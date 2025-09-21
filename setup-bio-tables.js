const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupBioTables() {
  console.log('Setting up bio tables...');

  const sql = `
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
    CREATE INDEX IF NOT EXISTS idx_bio_link_clicks_clicked_at ON bio_link_clicks(clicked_at);

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

  try {
    const { error } = await supabase.rpc('exec_sql', { query: sql });

    if (error) {
      // Try executing the SQL directly via the REST API
      console.log('Direct RPC failed, trying alternative method...');

      const statements = sql.split(';').filter(s => s.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          console.log('Executing:', statement.substring(0, 50) + '...');

          // We'll have to execute these manually in Supabase dashboard
          console.log('Please execute this in Supabase SQL Editor');
        }
      }

      console.log('\n✅ Please copy and paste the content from /supabase/migrations/create_bio_tables.sql into your Supabase SQL Editor and run it.');
      return;
    }

    console.log('✅ Bio tables created successfully!');
  } catch (error) {
    console.error('Error setting up tables:', error);
    console.log('\n❌ Automatic setup failed. Please manually run the SQL from /supabase/migrations/create_bio_tables.sql in your Supabase dashboard.');
  }
}

setupBioTables();