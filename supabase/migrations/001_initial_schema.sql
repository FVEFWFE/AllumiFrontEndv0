-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  -- Attribution tracking fields
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT
);

-- Communities table
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  custom_domain TEXT UNIQUE,
  settings JSONB DEFAULT '{}'::jsonb,
  stripe_account_id TEXT,
  stripe_product_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT FALSE,
  member_count INTEGER DEFAULT 0,
  revenue_total DECIMAL(10,2) DEFAULT 0,
  mrr DECIMAL(10,2) DEFAULT 0
);

-- Memberships table (junction between users and communities)
CREATE TABLE public.memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'moderator', 'member')) DEFAULT 'member',
  status TEXT CHECK (status IN ('active', 'paused', 'cancelled')) DEFAULT 'active',
  stripe_subscription_id TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  -- Attribution tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  last_active TIMESTAMPTZ,
  UNIQUE(user_id, community_id)
);

-- Posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  category TEXT,
  pinned BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  utm_tracking JSONB
);

-- Revenue Attribution table (core differentiator)
CREATE TABLE public.revenue_attribution (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  medium TEXT,
  campaign TEXT,
  revenue DECIMAL(10,2) NOT NULL,
  conversion_path JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_communities_slug ON public.communities(slug);
CREATE INDEX idx_communities_owner ON public.communities(owner_id);
CREATE INDEX idx_memberships_user ON public.memberships(user_id);
CREATE INDEX idx_memberships_community ON public.memberships(community_id);
CREATE INDEX idx_posts_community ON public.posts(community_id);
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_revenue_attribution_community ON public.revenue_attribution(community_id);
CREATE INDEX idx_revenue_attribution_source ON public.revenue_attribution(source);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_attribution ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Communities policies
CREATE POLICY "Anyone can view published communities" ON public.communities
  FOR SELECT USING (is_published = true);

CREATE POLICY "Owners can manage their communities" ON public.communities
  FOR ALL USING (auth.uid() = owner_id);

-- Memberships policies
CREATE POLICY "Users can view their memberships" ON public.memberships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Community owners can manage memberships" ON public.memberships
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.communities
      WHERE communities.id = memberships.community_id
      AND communities.owner_id = auth.uid()
    )
  );

-- Posts policies
CREATE POLICY "Members can view community posts" ON public.posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.community_id = posts.community_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
    )
  );

CREATE POLICY "Members can create posts" ON public.posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.community_id = posts.community_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
    )
  );

-- Revenue attribution policies
CREATE POLICY "Community owners can view attribution" ON public.revenue_attribution
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.communities
      WHERE communities.id = revenue_attribution.community_id
      AND communities.owner_id = auth.uid()
    )
  );

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON public.communities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to update community member count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities
    SET member_count = member_count + 1
    WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities
    SET member_count = member_count - 1
    WHERE id = OLD.community_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_member_count
AFTER INSERT OR DELETE ON public.memberships
FOR EACH ROW EXECUTE FUNCTION update_community_member_count();