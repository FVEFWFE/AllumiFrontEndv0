-- Attribution System Database Schema
-- Complete implementation for click tracking, conversion attribution, and analytics

-- Enhanced clicks table with all tracking fields
CREATE TABLE IF NOT EXISTS clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  short_id TEXT NOT NULL,

  -- Identity & Session
  identity_id TEXT,
  session_id TEXT,
  cookie_id TEXT,
  device_fingerprint TEXT,

  -- User Info
  ip_address INET,
  user_agent TEXT,
  email TEXT,

  -- UTM Parameters
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,

  -- Additional Tracking
  referer TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,

  -- Timestamps
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversions table for tracking actual sign-ups/purchases
CREATE TABLE IF NOT EXISTS conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Attribution Fields
  attributed_link_id UUID REFERENCES links(id),
  attributed_click_id UUID REFERENCES clicks(id),
  attribution_method TEXT, -- 'direct', 'cookie', 'fingerprint', 'email', 'session'
  confidence_score DECIMAL(5,2), -- 0-100 confidence percentage

  -- Conversion Details
  conversion_type TEXT NOT NULL, -- 'trial', 'paid', 'upgrade'
  revenue DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',

  -- Multi-touch Attribution
  first_touch_source TEXT,
  last_touch_source TEXT,
  attribution_window_days INTEGER,

  -- Device & Session
  device_fingerprint TEXT,
  session_id TEXT,
  ip_address INET,

  -- Metadata
  metadata JSONB DEFAULT '{}',
  raw_attribution_data JSONB DEFAULT '{}',

  -- Timestamps
  converted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attribution paths for multi-touch journey tracking
CREATE TABLE IF NOT EXISTS attribution_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversion_id UUID REFERENCES conversions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),

  -- Journey Data
  touchpoints JSONB DEFAULT '[]', -- Array of all touchpoints
  total_touchpoints INTEGER DEFAULT 0,
  journey_duration_hours DECIMAL(10,2),

  -- Attribution Scores
  first_touch_value DECIMAL(10,2),
  last_touch_value DECIMAL(10,2),
  time_decay_value DECIMAL(10,2),
  linear_value DECIMAL(10,2),

  -- Channels
  channels TEXT[], -- Array of unique channels
  dominant_channel TEXT,

  -- Confidence
  overall_confidence DECIMAL(5,2),

  -- Timestamps
  journey_started_at TIMESTAMP WITH TIME ZONE,
  journey_ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign performance aggregation table
CREATE TABLE IF NOT EXISTS campaign_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,

  -- Metrics
  total_clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,

  -- Rates
  conversion_rate DECIMAL(5,2),
  avg_order_value DECIMAL(10,2),
  cost_per_acquisition DECIMAL(10,2),

  -- Attribution
  attributed_conversions INTEGER DEFAULT 0,
  attribution_confidence_avg DECIMAL(5,2),

  -- Time Period
  period_start DATE,
  period_end DATE,

  -- Metadata
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate tracking table
CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES users(id),
  referred_user_id UUID REFERENCES users(id),

  -- Tracking
  referral_code TEXT NOT NULL,
  click_id UUID REFERENCES clicks(id),
  conversion_id UUID REFERENCES conversions(id),

  -- Commission
  commission_rate DECIMAL(5,2) DEFAULT 40.00,
  commission_amount DECIMAL(10,2),
  commission_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'paid'

  -- Timestamps
  referred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_clicks_short_id ON clicks(short_id);
CREATE INDEX IF NOT EXISTS idx_clicks_identity_id ON clicks(identity_id);
CREATE INDEX IF NOT EXISTS idx_clicks_session_id ON clicks(session_id);
CREATE INDEX IF NOT EXISTS idx_clicks_device_fingerprint ON clicks(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_clicks_email ON clicks(email);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON clicks(clicked_at);

CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_attributed_link_id ON conversions(attributed_link_id);
CREATE INDEX IF NOT EXISTS idx_conversions_device_fingerprint ON conversions(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_conversions_converted_at ON conversions(converted_at);

CREATE INDEX IF NOT EXISTS idx_attribution_paths_conversion_id ON attribution_paths(conversion_id);
CREATE INDEX IF NOT EXISTS idx_attribution_paths_user_id ON attribution_paths(user_id);

CREATE INDEX IF NOT EXISTS idx_campaign_metrics_campaign_name ON campaign_metrics(campaign_name);
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_period ON campaign_metrics(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_affiliate_id ON affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referral_code ON affiliate_referrals(referral_code);

-- Enable Row Level Security
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribution_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clicks (public read for analytics)
CREATE POLICY "Clicks viewable by link owner" ON clicks
  FOR SELECT USING (
    link_id IN (SELECT id FROM links WHERE user_id = auth.uid())
  );

-- RLS Policies for conversions
CREATE POLICY "Conversions viewable by user" ON conversions
  FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for attribution paths
CREATE POLICY "Attribution paths viewable by user" ON attribution_paths
  FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for campaign metrics (authenticated users can view)
CREATE POLICY "Campaign metrics viewable by authenticated users" ON campaign_metrics
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS Policies for affiliate referrals
CREATE POLICY "Affiliate can view own referrals" ON affiliate_referrals
  FOR SELECT USING (affiliate_id = auth.uid());

-- Function to calculate attribution confidence
CREATE OR REPLACE FUNCTION calculate_attribution_confidence(
  has_direct_link BOOLEAN,
  has_cookie BOOLEAN,
  has_session BOOLEAN,
  has_email BOOLEAN,
  has_fingerprint BOOLEAN,
  time_since_click_hours INTEGER
) RETURNS DECIMAL AS $$
DECLARE
  confidence DECIMAL := 0;
BEGIN
  -- Base confidence scores
  IF has_direct_link THEN confidence := confidence + 100; END IF;
  IF has_email THEN confidence := confidence + 95; END IF;
  IF has_cookie THEN confidence := confidence + 90; END IF;
  IF has_session THEN confidence := confidence + 85; END IF;
  IF has_fingerprint THEN confidence := confidence + 75; END IF;

  -- Time decay factor
  IF time_since_click_hours IS NOT NULL THEN
    IF time_since_click_hours < 1 THEN
      confidence := confidence * 1.0;
    ELSIF time_since_click_hours < 24 THEN
      confidence := confidence * 0.9;
    ELSIF time_since_click_hours < 72 THEN
      confidence := confidence * 0.7;
    ELSIF time_since_click_hours < 168 THEN
      confidence := confidence * 0.5;
    ELSE
      confidence := confidence * 0.3;
    END IF;
  END IF;

  -- Normalize to 0-100
  IF confidence > 100 THEN confidence := 100; END IF;

  RETURN confidence;
END;
$$ LANGUAGE plpgsql;

-- Function to attribute conversion to a click
CREATE OR REPLACE FUNCTION attribute_conversion(
  p_user_email TEXT,
  p_device_fingerprint TEXT,
  p_session_id TEXT,
  p_cookie_id TEXT
) RETURNS TABLE (
  click_id UUID,
  link_id UUID,
  confidence DECIMAL,
  attribution_method TEXT
) AS $$
BEGIN
  -- Try direct email match first (highest confidence)
  IF p_user_email IS NOT NULL THEN
    RETURN QUERY
    SELECT
      c.id,
      c.link_id,
      95.0::DECIMAL,
      'email'::TEXT
    FROM clicks c
    WHERE c.email = p_user_email
    ORDER BY c.clicked_at DESC
    LIMIT 1;

    IF FOUND THEN RETURN; END IF;
  END IF;

  -- Try cookie match (high confidence)
  IF p_cookie_id IS NOT NULL THEN
    RETURN QUERY
    SELECT
      c.id,
      c.link_id,
      90.0::DECIMAL,
      'cookie'::TEXT
    FROM clicks c
    WHERE c.cookie_id = p_cookie_id
    ORDER BY c.clicked_at DESC
    LIMIT 1;

    IF FOUND THEN RETURN; END IF;
  END IF;

  -- Try session match (good confidence)
  IF p_session_id IS NOT NULL THEN
    RETURN QUERY
    SELECT
      c.id,
      c.link_id,
      85.0::DECIMAL,
      'session'::TEXT
    FROM clicks c
    WHERE c.session_id = p_session_id
    ORDER BY c.clicked_at DESC
    LIMIT 1;

    IF FOUND THEN RETURN; END IF;
  END IF;

  -- Try fingerprint match (moderate confidence)
  IF p_device_fingerprint IS NOT NULL THEN
    RETURN QUERY
    SELECT
      c.id,
      c.link_id,
      75.0::DECIMAL,
      'fingerprint'::TEXT
    FROM clicks c
    WHERE c.device_fingerprint = p_device_fingerprint
      AND c.clicked_at > NOW() - INTERVAL '30 days'
    ORDER BY c.clicked_at DESC
    LIMIT 1;
  END IF;
END;
$$ LANGUAGE plpgsql;