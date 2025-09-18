-- Migration to add Allumi-specific attribution tracking tables
-- This works alongside your existing community platform schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Core identity tracking for device fingerprinting
CREATE TABLE IF NOT EXISTS public.identities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  emails TEXT[] DEFAULT '{}',
  phones TEXT[] DEFAULT '{}',
  device_fingerprints TEXT[] DEFAULT '{}',
  recipient_id TEXT UNIQUE,
  merged_with UUID REFERENCES public.identities(id),
  confidence_score FLOAT DEFAULT 1.0
);

-- Links table for Allumi shortener (allumi.to)
CREATE TABLE IF NOT EXISTS public.attribution_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS public.attribution_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES public.attribution_links(id) ON DELETE CASCADE,
  identity_id UUID REFERENCES public.identities(id),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
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
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skool/Community conversions tracking
CREATE TABLE IF NOT EXISTS public.attribution_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identity_id UUID REFERENCES public.identities(id),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  member_email TEXT,
  member_name TEXT,
  membership_id UUID REFERENCES public.memberships(id),
  joined_at TIMESTAMPTZ,
  attribution_model TEXT DEFAULT 'time_decay',
  attribution_data JSONB,
  confidence_score FLOAT,
  revenue_tracked DECIMAL(10,2),
  ltv_estimate DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attribution touchpoints for multi-touch attribution
CREATE TABLE IF NOT EXISTS public.attribution_touchpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identity_id UUID REFERENCES public.identities(id) NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  click_id UUID REFERENCES public.attribution_clicks(id),
  source TEXT,
  medium TEXT,
  campaign TEXT,
  content TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  attribution_credit FLOAT,
  metadata JSONB DEFAULT '{}'
);

-- Zapier webhook integration logs
CREATE TABLE IF NOT EXISTS public.zapier_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  event_type TEXT,
  payload JSONB,
  response_status INTEGER,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Whop integration events (for payment tracking)
CREATE TABLE IF NOT EXISTS public.whop_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT UNIQUE,
  event_type TEXT NOT NULL,
  customer_email TEXT,
  whop_customer_id TEXT,
  user_id UUID REFERENCES public.users(id),
  subscription_status TEXT,
  plan_id TEXT,
  affiliate_code TEXT,
  raw_data JSONB,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add Allumi-specific fields to users table if not exists
DO $$
BEGIN
  -- Add whop_customer_id if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'users'
                 AND column_name = 'whop_customer_id') THEN
    ALTER TABLE public.users ADD COLUMN whop_customer_id TEXT;
  END IF;

  -- Add zapier_webhook_url if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'users'
                 AND column_name = 'zapier_webhook_url') THEN
    ALTER TABLE public.users ADD COLUMN zapier_webhook_url TEXT;
  END IF;

  -- Add subscription fields for Allumi pricing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'users'
                 AND column_name = 'allumi_subscription_status') THEN
    ALTER TABLE public.users ADD COLUMN allumi_subscription_status TEXT DEFAULT 'trial';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'users'
                 AND column_name = 'allumi_subscription_plan') THEN
    ALTER TABLE public.users ADD COLUMN allumi_subscription_plan TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'users'
                 AND column_name = 'allumi_trial_ends_at') THEN
    ALTER TABLE public.users ADD COLUMN allumi_trial_ends_at TIMESTAMPTZ;
  END IF;
END $$;

-- Add Skool-specific fields to communities table if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'communities'
                 AND column_name = 'skool_group_url') THEN
    ALTER TABLE public.communities ADD COLUMN skool_group_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'communities'
                 AND column_name = 'attribution_enabled') THEN
    ALTER TABLE public.communities ADD COLUMN attribution_enabled BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_identities_emails ON public.identities USING GIN(emails);
CREATE INDEX IF NOT EXISTS idx_identities_device_fingerprints ON public.identities USING GIN(device_fingerprints);
CREATE INDEX IF NOT EXISTS idx_identities_recipient_id ON public.identities(recipient_id);

CREATE INDEX IF NOT EXISTS idx_attribution_links_short_id ON public.attribution_links(short_id);
CREATE INDEX IF NOT EXISTS idx_attribution_links_user_id ON public.attribution_links(user_id);
CREATE INDEX IF NOT EXISTS idx_attribution_links_community_id ON public.attribution_links(community_id);

CREATE INDEX IF NOT EXISTS idx_attribution_clicks_identity_id ON public.attribution_clicks(identity_id);
CREATE INDEX IF NOT EXISTS idx_attribution_clicks_user_id ON public.attribution_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_attribution_clicks_clicked_at ON public.attribution_clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_attribution_clicks_campaign ON public.attribution_clicks(campaign_name);

CREATE INDEX IF NOT EXISTS idx_attribution_conversions_user_id ON public.attribution_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_attribution_conversions_identity_id ON public.attribution_conversions(identity_id);
CREATE INDEX IF NOT EXISTS idx_attribution_conversions_community_id ON public.attribution_conversions(community_id);

CREATE INDEX IF NOT EXISTS idx_touchpoints_identity_id ON public.attribution_touchpoints(identity_id);
CREATE INDEX IF NOT EXISTS idx_touchpoints_timestamp ON public.attribution_touchpoints(timestamp DESC);

-- Row Level Security (RLS) policies for new tables
ALTER TABLE public.identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribution_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribution_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribution_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribution_touchpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zapier_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whop_events ENABLE ROW LEVEL SECURITY;

-- Attribution links policies
CREATE POLICY "Users can view own attribution links" ON public.attribution_links
  FOR ALL USING (auth.uid() = user_id);

-- Attribution clicks policies
CREATE POLICY "Users can view own attribution clicks" ON public.attribution_clicks
  FOR SELECT USING (auth.uid() = user_id);

-- Public can create clicks for tracking
CREATE POLICY "Public can create attribution clicks" ON public.attribution_clicks
  FOR INSERT WITH CHECK (true);

-- Attribution conversions policies
CREATE POLICY "Users can view own attribution conversions" ON public.attribution_conversions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own attribution conversions" ON public.attribution_conversions
  FOR ALL USING (auth.uid() = user_id);

-- Touchpoints policies
CREATE POLICY "Users can view own touchpoints" ON public.attribution_touchpoints
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own touchpoints" ON public.attribution_touchpoints
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Zapier webhooks policies
CREATE POLICY "Users can manage own webhooks" ON public.zapier_webhooks
  FOR ALL USING (auth.uid() = user_id);

-- Whop events policies (system only, no direct user access)
CREATE POLICY "System can manage whop events" ON public.whop_events
  FOR ALL USING (false);

-- Attribution analytics function
CREATE OR REPLACE FUNCTION get_attribution_stats(
  p_user_id UUID,
  p_community_id UUID DEFAULT NULL,
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
    ac.campaign_name,
    COUNT(DISTINCT ac.id) as total_clicks,
    COUNT(DISTINCT ac.identity_id) as unique_visitors,
    COUNT(DISTINCT conv.id) as total_conversions,
    ROUND(
      CASE
        WHEN COUNT(DISTINCT ac.id) > 0
        THEN (COUNT(DISTINCT conv.id)::NUMERIC / COUNT(DISTINCT ac.id)::NUMERIC) * 100
        ELSE 0
      END, 2
    ) as conversion_rate,
    COALESCE(SUM(conv.revenue_tracked), 0) as attributed_revenue
  FROM public.attribution_clicks ac
  LEFT JOIN public.attribution_conversions conv
    ON ac.identity_id = conv.identity_id
    AND ac.user_id = conv.user_id
    AND (p_community_id IS NULL OR ac.community_id = p_community_id)
  WHERE ac.user_id = p_user_id
    AND ac.clicked_at::DATE BETWEEN p_start_date AND p_end_date
    AND (p_community_id IS NULL OR ac.community_id = p_community_id)
  GROUP BY ac.campaign_name
  ORDER BY total_clicks DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Time-decay attribution calculation function
CREATE OR REPLACE FUNCTION calculate_time_decay_attribution(
  p_identity_id UUID,
  p_conversion_date TIMESTAMPTZ,
  p_half_life_days INTEGER DEFAULT 7
)
RETURNS TABLE(
  touchpoint_id UUID,
  attribution_credit NUMERIC
) AS $$
DECLARE
  total_weight NUMERIC := 0;
BEGIN
  -- Calculate total weight for normalization
  SELECT SUM(
    POWER(0.5,
      EXTRACT(EPOCH FROM (p_conversion_date - tp.timestamp)) / (86400 * p_half_life_days)
    )
  ) INTO total_weight
  FROM public.attribution_touchpoints tp
  WHERE tp.identity_id = p_identity_id
    AND tp.timestamp <= p_conversion_date;

  -- Return normalized attribution credits
  RETURN QUERY
  SELECT
    tp.id,
    ROUND(
      (POWER(0.5,
        EXTRACT(EPOCH FROM (p_conversion_date - tp.timestamp)) / (86400 * p_half_life_days)
      ) / NULLIF(total_weight, 0)) * 100,
      2
    ) as credit
  FROM public.attribution_touchpoints tp
  WHERE tp.identity_id = p_identity_id
    AND tp.timestamp <= p_conversion_date
  ORDER BY tp.timestamp DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Allumi attribution tables created successfully!';
END $$;