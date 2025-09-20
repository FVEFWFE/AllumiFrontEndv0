# Whop Payment Integration Setup Guide

## Current Status ✅
- **14-day trial period** configured in app
- **$59/month pricing** displayed in UI
- **Product created** in Whop: "Allumi - Attribution for Skool" (prod_tm0tLYKsvpwxi)
- **Trial buttons** redirect to Whop product page
- **Webhook handler** ready at `/api/webhooks/whop/route.ts`
- **Environment variables** configured

## What's Working
When users click "Start Free 14-Day Trial":
1. Event is tracked in PostHog
2. User is redirected via `/api/start-trial` API endpoint
3. Redirects to Whop product management page
4. Product exists with $59/month pricing

## What Needs to be Done in Whop Dashboard

### 1. ✅ Product Already Created
The product "Allumi - Attribution for Skool" (prod_tm0tLYKsvpwxi) has been created with:
- **Price**: $59/month
- **Description**: Track and attribute your Skool community growth
- **Name**: Allumi - Attribution for Skool

### 2. Add 14-Day Free Trial to Product
1. Go to https://whop.com/dashboard/biz_g5ZqcyTAQA1DOK/products/prod_tm0tLYKsvpwxi
2. Click on "Advanced Options" or "Pricing Options"
3. Enable "Free Trial"
4. Set trial duration to 14 days
5. Save changes

### 3. Create Checkout Link
1. Go to Checkout Links section
2. Create a new checkout link for the product
3. Configure:
   - Enable 14-day free trial
   - Set recurring billing at $59/month
   - Enable test mode for testing

### 3. Configure Webhooks
1. Go to Developer > Webhooks
2. Update webhook URL to: `https://allumi.com/api/webhooks/whop`
3. Copy the webhook secret
4. Select events to listen for:
   - `subscription.created`
   - `subscription.cancelled`
   - `payment.succeeded`
   - `payment.failed`

### 4. Update Environment Variables
Once you have the checkout link and webhook secret:

```env
# Update these in .env.local and Vercel
WHOP_PLAN_ID=plan_XXXXXX  # Get from checkout link
WHOP_WEBHOOK_SECRET=whsec_XXXXXX  # Get from webhook settings
```

### 5. Update the Redirect URL
Once you have the checkout link, update:

**File**: `app/api/start-trial/route.ts`
```typescript
// Replace this line:
const whopUrl = `https://whop.com/biz/${whopBusinessId}/`;

// With:
const whopUrl = `https://whop.com/checkout/YOUR_PLAN_ID/?trial=true`;
```

## Testing the Payment Flow

### Test Mode
1. Append `?test=true` to checkout URL for test mode
2. Use test card: 4242 4242 4242 4242
3. Any future expiry date
4. Any CVC

### Production Checklist
- [ ] Product configured with $59/month pricing
- [ ] 14-day trial enabled
- [ ] Checkout link created
- [ ] Webhook URL configured
- [ ] Webhook secret stored in environment
- [ ] Test purchase completed successfully
- [ ] Webhook events received and processed

## Webhook Handler
The webhook handler at `/api/webhooks/whop/route.ts` handles:
- New subscriptions → Creates/updates user in Supabase
- Cancellations → Updates subscription status
- Payments → Records payment history
- Trial conversions → Updates user status

## Support
For Whop integration support:
- Whop Documentation: https://docs.whop.com
- Whop Support: support@whop.com