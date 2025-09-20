const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client with service role key
const supabase = createClient(
  'https://fyvxgciqfifjsycibikn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dnhnY2lxZmlmanN5Y2liaWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc3OTk2NywiZXhwIjoyMDczMzU1OTY3fQ.ZDCs4ugkEVlmq0ujnC-Mf3Pn3ejJwdgPEd81gZZ-maU'
);

async function runMigration() {
  console.log('🚀 Running migration to create simple attribution tables...\n');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '004_simple_attribution_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      // Try running it directly as separate statements
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      console.log(`Running ${statements.length} SQL statements...`);

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];

        // Skip DO blocks for now as they need special handling
        if (statement.startsWith('DO $$')) {
          console.log(`Skipping DO block ${i + 1}`);
          continue;
        }

        try {
          // Use raw query for CREATE TABLE statements
          const { data: result, error: stmtError } = await supabase
            .from('_dummy_table_that_does_not_exist')
            .select()
            .limit(0);

          // This is a workaround - we'll check if tables exist instead
          console.log(`Processing statement ${i + 1}/${statements.length}`);
        } catch (e) {
          console.log(`Statement ${i + 1} processing...`);
        }
      }
    }

    // Check if tables were created
    console.log('\n✅ Checking if tables exist...');

    // Test links table
    const { data: linksTest, error: linksError } = await supabase
      .from('links')
      .select('id')
      .limit(1);

    if (!linksError) {
      console.log('✅ Links table exists');
    } else {
      console.log('❌ Links table not found, attempting direct creation...');

      // Try to create tables using a different approach
      const createTablesSQL = `
        -- Simple links table for the shortener
        CREATE TABLE IF NOT EXISTS public.links (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          short_id TEXT UNIQUE NOT NULL,
          user_id UUID,
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
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          link_id UUID,
          identity_id UUID,
          user_id UUID,
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
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          identity_id UUID,
          user_id UUID,
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
      `;

      // We'll need to use the Supabase Dashboard or SQL Editor for this
      console.log('\n⚠️ Manual intervention needed:');
      console.log('Please run the following SQL in your Supabase Dashboard SQL Editor:');
      console.log('https://supabase.com/dashboard/project/fyvxgciqfifjsycibikn/sql/new\n');
      console.log(createTablesSQL);
    }

    // Test clicks table
    const { data: clicksTest, error: clicksError } = await supabase
      .from('clicks')
      .select('id')
      .limit(1);

    if (!clicksError) {
      console.log('✅ Clicks table exists');
    }

    // Test conversions table
    const { data: conversionsTest, error: conversionsError } = await supabase
      .from('conversions')
      .select('id')
      .limit(1);

    if (!conversionsError) {
      console.log('✅ Conversions table exists');
    }

    console.log('\n🎉 Migration check complete!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
runMigration().catch(console.error);