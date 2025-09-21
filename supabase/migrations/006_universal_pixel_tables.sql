-- ================================================================
-- UNIVERSAL PIXEL TABLES - THE GAME CHANGER
-- Enables email capture and 70-80% attribution accuracy
-- ================================================================

-- Pixel events table (stores all pixel tracking events)
CREATE TABLE IF NOT EXISTS pixel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  identity_id TEXT, -- Can be string ID from pixel
  session_id TEXT,

  -- Event data
  event_name TEXT NOT NULL,
  event_properties JSONB,

  -- Page context
  page_url TEXT,
  page_title TEXT,
  referrer TEXT,

  -- Identity (THE MAGIC - EMAIL CAPTURE!)
  email TEXT,
  device_fingerprint TEXT,

  -- Metadata
  metadata JSONB,
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes for performance
  INDEX idx_pixel_events_email (email),
  INDEX idx_pixel_events_user_id (user_id),
  INDEX idx_pixel_events_identity_id (identity_id),
  INDEX idx_pixel_events_fingerprint (device_fingerprint),
  INDEX idx_pixel_events_tracked_at (tracked_at DESC)
);

-- Email campaigns table (for tracking email opens)
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  campaign_id TEXT UNIQUE NOT NULL,
  campaign_name TEXT,
  recipient_id TEXT UNIQUE NOT NULL,
  recipient_email TEXT,

  -- Campaign metadata
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes
  INDEX idx_email_campaigns_recipient_id (recipient_id),
  INDEX idx_email_campaigns_email (recipient_email)
);

-- Email opens table (tracks pixel opens)
CREATE TABLE IF NOT EXISTS email_opens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id TEXT,
  recipient_id TEXT,

  -- Request data
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,

  opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes
  INDEX idx_email_opens_campaign (campaign_id),
  INDEX idx_email_opens_recipient (recipient_id),
  INDEX idx_email_opens_opened_at (opened_at DESC)
);

-- Add new columns to identities table if they don't exist
ALTER TABLE identities
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS pixel_id TEXT,
ADD COLUMN IF NOT EXISTS email_capture_source TEXT,
ADD COLUMN IF NOT EXISTS email_capture_confidence DECIMAL(3,2);

-- Add indexes to identities for pixel matching
CREATE INDEX IF NOT EXISTS idx_identities_session_id ON identities(session_id);
CREATE INDEX IF NOT EXISTS idx_identities_pixel_id ON identities(pixel_id);

-- Add new columns to clicks table for better pixel integration
ALTER TABLE clicks
ADD COLUMN IF NOT EXISTS pixel_event_id UUID REFERENCES pixel_events(id),
ADD COLUMN IF NOT EXISTS email_from_pixel TEXT;

-- Add new columns to conversions table for pixel attribution
ALTER TABLE conversions
ADD COLUMN IF NOT EXISTS pixel_matched BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pixel_confidence DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS attribution_journey TEXT;

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Enable RLS
ALTER TABLE pixel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_opens ENABLE ROW LEVEL SECURITY;

-- Pixel events policies
CREATE POLICY "Users can view their own pixel events"
  ON pixel_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage all pixel events"
  ON pixel_events FOR ALL
  TO service_role
  USING (true);

-- Email campaigns policies
CREATE POLICY "Users can view their own campaigns"
  ON email_campaigns FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own campaigns"
  ON email_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage all campaigns"
  ON email_campaigns FOR ALL
  TO service_role
  USING (true);

-- Email opens policies
CREATE POLICY "Public can insert email opens"
  ON email_opens FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view opens for their campaigns"
  ON email_opens FOR SELECT
  TO authenticated
  USING (campaign_id IN (
    SELECT campaign_id FROM email_campaigns WHERE user_id = auth.uid()
  ));

-- ================================================================
-- FUNCTIONS FOR PIXEL ATTRIBUTION
-- ================================================================

-- Function to match pixel events to identities
CREATE OR REPLACE FUNCTION match_pixel_to_identity()
RETURNS TRIGGER AS $$
BEGIN
  -- If email is captured, try to match to existing identities
  IF NEW.email IS NOT NULL THEN
    UPDATE identities
    SET
      emails = array_append(
        COALESCE(emails, ARRAY[]::TEXT[]),
        NEW.email
      ),
      last_seen = NOW(),
      email_capture_source = COALESCE(email_capture_source, 'pixel'),
      email_capture_confidence = GREATEST(
        COALESCE(email_capture_confidence, 0),
        0.95
      )
    WHERE
      NEW.identity_id = identities.id
      OR NEW.device_fingerprint = ANY(identities.device_fingerprints)
      OR NEW.session_id = identities.session_id;

    -- Try to match pending conversions
    UPDATE conversions
    SET
      identity_id = NEW.identity_id,
      pixel_matched = true,
      pixel_confidence = 0.95,
      confidence_score = GREATEST(confidence_score, 95)
    WHERE
      skool_email = NEW.email
      AND identity_id IS NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for pixel event matching
CREATE TRIGGER trigger_match_pixel_to_identity
  AFTER INSERT ON pixel_events
  FOR EACH ROW
  WHEN (NEW.email IS NOT NULL OR NEW.device_fingerprint IS NOT NULL)
  EXECUTE FUNCTION match_pixel_to_identity();

-- Function to build attribution journey
CREATE OR REPLACE FUNCTION build_attribution_journey(p_identity_id TEXT)
RETURNS TEXT AS $$
DECLARE
  journey TEXT;
BEGIN
  SELECT string_agg(
    COALESCE(utm_source, 'direct') || '/' || COALESCE(utm_medium, 'none'),
    ' → '
    ORDER BY clicked_at
  ) INTO journey
  FROM clicks
  WHERE identity_id = p_identity_id
  AND clicked_at > NOW() - INTERVAL '30 days';

  RETURN journey;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- INITIAL DATA / TESTING
-- ================================================================

-- Insert test pixel event (comment out in production)
/*
INSERT INTO pixel_events (
  event_name,
  event_properties,
  email,
  device_fingerprint,
  page_url,
  identity_id
) VALUES (
  'test_pixel_event',
  '{"test": true}'::jsonb,
  'test@allumi.com',
  'test_fingerprint_123',
  'https://allumi.com/test',
  'test_identity_123'
);
*/

-- ================================================================
-- GRANTS
-- ================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT ON pixel_events TO anon;
GRANT SELECT ON email_campaigns TO anon;
GRANT INSERT ON email_opens TO anon;

-- ================================================================
-- COMMENTS
-- ================================================================

COMMENT ON TABLE pixel_events IS 'Universal pixel tracking events - the game changer for 70-80% attribution';
COMMENT ON TABLE email_campaigns IS 'Email campaign mappings for pixel tracking';
COMMENT ON TABLE email_opens IS 'Tracks email opens via pixel';
COMMENT ON COLUMN pixel_events.email IS 'THE MAGIC - captured email for identity resolution';
COMMENT ON COLUMN conversions.pixel_matched IS 'Whether this conversion was matched via pixel email';
COMMENT ON COLUMN conversions.attribution_journey IS 'Full journey string like: facebook/paid → email/newsletter → direct/none';