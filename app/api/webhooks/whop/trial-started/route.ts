import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature if Whop provides one
    const signature = request.headers.get('x-whop-signature');

    // Parse webhook payload
    const body = await request.json();
    console.log('Whop webhook received:', body);

    // Handle different webhook events
    const { event, data } = body;

    if (event === 'payment.succeeded' || event === 'subscription.created' || event === 'trial.started' || event === 'checkout.session.completed') {
      // Extract user information from Whop webhook
      // Whop sends data in different formats depending on the event
      const email = data.email || data.customer_email || data.buyer_email;
      const customer_id = data.customer_id || data.customer || data.buyer_id;
      const product_id = data.product_id || data.product;
      const subscription_id = data.subscription_id || data.subscription;
      const trial_ends = data.trial_ends || data.trial_end;
      const metadata = data.metadata || {};

      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      let userId: string;

      if (!existingUser) {
        // Generate a secure random password for the user
        const tempPassword = crypto.randomBytes(16).toString('hex');

        // Create auth user in Supabase
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true, // Auto-confirm since they came from Whop
          user_metadata: {
            whop_customer_id: customer_id,
            whop_subscription_id: subscription_id,
            source: 'whop'
          }
        });

        if (authError) {
          console.error('Error creating auth user:', authError);
          return NextResponse.json({ error: 'Failed to create auth user' }, { status: 500 });
        }

        userId = authData.user.id;

        // Create user profile in database
        const { data: newUser, error: userError } = await supabaseAdmin
          .from('users')
          .insert({
            id: userId, // Use the auth user ID
            email,
            whop_customer_id: customer_id,
            whop_subscription_id: subscription_id,
            trial_ends_at: trial_ends || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            subscription_status: 'trialing',
            created_at: new Date().toISOString(),
            metadata: {
              source: 'whop_webhook',
              product_id,
              ...metadata
            }
          })
          .select()
          .single();

        if (userError) {
          console.error('Error creating user profile:', userError);
          // Clean up auth user if profile creation fails
          await supabaseAdmin.auth.admin.deleteUser(userId);
          return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
        }

        console.log('User created from Whop webhook:', newUser);

        // Generate a magic link for automatic login
        const { data: magicLink, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email,
          options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/welcome?source=whop`
          }
        });

        if (linkError) {
          console.error('Error generating magic link:', linkError);
        }

        // Track conversion event
        await supabaseAdmin
          .from('events')
          .insert({
            user_id: userId,
            event_type: 'trial_started',
            properties: {
              source: 'whop',
              product_id,
              trial_length: 14
            }
          });
      } else {
        userId = existingUser.id;
      }

      // Create a session token for automatic login
      const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.createSession({
        userId
      });

      let redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/welcome?source=whop`;

      if (sessionData?.session) {
        // Include session info in redirect for automatic login
        redirectUrl += `&access_token=${sessionData.session.access_token}&refresh_token=${sessionData.session.refresh_token}`;
      }

      return NextResponse.json({
        success: true,
        message: 'Trial started successfully',
        redirect_url: redirectUrl,
        user_id: userId
      });
    }

    // Handle other webhook events
    if (event === 'subscription.updated' || event === 'subscription.cancelled') {
      const { email, subscription_status } = data;

      // Update user subscription status
      await supabaseAdmin
        .from('users')
        .update({
          subscription_status,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      return NextResponse.json({ success: true });
    }

    // Unknown event type
    console.log('Unknown Whop webhook event:', event);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Whop webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Optional: Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string): boolean {
  // Implement Whop's signature verification if they provide it
  // This would typically involve HMAC-SHA256 validation
  return true; // Placeholder
}