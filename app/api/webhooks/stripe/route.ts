import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get customer email and metadata
        const customerEmail = session.customer_email;
        const customerId = session.customer as string;
        const metadata = session.metadata || {};
        
        // Check if this is a lifetime deal
        const isLifetimeDeal = metadata.product_type === 'lifetime';
        
        // Update user profile
        const { data: user } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customerEmail)
          .single();
        
        if (user) {
          await supabase
            .from('profiles')
            .update({
              stripe_customer_id: customerId,
              subscription_status: 'active',
              lifetime_access: isLifetimeDeal,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
          
          // Track revenue attribution
          if (metadata.utm_source || metadata.utm_campaign) {
            await supabase.from('revenue_attribution').insert({
              user_id: user.id,
              order_id: session.id,
              revenue: (session.amount_total || 0) / 100,
              attribution_model: 'last_touch',
              channel: metadata.utm_source || 'direct',
              campaign: metadata.utm_campaign || null,
              created_at: new Date().toISOString(),
            });
          }
          
          // Send welcome email (if Resend configured)
          if (process.env.RESEND_API_KEY) {
            await sendWelcomeEmail(customerEmail!, isLifetimeDeal);
          }
        }
        
        console.log(`✅ Payment successful for ${customerEmail}`);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        const { data: user } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', subscription.customer)
          .single();
        
        if (user) {
          await supabase
            .from('profiles')
            .update({
              stripe_subscription_id: subscription.id,
              subscription_status: subscription.status,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
        }
        
        console.log(`✅ Subscription ${event.type} for customer ${subscription.customer}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        const { data: user } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', subscription.customer)
          .single();
        
        if (user) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'cancelled',
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
        }
        
        console.log(`❌ Subscription cancelled for customer ${subscription.customer}`);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Track recurring revenue
        if (invoice.subscription) {
          const { data: user } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', invoice.customer)
            .single();
          
          if (user) {
            await supabase.from('revenue_attribution').insert({
              user_id: user.id,
              order_id: invoice.id,
              revenue: (invoice.amount_paid || 0) / 100,
              attribution_model: 'recurring',
              channel: 'subscription',
              created_at: new Date().toISOString(),
            });
          }
        }
        
        console.log(`💰 Invoice paid: ${invoice.id}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        const { data: user } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', invoice.customer)
          .single();
        
        if (user) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
          
          // Send payment failed email
          if (process.env.RESEND_API_KEY && invoice.customer_email) {
            await sendPaymentFailedEmail(invoice.customer_email);
          }
        }
        
        console.log(`❌ Payment failed for invoice ${invoice.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Webhook handler error: ${error.message}`);
    return NextResponse.json(
      { error: `Webhook handler failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// Email helper functions
async function sendWelcomeEmail(email: string, isLifetime: boolean) {
  // Implementation would use Resend API
  console.log(`📧 Sending welcome email to ${email} (Lifetime: ${isLifetime})`);
}

async function sendPaymentFailedEmail(email: string) {
  // Implementation would use Resend API
  console.log(`📧 Sending payment failed email to ${email}`);
}