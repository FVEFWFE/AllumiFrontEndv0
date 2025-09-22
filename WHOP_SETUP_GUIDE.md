# 🔧 Whop Configuration Guide for Allumi

## 📋 Required Setup in Whop Dashboard

### 1. **Configure Success/Cancel URLs**

In your Whop product settings, set these URLs:

```
Success URL: https://allumi.com/welcome?source=whop
Cancel URL: https://allumi.com/pricing?cancelled=true
```

### 2. **Configure Webhooks**

Add these webhook endpoints in Whop dashboard:

```
Trial Started: https://allumi.com/api/webhooks/whop/trial-started
Payment Succeeded: https://allumi.com/api/webhooks/whop/payment
Subscription Updated: https://allumi.com/api/webhooks/whop/subscription
```

### 3. **Environment Variables Needed**

Add to `.env.local`:

```bash
# Whop Configuration
WHOP_CHECKOUT_LINK=link_XXXXXXXXXXXXXX  # Your checkout link ID
WHOP_PRODUCT_ID=prod_XXXXXXXXXXXXX      # Your product ID
WHOP_WEBHOOK_SECRET=whsec_XXXXXXXXXXXX  # Webhook signing secret
WHOP_API_KEY=wapi_XXXXXXXXXXXXXXXXXXXXX # API key for Whop API calls
```

---

## 🔄 User Flow After Payment

### What Happens:

1. **User completes payment on Whop**
   - Card is authorized
   - 14-day trial starts
   - Whop sends webhook to our endpoint

2. **Webhook creates user profile**
   - `/api/webhooks/whop/trial-started` receives data
   - User profile created in Supabase
   - Trial end date set (14 days)

3. **User redirected to `/welcome`**
   - Confetti celebration
   - Demo dashboard shown
   - Persona selection
   - Account creation
   - First link generated

4. **User lands in dashboard**
   - Trial banner shows days remaining
   - Onboarding checklist visible
   - Ready to track conversions

---

## 🧪 Testing the Flow

### Local Testing:
```bash
# 1. Use ngrok to expose local endpoint
ngrok http 3000

# 2. Set webhook URL in Whop to:
https://your-ngrok-url.ngrok.io/api/webhooks/whop/trial-started

# 3. Create test purchase in Whop test mode
```

### Verify Success:
- [ ] Webhook received and logged
- [ ] User created in database
- [ ] Redirect to `/welcome` works
- [ ] Trial banner shows correct end date
- [ ] Demo dashboard loads

---

## 🎯 Critical Success Points

### Must Work:
1. **Redirect URL** - User must land on `/welcome` after payment
2. **Account Creation** - Seamless signup with email from Whop
3. **Trial Tracking** - Show "Day X of 14" everywhere
4. **Value Demo** - Show dashboard with demo data immediately

### Nice to Have:
1. Pre-fill email from Whop webhook
2. Auto-login after account creation
3. Welcome email with next steps
4. Slack notification of new trial

---

## 📊 Metrics to Track

```javascript
// Track these events
trackEvent('whop_trial_started', { product_id });
trackEvent('welcome_page_viewed', { source: 'whop' });
trackEvent('demo_dashboard_interacted', { time_spent });
trackEvent('persona_selected', { type });
trackEvent('account_created', { time_from_payment });
trackEvent('first_link_created', { time_from_account });
trackEvent('trial_converted_to_paid', { days_used });
```

---

## 🚨 Common Issues & Solutions

### Issue: User not redirected after payment
**Solution**: Verify success URL in Whop product settings

### Issue: Webhook not creating user
**Solution**: Check webhook signature verification and API keys

### Issue: Trial end date incorrect
**Solution**: Ensure timezone handling in webhook processing

### Issue: User can't login after payment
**Solution**: Implement temporary password or magic link system

---

## 💡 Optimization Ideas

1. **Pre-warm the account** - Create shadow account during checkout
2. **Progressive profiling** - Don't ask for all info upfront
3. **Smart defaults** - Auto-detect their Skool community URL
4. **Instant gratification** - Show a click happening live
5. **Social proof** - "127 others started trials today"

---

## 📞 Support Resources

- Whop Documentation: https://docs.whop.com
- Whop Support: support@whop.com
- Test Checkout Link: https://whop.com/checkout/[your-link]?d2c=true

---

## ✅ Checklist Before Going Live

- [ ] Success URL configured in Whop
- [ ] Webhook endpoint deployed and tested
- [ ] Welcome page shows demo dashboard
- [ ] Account creation flow works
- [ ] Trial banner displays correctly
- [ ] First link can be created
- [ ] Analytics events firing
- [ ] Error handling for edge cases
- [ ] Mobile responsive welcome page
- [ ] Trial expiry reminders set up