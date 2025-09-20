const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'https://fyvxgciqfifjsycibikn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dnhnY2lxZmlmanN5Y2liaWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc3OTk2NywiZXhwIjoyMDczMzU1OTY3fQ.ZDCs4ugkEVlmq0ujnC-Mf3Pn3ejJwdgPEd81gZZ-maU'
);

async function runMigration() {
  console.log('🚀 Running column fix migration...\n');

  const migrationFile = path.join(__dirname, 'supabase', 'migrations', '005_fix_attribution_columns.sql');
  const sql = fs.readFileSync(migrationFile, 'utf8');

  // Split by semicolon and run each statement
  const statements = sql.split(';').filter(s => s.trim());

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i].trim();
    if (!statement) continue;

    console.log(`Running statement ${i + 1}/${statements.length}...`);

    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        query: statement + ';'
      });

      if (error) {
        // Try direct execution if RPC doesn't work
        console.log('RPC failed, trying alternative method...');
        // For Supabase, we'll need to use the SQL editor in the dashboard
        console.log('Statement to run manually:');
        console.log(statement + ';');
        console.log('---');
      } else {
        console.log('✅ Success');
      }
    } catch (err) {
      console.log('Statement needs to be run manually in Supabase SQL editor:');
      console.log(statement + ';');
      console.log('---');
    }
  }

  console.log('\n✨ Migration script prepared!');
  console.log('\nNOTE: Some statements may need to be run manually in the Supabase SQL editor.');
  console.log('Go to: https://app.supabase.com/project/fyvxgciqfifjsycibikn/sql/new');
  console.log('\nCopy and paste the entire contents of:');
  console.log('supabase/migrations/005_fix_attribution_columns.sql');
}

runMigration().catch(console.error);