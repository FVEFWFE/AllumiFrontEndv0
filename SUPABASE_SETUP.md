# Supabase Setup Guide for Allumi

## ✅ What's Been Set Up

### 1. **Dependencies Installed**
- `@supabase/supabase-js` - Core Supabase client
- `@supabase/ssr` - Server-side rendering support for Next.js

### 2. **Configuration Files Created**
- `.env.local.example` - Environment variables template
- `lib/supabase/client.ts` - Browser client
- `lib/supabase/server.ts` - Server client  
- `lib/supabase/middleware.ts` - Auth middleware
- `middleware.ts` - Next.js middleware integration
- `lib/supabase/database.types.ts` - TypeScript types

### 3. **Database Schema Ready**
- `supabase/migrations/001_initial_schema.sql` - Complete database schema with:
  - Users table with UTM tracking
  - Communities table
  - Memberships with attribution
  - Posts table
  - Revenue attribution table (KEY DIFFERENTIATOR)
  - Row Level Security policies
  - Indexes for performance

## 🚀 Next Steps to Connect

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Save your project URL and anon key

### 2. Set Up Environment Variables
```bash
# Copy the example file
cp .env.local.example .env.local

# Add your Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run Database Migration
```bash
# In Supabase dashboard:
1. Go to SQL Editor
2. Copy contents of supabase/migrations/001_initial_schema.sql
3. Run the query
```

### 4. Enable Authentication
In Supabase Dashboard:
1. Go to Authentication → Providers
2. Enable Email/Password
3. Enable Google OAuth (optional)
4. Enable GitHub OAuth (optional)

### 5. Configure Email Templates
1. Go to Authentication → Email Templates
2. Update confirmation email
3. Add Allumi branding
4. Include UTM parameters in links

## 📊 Attribution Tracking Implementation

The key differentiator is ready:

### How It Works
1. **Signup**: UTM parameters captured in `users` table
2. **Join Community**: UTM stored in `memberships` table  
3. **Revenue**: Tracked in `revenue_attribution` table
4. **Dashboard**: Queries aggregate data by source

### UTM Parameters Tracked
- `utm_source` (e.g., youtube, twitter)
- `utm_medium` (e.g., social, email)
- `utm_campaign` (e.g., launch, black-friday)
- `utm_term` (keyword for paid search)
- `utm_content` (specific ad or link)

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only see their own data
- Community owners see all community data
- Members can only access joined communities
- Attribution data protected by ownership

### Policies Implemented
- User profile management
- Community visibility rules
- Membership access control
- Post permissions
- Revenue attribution privacy

## 📝 Database Schema Overview

```sql
users → communities (owner)
  ↓        ↓
memberships (many-to-many)
  ↓
revenue_attribution (tracks conversions)
```

## 🎯 Ready for Testing

Once connected, you can:
1. Sign up with UTM parameters
2. Create communities
3. Track member sources
4. View attribution dashboard
5. See revenue by channel

## 💡 Tips

1. **Test Attribution**: Always include UTM params in signup links
2. **Monitor RLS**: Check Supabase logs for permission errors
3. **Backup Data**: Export regularly during development
4. **Use Triggers**: Database handles member counts automatically

---

**Status**: Frontend ready, awaiting Supabase project creation and connection