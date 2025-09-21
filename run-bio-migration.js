const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Get credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runBioMigration() {
  console.log('🚀 Running Link-in-Bio database migration...\n');
  console.log(`Using Supabase URL: ${supabaseUrl}\n`);

  const tables = [
    {
      name: 'bio_pages',
      sql: `CREATE TABLE IF NOT EXISTS bio_pages (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        slug VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(100),
        bio TEXT,
        avatar_url TEXT,
        theme VARCHAR(20) DEFAULT 'dark',
        custom_css TEXT,
        is_active BOOLEAN DEFAULT true,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
      )`
    },
    {
      name: 'bio_links',
      sql: `CREATE TABLE IF NOT EXISTS bio_links (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        page_id UUID REFERENCES bio_pages(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        url TEXT NOT NULL,
        thumbnail_url TEXT,
        description TEXT,
        button_style VARCHAR(20) DEFAULT 'filled',
        position INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT true,
        clicks INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )`
    },
    {
      name: 'bio_link_clicks',
      sql: `CREATE TABLE IF NOT EXISTS bio_link_clicks (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        link_id UUID REFERENCES bio_links(id) ON DELETE CASCADE,
        page_id UUID REFERENCES bio_pages(id) ON DELETE CASCADE,
        clicked_at TIMESTAMPTZ DEFAULT NOW(),
        ip_address INET,
        user_agent TEXT,
        referrer TEXT,
        country VARCHAR(2)
      )`
    }
  ];

  let tablesCreated = 0;
  let tablesExist = 0;
  let errors = 0;

  // Check and create tables
  for (const table of tables) {
    try {
      console.log(`Checking table: ${table.name}...`);

      // First, check if table exists
      const { data: existCheck, error: existError } = await supabase
        .from(table.name)
        .select('id')
        .limit(1);

      if (!existError || existError.code === 'PGRST116') {
        // PGRST116 means table doesn't exist
        if (existError && existError.code === 'PGRST116') {
          console.log(`  Table ${table.name} does not exist. Creating...`);

          // Table doesn't exist, we need to create it
          // Since we can't execute raw SQL directly, we'll output the SQL for manual execution
          console.log(`  ⚠️ Manual creation needed for ${table.name}`);
          errors++;
        } else {
          console.log(`  ✅ Table ${table.name} already exists`);
          tablesExist++;
        }
      }
    } catch (error) {
      console.error(`  ❌ Error checking ${table.name}:`, error.message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));

  if (errors > 0) {
    console.log('⚠️ Some tables need to be created manually.\n');
    console.log('Please run the following SQL in your Supabase Dashboard:');
    console.log(`${supabaseUrl.replace('/rest/v1', '')}/sql/new\n`);
    console.log('Copy and paste this SQL:\n');
    console.log('='.repeat(60));

    // Output the full migration SQL
    const fullSQL = `
-- Create bio_pages table
CREATE TABLE IF NOT EXISTS bio_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  theme VARCHAR(20) DEFAULT 'dark',
  custom_css TEXT,
  is_active BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Create bio_links table
CREATE TABLE IF NOT EXISTS bio_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES bio_pages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  button_style VARCHAR(20) DEFAULT 'filled',
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bio_link_clicks tracking table
CREATE TABLE IF NOT EXISTS bio_link_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES bio_links(id) ON DELETE CASCADE,
  page_id UUID REFERENCES bio_pages(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  country VARCHAR(2)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bio_pages_slug ON bio_pages(slug);
CREATE INDEX IF NOT EXISTS idx_bio_pages_user_id ON bio_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_bio_links_page_id ON bio_links(page_id);
CREATE INDEX IF NOT EXISTS idx_bio_links_position ON bio_links(page_id, position);
CREATE INDEX IF NOT EXISTS idx_bio_link_clicks_link_id ON bio_link_clicks(link_id);

-- Enable RLS
ALTER TABLE bio_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bio_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE bio_link_clicks ENABLE ROW LEVEL SECURITY;

-- Bio pages policies
CREATE POLICY "Users can view their own bio pages" ON bio_pages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active bio pages" ON bio_pages
  FOR SELECT USING (is_active = true);

-- Bio links policies
CREATE POLICY "Users can manage their own links" ON bio_links
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active links" ON bio_links
  FOR SELECT USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM bio_pages
      WHERE bio_pages.id = bio_links.page_id
      AND bio_pages.is_active = true
    )
  );

-- Bio link clicks policies
CREATE POLICY "Anyone can record clicks" ON bio_link_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view clicks for their links" ON bio_link_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bio_links
      WHERE bio_links.id = bio_link_clicks.link_id
      AND bio_links.user_id = auth.uid()
    )
  );

-- Create function to increment counters
CREATE OR REPLACE FUNCTION increment(table_name text, column_name text, row_id uuid)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET %I = %I + 1 WHERE id = $1', table_name, column_name, column_name) USING row_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bio_pages_updated_at BEFORE UPDATE ON bio_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bio_links_updated_at BEFORE UPDATE ON bio_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

    console.log(fullSQL);
    console.log('='.repeat(60));
    console.log('\n📋 Steps to complete:');
    console.log('1. Copy the SQL above');
    console.log('2. Go to your Supabase SQL Editor');
    console.log('3. Paste and run the SQL');
    console.log('4. The Link-in-Bio feature will be ready!');
  } else if (tablesExist === tables.length) {
    console.log('✅ All tables already exist!');
    console.log('🎉 The Link-in-Bio feature is ready to use.');
  }
}

// Run the migration check
runBioMigration().catch(console.error);