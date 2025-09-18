# 🚀 ALLUMI PRODUCTION DEPLOYMENT CHECKLIST

## ✅ Completed Tasks
- [x] Frontend codebase cleaned up and organized
- [x] Created UTM-tracked links for all channels
- [x] Generated SQL for Supabase link creation
- [x] Prepared environment variable templates

## 🔧 IMMEDIATE NEXT STEPS

### 1. Supabase Setup (CRITICAL - Do First!)
```bash
1. Go to https://supabase.com
2. Create new project called "allumi-production"
3. Save these credentials:
   - Project URL
   - Anon Key (public)
   - Service Role Key (secret)
4. Go to SQL Editor
5. Run the schema from: supabase/schema.sql
6. Run the UTM links SQL generated above
```

### 2. Update Environment Variables
```bash
1. Update .env.local with real Supabase credentials
2. Get FingerprintJS API key from https://fingerprintjs.com
3. Get PostHog key from https://posthog.com
4. Update Featurebase widget ID
```

### 3. Deploy to Vercel
```bash
# Option A: Deploy via CLI (recommended)
vercel --prod

# Option B: Deploy via GitHub
1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy to allumi.to domain
```

### 4. Configure Domains in Vercel
```
1. Add custom domain: allumi.to
2. Update DNS records:
   - A record: 76.76.21.21
   - CNAME: cname.vercel-dns.com
```

## 📱 INSTAGRAM WHALE OUTREACH SETUP

### Day 1 (Today):
1. Update IG bio with: https://allumi.to/ig-bio
2. Follow 10 whale prospects
3. Like 2-3 recent posts each
4. Save compelling content for later engagement

### Day 2-3:
1. Comment genuinely on 5 prospects' posts
2. Reply to their stories with value
3. Follow 10 more prospects daily

### Day 4-7:
1. Start DMing warm prospects
2. Use this opener:
   "Hey [name]! Been following your Skool community growth - impressive how you hit $[MRR]. 
   Quick q - do you track which content/ads actually drive paying members? 
   Building something that might help."

## 🧪 TESTING CHECKLIST

### Attribution Flow Test:
1. [ ] Create test short link
2. [ ] Click link from different devices
3. [ ] Verify click tracking in Supabase
4. [ ] Test Zapier webhook with mock Skool signup
5. [ ] Verify attribution calculation
6. [ ] Check PostHog event capture

### Link Shortener Test:
1. [ ] Visit https://allumi.to/ig-bio
2. [ ] Verify redirect to allumi.com with UTM params
3. [ ] Check click recorded in database
4. [ ] Test device fingerprinting

## 📊 KEY METRICS TO TRACK

### PostHog Events to Monitor:
- `link_clicked` - Track all short link clicks
- `whale_signup` - Track high-value prospect signups
- `conversion_attributed` - Track successful attributions
- `trial_started` - Track new Allumi trials

### Daily KPIs:
- Whale prospects contacted
- Response rate
- Trial signups
- Attribution accuracy

## 🔗 IMPORTANT URLS

### Your UTM-Tracked Links:
- Instagram: https://allumi.to/ig-bio
- Skool: https://allumi.to/skool-com
- dexvolkov.com: https://allumi.to/dex-site
- Jan's X: https://allumi.to/x-jan
- Dex's X: https://allumi.to/x-dex

### Admin Dashboards:
- Supabase: https://app.supabase.com
- Vercel: https://vercel.com/dashboard
- PostHog: https://app.posthog.com
- Featurebase: https://featurebase.app

## 🚨 TROUBLESHOOTING

### If build fails:
```bash
npm install csv-stringify
npm run build
```

### If Supabase connection fails:
1. Check .env.local has correct keys
2. Verify Supabase project is active
3. Check RLS policies are disabled for testing

### If redirects don't work:
1. Check vercel.json rewrites
2. Verify domain DNS propagation
3. Test with curl: `curl -I https://allumi.to/ig-bio`

## 📝 NOTES

- allumi.com = Your existing landing page (keep as is)
- allumi.to = Link shortener for attribution tracking
- Charge everyone $49-79/mo (whales pay same for social proof)
- Use Featurebase for support (NOT Discord)
- Monthly: Re-run Skool scraper on Oct 1

---

**Ready to launch! 🚀 Start with Supabase setup, then deploy to Vercel.**