/**
 * Direct Database Migration Script
 * Applies migrations using Supabase JavaScript client
 * Run this if Supabase CLI isn't authenticated
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigrations() {
  console.log('🗄️ APPLYING DATABASE MIGRATIONS\n');
  console.log('Using Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('');

  const migrations = [
    {
      name: 'user_settings',
      file: 'supabase/migrations/20250122_create_user_settings.sql'
    },
    {
      name: 'campaign_spend',
      file: 'supabase/migrations/20250122_create_campaign_spend.sql'
    }
  ];

  for (const migration of migrations) {
    console.log(`📋 Applying migration: ${migration.name}`);

    const sqlPath = path.join(__dirname, migration.file);
    if (!fs.existsSync(sqlPath)) {
      console.log(`⚠️ Migration file not found: ${migration.file}`);
      console.log('Creating inline migration...\n');

      if (migration.name === 'user_settings') {
        // Apply user_settings migration inline
        const { error } = await supabase.rpc('exec_sql', {
          sql: `
            -- Create user_settings table
            CREATE TABLE IF NOT EXISTS user_settings (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID NOT NULL UNIQUE,
              api_key TEXT NOT NULL UNIQUE,
              webhook_secret TEXT NOT NULL,
              webhook_url TEXT,
              notifications JSONB DEFAULT '{"emailAlerts": true, "weeklyReports": true, "trialReminders": true, "newConversions": false}'::jsonb,
              integrations JSONB DEFAULT '{}'::jsonb,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- Add indexes
            CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
            CREATE INDEX IF NOT EXISTS idx_user_settings_api_key ON user_settings(api_key);

            -- Enable RLS
            ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

            -- Create policies
            CREATE POLICY "Users can view own settings" ON user_settings
              FOR SELECT USING (auth.uid() = user_id);

            CREATE POLICY "Users can update own settings" ON user_settings
              FOR UPDATE USING (auth.uid() = user_id);

            CREATE POLICY "Users can insert own settings" ON user_settings
              FOR INSERT WITH CHECK (auth.uid() = user_id);
          `
        });

        if (error) {
          console.log('⚠️ Note: Table might already exist (this is OK)');
          console.log('Error details:', error.message);
        } else {
          console.log('✅ user_settings table created');
        }
      }

      if (migration.name === 'campaign_spend') {
        // Apply campaign_spend migration inline
        const { error } = await supabase.rpc('exec_sql', {
          sql: `
            -- Create campaign_spend table
            CREATE TABLE IF NOT EXISTS campaign_spend (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID NOT NULL,
              campaign_name TEXT NOT NULL,
              amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
              currency TEXT DEFAULT 'USD',
              notes TEXT,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW(),
              UNIQUE(user_id, campaign_name)
            );

            -- Add indexes
            CREATE INDEX IF NOT EXISTS idx_campaign_spend_user_id ON campaign_spend(user_id);
            CREATE INDEX IF NOT EXISTS idx_campaign_spend_campaign_name ON campaign_spend(campaign_name);

            -- Enable RLS
            ALTER TABLE campaign_spend ENABLE ROW LEVEL SECURITY;

            -- Create policies
            CREATE POLICY "Users can view own campaign spend" ON campaign_spend
              FOR SELECT USING (auth.uid() = user_id);

            CREATE POLICY "Users can insert own campaign spend" ON campaign_spend
              FOR INSERT WITH CHECK (auth.uid() = user_id);

            CREATE POLICY "Users can update own campaign spend" ON campaign_spend
              FOR UPDATE USING (auth.uid() = user_id);

            CREATE POLICY "Users can delete own campaign spend" ON campaign_spend
              FOR DELETE USING (auth.uid() = user_id);
          `
        });

        if (error) {
          console.log('⚠️ Note: Table might already exist (this is OK)');
          console.log('Error details:', error.message);
        } else {
          console.log('✅ campaign_spend table created');
        }
      }
    } else {
      const sql = fs.readFileSync(sqlPath, 'utf8');
      console.log(`Executing SQL from ${migration.file}...`);

      // Note: Supabase doesn't have a direct SQL execution method in JS client
      // We'll need to use the SQL editor in Supabase dashboard
      console.log('⚠️ Please run this SQL in Supabase SQL Editor:');
      console.log('---');
      console.log(sql.substring(0, 200) + '...');
      console.log('---');
    }
  }

  // Test if tables were created
  console.log('\n🧪 Verifying migrations...\n');

  // Check user_settings table
  const { data: settingsTest, error: settingsError } = await supabase
    .from('user_settings')
    .select('id')
    .limit(1);

  if (!settingsError) {
    console.log('✅ user_settings table exists and is accessible');
  } else {
    console.log('❌ user_settings table not accessible:', settingsError.message);
    console.log('\n⚠️ MANUAL ACTION REQUIRED:');
    console.log('1. Go to: https://supabase.com/dashboard/project/fyvxgciqfifjsycibikn/editor');
    console.log('2. Run the SQL from: supabase/migrations/20250122_create_user_settings.sql');
  }

  // Check campaign_spend table
  const { data: spendTest, error: spendError } = await supabase
    .from('campaign_spend')
    .select('id')
    .limit(1);

  if (!spendError) {
    console.log('✅ campaign_spend table exists and is accessible');
  } else {
    console.log('❌ campaign_spend table not accessible:', spendError.message);
    console.log('\n⚠️ MANUAL ACTION REQUIRED:');
    console.log('1. Go to: https://supabase.com/dashboard/project/fyvxgciqfifjsycibikn/editor');
    console.log('2. Run the SQL from: supabase/migrations/20250122_create_campaign_spend.sql');
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 MIGRATION STATUS\n');

  if (!settingsError && !spendError) {
    console.log('🎉 ALL MIGRATIONS APPLIED SUCCESSFULLY!');
    console.log('\nThe app is now ready to use:');
    console.log('- Settings page will work (API keys can be saved)');
    console.log('- Campaigns page will work (ROI tracking enabled)');
  } else {
    console.log('⚠️ Some migrations need manual application');
    console.log('\n📝 Next Steps:');
    console.log('1. Click link above to open Supabase SQL Editor');
    console.log('2. Copy SQL from migration files in supabase/migrations/');
    console.log('3. Paste and run in SQL Editor');
    console.log('4. Re-run this script to verify');
  }
}

applyMigrations().catch(console.error);