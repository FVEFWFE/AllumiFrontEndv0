# 🚨 TEMPORARY FILE - DELETE AFTER RUNNING THIS IMPLEMENTATION PLAN 🚨

# PostHog Analytics Complete Implementation Plan for Allumi

## Current State Analysis
Based on PostHog MCP analysis, the current integration is minimal (3/10 rating):
- ✅ Basic PostHog provider setup exists
- ✅ Pageview tracking enabled
- ❌ No custom events implemented
- ❌ No user identification
- ❌ No conversion tracking
- ❌ No feature flags
- ❌ No A/B testing
- ❌ No surveys configured
- ❌ No session recording
- ❌ No custom dashboards for Allumi

## 📋 Master Todo List for PostHog Implementation

### Phase 1: Core Analytics Setup (Pre-Launch Priority)
- [ ] **1. Fix PostHog Initialization**
  - Update PostHog configuration with proper API keys
  - Enable session recording
  - Configure person profiles
  - Set up proper domain settings

- [ ] **2. Implement User Identification**
  - Add user ID tracking after email signup
  - Track user properties (email, name, signup_date)
  - Implement on trial start and login

- [ ] **3. Track Critical Conversion Events**
  - `trial_started` - When user starts 14-day trial
  - `demo_requested` - When user requests 2-min demo
  - `waitlist_joined` - When user joins waitlist
  - `affiliate_application` - When someone applies to affiliate program
  - `email_captured` - Any email signup event
  - `pricing_viewed` - Track pricing page views
  - `feature_explored` - Track which features users explore

- [ ] **4. Track Engagement Events**
  - `hero_cta_clicked` - Track main CTA interactions
  - `scroll_depth` - How far users scroll on landing page
  - `time_on_page` - Engagement time tracking
  - `video_played` - If demo video is watched
  - `faq_expanded` - Which FAQs are most viewed
  - `navigation_clicked` - Track header navigation usage

- [ ] **5. Setup UTM & Attribution Tracking**
  - Capture all UTM parameters
  - Track referral sources
  - Set up first-touch attribution
  - Track campaign effectiveness

### Phase 2: Advanced Features (Post-Launch)
- [ ] **6. Implement Feature Flags**
  - `new_pricing_test` - A/B test pricing display
  - `onboarding_flow_v2` - Test new onboarding
  - `beta_features` - Gate beta features
  - `affiliate_dashboard` - Control affiliate features

- [ ] **7. Create Custom Dashboards**
  - **Conversion Funnel Dashboard**
    - Visitor → Email → Trial → Paid
  - **Marketing Attribution Dashboard**  
    - Which channels drive trials
    - Cost per acquisition by source
  - **Product Analytics Dashboard**
    - Feature usage stats
    - User engagement metrics
  - **Affiliate Performance Dashboard**
    - Affiliate signups and conversions
    - Commission tracking

- [ ] **8. Setup Surveys**
  - **Exit Intent Survey** - Why are users leaving?
  - **Post-Trial Survey** - Why did/didn't they convert?
  - **NPS Survey** - 30 days after signup
  - **Feature Request Survey** - What do users want?

- [ ] **9. Implement Session Recording**
  - Enable for all users initially
  - Set up privacy exclusions
  - Create rage click alerts
  - Monitor conversion drop-offs

- [ ] **10. Setup Experiments**
  - **Pricing Page A/B Test**
    - Test different price points
    - Test billing period emphasis
  - **Hero Copy Test**
    - Test different value propositions
  - **CTA Button Test**
    - Test button colors and copy

### Phase 3: Revenue & Growth Tracking
- [ ] **11. Revenue Analytics**
  - Track MRR/ARR
  - Implement revenue per user
  - Track LTV by acquisition source
  - Churn prediction models

- [ ] **12. Implement Cohort Analysis**
  - Weekly cohort retention
  - Feature adoption by cohort
  - Revenue retention curves

- [ ] **13. Setup Alerts & Automation**
  - Alert on conversion rate drops
  - Alert on high-value user signup
  - Alert on payment failures
  - Weekly performance reports

### Implementation Code Snippets

#### 1. Enhanced PostHog Provider (components/posthog-provider.tsx)
```typescript
// Add user identification
export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, {
      email: properties?.email,
      name: properties?.name,
      signup_date: new Date().toISOString(),
      plan: 'trial',
      ...properties
    });
  }
}

// Add custom event tracking
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
}

// Add revenue tracking
export function trackRevenue(amount: number, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.capture('$revenue', {
      revenue: amount,
      currency: 'USD',
      ...properties
    });
  }
}
```

#### 2. Email Popup Tracking (components/email-popup.tsx)
```typescript
// In handleSubmit function, after successful email capture:
trackEvent('email_captured', {
  source: 'popup',
  page: window.location.pathname,
  custom_title: customTitle,
  group_id: groupId
});

// If it's a trial signup:
identifyUser(email, { email });
trackEvent('trial_started', {
  trial_type: '14_day',
  source: 'popup'
});
```

#### 3. Affiliate Page Tracking (app/affiliate/page.tsx)
```typescript
// Track affiliate CTA clicks
trackEvent('affiliate_application', {
  source: 'cta_button',
  page_section: 'hero'
});

// Track calculator interactions
trackEvent('income_calculator_used', {
  selected_tier: tierName
});
```

#### 4. Landing Page Analytics (app/page.tsx)
```typescript
// Track scroll depth
useEffect(() => {
  let maxScroll = 0;
  const handleScroll = () => {
    const scrollPercent = (window.scrollY / document.body.scrollHeight) * 100;
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      if (maxScroll > 25 && maxScroll < 30) trackEvent('scroll_25_percent');
      if (maxScroll > 50 && maxScroll < 55) trackEvent('scroll_50_percent');
      if (maxScroll > 75 && maxScroll < 80) trackEvent('scroll_75_percent');
      if (maxScroll > 90) trackEvent('scroll_90_percent');
    }
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### Priority Implementation Order (For Immediate Action)

1. **TODAY - Critical Setup**
   - Fix PostHog initialization with proper configs
   - Add email capture tracking
   - Add trial start tracking
   - Add basic conversion funnel

2. **THIS WEEK - Core Events**
   - Implement all conversion events
   - Add UTM tracking
   - Setup user identification
   - Create first dashboard

3. **NEXT WEEK - Advanced Features**
   - Setup A/B testing for pricing
   - Implement session recording
   - Add exit intent survey
   - Create attribution dashboard

### Environment Variables Needed
```env
NEXT_PUBLIC_POSTHOG_KEY=phc_XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_POSTHOG_PERSON_PROFILES=identified_only
```

### Testing Checklist
- [ ] Verify events fire in PostHog dashboard
- [ ] Check user identification works
- [ ] Test conversion funnel tracking
- [ ] Validate UTM parameter capture
- [ ] Ensure no PII leakage in events
- [ ] Test feature flags work properly
- [ ] Verify session recordings capture

### Success Metrics to Track
- Visitor to email conversion rate (target: >5%)
- Email to trial conversion rate (target: >30%)
- Trial to paid conversion rate (target: >10%)
- Average session duration (target: >2 minutes)
- Pages per session (target: >3)
- Affiliate application rate (target: >2%)

## 🚀 Next Steps
1. Copy this implementation plan
2. Delete this temporary file
3. Start with Phase 1 in a new context window
4. Use PostHog MCP tools to create dashboards and insights
5. Test each implementation thoroughly

---
**Remember: Delete this file after copying the implementation plan!**