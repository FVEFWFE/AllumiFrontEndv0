# Whop Test Mode Setup Guide

## How to Enable Test Mode for Payment Testing

### Step 1: Enable Test Mode in Whop Dashboard

1. Log into your Whop seller dashboard: https://dash.whop.com
2. Navigate to **Settings** → **Developer**
3. Toggle **Test Mode** to ON
4. You'll see a test-specific plan ID (different from your live plan)
5. Copy the test plan ID

### Step 2: Update Your Local Environment

Add these to your `.env.local` file:

```env
# Test Mode Configuration
WHOP_TEST_MODE=true
WHOP_TEST_PLAN_ID=plan_test_xxxxx  # Replace with your test plan ID from Whop
WHOP_TEST_API_KEY=your_test_api_key  # Test API key from Whop dashboard
WHOP_TEST_WEBHOOK_SECRET=test_webhook_secret  # Test webhook secret
```

### Step 3: Update WhopCheckout Component

Modify `components/WhopCheckout.tsx` to use test mode:

```typescript
// Add at the top of the component
const isTestMode = process.env.NEXT_PUBLIC_WHOP_TEST_MODE === 'true';
const planIdToUse = isTestMode
  ? process.env.NEXT_PUBLIC_WHOP_TEST_PLAN_ID
  : planId;

// Update the data attribute
data-whop-checkout-plan-id={planIdToUse}
```

### Step 4: Test Cards for Whop (Stripe)

When in test mode, use these test card numbers:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

**Expiry**: Any future date (e.g., 12/34)
**CVC**: Any 3 digits (e.g., 123)
**ZIP**: Any valid ZIP (e.g., 12345)

### Step 5: Alternative - Create Test User Locally

Run the test user creation script:

```bash
node create-test-user.js
```

This will create a test user with:
- Email: test@allumi.com
- Password: Test123!@#
- Active subscription status
- Sample attribution data

You can then login at http://localhost:3005/dashboard

### Important Notes:

1. **Never use test mode in production** - Always use live mode for real customers
2. **Test webhooks** will have different signatures - make sure to update WHOP_WEBHOOK_SECRET for test mode
3. **Test transactions** won't appear in your live dashboard
4. **Switch back to live mode** when done testing

### Quick Test Without Whop

If you just want to test the dashboard and features without going through Whop:

1. Run: `node create-test-user.js`
2. Login with test@allumi.com / Test123!@#
3. Access dashboard at http://localhost:3005/dashboard

This bypasses Whop entirely and creates a user directly in Supabase with active subscription status.