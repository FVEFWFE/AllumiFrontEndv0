-- Fix Conversions Table Schema
-- Run this in Supabase SQL Editor

-- First, check if conversions table exists
CREATE TABLE IF NOT EXISTS conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  skool_email TEXT NOT NULL,
  skool_name TEXT,
  skool_username TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  membership_type TEXT DEFAULT 'free',
  revenue_tracked DECIMAL(10, 2) DEFAULT 0,
  attributed_link_id UUID REFERENCES links(id),
  attribution_data JSONB,
  confidence_score DECIMAL(3, 2) DEFAULT 0,
  device_fingerprint TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already exists (will fail silently if columns exist)
ALTER TABLE conversions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
ALTER TABLE conversions ADD COLUMN IF NOT EXISTS skool_name TEXT;
ALTER TABLE conversions ADD COLUMN IF NOT EXISTS skool_username TEXT;
ALTER TABLE conversions ADD COLUMN IF NOT EXISTS joined_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE conversions ADD COLUMN IF NOT EXISTS membership_type TEXT DEFAULT 'free';
ALTER TABLE conversions ADD COLUMN IF NOT EXISTS revenue_tracked DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE conversions ADD COLUMN IF NOT EXISTS attributed_link_id UUID REFERENCES links(id);
ALTER TABLE conversions ADD COLUMN IF NOT EXISTS attribution_data JSONB;
ALTER TABLE conversions ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3, 2) DEFAULT 0;
ALTER TABLE conversions ADD COLUMN IF NOT EXISTS device_fingerprint TEXT;
ALTER TABLE conversions ADD COLUMN IF NOT EXISTS metadata JSONB;
ALTER TABLE conversions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE conversions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_email ON conversions(skool_email);
CREATE INDEX IF NOT EXISTS idx_conversions_link_id ON conversions(attributed_link_id);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at DESC);

-- Fix Links Table Schema
ALTER TABLE links ADD COLUMN IF NOT EXISTS metadata JSONB;
ALTER TABLE links ADD COLUMN IF NOT EXISTS clicks_count INTEGER DEFAULT 0;
ALTER TABLE links ADD COLUMN IF NOT EXISTS conversions_count INTEGER DEFAULT 0;
ALTER TABLE links ADD COLUMN IF NOT EXISTS revenue_generated DECIMAL(10, 2) DEFAULT 0;

-- Fix Clicks Table Schema
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS short_id TEXT;
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS link_id UUID REFERENCES links(id);
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS clicked_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS referer TEXT;
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS device_fingerprint TEXT;
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Create indexes for clicks table
CREATE INDEX IF NOT EXISTS idx_clicks_short_id ON clicks(short_id);
CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_clicks_device_fingerprint ON clicks(device_fingerprint);

-- Enable RLS
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- Create policies for service role
CREATE POLICY IF NOT EXISTS "Service role can manage conversions" ON conversions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role can manage clicks" ON clicks
  FOR ALL USING (true) WITH CHECK (true);

-- Verify the changes
SELECT
  'conversions' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'conversions'
UNION ALL
SELECT
  'clicks' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'clicks'
ORDER BY table_name, column_name;