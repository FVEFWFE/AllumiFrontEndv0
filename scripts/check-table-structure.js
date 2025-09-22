const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableStructure() {
  console.log('🔍 Analyzing database structure...\n');

  // Check clicks table
  console.log('📊 Clicks table:');
  const { data: clickSample, error: clickError } = await supabase
    .from('clicks')
    .select('*')
    .limit(1);

  if (clickError) {
    console.log('❌ Error:', clickError.message);
  } else {
    if (clickSample && clickSample.length > 0) {
      console.log('✅ Sample record columns:', Object.keys(clickSample[0]));
    } else {
      console.log('✅ Table exists but is empty');
    }
  }

  // Check links table
  console.log('\n📊 Links table:');
  const { data: linkSample, error: linkError } = await supabase
    .from('links')
    .select('*')
    .limit(1);

  if (linkError) {
    console.log('❌ Error:', linkError.message);
  } else {
    if (linkSample && linkSample.length > 0) {
      console.log('✅ Sample record columns:', Object.keys(linkSample[0]));
      console.log('Sample link ID:', linkSample[0].id);
    } else {
      console.log('✅ Table exists but is empty');
    }
  }

  // Check conversions table with different approach
  console.log('\n📊 Conversions table:');

  // Try minimal insert to see what works
  const minimalTests = [
    { skool_email: 'test1@test.com' },
    { email: 'test2@test.com' },
    { user_email: 'test3@test.com' }
  ];

  for (const test of minimalTests) {
    const { error } = await supabase
      .from('conversions')
      .insert(test);

    if (!error) {
      console.log('✅ Works with columns:', Object.keys(test));
      // Clean up
      await supabase
        .from('conversions')
        .delete()
        .match(test);
      break;
    }
  }

  // Try to get actual columns via a different approach
  console.log('\n📋 Attempting to detect actual columns...');
  const { data: conversionData, error: conversionError } = await supabase
    .from('conversions')
    .select()
    .limit(1);

  if (!conversionError) {
    if (conversionData && conversionData.length > 0) {
      console.log('✅ Actual columns:', Object.keys(conversionData[0]));
    } else {
      console.log('ℹ️ Table exists but is empty. Checking alternate approaches...');

      // Test with whop webhook data structure
      const whopConversion = {
        user_id: null,
        email: 'whop-test@test.com',
        whop_user_id: 'test_whop_id',
        amount: 59.00,
        status: 'completed',
        created_at: new Date().toISOString()
      };

      const { error: whopError } = await supabase
        .from('conversions')
        .insert(whopConversion);

      if (!whopError) {
        console.log('✅ Table accepts Whop webhook structure');
        await supabase
          .from('conversions')
          .delete()
          .eq('email', 'whop-test@test.com');
      } else {
        console.log('ℹ️ Not using Whop structure:', whopError.message);
      }
    }
  }

  // Check users table for reference
  console.log('\n📊 Users table:');
  const { data: userSample, error: userError } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  if (userError) {
    console.log('❌ Error:', userError.message);
  } else {
    if (userSample && userSample.length > 0) {
      console.log('✅ Sample record columns:', Object.keys(userSample[0]));
      console.log('Sample user ID:', userSample[0].id);
    } else {
      console.log('✅ Table exists but is empty');
    }
  }

  // Check if there are any other relevant tables
  console.log('\n📊 Checking for other attribution tables...');
  const tableNames = ['attributions', 'conversions', 'pixel_events', 'identities', 'campaigns'];

  for (const table of tableNames) {
    const { error } = await supabase
      .from(table)
      .select()
      .limit(0);

    if (!error) {
      console.log(`✅ ${table} table exists`);
    }
  }

  console.log('\n✅ Analysis complete!');
}

checkTableStructure();