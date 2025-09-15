import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Whop webhook secret for signature verification
const webhookSecret = process.env.WHOP_WEBHOOK_SECRET!;

// Verify Whop webhook signature
function verifyWhopSignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('x-whop-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature header' },
      { status: 400 }
    );
  }

  // Verify webhook signature
  if (!verifyWhopSignature(body, signature)) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    );
  }

  const event = JSON.parse(body);

  try {
    switch (event.event) {
      case 'membership.went_valid': {
        // User purchased or renewed membership
        const { 
          id: membershipId,
          user_id: whopUserId,
          email,
          product_id,
          plan_id,
          status,
          metadata = {}
        } = event.data;

        // Check if user exists or create new profile
        let { data: user } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (!user) {
          // Create new user profile
          const { data: newUser } = await supabase
            .from('profiles')
            .insert({
              email,
              whop_user_id: whopUserId,
              created_at: new Date().toISOString(),
            })
            .select()
            .single();
          
          user = newUser;
        }

        if (user) {
          // Update user with Whop membership details
          await supabase
            .from('profiles')
            .update({
              whop_user_id: whopUserId,
              whop_membership_id: membershipId,
              whop_product_id: product_id,
              whop_plan_id: plan_id,
              subscription_status: 'active',
              lifetime_access: plan_id?.includes('lifetime') || false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

          // Track revenue attribution
          const revenue = event.data.initial_amount || event.data.renewal_amount || 0;
          
          if (metadata.utm_source || metadata.utm_campaign || metadata.referrer) {
            await supabase.from('revenue_attribution').insert({
              user_id: user.id,
              order_id: membershipId,
              revenue: revenue / 100, // Convert cents to dollars
              attribution_model: 'last_touch',
              channel: metadata.utm_source || extractChannel(metadata.referrer),
              campaign: metadata.utm_campaign || null,
              touchpoints: [{
                source: metadata.utm_source,
                medium: metadata.utm_medium,
                campaign: metadata.utm_campaign,
                timestamp: new Date().toISOString()
              }],
              created_at: new Date().toISOString(),
            });
          }

          // Track attribution event
          await supabase.from('attribution_events').insert({
            user_id: user.id,
            event_type: 'purchase',
            utm_source: metadata.utm_source || null,
            utm_medium: metadata.utm_medium || null,
            utm_campaign: metadata.utm_campaign || null,
            utm_term: metadata.utm_term || null,
            utm_content: metadata.utm_content || null,
            referrer: metadata.referrer || null,
            revenue: revenue / 100,
            metadata: {
              whop_membership_id: membershipId,
              whop_product_id: product_id,
              whop_plan_id: plan_id,
            },
            created_at: new Date().toISOString(),
          });

          console.log(`✅ Membership activated for ${email} (${membershipId})`);
        }
        break;
      }

      case 'membership.went_invalid': {
        // Membership cancelled or expired
        const { 
          id: membershipId,
          user_id: whopUserId,
          email 
        } = event.data;

        const { data: user } = await supabase
          .from('profiles')
          .select('id')
          .eq('whop_membership_id', membershipId)
          .single();

        if (user) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'cancelled',
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

          console.log(`❌ Membership cancelled for ${email} (${membershipId})`);
        }
        break;
      }

      case 'membership.renewal_succeeded': {
        // Subscription renewed successfully
        const { 
          id: membershipId,
          renewal_amount,
          email 
        } = event.data;

        const { data: user } = await supabase
          .from('profiles')
          .select('id')
          .eq('whop_membership_id', membershipId)
          .single();

        if (user) {
          // Track recurring revenue
          await supabase.from('revenue_attribution').insert({
            user_id: user.id,
            order_id: `renewal_${membershipId}_${Date.now()}`,
            revenue: renewal_amount / 100,
            attribution_model: 'recurring',
            channel: 'subscription',
            created_at: new Date().toISOString(),
          });

          console.log(`💰 Renewal successful for ${email}: $${renewal_amount / 100}`);
        }
        break;
      }

      case 'membership.renewal_failed': {
        // Payment failed
        const { 
          id: membershipId,
          email 
        } = event.data;

        const { data: user } = await supabase
          .from('profiles')
          .select('id')
          .eq('whop_membership_id', membershipId)
          .single();

        if (user) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

          // Create notification
          await supabase.from('notifications').insert({
            user_id: user.id,
            type: 'payment_failed',
            title: 'Payment Failed',
            message: 'Your subscription payment failed. Please update your payment method.',
            link: '/settings/billing',
            created_at: new Date().toISOString(),
          });

          console.log(`❌ Payment failed for ${email} (${membershipId})`);
        }
        break;
      }

      case 'payment.succeeded': {
        // One-time payment succeeded (for lifetime deals)
        const { 
          id: paymentId,
          amount,
          user_email,
          product_id,
          metadata = {}
        } = event.data;

        let { data: user } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', user_email)
          .single();

        if (!user && user_email) {
          // Create user if doesn't exist
          const { data: newUser } = await supabase
            .from('profiles')
            .insert({
              email: user_email,
              created_at: new Date().toISOString(),
            })
            .select()
            .single();
          
          user = newUser;
        }

        if (user) {
          // Update for lifetime access
          await supabase
            .from('profiles')
            .update({
              lifetime_access: true,
              subscription_status: 'active',
              whop_product_id: product_id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

          // Track revenue with attribution
          await supabase.from('revenue_attribution').insert({
            user_id: user.id,
            order_id: paymentId,
            revenue: amount / 100,
            attribution_model: 'last_touch',
            channel: metadata.utm_source || 'direct',
            campaign: metadata.utm_campaign || null,
            touchpoints: metadata.utm_source ? [{
              source: metadata.utm_source,
              medium: metadata.utm_medium,
              campaign: metadata.utm_campaign,
              timestamp: new Date().toISOString()
            }] : [],
            created_at: new Date().toISOString(),
          });

          console.log(`💎 Lifetime deal purchased by ${user_email}: $${amount / 100}`);
        }
        break;
      }

      case 'user.created': {
        // New user registered via Whop
        const { 
          id: whopUserId,
          email,
          username,
          metadata = {}
        } = event.data;

        // Create or update user profile
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (!existingUser) {
          await supabase.from('profiles').insert({
            email,
            username,
            whop_user_id: whopUserId,
            created_at: new Date().toISOString(),
          });

          // Track signup attribution
          if (metadata.utm_source || metadata.referrer) {
            await supabase.from('attribution_events').insert({
              event_type: 'signup',
              utm_source: metadata.utm_source || null,
              utm_medium: metadata.utm_medium || null,
              utm_campaign: metadata.utm_campaign || null,
              referrer: metadata.referrer || null,
              metadata: { whop_user_id: whopUserId },
              created_at: new Date().toISOString(),
            });
          }

          console.log(`👤 New user created: ${email}`);
        }
        break;
      }

      default:
        console.log(`Unhandled Whop event: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Whop webhook error: ${error.message}`);
    return NextResponse.json(
      { error: `Webhook handler failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// Helper function to extract channel from referrer
function extractChannel(referrer?: string): string {
  if (!referrer) return 'direct';
  
  if (referrer.includes('google')) return 'google';
  if (referrer.includes('facebook')) return 'facebook';
  if (referrer.includes('twitter') || referrer.includes('x.com')) return 'twitter';
  if (referrer.includes('youtube')) return 'youtube';
  if (referrer.includes('linkedin')) return 'linkedin';
  if (referrer.includes('reddit')) return 'reddit';
  if (referrer.includes('tiktok')) return 'tiktok';
  
  return 'referral';
}