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
CREATE INDEX idx_campaign_spend_user_id ON campaign_spend(user_id);
CREATE INDEX idx_campaign_spend_campaign_name ON campaign_spend(campaign_name);

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