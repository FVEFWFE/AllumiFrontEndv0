-- Migration: Add member-identity linking columns
-- Purpose: Enable member identification and attribution system

-- 1. Add identity_id column to users table (for member-identity linking)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS identity_id UUID REFERENCES identities(id),
ADD COLUMN IF NOT EXISTS skool_member_id TEXT UNIQUE;

-- 2. Add identity_id column to conversions table (if not exists)
ALTER TABLE conversions
ADD COLUMN IF NOT EXISTS identity_id UUID REFERENCES identities(id),
ADD COLUMN IF NOT EXISTS email TEXT;

-- 3. Create members table if it doesn't exist (for CSV imports)
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  skool_member_id TEXT UNIQUE,
  joined_date TIMESTAMP,
  identity_id UUID REFERENCES identities(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_identity ON users(identity_id);
CREATE INDEX IF NOT EXISTS idx_users_skool_member ON users(skool_member_id);
CREATE INDEX IF NOT EXISTS idx_members_identity ON members(identity_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_identities_emails ON identities USING GIN(emails);
CREATE INDEX IF NOT EXISTS idx_conversions_identity ON conversions(identity_id);
CREATE INDEX IF NOT EXISTS idx_conversions_email ON conversions(email);

-- 5. Enable RLS on members table
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for members table
CREATE POLICY "Members are viewable by authenticated users" ON members
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Members can be created by service role" ON members
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Members can be updated by service role" ON members
  FOR UPDATE USING (auth.role() = 'service_role');

-- 7. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create trigger for members table
DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. Create trigger for users table (if not exists)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 10. Grant permissions
GRANT ALL ON members TO service_role;
GRANT SELECT ON members TO authenticated;