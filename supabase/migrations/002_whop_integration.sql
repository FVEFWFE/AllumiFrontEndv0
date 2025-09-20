-- Whop Integration Tables
-- This migration adds tables needed for Whop payment processing

-- Store raw Whop webhook events for debugging and audit
CREATE TABLE IF NOT EXISTS whop_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE,
  event_type TEXT NOT NULL,
  customer_email TEXT,
  whop_customer_id TEXT,
  subscription_status TEXT,
  plan_id TEXT,
  affiliate_code TEXT,
  raw_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Whop-specific columns to users table if they don't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS whop_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_plan TEXT,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_whop_customer_id ON users(whop_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_whop_events_customer_email ON whop_events(customer_email);
CREATE INDEX IF NOT EXISTS idx_whop_events_event_type ON whop_events(event_type);

-- Add RLS policies for whop_events table
ALTER TABLE whop_events ENABLE ROW LEVEL SECURITY;

-- Only service role can insert webhook events
CREATE POLICY "Service role can insert whop events" ON whop_events
  FOR INSERT
  TO service_role
  USING (true);

-- Users can view their own events
CREATE POLICY "Users can view own whop events" ON whop_events
  FOR SELECT
  USING (
    customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Add subscription status check function
CREATE OR REPLACE FUNCTION check_subscription_status(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id
    AND subscription_status IN ('active', 'trial')
    AND (
      subscription_ends_at IS NULL
      OR subscription_ends_at > NOW()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON whop_events TO authenticated;
GRANT ALL ON whop_events TO service_role;
GRANT EXECUTE ON FUNCTION check_subscription_status TO anon, authenticated;