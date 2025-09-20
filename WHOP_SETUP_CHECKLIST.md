# 🚀 Whop Payment Setup - Action Checklist

## ⚡ Quick Overview
You need to complete these steps in your Whop dashboard to get payments working:
1. Create checkout link with 14-day trial ($59/mo for beta, then $79/mo)
2. Configure webhooks
3. Update environment variables
4. Test the flow

---

## 📋 Step-by-Step Checklist

### Step 1: Create Checkout Link ⏰ (5 minutes)

Go to: https://whop.com/dashboard/biz_g5ZqcyTAQA1DOK/products/prod_tm0tLYKsvpwxi

- [ ] Click "Checkout links" or "Pricing options"
- [ ] Click "Add pricing option" or "Create checkout link"
- [ ] Configure the link:
  - **Type**: Recurring (Monthly subscription)
  - **Price**: $59.00
  - **Currency**: USD
  - **Billing period**: Monthly
- [ ] Open "Advanced Options":
  - [ ] Enable "Free trial"
  - [ ] Set trial period: **14 days**
  - [ ] Name: "Beta Launch - 14 Day Trial"
- [ ] Optional settings:
  - [ ] Limit quantity: 15 (for beta scarcity)
  - [ ] Show on store: Yes/No (your choice)
- [ ] Save and copy the checkout link ID (looks like: `link_XXXXXXXXXXXXX`)

### Step 2: Configure Webhooks ⚙️ (3 minutes)

Go to: https://whop.com/dashboard/biz_g5ZqcyTAQA1DOK/developer/

- [ ] Find "Webhooks" section
- [ ] Click "Create webhook" or "Edit webhook"
- [ ] Set endpoint URL: `https://allumi.com/api/webhooks/whop`
- [ ] Select these events:
  - [ ] payment_succeeded
  - [ ] membership_went_valid
  - [ ] membership_went_invalid
  - [ ] payment_affiliate_reward_created (for tracking affiliates)
  - [ ] refund_created
- [ ] Copy the full webhook secret (starts with `ws_`)
- [ ] Save webhook configuration

### Step 3: Update Environment Variables 🔐 (2 minutes)

Update your `.env.local` file:

```env
# Whop Payment Integration
WHOP_PRODUCT_ID=prod_tm0tLYKsvpwxi
WHOP_BUSINESS_ID=biz_g5ZqcyTAQA1DOK
WHOP_CHECKOUT_LINK=link_XXXXXXXXXXXXX  # ← Paste from Step 1
WHOP_WEBHOOK_SECRET=ws_XXXXXXXXXX      # ← Paste from Step 2
```

### Step 4: Deploy to Vercel 🌐 (5 minutes)

- [ ] Commit changes: `git add -A && git commit -m "Configure Whop payment integration"`
- [ ] Push to GitHub: `git push`
- [ ] Go to Vercel dashboard
- [ ] Add environment variables:
  - [ ] WHOP_CHECKOUT_LINK
  - [ ] WHOP_WEBHOOK_SECRET
  - [ ] WHOP_PRODUCT_ID
  - [ ] WHOP_BUSINESS_ID
- [ ] Redeploy if needed

### Step 5: Test the Flow 🧪 (10 minutes)

#### A. Test Mode Purchase:
- [ ] Go to your site
- [ ] Click "Start Free 14-Day Trial"
- [ ] You should land on Whop checkout page
- [ ] Append `?test=true` to URL for test mode
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Complete purchase

#### B. Verify Webhook:
- [ ] Go back to Whop dashboard
- [ ] Check webhook logs (Developer → Webhooks → View logs)
- [ ] Confirm webhook was received (200 status)
- [ ] Check your Supabase database for new user record

#### C. Verify User Creation:
- [ ] Open Supabase dashboard
- [ ] Check `users` table
- [ ] Confirm new record with:
  - Email from test purchase
  - whop_customer_id populated
  - subscription_status = 'active' or 'trial'

---

## 🎯 Beta Launch Strategy

### Pricing Tiers:

**Beta (First 15 users)**
- $59/month (save $20/mo forever)
- 14-day free trial
- Founder pricing locked forever
- Creates urgency with limited spots

**Regular (After beta)**
- $79/month
- 14-day free trial
- Standard pricing

### Marketing the Beta:

1. **Scarcity**: "Only 15 beta spots available"
2. **Savings**: "Save $240/year forever as a founding member"
3. **Social Proof**: "Join 3 other Skool community owners already tracking"
4. **Urgency**: "Beta closes in 48 hours" or "X spots left"

---

## 🔍 Troubleshooting

### If redirect doesn't work:
1. Check WHOP_CHECKOUT_LINK is set correctly
2. Try the fallback URL: `https://whop.com/checkout/prod_tm0tLYKsvpwxi/`
3. Check browser console for errors

### If webhook fails:
1. Verify URL is exactly: `https://allumi.com/api/webhooks/whop`
2. Check webhook secret matches exactly
3. Look at Vercel function logs
4. Test with webhook.site first

### If user isn't created:
1. Check Supabase service role key
2. Verify webhook is hitting your endpoint
3. Check for errors in Vercel logs
4. Test webhook handler locally

---

## 📊 What Happens After Setup

When a user signs up:

1. **User clicks "Start Free Trial"** → Redirected to Whop
2. **Completes checkout** → Starts 14-day trial
3. **Whop sends webhook** → Your server receives event
4. **User created in database** → Ready to use Allumi
5. **After 14 days** → Card charged automatically
6. **If cancelled** → Access ends, status updated

---

## 🎉 Launch Checklist

Before launching to first users:

- [ ] Checkout link tested in test mode
- [ ] Webhook confirmed working
- [ ] User creation verified
- [ ] Pricing displays correctly ($59 for beta)
- [ ] Trial period shows (14 days)
- [ ] Affiliate tracking ready (40% commission)

---

## 📞 Support

**Whop Support**: support@whop.com
**Whop Docs**: https://docs.whop.com
**Your Dashboard**: https://whop.com/dashboard/biz_g5ZqcyTAQA1DOK/

---

## 🚦 Ready to Launch?

Once all checkboxes are complete, you're ready to:
1. Share with first beta users
2. Track conversions
3. Monitor webhook logs
4. Celebrate your first paying customer! 🎉