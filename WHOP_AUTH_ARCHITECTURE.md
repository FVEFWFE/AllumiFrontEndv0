# Whop-First Authentication Architecture for Allumi

## Overview
Users can ONLY create accounts through Whop payment/trial. No direct registration.

## Architecture Flow

```
1. User clicks "Start Trial" →
2. Whop Checkout (embedded or redirect) →
3. User completes payment →
4. Whop webhook fires →
5. Your backend creates Supabase user →
6. User receives login credentials →
7. User can login to dashboard
```

## Implementation Steps

### 1. Remove Direct Registration
- Remove `/register` route completely
- Login page only has email/password fields
- "Start Trial" button goes to Whop checkout

### 2. Whop Webhook Handler (`/api/webhooks/whop`)

```javascript
// When Whop membership.created event fires:
async function handleMembershipCreated(whopData) {
  // 1. Create user in Supabase Auth
  const { data: user, error } = await supabase.auth.admin.createUser({
    email: whopData.email,
    password: generateSecurePassword(), // or let them set it
    email_confirm: true,
    user_metadata: {
      whop_user_id: whopData.user_id,
      whop_membership_id: whopData.membership_id,
      plan: whopData.plan,
      trial_ends: whopData.trial_ends_at
    }
  });

  // 2. Create user settings record
  await supabase.from('user_settings').insert({
    user_id: user.id,
    whop_user_id: whopData.user_id,
    whop_membership_id: whopData.membership_id,
    subscription_status: 'trial',
    trial_ends_at: whopData.trial_ends_at,
    api_key: generateAPIKey(),
    webhook_secret: generateWebhookSecret()
  });

  // 3. Send welcome email with login instructions
  await sendWelcomeEmail(whopData.email, temporaryPassword);
}
```

### 3. Database Schema Updates

```sql
-- Add Whop-specific columns to user_settings
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS whop_user_id TEXT UNIQUE;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS whop_membership_id TEXT UNIQUE;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS whop_customer_id TEXT;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial';
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS plan_name TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_settings_whop_user_id ON user_settings(whop_user_id);
```

### 4. Webhook Events to Handle

```javascript
// membership.created - New user signs up
// membership.went_valid - Payment successful, activate user
// membership.went_invalid - Payment failed, restrict access
// membership.canceled - User canceled, schedule deletion
// membership.updated - Plan change, update permissions
```

### 5. Authentication Flow

```javascript
// Login page checks subscription status
async function handleLogin(email, password) {
  const { user } = await supabase.auth.signIn({ email, password });

  // Check subscription status
  const { data: settings } = await supabase
    .from('user_settings')
    .select('subscription_status, trial_ends_at')
    .eq('user_id', user.id)
    .single();

  if (settings.subscription_status === 'expired' ||
      (settings.trial_ends_at && new Date(settings.trial_ends_at) < new Date())) {
    // Redirect to Whop to reactivate
    return redirect('/subscription-expired');
  }

  // Continue to dashboard
  return redirect('/dashboard');
}
```

### 6. Security Considerations

1. **Webhook Verification**: Always verify Whop webhook signatures
2. **Idempotency**: Handle duplicate webhook events gracefully
3. **Password Security**: Generate secure temporary passwords or use magic links
4. **Status Sync**: Regularly sync subscription status with Whop API

### 7. User Experience Improvements

1. **Magic Link Option**: Instead of passwords, send magic login links
2. **SSO with Whop**: Use Whop OAuth for seamless login (if available)
3. **Status Dashboard**: Show subscription status clearly in app
4. **Grace Period**: Allow 3-day grace period for failed payments

## Environment Variables Needed

```env
WHOP_API_KEY=your_whop_api_key
WHOP_WEBHOOK_SECRET=your_webhook_secret
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # For creating users
```

## Benefits of This Architecture

1. **Single Source of Truth**: Whop manages all billing/subscription
2. **No Free Riders**: Can't create accounts without payment
3. **Automatic Status Management**: Webhooks keep status in sync
4. **Simplified Onboarding**: One checkout process
5. **Better Analytics**: All users are tracked in Whop

## Potential Issues & Solutions

**Issue**: User forgets password
**Solution**: Password reset flow or magic links

**Issue**: Webhook fails
**Solution**: Implement retry logic and manual sync button

**Issue**: User wants to change email
**Solution**: Update both Whop and Supabase via API

**Issue**: Trial expires
**Solution**: Auto-redirect to Whop upgrade page