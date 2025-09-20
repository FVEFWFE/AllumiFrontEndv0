-- Create simplified attribution tables that match the application code
-- These work alongside the more complex attribution_ prefixed tables

-- Simple links table for the shortener
CREATE TABLE IF NOT EXISTS public.links (
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

-- Simple clicks table for tracking
CREATE TABLE IF NOT EXISTS public.clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
  identity_id UUID REFERENCES public.identities(id),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  short_id TEXT NOT NULL,
  campaign_name TEXT,
  recipient_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  ip_address TEXT,
  user_agent TEXT,
  device_fingerprint TEXT,
  referrer TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simple conversions table
CREATE TABLE IF NOT EXISTS public.conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identity_id UUID REFERENCES public.identities(id),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  skool_email TEXT,
  skool_name TEXT,
  skool_username TEXT,
  membership_type TEXT,
  price_paid DECIMAL(10,2),
  joined_at TIMESTAMPTZ,
  attributed_link_id TEXT,
  attributed_campaign TEXT,
  attributed_source TEXT,
  attribution_confidence FLOAT,
  revenue_tracked DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_links_short_id ON public.links(short_id);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);

CREATE INDEX IF NOT EXISTS idx_clicks_short_id ON public.clicks(short_id);
CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON public.clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_clicks_user_id ON public.clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON public.clicks(clicked_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON public.conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_skool_email ON public.conversions(skool_email);

-- Row Level Security (RLS) policies
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;

-- Links policies
CREATE POLICY "Users can manage own links" ON public.links
  FOR ALL USING (auth.uid() = user_id);

-- Service role can manage all links
CREATE POLICY "Service role full access to links" ON public.links
  FOR ALL USING (auth.role() = 'service_role');

-- Clicks policies
CREATE POLICY "Users can view own clicks" ON public.clicks
  FOR SELECT USING (auth.uid() = user_id);

-- Public can create clicks for tracking
CREATE POLICY "Public can create clicks" ON public.clicks
  FOR INSERT WITH CHECK (true);

-- Service role can manage all clicks
CREATE POLICY "Service role full access to clicks" ON public.clicks
  FOR ALL USING (auth.role() = 'service_role');

-- Conversions policies
CREATE POLICY "Users can view own conversions" ON public.conversions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own conversions" ON public.conversions
  FOR ALL USING (auth.uid() = user_id);

-- Service role can manage all conversions
CREATE POLICY "Service role full access to conversions" ON public.conversions
  FOR ALL USING (auth.role() = 'service_role');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Simple attribution tables created successfully!';
END $$;