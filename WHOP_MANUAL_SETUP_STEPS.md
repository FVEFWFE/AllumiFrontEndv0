# 🎯 Whop Setup - Manual Steps with Exact Clicks

## Step 1: Open Whop Product Page
1. Open your browser
2. Go to: **https://whop.com/dashboard/biz_g5ZqcyTAQA1DOK/products/prod_tm0tLYKsvpwxi**
3. Log in if needed

## Step 2: Create Checkout Link with 14-Day Trial

### A. Navigate to Checkout Links
Look for one of these (depending on Whop's current UI):
- Button labeled **"Checkout links"**
- Button labeled **"Pricing options"**
- Tab labeled **"Pricing"**
- Button labeled **"Add pricing option"**

Click it.

### B. Create New Checkout Link
1. Click **"Create checkout link"** or **"Add pricing option"** or **"+ New"**

### C. Configure Basic Settings
Fill in these fields:
- **Name**: Beta Launch - 14 Day Trial
- **Type**: Select **"Recurring"** or **"Subscription"**
- **Price**: Enter **59** (for $59)
- **Currency**: **USD** (should be default)
- **Billing Period**: Select **"Monthly"**

### D. Enable Free Trial
1. Look for **"Advanced Options"** or **"More settings"** - click it
2. Find **"Free trial"** option - toggle it ON
3. Set trial period: Enter **14** days
4. Optional: Set **"Quantity limit"** to **15** (for beta scarcity)

### E. Save and Copy Link
1. Click **"Save"** or **"Create"**
2. Once created, you'll see a checkout link like: `link_XXXXXXXXXXXXX`
3. **COPY THIS LINK ID** - you'll need it for the next step

---

## Step 3: Configure Webhooks

### A. Go to Developer Settings
1. Navigate to: **https://whop.com/dashboard/biz_g5ZqcyTAQA1DOK/developer/**
2. Or from dashboard: Click **"Developer"** in sidebar

### B. Find Webhooks Section
Look for:
- **"Webhooks"** tab or section
- **"API & Webhooks"**
- **"Developer > Webhooks"**

### C. Create/Edit Webhook
1. Click **"Create webhook"** or **"Add endpoint"** or **"+ New webhook"**
2. If webhook already exists, click **"Edit"**

### D. Configure Webhook Settings
Enter these exact values:

**Endpoint URL**:
```
https://allumi.com/api/webhooks/whop
```

**Events to listen for** (check these boxes):
- ✅ payment_succeeded
- ✅ membership_went_valid
- ✅ membership_went_invalid
- ✅ payment_affiliate_reward_created
- ✅ refund_created

### E. Copy Webhook Secret
1. After saving, you'll see a webhook secret
2. It starts with `ws_` followed by random characters
3. **COPY THE FULL SECRET** - looks like: `ws_ae77b...2fb2fc95`

---

## Step 4: Update Your Environment Variables

Open your `.env.local` file and add:

```env
# From Step 2E - your checkout link ID
WHOP_CHECKOUT_LINK=link_PASTE_YOUR_LINK_ID_HERE

# From Step 3E - your webhook secret
WHOP_WEBHOOK_SECRET=ws_PASTE_YOUR_FULL_SECRET_HERE
```

Example (with fake values):
```env
WHOP_CHECKOUT_LINK=link_abc123xyz789
WHOP_WEBHOOK_SECRET=ws_ae77b4d89e3f...full_secret_here
```

---

## Step 5: Test Your Setup

### A. Test the Redirect
1. Go to your local dev site: **http://localhost:3002**
2. Click any **"Start Free Trial"** button
3. You should be redirected to Whop checkout page
4. Check that it shows:
   - Price: $59/month
   - Trial: 14 days free

### B. Test Mode Purchase (Optional)
1. On the Whop checkout page, add `?test=true` to the URL
2. Use test card: **4242 4242 4242 4242**
3. Any future date, any CVC
4. Complete the purchase

### C. Check Webhook Logs
1. Go back to Whop Developer dashboard
2. Find **"Webhook logs"** or **"Request logs"**
3. You should see your test event with status **200**

---

## 🚨 Common Issues & Solutions

### If you can't find "Checkout links":
- Try looking for "Pricing" or "Plans"
- It might be under the product's main page
- Look for a "+" or "Add" button

### If trial option isn't visible:
- Make sure you selected "Recurring" type first
- Look in "Advanced settings" or "More options"
- It might be called "Free trial period" or "Trial days"

### If webhook isn't working:
- Double-check the URL has no typos
- Make sure it's HTTPS not HTTP
- Try removing and re-adding the webhook

---

## ✅ Success Checklist

After completing these steps, you should have:
- [ ] A checkout link ID starting with `link_`
- [ ] A webhook secret starting with `ws_`
- [ ] Both values added to `.env.local`
- [ ] Successful redirect to Whop checkout
- [ ] Checkout page showing $59/mo with 14-day trial

---

## 📱 Quick Alternative: Direct Links

If you have trouble creating the checkout link, you can try these direct URLs:

1. **Product checkout** (may not have trial):
   ```
   https://whop.com/checkout/prod_tm0tLYKsvpwxi/
   ```

2. **Marketplace page**:
   ```
   https://whop.com/allumi/
   ```

But creating a proper checkout link with trial is preferred!