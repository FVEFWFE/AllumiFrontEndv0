import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { nanoid } from 'nanoid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Webhook event types we handle
const WHOP_EVENTS = {
  MEMBERSHIP_CREATED: 'membership.created',
  MEMBERSHIP_WENT_VALID: 'membership.went_valid',
  MEMBERSHIP_WENT_INVALID: 'membership.went_invalid',
  MEMBERSHIP_CANCELED: 'membership.canceled',
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_ACTIVATED: 'subscription.activated',
  SUBSCRIPTION_CANCELLED: 'subscription.cancelled',
  SUBSCRIPTION_EXPIRED: 'subscription.expired',
  SUBSCRIPTION_UPDATED: 'subscription.updated',
  PAYMENT_SUCCEEDED: 'payment.succeeded'
};

function verifyWhopSignature(payload: string, signature: string | null): boolean {
  if (!signature || !process.env.WHOP_WEBHOOK_SECRET) return false;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.WHOP_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  // Handle length mismatch gracefully
  if (signature.length !== expectedSignature.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
}

// Generate secure password for new users
function generateSecurePassword(): string {
  return nanoid(16) + '@1Aa';
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('X-Whop-Signature');
    const body = await request.text();
    
    // Verify webhook signature
    if (!verifyWhopSignature(body, signature)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const event = JSON.parse(body);
    
    // Log the event for debugging
    await supabase.from('whop_webhook_events').insert({
      event_id: event.id || `evt_${Date.now()}`,
      event_type: event.type,
      payload: event,
      processed: false
    }).select().single();
    
    switch (event.type) {
      case WHOP_EVENTS.MEMBERSHIP_CREATED:
      case WHOP_EVENTS.SUBSCRIPTION_CREATED:
      case WHOP_EVENTS.SUBSCRIPTION_ACTIVATED:
        await handleSubscriptionCreated(event);
        break;

      case WHOP_EVENTS.MEMBERSHIP_WENT_INVALID:
      case WHOP_EVENTS.SUBSCRIPTION_CANCELLED:
      case WHOP_EVENTS.SUBSCRIPTION_EXPIRED:
        await handleSubscriptionCancelled(event);
        break;

      case WHOP_EVENTS.MEMBERSHIP_WENT_VALID:
      case WHOP_EVENTS.SUBSCRIPTION_UPDATED:
        await handleSubscriptionUpdated(event);
        break;

      case WHOP_EVENTS.PAYMENT_SUCCEEDED:
        await handlePaymentSucceeded(event);
        break;

      default:
        console.log('Unhandled Whop event type:', event.type);
    }

    // Mark event as processed
    await supabase.from('whop_webhook_events')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('event_id', event.id || `evt_${Date.now()}`);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Whop webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(event: any) {
  const {
    customer,
    plan,
    affiliate,
    user_id: whopUserId,
    membership_id: whopMembershipId,
    status
  } = event.data;

  // Check if user already exists by Whop ID
  const { data: existingSettings } = await supabase
    .from('user_settings')
    .select('user_id')
    .eq('whop_user_id', whopUserId || customer.id)
    .single();

  if (existingSettings) {
    // Update existing user
    await supabase
      .from('user_settings')
      .update({
        subscription_status: 'active',
        plan_name: plan?.name || 'beta',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', existingSettings.user_id);

    console.log('Updated existing user:', customer.email);
  } else {
    // Generate temporary password
    const tempPassword = generateSecurePassword();

    // Create new auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: customer.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        whop_user_id: whopUserId || customer.id,
        whop_membership_id: whopMembershipId,
        source: 'whop'
      }
    });

    if (authError) {
      console.error('Failed to create auth user:', authError);
      throw authError;
    }

    // Create user_settings entry
    await supabase
      .from('user_settings')
      .insert({
        user_id: authUser.user.id,
        whop_user_id: whopUserId || customer.id,
        whop_membership_id: whopMembershipId,
        whop_customer_id: customer.id,
        subscription_status: status === 'trialing' ? 'trial' : 'active',
        plan_name: plan?.name || 'beta',
        trial_ends_at: status === 'trialing'
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          : null,
        whop_affiliate_code: affiliate?.code,
        api_key: `ak_live_${nanoid(32)}`,
        webhook_secret: `whsec_${nanoid(32)}`,
        created_via: 'whop',
        created_at: new Date().toISOString()
      });

    console.log(`✅ New user created: ${customer.email} with password: ${tempPassword}`);

    // TODO: Send welcome email with temp password
  }

  // Track affiliate if present
  if (affiliate) {
    console.log('Affiliate referral:', affiliate.code, 'for customer:', customer.email);
  }
}

async function handleSubscriptionCancelled(event: any) {
  const { customer, membership_id } = event.data;

  await supabase
    .from('user_settings')
    .update({
      subscription_status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('whop_membership_id', membership_id)
    .or(`whop_customer_id.eq.${customer?.id}`);

  console.log('Subscription cancelled for:', customer?.email || membership_id);
}

async function handleSubscriptionUpdated(event: any) {
  const { customer, plan, status, membership_id } = event.data;

  await supabase
    .from('user_settings')
    .update({
      subscription_status: status || 'active',
      plan_name: plan?.name || 'beta',
      updated_at: new Date().toISOString()
    })
    .eq('whop_membership_id', membership_id)
    .or(`whop_customer_id.eq.${customer?.id}`);

  console.log('Subscription updated for:', customer?.email || membership_id);
}

async function handlePaymentSucceeded(event: any) {
  const { customer, amount, membership_id } = event.data;

  // Log successful payment
  console.log(`💰 Payment of $${amount / 100} received from customer ${customer?.email}`);

  // Get user settings
  const { data: userSettings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('whop_customer_id', customer?.id)
    .or(`whop_membership_id.eq.${membership_id}`)
    .single();

  if (userSettings && userSettings.subscription_status === 'trial') {
    // Convert trial to paid
    await supabase
      .from('user_settings')
      .update({
        subscription_status: 'active',
        trial_ends_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userSettings.user_id);

    console.log('Trial converted to paid for user:', userSettings.user_id);
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'Whop webhook endpoint ready',
    events_supported: Object.values(WHOP_EVENTS),
    webhook_configured: !!process.env.WHOP_WEBHOOK_SECRET,
    timestamp: new Date().toISOString()
  });
}