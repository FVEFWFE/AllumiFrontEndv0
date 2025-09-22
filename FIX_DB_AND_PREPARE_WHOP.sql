-- ========================================
-- ALLUMI DATABASE FIX & WHOP PREPARATION
-- Run this in Supabase SQL Editor
-- ========================================

-- PART 1: Fix Foreign Key Constraints
-- ====================================

-- Drop existing incorrect constraints
ALTER TABLE user_settings
DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;

ALTER TABLE campaign_spend
DROP CONSTRAINT IF EXISTS campaign_spend_user_id_fkey;

-- Add correct foreign key constraints to auth.users
ALTER TABLE user_settings
ADD CONSTRAINT user_settings_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE campaign_spend
ADD CONSTRAINT campaign_spend_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- PART 2: Add Whop Integration Columns
-- ====================================

-- Add Whop-specific columns to user_settings
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS whop_user_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS whop_membership_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS whop_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS plan_name TEXT DEFAULT 'beta',
ADD COLUMN IF NOT EXISTS whop_affiliate_code TEXT,
ADD COLUMN IF NOT EXISTS created_via TEXT DEFAULT 'direct';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_settings_whop_user_id
ON user_settings(whop_user_id);

CREATE INDEX IF NOT EXISTS idx_user_settings_whop_membership_id
ON user_settings(whop_membership_id);

CREATE INDEX IF NOT EXISTS idx_user_settings_subscription_status
ON user_settings(subscription_status);

-- PART 3: Create Whop Events Table for Webhook Logging
-- ====================================================

CREATE TABLE IF NOT EXISTS whop_webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_whop_webhook_events_event_id
ON whop_webhook_events(event_id);

CREATE INDEX IF NOT EXISTS idx_whop_webhook_events_processed
ON whop_webhook_events(processed);

-- PART 4: Create Test User Function
-- ==================================

-- Function to create a test user properly
CREATE OR REPLACE FUNCTION create_test_user_with_whop(
  p_email TEXT,
  p_password TEXT DEFAULT 'Test123!@#'
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_result JSON;
BEGIN
  -- Create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    NOW(),
    jsonb_build_object(
      'provider', 'email',
      'providers', ARRAY['email']
    ),
    jsonb_build_object(
      'whop_user_id', 'whop_test_' || substr(md5(random()::text), 0, 10),
      'source', 'test'
    ),
    NOW(),
    NOW()
  ) RETURNING id INTO v_user_id;

  -- Create user_settings entry
  INSERT INTO user_settings (
    user_id,
    whop_user_id,
    whop_membership_id,
    subscription_status,
    plan_name,
    trial_ends_at,
    api_key,
    webhook_secret,
    created_via
  ) VALUES (
    v_user_id,
    'whop_test_' || substr(md5(random()::text), 0, 10),
    'mem_test_' || substr(md5(random()::text), 0, 10),
    'trial',
    'beta',
    NOW() + INTERVAL '7 days',
    'ak_test_' || substr(md5(random()::text), 0, 32),
    'whsec_test_' || substr(md5(random()::text), 0, 32),
    'test'
  );

  -- Return user info
  SELECT json_build_object(
    'user_id', v_user_id,
    'email', p_email,
    'password', p_password,
    'message', 'Test user created successfully'
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PART 5: Migrate Existing Users
-- ===============================

-- Update existing users to have proper subscription status
UPDATE user_settings
SET
  subscription_status = CASE
    WHEN trial_ends_at IS NOT NULL AND trial_ends_at > NOW() THEN 'trial'
    WHEN trial_ends_at IS NOT NULL AND trial_ends_at <= NOW() THEN 'expired'
    ELSE 'active'
  END,
  plan_name = COALESCE(plan_name, 'beta'),
  created_via = 'migration'
WHERE whop_user_id IS NULL;

-- PART 6: Create Helper Views
-- ===========================

-- View for active users
CREATE OR REPLACE VIEW active_users AS
SELECT
  u.id,
  u.email,
  us.subscription_status,
  us.plan_name,
  us.trial_ends_at,
  us.whop_user_id,
  us.created_at
FROM auth.users u
JOIN user_settings us ON u.id = us.user_id
WHERE us.subscription_status IN ('active', 'trial');

-- View for expired trials
CREATE OR REPLACE VIEW expired_trials AS
SELECT
  u.id,
  u.email,
  us.subscription_status,
  us.trial_ends_at,
  us.whop_user_id
FROM auth.users u
JOIN user_settings us ON u.id = us.user_id
WHERE us.subscription_status = 'expired'
  OR (us.trial_ends_at IS NOT NULL AND us.trial_ends_at < NOW());

-- PART 7: Row Level Security (RLS)
-- =================================

-- Enable RLS on user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can only view/update their own settings
CREATE POLICY "Users can view own settings"
  ON user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can do anything (for webhook handler)
CREATE POLICY "Service role full access"
  ON user_settings
  FOR ALL
  USING (auth.role() = 'service_role');

-- PART 8: Create Test Data
-- ========================

-- Create a test user that can login
SELECT create_test_user_with_whop(
  'test@allumi.com',
  'Test123!@#'
);

-- PART 9: Verification Queries
-- ============================

-- Check if foreign keys are correct
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('user_settings', 'campaign_spend');

-- Check user_settings structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_settings'
ORDER BY ordinal_position;

-- Count users by subscription status
SELECT
  subscription_status,
  COUNT(*) as count
FROM user_settings
GROUP BY subscription_status;

-- Check test user
SELECT
  u.email,
  us.*
FROM auth.users u
JOIN user_settings us ON u.id = us.user_id
WHERE u.email = 'test@allumi.com';

-- ========================================
-- END OF MIGRATION SCRIPT
-- Run this entire script in Supabase SQL Editor
-- ========================================