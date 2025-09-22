# 🚀 ALLUMI PRODUCTION LAUNCH - EXECUTION PLAN
*Time Required: 45 minutes*
*Current Status: 75% Complete*

## 🎯 OBJECTIVE
Get Allumi to production with Whop-only authentication working

## ✅ PREREQUISITES COMPLETED
- [x] Whop webhook handler created
- [x] Login page updated for Whop checkout
- [x] Local dev environment running (port 3006)
- [x] Database migration script ready
- [x] Test webhook script prepared

## 📋 PHASE 1: DATABASE SETUP (10 mins)

### Step 1.1: Open Supabase Dashboard
```
URL: https://supabase.com/dashboard/project/fyvxgciqfifjsycibikn
Navigate to: SQL Editor (left sidebar)
```

### Step 1.2: Run Migration
1. Copy entire contents of `FIX_DB_AND_PREPARE_WHOP.sql`
2. Paste into SQL Editor
3. Click "Run" button
4. Verify output shows:
   - Foreign keys fixed ✓
   - Whop columns added ✓
   - Test user created ✓

### Step 1.3: Verify Migration
Run this query to confirm:
```sql
-- Check foreign keys are correct
SELECT COUNT(*) as fixed_constraints
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND table_name IN ('user_settings', 'campaign_spend');
-- Should return 2

-- Check test user exists
SELECT email, subscription_status
FROM auth.users u
JOIN user_settings us ON u.id = us.user_id
WHERE email = 'test@allumi.com';
-- Should show test user with 'trial' status
```

## 📋 PHASE 2: LOCAL TESTING (20 mins)

### Step 2.1: Set Up ngrok Tunnel
```bash
# Install ngrok if needed
npm install -g ngrok

# Start tunnel to local server
ngrok http 3006

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

### Step 2.2: Configure Whop Webhook
1. Go to Whop Dashboard: https://dash.whop.com
2. Navigate to: Developer → Webhooks
3. Add endpoint:
   - URL: `https://[your-ngrok-url].ngrok.io/api/webhooks/whop`
   - Events: Select all subscription/membership events
4. Copy the webhook secret (starts with `ws_`)

### Step 2.3: Update Environment
Edit `.env.local`:
```env
WHOP_WEBHOOK_SECRET=ws_[paste-actual-secret-here]
```

### Step 2.4: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Restart with new env vars
npm run dev
```

### Step 2.5: Test Webhook
```bash
# Update test-whop-webhook.js with:
# - Your ngrok URL
# - Actual webhook secret

node test-whop-webhook.js
```

### Step 2.6: Verify User Creation
Check Supabase Dashboard:
```sql
SELECT * FROM whop_webhook_events ORDER BY created_at DESC;
-- Should show test events

SELECT * FROM user_settings WHERE created_via = 'whop' ORDER BY created_at DESC;
-- Should show new test user
```

### Step 2.7: Test Login
1. Check console for temporary password from webhook
2. Navigate to: http://localhost:3006/login
3. Login with test credentials
4. Verify redirect to dashboard

## 📋 PHASE 3: PRODUCTION DEPLOYMENT (15 mins)

### Step 3.1: Final Code Check
```bash
# Check for any hardcoded secrets
grep -r "ws_" --include="*.ts" --include="*.tsx" .
# Should only show .env references

# Check for console.logs to remove
grep -r "console.log" app/api/webhooks/whop/
# Consider removing sensitive logs
```

### Step 3.2: Commit Changes
```bash
git add .
git commit -m "feat: Implement Whop-only authentication system

- Users must create accounts via Whop trial/payment
- Webhook handler creates Supabase users automatically
- Removed direct registration capability
- Updated login page with Whop checkout flow
- Added database migrations for Whop integration
- Subscription status synced via webhooks

Breaking changes:
- Direct registration no longer available
- All new users must go through Whop

Closes #auth-rework"

git push origin main
```

### Step 3.3: Monitor Deployment
1. Check Vercel Dashboard: https://vercel.com/dashboard
2. Watch build logs for errors
3. Verify deployment completed

### Step 3.4: Configure Production Webhook
1. Go to Whop Dashboard
2. Update webhook URL to: `https://allumi.com/api/webhooks/whop`
3. Keep same webhook secret

### Step 3.5: Test Production Endpoint
```bash
curl https://allumi.com/api/webhooks/whop

# Should return:
# {
#   "status": "Whop webhook endpoint ready",
#   "events_supported": [...],
#   "webhook_configured": true
# }
```

### Step 3.6: Create Test Purchase
1. Use Whop test mode
2. Create test subscription
3. Monitor webhook events in Supabase
4. Verify user creation

## 🔍 VERIFICATION CHECKLIST

### Local Testing ✓
- [ ] Database migration successful
- [ ] ngrok tunnel working
- [ ] Webhook receives events
- [ ] User created in Supabase
- [ ] Can login with temp password
- [ ] Dashboard loads after login

### Production ✓
- [ ] Vercel deployment successful
- [ ] Webhook endpoint accessible
- [ ] Whop webhook configured
- [ ] Test purchase creates user
- [ ] Production login works
- [ ] No sensitive data in logs

## 🚨 TROUBLESHOOTING

### Issue: Webhook signature verification fails
```javascript
// Check webhook secret format
console.log('Secret starts with:', process.env.WHOP_WEBHOOK_SECRET?.substring(0, 5));
// Should be: ws_xx
```

### Issue: User not created
```sql
-- Check webhook events
SELECT * FROM whop_webhook_events
WHERE processed = false
ORDER BY created_at DESC;

-- Check for errors
SELECT event_type, error, payload
FROM whop_webhook_events
WHERE error IS NOT NULL;
```

### Issue: Foreign key constraint error
```sql
-- Re-run constraint fix
ALTER TABLE user_settings
DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;

ALTER TABLE user_settings
ADD CONSTRAINT user_settings_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

## 📊 SUCCESS METRICS

### Immediate (Today)
- ✅ Webhook processes events
- ✅ Users created via Whop
- ✅ Login flow works
- ✅ Dashboard accessible

### Day 1
- [ ] 10+ test signups
- [ ] Zero authentication errors
- [ ] Subscription status accurate

### Week 1
- [ ] 100+ users onboarded
- [ ] <1% webhook failures
- [ ] Payment processing working

## 🎯 NEXT ACTIONS AFTER LAUNCH

1. **Implement Email Notifications**
   - Welcome emails with temp passwords
   - Password reset flow
   - Trial expiration warnings

2. **Add Monitoring**
   - Sentry error tracking
   - Webhook failure alerts
   - User creation metrics

3. **Optimize Onboarding**
   - Better password reset UX
   - Onboarding wizard
   - Tutorial videos

## 📝 LAUNCH NOTES

**Critical Path**: Database → Webhook → Test → Deploy

**Time Breakdown**:
- Database: 10 mins
- Local test: 20 mins
- Production: 15 mins
- Total: 45 mins

**Risk Areas**:
- Webhook secret misconfiguration
- Foreign key constraints
- Environment variable issues

---

**Ready to Launch?** Start with Phase 1: Database Setup

Good luck! 🚀