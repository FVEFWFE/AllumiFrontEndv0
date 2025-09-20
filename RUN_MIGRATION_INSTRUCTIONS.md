# 📋 Database Migration Instructions

## Quick Steps to Run the Migration:

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/fyvxgciqfifjsycibikn/sql/new
   - Or click on "SQL Editor" in the left sidebar

2. **Copy this SQL and paste it into the editor:**

```sql
-- Add missing columns for improved attribution tracking
-- This migration ensures all required columns exist

-- Add missing columns to clicks table if they don't exist
ALTER TABLE public.clicks
ADD COLUMN IF NOT EXISTS short_id TEXT,
ADD COLUMN IF NOT EXISTS identity_id UUID REFERENCES public.identities(id),
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS cookie_id TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add missing columns to conversions table if they don't exist
ALTER TABLE public.conversions
ADD COLUMN IF NOT EXISTS attributed_link_id TEXT,
ADD COLUMN IF NOT EXISTS attribution_data JSONB,
ADD COLUMN IF NOT EXISTS confidence_score FLOAT,
ADD COLUMN IF NOT EXISTS device_fingerprint TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Update identities table with additional tracking fields
ALTER TABLE public.identities
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clicks_identity_id ON public.clicks(identity_id);
CREATE INDEX IF NOT EXISTS idx_clicks_session_id ON public.clicks(session_id);
CREATE INDEX IF NOT EXISTS idx_clicks_cookie_id ON public.clicks(cookie_id);
CREATE INDEX IF NOT EXISTS idx_conversions_attributed_link_id ON public.conversions(attributed_link_id);
CREATE INDEX IF NOT EXISTS idx_conversions_confidence_score ON public.conversions(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_identities_device_fingerprint ON public.identities(device_fingerprint);

-- Add composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_clicks_user_link_time ON public.clicks(user_id, link_id, clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversions_user_time ON public.conversions(user_id, created_at DESC);
```

3. **Run the migration:**
   - Click the "Run" button (or press Ctrl+Enter)
   - Wait for completion message

## What This Migration Does:

### ✅ Adds Missing Columns:
- **clicks table:** short_id, identity_id, session_id, cookie_id, email
- **conversions table:** attributed_link_id, attribution_data, confidence_score, device_fingerprint, metadata
- **identities table:** user_agent, last_seen, metadata

### ✅ Creates Performance Indexes:
- 8 new indexes for faster queries
- 2 composite indexes for complex lookups

## After Running:

1. **Verify Success:**
   - Check for green success message
   - No errors should appear

2. **Test Attribution:**
   - Run: `node test-e2e-attribution.js`
   - Should now show 80%+ accuracy

## Alternative: Copy from File

The full migration is also saved at:
`C:\Users\JanJe\OneDrive\Documents\Github\AllumiFrontEndv2\supabase\migrations\005_fix_attribution_columns.sql`

---

**Note:** This migration is safe to run multiple times - it only adds columns/indexes if they don't exist.