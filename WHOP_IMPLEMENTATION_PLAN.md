# Whop-Only Authentication Implementation Plan

## 🎯 Objective
Remove direct registration and make Whop trial/payment the ONLY way to create accounts.

## 📐 Architecture Design

```mermaid
graph TD
    A[User Clicks Start Trial] --> B[Whop Checkout Embed]
    B --> C[User Completes Payment/Trial]
    C --> D[Whop Sends Webhook]
    D --> E[/api/webhooks/whop]
    E --> F[Create Supabase User]
    E --> G[Create User Settings]
    E --> H[Send Welcome Email]
    F --> I[User Can Login]
```

## 🔧 Implementation Steps

### Phase 1: Database Fixes (20 mins)
```sql
-- Fix foreign key constraints
ALTER TABLE user_settings
DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;

ALTER TABLE user_settings
ADD CONSTRAINT user_settings_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE campaign_spend
DROP CONSTRAINT IF EXISTS campaign_spend_user_id_fkey;

ALTER TABLE campaign_spend
ADD CONSTRAINT campaign_spend_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add Whop-specific columns
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS whop_user_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS whop_membership_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS whop_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS plan_name TEXT DEFAULT 'beta';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_settings_whop_user_id
ON user_settings(whop_user_id);

CREATE INDEX IF NOT EXISTS idx_user_settings_whop_membership_id
ON user_settings(whop_membership_id);
```

### Phase 2: Whop Webhook Handler (1 hour)

**File: `/app/api/webhooks/whop/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { nanoid } from 'nanoid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Webhook event types
const WHOP_EVENTS = {
  MEMBERSHIP_CREATED: 'membership.created',
  MEMBERSHIP_WENT_VALID: 'membership.went_valid',
  MEMBERSHIP_WENT_INVALID: 'membership.went_invalid',
  MEMBERSHIP_CANCELED: 'membership.canceled',
  MEMBERSHIP_UPDATED: 'membership.updated',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed'
};

// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WHOP_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Generate secure random password
function generateSecurePassword(): string {
  return nanoid(16) + '@1Aa';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-whop-signature');

    // Verify webhook signature
    if (!signature || !verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log(`Processing Whop event: ${event.type}`, event);

    switch (event.type) {
      case WHOP_EVENTS.MEMBERSHIP_CREATED:
        return await handleMembershipCreated(event.data);

      case WHOP_EVENTS.MEMBERSHIP_WENT_VALID:
        return await handleMembershipValid(event.data);

      case WHOP_EVENTS.MEMBERSHIP_WENT_INVALID:
        return await handleMembershipInvalid(event.data);

      case WHOP_EVENTS.MEMBERSHIP_CANCELED:
        return await handleMembershipCanceled(event.data);

      case WHOP_EVENTS.PAYMENT_SUCCEEDED:
        return await handlePaymentSucceeded(event.data);

      default:
        console.log(`Unhandled event type: ${event.type}`);
        return NextResponse.json({ received: true });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleMembershipCreated(data: any) {
  const { email, user_id: whopUserId, membership_id, plan, status } = data;

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_settings')
      .select('user_id')
      .eq('whop_user_id', whopUserId)
      .single();

    if (existingUser) {
      console.log('User already exists for Whop ID:', whopUserId);
      return NextResponse.json({ message: 'User already exists' });
    }

    // Generate temporary password
    const tempPassword = generateSecurePassword();

    // Create Supabase auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        whop_user_id: whopUserId,
        whop_membership_id: membership_id,
        plan_name: plan?.name || 'beta',
        source: 'whop'
      }
    });

    if (authError) {
      console.error('Failed to create auth user:', authError);
      throw authError;
    }

    // Calculate trial end date (7 days for trial, null for paid)
    const trialEndsAt = status === 'trialing'
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    // Create user settings
    const { error: settingsError } = await supabase
      .from('user_settings')
      .insert({
        user_id: authUser.user.id,
        whop_user_id: whopUserId,
        whop_membership_id: membership_id,
        subscription_status: status === 'trialing' ? 'trial' : 'active',
        trial_ends_at: trialEndsAt,
        plan_name: plan?.name || 'beta',
        api_key: `ak_live_${nanoid(32)}`,
        webhook_secret: `whsec_${nanoid(32)}`,
        created_at: new Date().toISOString()
      });

    if (settingsError) {
      // Rollback auth user
      await supabase.auth.admin.deleteUser(authUser.user.id);
      throw settingsError;
    }

    // Send welcome email with temporary password
    await sendWelcomeEmail(email, tempPassword);

    return NextResponse.json({
      success: true,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Error creating user from Whop:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

async function handleMembershipValid(data: any) {
  const { membership_id } = data;

  // Update subscription status to active
  await supabase
    .from('user_settings')
    .update({
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('whop_membership_id', membership_id);

  return NextResponse.json({ success: true });
}

async function handleMembershipInvalid(data: any) {
  const { membership_id } = data;

  // Update subscription status to expired
  await supabase
    .from('user_settings')
    .update({
      subscription_status: 'expired',
      updated_at: new Date().toISOString()
    })
    .eq('whop_membership_id', membership_id);

  return NextResponse.json({ success: true });
}

async function handleMembershipCanceled(data: any) {
  const { membership_id } = data;

  // Update subscription status to canceled
  await supabase
    .from('user_settings')
    .update({
      subscription_status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('whop_membership_id', membership_id);

  return NextResponse.json({ success: true });
}

async function handlePaymentSucceeded(data: any) {
  // Log payment for analytics
  console.log('Payment succeeded:', data);
  return NextResponse.json({ success: true });
}

// Email sending function (implement with your email provider)
async function sendWelcomeEmail(email: string, tempPassword: string) {
  // TODO: Implement with MailerLite or your email provider
  console.log(`Welcome email would be sent to ${email} with temp password`);

  // For now, just log it
  console.log(`
    ====================================
    NEW USER CREATED VIA WHOP
    Email: ${email}
    Temp Password: ${tempPassword}
    Login at: https://allumi.com/login
    ====================================
  `);
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'Whop webhook endpoint ready',
    events: Object.values(WHOP_EVENTS)
  });
}
```

### Phase 3: Update Frontend (45 mins)

**1. Remove Registration Page**
```bash
# Remove direct registration
rm app/auth/register/page.tsx
rm app/signup/page.tsx
rm app/api/auth/register/route.ts
```

**2. Update Login Page** (`/app/login/page.tsx`)
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Check subscription status
    const { data: settings } = await supabase
      .from('user_settings')
      .select('subscription_status, trial_ends_at')
      .eq('user_id', data.user?.id)
      .single();

    if (settings?.subscription_status === 'expired') {
      router.push('/subscription-expired');
    } else {
      router.push('/dashboard');
    }
  };

  const handleStartTrial = () => {
    // Redirect to Whop checkout
    const checkoutUrl = `https://whop.com/checkout/${process.env.NEXT_PUBLIC_WHOP_CHECKOUT_LINK}`;
    window.location.href = checkoutUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-3xl font-bold text-center">Login to Allumi</h2>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border rounded"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border rounded"
            required
          />

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600 mb-4">Don't have an account?</p>
          <button
            onClick={handleStartTrial}
            className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
          >
            Start 7-Day Free Trial
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Trial includes full access. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Phase 4: Middleware for Auth Protection

**File: `/middleware.ts`** (update existing)
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  // Protected routes
  const protectedPaths = ['/dashboard', '/settings', '/api/protected'];
  const isProtectedPath = protectedPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Check subscription status for authenticated users
  if (session && isProtectedPath) {
    const { data: settings } = await supabase
      .from('user_settings')
      .select('subscription_status')
      .eq('user_id', session.user.id)
      .single();

    if (settings?.subscription_status === 'expired') {
      return NextResponse.redirect(new URL('/subscription-expired', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/api/protected/:path*']
};
```

## 🧪 Testing Plan

### Local Testing
1. Start local server: `npm run dev`
2. Use `test-whop-webhook.js` to simulate events
3. Check user creation in Supabase dashboard
4. Test login flow with created user

### Production Testing
1. Deploy webhook handler
2. Configure Whop webhook URL
3. Create test purchase in Whop test mode
4. Verify user creation and login

## 📊 Migration Strategy

### For Existing Users
```sql
-- Migrate existing users to have Whop fields
UPDATE user_settings
SET
  subscription_status = CASE
    WHEN trial_ends_at > NOW() THEN 'trial'
    ELSE 'expired'
  END,
  plan_name = 'beta'
WHERE whop_user_id IS NULL;
```

## 🔒 Security Considerations

1. **Webhook Verification**: Always verify signatures
2. **Password Security**: Generate strong temporary passwords
3. **Idempotency**: Handle duplicate webhooks gracefully
4. **Rate Limiting**: Add rate limiting to webhook endpoint
5. **Audit Logging**: Log all webhook events

## 📋 Environment Variables Required

```env
# Existing (already configured)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Whop (verify these are correct)
WHOP_API_KEY=qsUvkYxBAPe5z9I_BA8u6HrxEWgbRz0EOHJvefQ4zMQ
WHOP_WEBHOOK_SECRET=ws_7a732d8f4b2c9e1a6f3d8e9b2c7a1f4e8d3b6a9c2e7f1d4a8b3c6e9d2f7a1b4e
WHOP_CHECKOUT_LINK=plan_ufRzE7PHJgEXR

# Email (configure for welcome emails)
MAILERLITE_API_KEY=...
```

## ⚠️ Critical Notes

1. **No Direct Registration**: Users CANNOT create accounts without Whop
2. **Trial Period**: 7 days (configurable in Whop)
3. **Password Reset**: Users can reset password via email
4. **Subscription Sync**: Webhooks keep status in sync automatically

## 🚀 Deployment Checklist

- [ ] Apply database migrations
- [ ] Deploy webhook handler
- [ ] Remove registration endpoints
- [ ] Update frontend login page
- [ ] Configure Whop webhook URL
- [ ] Test with Whop test mode
- [ ] Send test webhook events
- [ ] Verify user creation
- [ ] Test login flow
- [ ] Monitor error logs