# Allumi Testing Checklist
*Date: January 20, 2025*
*Time: 9:45 AM - Start*

## Phase 1: Whop Payment Configuration (9-10 AM)

### Configuration Tasks
- [x] Created Whop checkout link with $59/mo and 14-day trial
- [x] Configured webhook endpoint (https://allumi.com/api/webhooks/whop)
- [ ] Obtained and saved:
  - [x] Checkout Link ID: `plan_ufRzE7PHJgEXR`
  - [ ] Webhook Secret: `_______________`
  - [ ] API Key: `_______________`
  - [ ] Client ID: `_______________`
  - [ ] Client Secret: `_______________`
- [x] Updated .env.local with credentials
- [x] Ran database migration for whop_events table

### Payment Flow Testing
- [x] Click "Start Free Trial" button works
- [x] Redirects to correct Whop checkout
- [ ] Test mode purchase (4242 4242 4242 4242)
- [ ] Webhook received and logged
- [ ] User created in Supabase
- [ ] Subscription status set correctly

## Phase 2: User Flow Testing (10 AM - 12 PM)

### First-Time Visitor Flow
- [ ] Landing page loads correctly
- [ ] Demo modal opens and captures:
  - [ ] Email
  - [ ] Skool URL
  - [ ] Name
- [ ] Attio enrichment happens
- [ ] Email notification sent via MailerLite
- [ ] User redirected to demo page

### Trial Signup Flow
- [ ] Pricing shows $59 beta pricing
- [ ] "Start Free Trial" button visible
- [ ] Redirects to Whop checkout
- [ ] Trial period shows 14 days
- [ ] After payment, user created in database
- [ ] User can access dashboard

### Dashboard Functionality
- [ ] Login/logout works
- [ ] Create attribution link
- [ ] View created links
- [ ] Click tracking records properly
- [ ] Settings page functional
- [ ] API keys can be managed

## Phase 3: Attribution Testing (1-3 PM)

### Link Creation & Tracking
- [ ] Create test attribution link
- [ ] Short URL generated
- [ ] Click from different browser/device
- [ ] Click recorded in database
- [ ] UTM parameters captured

### Identity Resolution
- [ ] Device fingerprinting works
- [ ] Identity matching logic verified
- [ ] Cross-device tracking tested
- [ ] Confidence scoring calculated

### Conversion Tracking
- [ ] Simulate Zapier webhook (Skool member joined)
- [ ] Attribution matching verified
- [ ] Time-decay calculation correct
- [ ] Conversion recorded

## Phase 4: Integration Testing (3-4 PM)

### Whop Webhook Testing
- [ ] subscription.created handled
- [ ] payment.succeeded updates user
- [ ] subscription.cancelled works
- [ ] Trial to paid conversion tracked

### Database Verification
- [ ] All tables have correct schema
- [ ] RLS policies work correctly
- [ ] No permission errors
- [ ] Data persists properly

### Third-party Services
- [ ] Supabase auth works
- [ ] PostHog events tracking
- [ ] MailerLite emails sending
- [ ] Attio CRM updating

## Phase 5: Edge Cases & Error Handling (4-5 PM)

### Payment Edge Cases
- [ ] Card declined handling
- [ ] Webhook timeout/retry
- [ ] Duplicate webhook events
- [ ] User already exists scenario

### User Experience Issues
- [ ] Slow network conditions
- [ ] Browser back button
- [ ] Multiple tabs open
- [ ] Session expiration
- [ ] Form validation errors

### Data Integrity
- [ ] Duplicate email signups
- [ ] Missing required fields
- [ ] Invalid Skool URLs
- [ ] Malformed webhook data

## Phase 6: Production Readiness (5-6 PM)

### Performance Check
- [ ] Page load times < 3 seconds
- [ ] Database queries optimized
- [ ] No console errors
- [ ] Mobile responsive

### Security Audit
- [ ] Environment variables secure
- [ ] Webhook signature verified
- [ ] SQL injection protected
- [ ] XSS prevention in place

### Documentation Update
- [ ] Update setup guides with findings
- [ ] Document any workarounds needed
- [ ] Create troubleshooting guide
- [ ] Note all test scenarios

## Bug Tracking

### Issue #1
- **Description**:
- **Steps to reproduce**:
- **Expected**:
- **Actual**:
- **Priority**:
- **Fixed**: [ ]

### Issue #2
- **Description**:
- **Steps to reproduce**:
- **Expected**:
- **Actual**:
- **Priority**:
- **Fixed**: [ ]

### Issue #3
- **Description**:
- **Steps to reproduce**:
- **Expected**:
- **Actual**:
- **Priority**:
- **Fixed**: [ ]

## Test Results Summary

### Phase 1 Results
- **Status**:
- **Issues Found**:
- **Time Completed**:

### Phase 2 Results
- **Status**:
- **Issues Found**:
- **Time Completed**:

### Phase 3 Results
- **Status**:
- **Issues Found**:
- **Time Completed**:

### Phase 4 Results
- **Status**:
- **Issues Found**:
- **Time Completed**:

### Phase 5 Results
- **Status**:
- **Issues Found**:
- **Time Completed**:

### Phase 6 Results
- **Status**:
- **Issues Found**:
- **Time Completed**:

## Final Status
- **Ready for Production**: [ ] Yes [ ] No
- **Critical Bugs Remaining**:
- **Next Steps**: