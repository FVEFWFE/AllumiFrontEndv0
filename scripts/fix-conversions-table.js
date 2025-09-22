const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixConversionsTable() {
  console.log('🔧 Fixing conversions table schema...');

  try {
    // Check if column already exists
    const { data: columns } = await supabase.rpc('get_table_columns', {
      table_name: 'conversions'
    }).catch(() => ({ data: null }));

    // Add missing column using raw SQL through Supabase
    const { error: alterError } = await supabase.rpc('exec_sql', {
      query: `
        ALTER TABLE conversions
        ADD COLUMN IF NOT EXISTS attributed_link_id UUID REFERENCES links(id);
      `
    }).catch(async () => {
      // If RPC doesn't exist, try direct approach
      console.log('Attempting direct table update...');

      // Create a test conversion to see current schema
      const { error: testError } = await supabase
        .from('conversions')
        .select('*')
        .limit(1);

      if (testError?.message?.includes('attributed_link_id')) {
        console.log('❌ Column needs to be added manually in Supabase dashboard');
        console.log('\n📝 Manual steps:');
        console.log('1. Go to Supabase dashboard');
        console.log('2. Navigate to Table Editor → conversions');
        console.log('3. Click "Add column"');
        console.log('4. Name: attributed_link_id');
        console.log('5. Type: uuid');
        console.log('6. Foreign key: links.id');
        console.log('7. Nullable: Yes');
        return { error: 'Manual intervention required' };
      }

      return { error: null };
    });

    if (alterError) {
      console.log('⚠️ Could not automatically add column');
      console.log('Error:', alterError);

      // Try alternative approach - create new conversions record to test
      const testConversion = {
        skool_email: 'schema-test@allumi.com',
        skool_name: 'Schema Test',
        membership_type: 'free',
        revenue_tracked: 0,
        confidence_score: 1.0,
        attributed_link_id: null, // This will fail if column doesn't exist
        metadata: {}
      };

      const { error: insertError } = await supabase
        .from('conversions')
        .insert(testConversion);

      if (insertError) {
        console.log('\n❌ Column does not exist and needs manual creation');
        console.log('Error:', insertError.message);
      } else {
        console.log('✅ Column already exists or was created successfully!');

        // Clean up test record
        await supabase
          .from('conversions')
          .delete()
          .eq('skool_email', 'schema-test@allumi.com');
      }
    } else {
      console.log('✅ Conversions table schema fixed successfully!');
    }

    // Verify the fix by checking if we can insert with the column
    console.log('\n🔍 Verifying schema...');
    const { data, error } = await supabase
      .from('conversions')
      .select('id, skool_email, attributed_link_id')
      .limit(1);

    if (!error) {
      console.log('✅ Schema verification successful!');
      console.log('Sample query result:', data);
    } else {
      console.log('❌ Schema verification failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Error fixing conversions table:', error);
    console.log('\n📝 Please add the column manually in Supabase:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to Table Editor');
    console.log('3. Select the "conversions" table');
    console.log('4. Click "Add column"');
    console.log('5. Set:');
    console.log('   - Name: attributed_link_id');
    console.log('   - Type: uuid');
    console.log('   - Foreign key: links.id (optional)');
    console.log('   - Nullable: Yes');
  }
}

fixConversionsTable();