# Allumi Attribution Platform - Setup Guide

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works)
- Vercel account for deployment
- Domain configured (allumi.to)

### 2. Environment Setup

1. Copy `.env.local.template` to `.env.local`
2. Fill in your credentials:

```bash
# Required for core functionality
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Set your domain
NEXT_PUBLIC_APP_URL=https://allumi.to  # or http://localhost:3000 for dev
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Copy your project URL and keys to `.env.local`
4. Enable Email Auth in Authentication settings

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
/app
  /api
    /links
      /create       # Create short links
    /webhooks
      /zapier      # Handle Skool member conversions
      /whop        # Payment webhooks
  /l
    /[shortId]     # Click tracking & redirect
  /dashboard       # User dashboard (to be built)
  /auth           # Authentication pages

/lib
  fingerprint.ts   # Device fingerprinting
  supabase.ts     # Supabase client
  attribution.ts  # Attribution logic

/components
  # Reusable UI components

/supabase
  schema.sql      # Database schema
```

## 🔑 Key Features Implemented

### ✅ Core Attribution Engine
- Link shortener with UTM tracking
- Click tracking with device fingerprinting  
- Identity resolution across devices
- Zapier webhook for Skool conversions
- Time-decay attribution model

### 🚧 In Progress
- User dashboard
- Whop payment integration
- Chrome extension
- Email tracking pixels

### 📝 To Do
- Complete dashboard UI
- Add more attribution models
- Implement CSV exports
- Build onboarding flow

## 🧪 Testing

### Test Link Creation
```bash
curl -X POST http://localhost:3000/api/links/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-id",
    "campaignName": "Test Campaign",
    "destinationUrl": "https://skool.com/group",
    "utmSource": "youtube",
    "utmMedium": "video",
    "utmCampaign": "launch"
  }'
```

### Test Zapier Webhook
```bash
curl -X POST http://localhost:3000/api/webhooks/zapier \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "skoolGroupUrl": "https://skool.com/testgroup",
    "userId": "test-user-id",
    "joinedAt": "2025-09-17T12:00:00Z"
  }'
```

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Custom Domain Setup

1. Add domain in Vercel settings
2. Update DNS records:
   - A record: 76.76.21.21
   - CNAME: cname.vercel-dns.com

## 📊 Database Schema Overview

- **users**: Allumi customer accounts
- **links**: Short URLs and campaigns
- **clicks**: Click tracking data
- **identities**: Cross-device identity resolution
- **conversions**: Skool member signups
- **attribution_reports**: Processed analytics

## 🔒 Security

- Row Level Security enabled on all tables
- API routes protected with authentication
- Service role key only used server-side
- HTTPS enforced in production

## 📈 Next Steps

1. **Set up Supabase** and run the schema
2. **Configure environment variables**
3. **Test link creation** and tracking
4. **Deploy to Vercel**
5. **Configure domain DNS**
6. **Start onboarding beta users**

## 🤝 Support

For questions or issues, check:
- Master Plan: `/13. Management/ALLUMI_MASTER_PLAN.md`
- Progress Tracker: `/13. Management/ALLUMI_PROGRESS_TRACKER.md`

---

**Ready to track attribution for Skool communities!** 🎯