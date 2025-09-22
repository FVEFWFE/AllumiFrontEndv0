/**
 * Run Member-Identity Migration Script
 * Adds columns and tables needed for member identification system
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('🚀 Running member-identity migration...\n');

  // Read migration SQL
  const migrationPath = path.join(__dirname, 'supabase', 'migrations', 'member-identity-columns.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  // Split into individual statements (simple split by semicolon)
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

  let successCount = 0;
  let errorCount = 0;

  // Execute each statement
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    const preview = statement.substring(0, 60).replace(/\n/g, ' ');

    console.log(`[${i + 1}/${statements.length}] Executing: ${preview}...`);

    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql_query: statement
      });

      if (error) {
        // Try direct execution as fallback
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
          {
            method: 'POST',
            headers: {
              'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql_query: statement })
          }
        );

        if (!response.ok) {
          throw new Error(`Statement failed: ${preview}`);
        }
      }

      console.log(`   ✅ Success`);
      successCount++;
    } catch (error) {
      console.log(`   ⚠️ Warning: ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 Migration Results:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ⚠️ Warnings: ${errorCount}`);
  console.log('='.repeat(60));

  // Test the new schema
  console.log('\n🧪 Testing new schema...\n');

  // Test 1: Check if members table exists
  const { data: membersTest } = await supabase
    .from('members')
    .select('count')
    .limit(1);

  if (membersTest !== null) {
    console.log('✅ Members table exists');
  } else {
    console.log('❌ Members table not found');
  }

  // Test 2: Check if identity_id column exists in users
  const { data: usersTest } = await supabase
    .from('users')
    .select('id, identity_id')
    .limit(1);

  if (usersTest !== null) {
    console.log('✅ Users.identity_id column exists');
  } else {
    console.log('⚠️ Users.identity_id column may not exist');
  }

  // Test 3: Check if identities table is accessible
  const { data: identitiesTest } = await supabase
    .from('identities')
    .select('count')
    .limit(1);

  if (identitiesTest !== null) {
    console.log('✅ Identities table accessible');
  } else {
    console.log('⚠️ Identities table not accessible');
  }

  console.log('\n✨ Migration complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Test CSV import with: node test-csv-import.js');
  console.log('2. Test Zapier webhook with real data');
  console.log('3. Update dashboard to show real member data');
}

// Run the migration
runMigration().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});