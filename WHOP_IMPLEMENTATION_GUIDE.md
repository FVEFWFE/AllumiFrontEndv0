# Whop Payment Integration - Complete Implementation Guide

## Current Status Summary
- ✅ Product created: "Allumi - Attribution for Skool" (prod_tm0tLYKsvpwxi)
- ✅ Webhook handler implemented at `/api/webhooks/whop/route.ts`
- ✅ Basic redirect to Whop set up at `/api/start-trial/route.ts`
- ⚠️ Checkout link needs configuration for 14-day trial
- ⚠️ Webhook secret needs to be added to environment variables
- ⚠️ Pricing tiers need implementation ($59 beta, $79 regular)

## Step-by-Step Implementation

### Step 1: Configure Checkout Link in Whop Dashboard

1. **Go to your Whop Dashboard**: https://whop.com/dashboard/biz_g5ZqcyTAQA1DOK/
2. **Navigate to Products**: Click on your product (prod_tm0tLYKsvpwxi)
3. **Create Checkout Link**:
   - Click "Add pricing option" or "Create checkout link"
   - Choose "Recurring" for subscription type
   - Set price: $59/month (beta pricing)
   - Enable "Advanced Options"
   - Set "Free trial": 14 days
   - Name it: "Beta Launch - 14 Day Trial"
   - Save and copy the checkout link

The checkout link will look like:
```
https://whop.com/checkout/link_XXXXXXXXXXXXX/?d2c=true
```

### Step 2: Configure Webhooks

1. **Go to Developer Settings**: https://whop.com/dashboard/biz_g5ZqcyTAQA1DOK/developer/
2. **Webhooks Configuration**:
   - Endpoint URL: `https://allumi.com/api/webhooks/whop`
   - Copy the full webhook secret (starts with `ws_`)
   - Ensure these events are selected:
     - `payment_succeeded`
     - `membership_went_valid`
     - `membership_went_invalid`
     - `payment_affiliate_reward_created`
     - `refund_created`

### Step 3: Update Environment Variables

Update `.env.local`:
```env
# Whop Integration
WHOP_PRODUCT_ID=prod_tm0tLYKsvpwxi
WHOP_BUSINESS_ID=biz_g5ZqcyTAQA1DOK
WHOP_CHECKOUT_LINK=link_XXXXXXXXXXXXX  # From Step 1
WHOP_WEBHOOK_SECRET=ws_XXXXXXXXXX      # From Step 2
```

### Step 4: Update Code Implementation

#### A. Update `/app/api/start-trial/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get checkout link from environment
  const checkoutLink = process.env.WHOP_CHECKOUT_LINK;

  if (!checkoutLink) {
    // Fallback to product page if checkout link not configured
    return NextResponse.redirect('https://whop.com/allumi/');
  }

  // Redirect to Whop checkout with 14-day trial
  const whopUrl = `https://whop.com/checkout/${checkoutLink}/?d2c=true`;

  return NextResponse.redirect(whopUrl);
}
```

#### B. Create Pricing Configuration `/lib/pricing-config.ts`:
```typescript
export const PRICING_TIERS = {
  beta: {
    name: 'Beta Launch',
    price: '$59',
    originalPrice: '$79',
    period: '/month',
    trial: '14-day free trial',
    spots: 15,
    spotsRemaining: 15, // Update dynamically
    features: [
      'Full attribution tracking',
      'Unlimited tracking links',
      'Zapier integration',
      'Chrome extension',
      'Priority support',
      'Founder pricing locked forever'
    ]
  },
  regular: {
    name: 'Professional',
    price: '$79',
    period: '/month',
    trial: '14-day free trial',
    features: [
      'Full attribution tracking',
      'Unlimited tracking links',
      'Zapier integration',
      'Chrome extension',
      'Email support'
    ]
  }
};

export function getCurrentPricing() {
  // Check if beta spots available
  const betaSpotsRemaining = 15; // TODO: Get from database

  if (betaSpotsRemaining > 0) {
    return PRICING_TIERS.beta;
  }

  return PRICING_TIERS.regular;
}
```

### Step 5: Test the Integration

#### A. Test Checkout Flow:
1. Click "Start Free 14-Day Trial" button
2. Should redirect to Whop checkout
3. Complete test purchase (use test mode)
4. Verify user created in Supabase

#### B. Test Webhook:
1. Complete a test purchase
2. Check webhook logs in Whop dashboard
3. Verify events received at `/api/webhooks/whop`
4. Check Supabase for user record creation

#### C. Test Card Numbers (Test Mode):
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires auth: `4000 0025 0000 3155`

### Step 6: Production Deployment

1. **Update Vercel Environment Variables**:
   - Add all Whop-related env variables
   - Ensure webhook secret is correct
   - Verify Supabase credentials

2. **Test in Production**:
   - Create test account
   - Complete trial signup
   - Verify webhook received
   - Check user creation

3. **Monitor Initial Users**:
   - Track conversion from trial to paid
   - Monitor for any webhook failures
   - Check affiliate tracking works

## Pricing Strategy Implementation

### Beta Launch (First 15 users)
- $59/month with 14-day trial
- "Founder pricing - locked forever"
- Limited spots create urgency

### Regular Pricing (After beta)
- $79/month with 14-day trial
- Standard pricing for all users
- Still 78% cheaper than competitors

### Future Pricing Tiers
Consider implementing:
- **Starter**: $49/month (limited features)
- **Professional**: $79/month (current full features)
- **Enterprise**: $199/month (white label, priority support)

## Webhook Event Handling

The webhook handler processes these key events:

1. **membership_went_valid**: User started trial or became paying
2. **membership_went_invalid**: Subscription cancelled/expired
3. **payment_succeeded**: Payment processed successfully
4. **payment_affiliate_reward_created**: Track affiliate commissions
5. **refund_created**: Handle refund requests

## Troubleshooting

### Common Issues:

1. **Webhook not receiving events**:
   - Verify URL is correct in Whop dashboard
   - Check webhook secret matches
   - Ensure Vercel deployment is live

2. **User not created in Supabase**:
   - Check Supabase service role key
   - Verify database schema matches
   - Check webhook logs for errors

3. **Redirect not working**:
   - Ensure checkout link env variable is set
   - Verify link format is correct
   - Check for CORS issues

## Next Steps

1. ✅ Create checkout link in Whop dashboard
2. ✅ Update environment variables
3. ✅ Deploy to Vercel
4. ✅ Test full payment flow
5. ✅ Launch to first beta users
6. Monitor and iterate based on user feedback

## Support Resources

- Whop Documentation: https://docs.whop.com
- Whop API Reference: https://dev.whop.com/api-reference/v2/
- Whop Support: support@whop.com
- Dashboard: https://whop.com/dashboard/biz_g5ZqcyTAQA1DOK/