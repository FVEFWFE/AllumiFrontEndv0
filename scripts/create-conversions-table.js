const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createConversionsTable() {
  console.log('🔍 Checking conversions table structure...\n');

  // First, check if conversions table exists and its columns
  const { data: tables, error: tableError } = await supabase
    .from('conversions')
    .select('*')
    .limit(0); // Just check structure, don't fetch data

  if (tableError) {
    console.log('⚠️ Issue with conversions table:', tableError.message);
    console.log('\n📝 SQL to create conversions table:');
    console.log(`
CREATE TABLE IF NOT EXISTS conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  skool_email TEXT NOT NULL,
  skool_name TEXT,
  skool_username TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  membership_type TEXT DEFAULT 'free',
  revenue_tracked DECIMAL(10, 2) DEFAULT 0,
  attributed_link_id UUID REFERENCES links(id),
  attribution_data JSONB,
  confidence_score DECIMAL(3, 2) DEFAULT 0,
  device_fingerprint TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_conversions_user_id ON conversions(user_id);
CREATE INDEX idx_conversions_email ON conversions(skool_email);
CREATE INDEX idx_conversions_link_id ON conversions(attributed_link_id);
CREATE INDEX idx_conversions_created_at ON conversions(created_at DESC);

-- Enable RLS
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY "Service role can manage conversions" ON conversions
  FOR ALL USING (true) WITH CHECK (true);
    `);

    console.log('\n⚠️ Please run the above SQL in your Supabase SQL Editor:');
    console.log('1. Go to Supabase dashboard');
    console.log('2. Click on SQL Editor');
    console.log('3. Paste and run the SQL above');
    console.log('4. Then re-run this script to verify');
  } else {
    console.log('✅ Conversions table exists!');

    // Test insertion with correct schema
    const testData = {
      skool_email: 'schema-test@allumi.com',
      skool_name: 'Schema Test User',
      skool_username: 'schematest',
      membership_type: 'free',
      revenue_tracked: 0,
      confidence_score: 0.95,
      device_fingerprint: 'test_fp_' + Date.now(),
      metadata: {
        test: true,
        timestamp: new Date().toISOString()
      }
    };

    console.log('\n🧪 Testing insertion...');
    const { data, error } = await supabase
      .from('conversions')
      .insert(testData)
      .select()
      .single();

    if (error) {
      console.log('❌ Insertion failed:', error.message);

      // Try to understand what columns are available
      console.log('\n📊 Attempting to query table structure...');
      const { data: sample, error: sampleError } = await supabase
        .from('conversions')
        .select('*')
        .limit(1);

      if (!sampleError && sample?.length === 0) {
        console.log('Table exists but is empty. Columns might be different.');
        console.log('Please check the table structure in Supabase dashboard.');
      }
    } else {
      console.log('✅ Test insertion successful!');
      console.log('Record ID:', data.id);

      // Clean up
      await supabase
        .from('conversions')
        .delete()
        .eq('id', data.id);

      console.log('🧹 Test data cleaned up');
      console.log('\n🎉 Conversions table is properly configured!');
    }
  }
}

createConversionsTable();