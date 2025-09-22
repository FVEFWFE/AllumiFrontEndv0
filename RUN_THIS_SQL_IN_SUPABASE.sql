-- ================================================
-- ALLUMI DATABASE MIGRATIONS - RUN THIS IN SUPABASE SQL EDITOR
-- ================================================
--
-- 🔴 CRITICAL: Without these tables, the app is BROKEN!
--
-- HOW TO RUN:
-- 1. Go to: https://supabase.com/dashboard/project/fyvxgciqfifjsycibikn/editor
-- 2. Copy ALL of this SQL
-- 3. Paste in SQL Editor
-- 4. Click "Run"
--
-- ================================================

-- ================================================
-- 1. USER SETTINGS TABLE (for API keys and preferences)
-- ================================================

-- Create user_settings table for storing user preferences and API keys
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key TEXT NOT NULL UNIQUE,
  webhook_secret TEXT NOT NULL,
  webhook_url TEXT,
  notifications JSONB DEFAULT '{"emailAlerts": true, "weeklyReports": true, "trialReminders": true, "newConversions": false}'::jsonb,
  integrations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_api_key ON user_settings(api_key);

-- Add RLS policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can only view and update their own settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_settings_updated_at_trigger
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_settings_updated_at();

-- ================================================
-- 2. CAMPAIGN SPEND TABLE (for ROI tracking)
-- ================================================

-- Create campaign_spend table for tracking advertising costs
CREATE TABLE IF NOT EXISTS campaign_spend (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, campaign_name)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaign_spend_user_id ON campaign_spend(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_spend_campaign_name ON campaign_spend(campaign_name);

-- Add RLS policies
ALTER TABLE campaign_spend ENABLE ROW LEVEL SECURITY;

-- Users can only view and manage their own campaign spend
CREATE POLICY "Users can view own campaign spend" ON campaign_spend
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaign spend" ON campaign_spend
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaign spend" ON campaign_spend
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaign spend" ON campaign_spend
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_campaign_spend_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_campaign_spend_updated_at_trigger
  BEFORE UPDATE ON campaign_spend
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_spend_updated_at();

-- ================================================
-- VERIFICATION QUERIES (Run these to test)
-- ================================================

-- Test user_settings table
SELECT 'user_settings table created' AS status, COUNT(*) AS row_count FROM user_settings;

-- Test campaign_spend table
SELECT 'campaign_spend table created' AS status, COUNT(*) AS row_count FROM campaign_spend;

-- ================================================
-- SUCCESS MESSAGE
-- ================================================
-- If both queries above return results, the migrations are complete!
-- The app will now work properly:
-- ✅ Settings page can save API keys
-- ✅ Campaigns page can track ROI
-- ✅ All features functional