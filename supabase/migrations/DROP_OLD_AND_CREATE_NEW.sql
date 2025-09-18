-- CLEAN SLATE: Drop old community platform tables and create Allumi attribution schema
-- WARNING: This will delete all existing data!

-- Drop all old tables in reverse dependency order
DROP TABLE IF EXISTS public.revenue_attribution CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.memberships CASCADE;
DROP TABLE IF EXISTS public.communities CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop any leftover functions
DROP FUNCTION IF EXISTS update_community_member_count() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;

-- Now create the correct Allumi attribution schema
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Core identity tracking (for device fingerprinting)
CREATE TABLE public.identities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  emails TEXT[] DEFAULT '{}',
  phones TEXT[] DEFAULT '{}',
  device_fingerprints TEXT[] DEFAULT '{}',
  recipient_id TEXT UNIQUE,
  merged_with UUID REFERENCES identities(id),
  confidence_score FLOAT DEFAULT 1.0
);

-- Allumi customer accounts (people who use Allumi to track their Skool communities)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  whop_customer_id TEXT UNIQUE,
  skool_group_url TEXT,
  skool_group_name TEXT,
  zapier_webhook_url TEXT,
  subscription_status TEXT DEFAULT 'trial',
  subscription_plan TEXT, -- 'beta', 'launch', 'standard'
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracking links (allumi.to shortener)
CREATE TABLE public.links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  destination_url TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  recipient_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_clicked_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Click tracking with device fingerprinting
CREATE TABLE public.clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
  identity_id UUID REFERENCES public.identities(id),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  campaign_name TEXT,
  recipient_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversions (when someone joins a Skool community)
CREATE TABLE public.conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identity_id UUID REFERENCES public.identities(id),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  skool_email TEXT,
  skool_name TEXT,
  skool_member_id TEXT,
  membership_level TEXT,
  joined_at TIMESTAMPTZ,
  attribution_model TEXT DEFAULT 'time_decay',
  attribution_data JSONB, -- Shows credit split across touchpoints
  confidence_score FLOAT,
  revenue_tracked DECIMAL(10,2),
  ltv_estimate DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attribution touchpoints for multi-touch attribution
CREATE TABLE public.touchpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identity_id UUID REFERENCES public.identities(id) NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  click_id UUID REFERENCES public.clicks(id),
  source TEXT,
  medium TEXT,
  campaign TEXT,
  content TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  attribution_credit FLOAT,
  metadata JSONB DEFAULT '{}'
);

-- Zapier webhook logs
CREATE TABLE public.zapier_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  event_type TEXT,
  payload JSONB,
  member_email TEXT,
  member_name TEXT,
  processed BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Whop payment events
CREATE TABLE public.whop_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT UNIQUE,
  event_type TEXT NOT NULL,
  customer_email TEXT,
  whop_customer_id TEXT,
  subscription_status TEXT,
  plan_id TEXT,
  amount DECIMAL(10,2),
  affiliate_code TEXT,
  raw_data JSONB,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attribution reports (cached analytics)
CREATE TABLE public.attribution_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  campaign_name TEXT,
  total_clicks INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  conversion_rate FLOAT,
  attributed_revenue DECIMAL(10,2),
  top_sources JSONB,
  top_content JSONB,
  device_breakdown JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, report_date, campaign_name)
);

-- Create all indexes for performance
CREATE INDEX idx_identities_emails ON public.identities USING GIN(emails);
CREATE INDEX idx_identities_device_fingerprints ON public.identities USING GIN(device_fingerprints);
CREATE INDEX idx_identities_recipient_id ON public.identities(recipient_id);

CREATE INDEX idx_links_short_id ON public.links(short_id);
CREATE INDEX idx_links_user_id ON public.links(user_id);
CREATE INDEX idx_links_campaign ON public.links(campaign_name);

CREATE INDEX idx_clicks_link_id ON public.clicks(link_id);
CREATE INDEX idx_clicks_identity_id ON public.clicks(identity_id);
CREATE INDEX idx_clicks_user_id ON public.clicks(user_id);
CREATE INDEX idx_clicks_clicked_at ON public.clicks(clicked_at DESC);
CREATE INDEX idx_clicks_campaign ON public.clicks(campaign_name);
CREATE INDEX idx_clicks_device_fingerprint ON public.clicks(device_fingerprint);

CREATE INDEX idx_conversions_user_id ON public.conversions(user_id);
CREATE INDEX idx_conversions_identity_id ON public.conversions(identity_id);
CREATE INDEX idx_conversions_joined_at ON public.conversions(joined_at DESC);
CREATE INDEX idx_conversions_skool_email ON public.conversions(skool_email);

CREATE INDEX idx_touchpoints_identity_id ON public.touchpoints(identity_id);
CREATE INDEX idx_touchpoints_user_id ON public.touchpoints(user_id);
CREATE INDEX idx_touchpoints_timestamp ON public.touchpoints(timestamp DESC);

CREATE INDEX idx_zapier_webhooks_user_id ON public.zapier_webhooks(user_id);
CREATE INDEX idx_zapier_webhooks_processed ON public.zapier_webhooks(processed);

CREATE INDEX idx_attribution_reports_user_id ON public.attribution_reports(user_id);
CREATE INDEX idx_attribution_reports_date ON public.attribution_reports(report_date DESC);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.touchpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zapier_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribution_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid()::TEXT = id::TEXT);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::TEXT = id::TEXT);

-- Links policies
CREATE POLICY "Users can manage own links" ON public.links
  FOR ALL USING (auth.uid()::TEXT = user_id::TEXT);

-- Clicks policies
CREATE POLICY "Users can view own clicks" ON public.clicks
  FOR SELECT USING (auth.uid()::TEXT = user_id::TEXT);

-- Public can create clicks (for tracking)
CREATE POLICY "Public can create clicks" ON public.clicks
  FOR INSERT WITH CHECK (true);

-- Conversions policies
CREATE POLICY "Users can manage own conversions" ON public.conversions
  FOR ALL USING (auth.uid()::TEXT = user_id::TEXT);

-- Touchpoints policies
CREATE POLICY "Users can manage own touchpoints" ON public.touchpoints
  FOR ALL USING (auth.uid()::TEXT = user_id::TEXT);

-- Zapier webhooks policies
CREATE POLICY "Users can manage own webhooks" ON public.zapier_webhooks
  FOR ALL USING (auth.uid()::TEXT = user_id::TEXT);

-- Attribution reports policies
CREATE POLICY "Users can view own reports" ON public.attribution_reports
  FOR SELECT USING (auth.uid()::TEXT = user_id::TEXT);

-- Helper functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Attribution analytics function
CREATE OR REPLACE FUNCTION get_campaign_stats(
  p_user_id UUID,
  p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  campaign_name TEXT,
  total_clicks BIGINT,
  unique_visitors BIGINT,
  total_conversions BIGINT,
  conversion_rate NUMERIC,
  attributed_revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.campaign_name,
    COUNT(DISTINCT c.id) as total_clicks,
    COUNT(DISTINCT c.identity_id) as unique_visitors,
    COUNT(DISTINCT conv.id) as total_conversions,
    ROUND(
      CASE
        WHEN COUNT(DISTINCT c.id) > 0
        THEN (COUNT(DISTINCT conv.id)::NUMERIC / COUNT(DISTINCT c.id)::NUMERIC) * 100
        ELSE 0
      END, 2
    ) as conversion_rate,
    COALESCE(SUM(conv.revenue_tracked), 0) as attributed_revenue
  FROM public.clicks c
  LEFT JOIN public.conversions conv
    ON c.identity_id = conv.identity_id
    AND c.user_id = conv.user_id
  WHERE c.user_id = p_user_id
    AND c.clicked_at::DATE BETWEEN p_start_date AND p_end_date
  GROUP BY c.campaign_name
  ORDER BY total_clicks DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success!
DO $$
BEGIN
  RAISE NOTICE '✅ Allumi attribution schema created successfully!';
  RAISE NOTICE '📊 Tables created: users, identities, links, clicks, conversions, touchpoints, zapier_webhooks, whop_events, attribution_reports';
  RAISE NOTICE '🔒 Row Level Security enabled on all tables';
  RAISE NOTICE '🚀 Ready to track attribution for Skool communities!';
END $$;