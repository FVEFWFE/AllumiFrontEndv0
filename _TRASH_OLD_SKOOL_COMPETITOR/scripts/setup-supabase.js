#!/usr/bin/env node

/**
 * Allumi Supabase Setup Helper
 * Automates database schema creation and initial data setup
 * Run: node scripts/setup-supabase.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// SQL Schema for Allumi
const schema = `
-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'member',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  lifetime_access BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Communities table
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  logo_url TEXT,
  owner_id UUID REFERENCES auth.users(id),
  subscription_price DECIMAL(10,2),
  lifetime_price DECIMAL(10,2),
  is_public BOOLEAN DEFAULT true,
  features JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Community memberships
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  community_id UUID REFERENCES public.communities(id),
  role TEXT DEFAULT 'member', -- owner, admin, moderator, member
  status TEXT DEFAULT 'active', -- active, inactive, banned
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, community_id)
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES public.communities(id),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  instructor_id UUID REFERENCES auth.users(id),
  price DECIMAL(10,2) DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Course modules
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Course lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.course_modules(id),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  content TEXT,
  duration INTEGER, -- in seconds
  order_index INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Attribution tracking
CREATE TABLE IF NOT EXISTS public.attribution_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES public.communities(id),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL, -- page_view, signup, purchase, etc.
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  landing_page TEXT,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  revenue DECIMAL(10,2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Revenue attribution
CREATE TABLE IF NOT EXISTS public.revenue_attribution (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES public.communities(id),
  user_id UUID REFERENCES auth.users(id),
  order_id TEXT,
  revenue DECIMAL(10,2) NOT NULL,
  attribution_model TEXT NOT NULL, -- first_touch, last_touch, linear, time_decay
  channel TEXT NOT NULL,
  campaign TEXT,
  touchpoints JSONB DEFAULT '[]',
  conversion_path JSONB DEFAULT '[]',
  days_to_conversion INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Posts/Feed
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES public.communities(id),
  author_id UUID REFERENCES auth.users(id),
  title TEXT,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'post', -- post, announcement, poll
  is_pinned BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Comments
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id),
  lesson_id UUID REFERENCES public.lessons(id),
  author_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES public.communities(id),
  host_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  meeting_url TEXT,
  max_attendees INTEGER,
  rsvp_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Direct Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id),
  recipient_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Leaderboard scores
CREATE TABLE IF NOT EXISTS public.leaderboard_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES public.communities(id),
  user_id UUID REFERENCES auth.users(id),
  period TEXT NOT NULL, -- daily, weekly, monthly, all_time
  points INTEGER DEFAULT 0,
  rank INTEGER,
  activities JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(community_id, user_id, period)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_communities_slug ON public.communities(slug);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_community ON public.memberships(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_community ON public.posts(community_id);
CREATE INDEX IF NOT EXISTS idx_attribution_events_community ON public.attribution_events(community_id);
CREATE INDEX IF NOT EXISTS idx_attribution_events_user ON public.attribution_events(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_attribution_community ON public.revenue_attribution(community_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribution_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_scores ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
-- Profiles: Users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Communities: Public read, owners can update
CREATE POLICY "Public communities are viewable" ON public.communities FOR SELECT USING (is_public = true);
CREATE POLICY "Owners can update communities" ON public.communities FOR UPDATE USING (auth.uid() = owner_id);

-- Messages: Users can read own messages
CREATE POLICY "Users can read own messages" ON public.messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Notifications: Users can read own notifications
CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);
`;

// Load environment variables
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return {};
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

// Save schema to file
function saveSchemaFile() {
  const schemaDir = path.join(process.cwd(), 'supabase');
  const schemaPath = path.join(schemaDir, 'schema.sql');
  
  if (!fs.existsSync(schemaDir)) {
    fs.mkdirSync(schemaDir, { recursive: true });
  }
  
  fs.writeFileSync(schemaPath, schema);
  return schemaPath;
}

// Main setup function
async function setupSupabase() {
  console.log(`${colors.blue}${colors.bright}
╔═══════════════════════════════════════╗
║   🗄️  Allumi Supabase Setup           ║
╚═══════════════════════════════════════╝${colors.reset}
`);

  const env = loadEnv();
  
  // Check if Supabase is configured
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log(`${colors.red}❌ Supabase not configured in .env.local${colors.reset}`);
    console.log(`${colors.yellow}   Run: node scripts/setup-env.js${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.green}✅ Found Supabase configuration${colors.reset}`);
  console.log(`${colors.cyan}   URL: ${env.NEXT_PUBLIC_SUPABASE_URL}${colors.reset}\n`);
  
  // Save schema file
  console.log(`${colors.blue}Creating schema file...${colors.reset}`);
  const schemaPath = saveSchemaFile();
  console.log(`${colors.green}✅ Schema saved to: ${schemaPath}${colors.reset}\n`);
  
  // Instructions for manual setup
  console.log(`${colors.magenta}${colors.bright}Setup Instructions:${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
  
  console.log(`\n${colors.yellow}Option 1: Using Supabase Dashboard (Recommended)${colors.reset}`);
  console.log(`1. Go to your Supabase project dashboard`);
  console.log(`2. Navigate to SQL Editor`);
  console.log(`3. Copy contents from: ${colors.cyan}supabase/schema.sql${colors.reset}`);
  console.log(`4. Paste and run the SQL`);
  console.log(`5. Check the Table Editor to verify tables were created`);
  
  console.log(`\n${colors.yellow}Option 2: Using Supabase CLI${colors.reset}`);
  console.log(`1. Install Supabase CLI: ${colors.cyan}npm install -g supabase${colors.reset}`);
  console.log(`2. Login: ${colors.cyan}supabase login${colors.reset}`);
  console.log(`3. Link project: ${colors.cyan}supabase link --project-ref YOUR_PROJECT_REF${colors.reset}`);
  console.log(`4. Push schema: ${colors.cyan}supabase db push${colors.reset}`);
  
  console.log(`\n${colors.blue}${colors.bright}Required Tables Created:${colors.reset}`);
  const tables = [
    'profiles - User profiles',
    'communities - Community spaces',
    'memberships - User-community relationships',
    'courses - Educational content',
    'attribution_events - Track user journeys',
    'revenue_attribution - Revenue tracking',
    'posts - Community feed',
    'messages - Direct messaging',
    'notifications - User notifications',
    'leaderboard_scores - Gamification'
  ];
  
  tables.forEach(table => {
    console.log(`  ✓ ${table}`);
  });
  
  console.log(`\n${colors.blue}${colors.bright}Next Steps:${colors.reset}`);
  console.log(`1. ${colors.cyan}Run schema:${colors.reset} Copy schema.sql to Supabase SQL editor`);
  console.log(`2. ${colors.cyan}Enable Auth:${colors.reset} Configure authentication providers`);
  console.log(`3. ${colors.cyan}Set up Storage:${colors.reset} Create buckets for avatars and media`);
  console.log(`4. ${colors.cyan}Test connection:${colors.reset} npm run dev`);
  
  console.log(`\n${colors.green}${colors.bright}✅ Supabase setup files ready!${colors.reset}`);
  console.log(`${colors.yellow}Note: Manual steps required in Supabase dashboard${colors.reset}`);
}

// Run setup
setupSupabase().catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});