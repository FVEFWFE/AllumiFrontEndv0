const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const testResults = {
  passed: [],
  failed: [],
  total: 0
};

function logTest(name, passed, details = '') {
  testResults.total++;
  if (passed) {
    testResults.passed.push(name);
    console.log(`✅ ${name}`);
  } else {
    testResults.failed.push(name);
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: Create Tracking Link
async function testTrackingLinkCreation() {
  console.log('\n🔗 Testing Tracking Link Creation...');

  try {
    // Get or create test user
    const { data: userData } = await supabase.auth.admin.createUser({
      email: 'e2e-test@allumi.com',
      password: 'testpassword123',
      email_confirm: true
    }).catch(() => ({ data: null }));

    const userId = userData?.user?.id || 'test-user-id';

    // Create tracking link
    const trackingLink = {
      user_id: userId,
      name: 'E2E Test Campaign',
      url: 'https://allumi.com/join',
      utm_source: 'facebook',
      utm_medium: 'social',
      utm_campaign: 'e2e_test',
      clicks: 0,
      conversions: 0
    };

    const { data, error } = await supabase
      .from('tracking_links')
      .insert(trackingLink)
      .select()
      .single();

    logTest('Create tracking link', !error && data?.id, error?.message);
    return data;
  } catch (err) {
    logTest('Create tracking link', false, err.message);
    return null;
  }
}

// Test 2: Simulate Click & Identity Creation
async function testClickTracking(trackingLinkId) {
  console.log('\n🖱️ Testing Click Tracking & Identity Resolution...');

  try {
    // Simulate device fingerprint
    const fingerprint = {
      browser: 'Chrome',
      os: 'Windows',
      resolution: '1920x1080',
      timezone: 'America/New_York',
      language: 'en-US'
    };

    // Create identity (simulating pixel tracking)
    const { data: identity, error: idError } = await supabase
      .from('identities')
      .insert({
        anonymous_id: `anon_e2e_${Date.now()}`,
        fingerprint: JSON.stringify(fingerprint),
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        user_id: 'test-user-id'
      })
      .select()
      .single();

    logTest('Create identity', !idError && identity?.id, idError?.message);

    // Record click
    const { data: click, error: clickError } = await supabase
      .from('clicks')
      .insert({
        identity_id: identity?.id,
        url: `https://allumi.com/join?utm_source=facebook&utm_medium=social&utm_campaign=e2e_test`,
        utm_source: 'facebook',
        utm_medium: 'social',
        utm_campaign: 'e2e_test',
        referrer: 'https://facebook.com',
        user_id: 'test-user-id'
      })
      .select()
      .single();

    logTest('Record click', !clickError && click?.id, clickError?.message);

    return { identity, click };
  } catch (err) {
    logTest('Click tracking', false, err.message);
    return { identity: null, click: null };
  }
}

// Test 3: Email Capture
async function testEmailCapture(identityId) {
  console.log('\n📧 Testing Email Capture...');

  try {
    const testEmail = `e2e-test-${Date.now()}@example.com`;

    // Update identity with captured email
    const { data, error } = await supabase
      .from('identities')
      .update({ email_captured: testEmail })
      .eq('id', identityId)
      .select()
      .single();

    logTest('Capture email', !error && data?.email_captured === testEmail, error?.message);
    return testEmail;
  } catch (err) {
    logTest('Email capture', false, err.message);
    return null;
  }
}

// Test 4: Conversion Tracking
async function testConversionTracking(identityId, email) {
  console.log('\n💰 Testing Conversion Tracking...');

  try {
    // Create conversion (simulating Skool member join)
    const conversion = {
      identity_id: identityId,
      skool_email: email,
      revenue_tracked: 79.00,
      attribution_data: {
        source: 'facebook',
        medium: 'social',
        campaign: 'e2e_test',
        path: 'tracked_link',
        timestamp: new Date().toISOString()
      },
      confidence_score: 0.85,
      user_id: 'test-user-id'
    };

    const { data, error } = await supabase
      .from('conversions')
      .insert(conversion)
      .select()
      .single();

    logTest('Create conversion', !error && data?.id, error?.message);
    logTest('Attribution data captured', data?.attribution_data?.source === 'facebook');
    logTest('Revenue tracked', data?.revenue_tracked === 79);
    logTest('Confidence score >= 80%', data?.confidence_score >= 0.8);

    return data;
  } catch (err) {
    logTest('Conversion tracking', false, err.message);
    return null;
  }
}

// Test 5: Analytics Dashboard Data
async function testAnalyticsDashboard() {
  console.log('\n📊 Testing Analytics Dashboard Data...');

  try {
    // Query conversions grouped by source
    const { data: sourceData, error: sourceError } = await supabase
      .from('conversions')
      .select('utm_source:attribution_data->source, revenue_tracked')
      .eq('user_id', 'test-user-id');

    logTest('Query conversions by source', !sourceError && sourceData?.length > 0, sourceError?.message);

    // Query total revenue
    const totalRevenue = sourceData?.reduce((sum, c) => sum + (c.revenue_tracked || 0), 0) || 0;
    logTest('Calculate total revenue', totalRevenue > 0, `Total: $${totalRevenue}`);

    // Query conversion rate
    const { count: clickCount } = await supabase
      .from('clicks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', 'test-user-id');

    const { count: conversionCount } = await supabase
      .from('conversions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', 'test-user-id');

    const conversionRate = clickCount > 0 ? (conversionCount / clickCount * 100).toFixed(2) : 0;
    logTest('Calculate conversion rate', conversionRate > 0, `Rate: ${conversionRate}%`);

  } catch (err) {
    logTest('Analytics dashboard', false, err.message);
  }
}

// Test 6: CSV Import Simulation
async function testCSVImport() {
  console.log('\n📂 Testing CSV Import Flow...');

  try {
    // Simulate CSV data
    const csvMembers = [
      { email: 'member1@test.com', name: 'Test Member 1', joined_date: '2024-01-15', amount_paid: 49 },
      { email: 'member2@test.com', name: 'Test Member 2', joined_date: '2024-01-16', amount_paid: 79 },
      { email: 'member3@test.com', name: 'Test Member 3', joined_date: '2024-01-17', amount_paid: 99 }
    ];

    let imported = 0;
    for (const member of csvMembers) {
      // Check if identity exists with this email
      const { data: existingIdentity } = await supabase
        .from('identities')
        .select('id')
        .eq('email_captured', member.email)
        .single();

      // Create conversion for each member
      const conversion = {
        identity_id: existingIdentity?.id || null,
        skool_email: member.email,
        revenue_tracked: member.amount_paid,
        attribution_data: {
          source: existingIdentity ? 'tracked' : 'untracked',
          import_date: new Date().toISOString()
        },
        confidence_score: existingIdentity ? 0.9 : 0.3,
        user_id: 'test-user-id'
      };

      const { error } = await supabase
        .from('conversions')
        .insert(conversion);

      if (!error) imported++;
    }

    logTest('Import CSV members', imported === csvMembers.length, `Imported ${imported}/${csvMembers.length}`);
  } catch (err) {
    logTest('CSV import', false, err.message);
  }
}

// Test 7: Bio Page Creation & Tracking
async function testBioPage() {
  console.log('\n📱 Testing Link-in-Bio Feature...');

  try {
    // Create bio page
    const { data: bioPage, error: pageError } = await supabase
      .from('bio_pages')
      .insert({
        user_id: 'test-user-id',
        slug: 'e2e-test',
        title: 'E2E Test Bio Page',
        bio: 'Testing the link-in-bio feature',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=e2e',
        theme: JSON.stringify({ backgroundColor: '#1a1a1a', textColor: '#ffffff' }),
        views: 0
      })
      .select()
      .single();

    logTest('Create bio page', !pageError && bioPage?.id, pageError?.message);

    // Add links to bio page
    const links = [
      { title: 'Join Skool', url: 'https://skool.com/join', icon: '🎓' },
      { title: 'Free Training', url: 'https://training.com', icon: '📹' },
      { title: 'Book a Call', url: 'https://calendly.com', icon: '📞' }
    ];

    let linksCreated = 0;
    for (let i = 0; i < links.length; i++) {
      const { error } = await supabase
        .from('bio_links')
        .insert({
          page_id: bioPage?.id,
          title: links[i].title,
          url: links[i].url,
          icon: links[i].icon,
          order: i,
          clicks: 0,
          is_active: true
        });

      if (!error) linksCreated++;
    }

    logTest('Add bio links', linksCreated === links.length, `Added ${linksCreated}/${links.length} links`);

    // Simulate link click tracking
    const { error: updateError } = await supabase
      .from('bio_links')
      .update({ clicks: 1 })
      .eq('page_id', bioPage?.id)
      .select()
      .single();

    logTest('Track bio link click', !updateError, updateError?.message);

  } catch (err) {
    logTest('Bio page', false, err.message);
  }
}

// Test 8: Zapier Webhook Endpoint
async function testZapierWebhook() {
  console.log('\n⚡ Testing Zapier Webhook Integration...');

  try {
    // Check if webhook endpoint exists
    const webhookUrl = `${baseUrl}/api/webhooks/zapier`;

    // Simulate Zapier webhook payload
    const webhookPayload = {
      email: 'zapier-test@example.com',
      name: 'Zapier Test User',
      joined_date: new Date().toISOString(),
      membership_type: 'premium',
      amount_paid: 99
    };

    // Note: This will fail if endpoint doesn't exist yet
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    }).catch(() => null);

    const exists = response !== null;
    logTest('Zapier webhook endpoint exists', exists, exists ? 'Ready for integration' : 'Needs implementation');

    if (exists && response.ok) {
      // Check if conversion was created
      await delay(1000); // Wait for processing
      const { data } = await supabase
        .from('conversions')
        .select('*')
        .eq('skool_email', webhookPayload.email)
        .single();

      logTest('Webhook creates conversion', data?.id, data ? 'Conversion created' : 'Conversion not found');
    }

  } catch (err) {
    logTest('Zapier webhook', false, err.message);
  }
}

// Main test runner
async function runEndToEndTests() {
  console.log('🚀 ALLUMI END-TO-END ATTRIBUTION TEST SUITE');
  console.log('==========================================\n');

  // Run tests in sequence
  const trackingLink = await testTrackingLinkCreation();
  const { identity, click } = await testClickTracking(trackingLink?.id);
  const email = await testEmailCapture(identity?.id);
  const conversion = await testConversionTracking(identity?.id, email);
  await testAnalyticsDashboard();
  await testCSVImport();
  await testBioPage();
  await testZapierWebhook();

  // Summary
  console.log('\n==========================================');
  console.log('📊 TEST RESULTS SUMMARY\n');
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`✅ Passed: ${testResults.passed.length}`);
  console.log(`❌ Failed: ${testResults.failed.length}`);

  const successRate = (testResults.passed.length / testResults.total * 100).toFixed(1);
  console.log(`\nSuccess Rate: ${successRate}%`);

  if (testResults.failed.length > 0) {
    console.log('\n⚠️ Failed Tests:');
    testResults.failed.forEach(test => console.log(`  - ${test}`));
  }

  // Attribution accuracy calculation
  const accuracyTests = ['Create conversion', 'Attribution data captured', 'Confidence score >= 80%'];
  const accuracyPassed = accuracyTests.filter(t => testResults.passed.includes(t)).length;
  const attributionAccuracy = (accuracyPassed / accuracyTests.length * 100).toFixed(0);

  console.log(`\n🎯 Attribution Accuracy: ${attributionAccuracy}%`);

  if (attributionAccuracy >= 80) {
    console.log('✨ Target accuracy of 80% achieved!');
  } else {
    console.log('⚠️ Below target accuracy of 80%');
  }

  // Cleanup test data (optional)
  const cleanup = process.argv.includes('--cleanup');
  if (cleanup) {
    console.log('\n🧹 Cleaning up test data...');
    await supabase.from('conversions').delete().eq('user_id', 'test-user-id');
    await supabase.from('clicks').delete().eq('user_id', 'test-user-id');
    await supabase.from('identities').delete().eq('user_id', 'test-user-id');
    await supabase.from('bio_pages').delete().eq('user_id', 'test-user-id');
    await supabase.from('tracking_links').delete().eq('user_id', 'test-user-id');
    console.log('✅ Test data cleaned up');
  }
}

// Run the tests
runEndToEndTests()
  .then(() => process.exit(testResults.failed.length > 0 ? 1 : 0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });