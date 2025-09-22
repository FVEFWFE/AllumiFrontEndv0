import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('X-Whop-Signature');
    const body = await request.text();
    
    // Verify webhook signature
    if (!verifyWhopSignature(body, signature)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const event = JSON.parse(body);
    
    // Log the event
    await supabase.from('whop_events').insert({
      event_id: event.id,
      event_type: event.type,
      customer_email: event.data?.customer?.email,
      whop_customer_id: event.data?.customer?.id,
      subscription_status: event.data?.status,
      plan_id: event.data?.plan?.id,
      affiliate_code: event.data?.affiliate?.code,
      raw_data: event
    });
    
    switch (event.type) {
      case 'subscription.created':
      case 'subscription.activated':
        await handleSubscriptionCreated(event);
        break;
        
      case 'subscription.cancelled':
      case 'subscription.expired':
        await handleSubscriptionCancelled(event);
        break;
        
      case 'subscription.updated':
        await handleSubscriptionUpdated(event);
        break;
        
      case 'payment.succeeded':
        await handlePaymentSucceeded(event);
        break;
        
      default:
        console.log('Unhandled Whop event type:', event.type);
    }
    
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
  const { customer, plan, affiliate } = event.data;
  
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', customer.email)
    .single();
  
  if (existingUser) {
    // Update existing user
    await supabase
      .from('users')
      .update({
        whop_customer_id: customer.id,
        subscription_status: 'active',
        subscription_plan: plan.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingUser.id);
  } else {
    // Create new user
    const { data: authUser } = await supabase.auth.admin.createUser({
      email: customer.email,
      email_confirm: true,
      user_metadata: {
        whop_customer_id: customer.id
      }
    });
    
    if (authUser) {
      await supabase
        .from('users')
        .insert({
          id: authUser.user.id,
          email: customer.email,
          whop_customer_id: customer.id,
          subscription_status: 'active',
          subscription_plan: plan.id,
          created_at: new Date().toISOString()
        });
    }
  }
  
  // Track affiliate if present
  if (affiliate) {
    console.log('Affiliate referral:', affiliate.code, 'for customer:', customer.email);
    // You can add affiliate tracking logic here
  }
}

async function handleSubscriptionCancelled(event: any) {
  const { customer } = event.data;
  
  await supabase
    .from('users')
    .update({
      subscription_status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('whop_customer_id', customer.id);
}

async function handleSubscriptionUpdated(event: any) {
  const { customer, plan, status } = event.data;
  
  await supabase
    .from('users')
    .update({
      subscription_status: status,
      subscription_plan: plan.id,
      updated_at: new Date().toISOString()
    })
    .eq('whop_customer_id', customer.id);
}

async function handlePaymentSucceeded(event: any) {
  const { customer, amount } = event.data;
  
  // Log successful payment
  console.log(`Payment of $${amount / 100} received from customer ${customer.email}`);
  
  // You can add logic here to track revenue, extend trials, etc.
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('whop_customer_id', customer.id)
    .single();
  
  if (user && user.subscription_status === 'trial') {
    // Convert trial to paid
    await supabase
      .from('users')
      .update({
        subscription_status: 'active',
        trial_ends_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
  }
}