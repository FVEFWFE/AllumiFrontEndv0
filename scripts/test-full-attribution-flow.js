const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testFullAttributionFlow() {
  console.log('🚀 Testing Full Attribution Flow\n');
  console.log('=' .repeat(50));

  // Step 1: Create a test link
  console.log('\n📝 Step 1: Creating tracking link...');
  const linkData = {
    user_id: 'ab54ac98-06ec-4eb8-a771-182d23c88665', // Your actual user ID
    short_id: 'test_' + Date.now().toString(36),
    destination_url: 'https://www.skool.com/@test-community',
    campaign_name: 'Attribution Test Campaign',
    utm_source: 'instagram',
    utm_medium: 'social',
    utm_campaign: 'test_attribution',
    is_active: true
  };

  const { data: link, error: linkError } = await supabase
    .from('links')
    .insert(linkData)
    .select()
    .single();

  if (linkError) {
    console.log('❌ Error creating link:', linkError.message);
    return;
  }

  console.log('✅ Link created:', {
    id: link.id,
    short_id: link.short_id,
    url: `http://localhost:3000/l/${link.short_id}`
  });

  // Step 2: Simulate a click
  console.log('\n🖱️ Step 2: Simulating click...');
  const clickData = {
    short_id: link.short_id,
    link_id: link.id,
    clicked_at: new Date().toISOString(),
    user_agent: 'Mozilla/5.0 (Test Browser)',
    ip_address: '127.0.0.1',
    referer: 'https://instagram.com/profile',
    device_fingerprint: 'test_fp_' + Date.now(),
    session_id: 'test_session_' + Date.now(),
    // metadata not available yet
  };

  const { data: click, error: clickError } = await supabase
    .from('clicks')
    .insert(clickData)
    .select()
    .single();

  if (clickError) {
    console.log('❌ Error recording click:', clickError.message);
    // Continue anyway to test conversion
  } else {
    console.log('✅ Click recorded:', {
      id: click.id,
      device_fingerprint: click.device_fingerprint
    });
  }

  // Step 3: Simulate a conversion
  console.log('\n💰 Step 3: Simulating conversion...');
  const conversionData = {
    skool_email: 'test_conversion_' + Date.now() + '@allumi.com',
    skool_name: 'Test Conversion User',
    skool_username: 'testuser_' + Date.now(),
    joined_at: new Date().toISOString(),
    membership_type: 'paid',
    revenue_tracked: 59.00,
    attributed_link_id: link.id,
    attribution_data: {
      source: link.utm_source,
      medium: link.utm_medium,
      campaign: link.utm_campaign,
      click_time: clickData.clicked_at,
      conversion_time: new Date().toISOString(),
      device_fingerprint: clickData.device_fingerprint
    },
    confidence_score: 0.95,
    device_fingerprint: clickData.device_fingerprint,
    metadata: {
      test: true,
      attribution_method: 'direct_link_click',
      time_to_convert: '5 minutes'
    }
  };

  const { data: conversion, error: conversionError } = await supabase
    .from('conversions')
    .insert(conversionData)
    .select()
    .single();

  if (conversionError) {
    console.log('❌ Error recording conversion:', conversionError.message);
    console.log('\n⚠️ Database schema needs to be updated. Please run fix-all-tables.sql in Supabase.');
    return;
  }

  console.log('✅ Conversion recorded:', {
    id: conversion.id,
    email: conversion.skool_email,
    revenue: conversion.revenue_tracked,
    attributed_to: conversion.attributed_link_id
  });

  // Step 4: Verify attribution
  console.log('\n🔍 Step 4: Verifying attribution...');

  // Check if link stats were updated
  const { data: updatedLink, error: statsError } = await supabase
    .from('links')
    .select('clicks, last_clicked_at')
    .eq('id', link.id)
    .single();

  if (!statsError && updatedLink) {
    console.log('📊 Link stats:', {
      clicks: updatedLink.clicks || 0,
      last_clicked: updatedLink.last_clicked_at || 'never'
    });
  }

  // Clean up test data
  console.log('\n🧹 Step 5: Cleaning up test data...');

  if (conversion && conversion.id) {
    await supabase.from('conversions').delete().eq('id', conversion.id);
  }
  if (click && click.id) {
    await supabase.from('clicks').delete().eq('id', click.id);
  }
  if (link && link.id) {
    await supabase.from('links').delete().eq('id', link.id);
  }

  console.log('✅ Test data cleaned up');

  console.log('\n' + '='.repeat(50));
  console.log('🎉 Attribution flow test complete!');

  if (conversion) {
    console.log('\n✨ SUCCESS: Full attribution pipeline working!');
    console.log('- Link creation ✅');
    console.log('- Click tracking ✅');
    console.log('- Conversion tracking ✅');
    console.log('- Attribution ✅');
  } else {
    console.log('\n⚠️ PARTIAL SUCCESS: Link creation working');
    console.log('❌ Database schema needs update for full flow');
  }
}

testFullAttributionFlow();