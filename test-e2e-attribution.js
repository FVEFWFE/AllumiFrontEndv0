const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  'https://fyvxgciqfifjsycibikn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dnhnY2lxZmlmanN5Y2liaWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc3OTk2NywiZXhwIjoyMDczMzU1OTY3fQ.ZDCs4ugkEVlmq0ujnC-Mf3Pn3ejJwdgPEd81gZZ-maU'
);

// Test configuration
const BASE_URL = 'http://localhost:3004';
let TEST_USER_ID = null; // Will be set dynamically

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testE2EAttribution() {
  log('🚀 Starting End-to-End Attribution Test\n', 'blue');

  let results = {
    linkCreation: false,
    clickTracking: false,
    conversionTracking: false,
    attribution: false,
    analytics: false
  };

  try {
    // ==========================
    // STEP 0: Create or Get Test User
    // ==========================
    log('📌 Step 0: Setting up test user...', 'yellow');

    const testEmail = `test-${Date.now()}@allumi.com`;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'testpass123',
      email_confirm: true
    });

    if (authError) {
      // Try to get existing test user
      const { data: users } = await supabase.auth.admin.listUsers();
      const testUser = users?.users?.find(u => u.email.includes('test') && u.email.includes('allumi.com'));
      if (testUser) {
        TEST_USER_ID = testUser.id;
        log('✓ Using existing test user', 'green');
      } else {
        throw new Error('Could not create or find test user');
      }
    } else {
      TEST_USER_ID = authData?.user?.id;
      log('✓ Created new test user', 'green');
    }
    log(`  User ID: ${TEST_USER_ID}\n`);

    // Ensure user exists in public.users table
    await supabase
      .from('users')
      .upsert({
        id: TEST_USER_ID,
        email: testEmail,
        created_at: new Date().toISOString()
      })
      .select();

    // ==========================
    // STEP 1: Create Tracking Link
    // ==========================
    log('📌 Step 1: Creating tracking link...', 'yellow');

    const linkResponse = await fetch(`${BASE_URL}/api/links/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: TEST_USER_ID,
        destinationUrl: 'https://skool.com/test-community',
        campaignName: 'e2e-test-campaign',
        utmSource: 'twitter',
        utmMedium: 'social',
        utmCampaign: 'test-campaign-2024'
      })
    });

    const linkData = await linkResponse.json();

    if (linkData.success) {
      results.linkCreation = true;
      log('✓ Link created successfully', 'green');
      log(`  Short URL: ${linkData.shortUrl}`);
      log(`  Short ID: ${linkData.shortId}\n`);
    } else {
      console.error('Link creation failed:', linkData);
      throw new Error(linkData.error || 'Failed to create link');
    }

    // ==========================
    // STEP 2: Simulate Click
    // ==========================
    log('📌 Step 2: Simulating click on tracking link...', 'yellow');

    const clickResponse = await fetch(`${BASE_URL}/l/${linkData.shortId}`, {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Test Browser)',
        'X-Forwarded-For': '192.168.1.100'
      }
    });

    if (clickResponse.status === 307 || clickResponse.status === 302) {
      results.clickTracking = true;
      log('✓ Click tracked successfully', 'green');

      // Verify click was recorded
      const { data: clicks } = await supabase
        .from('clicks')
        .select('*')
        .eq('short_id', linkData.shortId)
        .order('clicked_at', { ascending: false })
        .limit(1);

      if (clicks && clicks.length > 0) {
        log(`  Click ID: ${clicks[0].id}`);
        log(`  Campaign: ${clicks[0].campaign_name}\n`);
      }
    }

    await sleep(1000); // Wait for click to be processed

    // ==========================
    // STEP 3: Track Conversion
    // ==========================
    log('📌 Step 3: Tracking conversion with attribution...', 'yellow');

    const conversionResponse = await fetch(`${BASE_URL}/api/conversions/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skool_email: 'test-member@example.com',
        skool_name: 'Test Member',
        skool_username: 'testmember',
        joined_at: new Date().toISOString(),
        membership_type: 'paid',
        price_paid: 59,
        allumi_id: linkData.shortId // Direct attribution
      })
    });

    const conversionData = await conversionResponse.json();

    if (conversionData.success !== false) {
      results.conversionTracking = true;
      log('✓ Conversion tracked successfully', 'green');
      log(`  Conversion ID: ${conversionData.conversion_id}`);
      log(`  Attributed: ${conversionData.attributed ? 'Yes' : 'No'}`);
      log(`  Confidence Score: ${conversionData.confidence_score}%`);

      if (conversionData.attributed) {
        results.attribution = true;
        log(`  Revenue Attributed: $${Object.values(conversionData.revenue_attributed)[0] || 0}\n`);
      }
    }

    // ==========================
    // STEP 4: Test Webhook
    // ==========================
    log('📌 Step 4: Testing Skool webhook...', 'yellow');

    const webhookResponse = await fetch(`${BASE_URL}/api/webhooks/skool`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'member.joined',
        email: 'webhook-test@example.com',
        name: 'Webhook Test User',
        username: 'webhooktest',
        joined_at: new Date().toISOString(),
        membership_type: 'free',
        price_paid: 0,
        referrer_tracking_id: linkData.shortId
      })
    });

    const webhookData = await webhookResponse.json();

    if (webhookData.success) {
      log('✓ Webhook processed successfully', 'green');
      log(`  Event: member.joined`);
      log(`  Attributed: ${webhookData.attributed ? 'Yes' : 'No'}\n`);
    }

    // ==========================
    // STEP 5: Verify Analytics
    // ==========================
    log('📌 Step 5: Verifying analytics data...', 'yellow');

    // Check conversions table
    const { data: conversions } = await supabase
      .from('conversions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2);

    if (conversions && conversions.length > 0) {
      results.analytics = true;
      log('✓ Analytics data verified', 'green');
      log(`  Total conversions tracked: ${conversions.length}`);

      const attributed = conversions.filter(c => c.attributed_link_id).length;
      log(`  Attributed conversions: ${attributed}`);

      const totalRevenue = conversions.reduce((sum, c) => sum + (c.revenue_tracked || 0), 0);
      log(`  Total revenue tracked: $${totalRevenue}\n`);
    }

    // ==========================
    // STEP 6: Test CSV Import
    // ==========================
    log('📌 Step 6: Testing CSV import...', 'yellow');

    // Simulate CSV data
    const csvMembers = [
      {
        email: 'csv-test1@example.com',
        name: 'CSV Test 1',
        username: 'csvtest1',
        joined_date: '2024-01-20',
        membership_type: 'paid',
        amount_paid: 59,
        referrer: `https://skool.com/test?allumi_id=${linkData.shortId}`
      },
      {
        email: 'csv-test2@example.com',
        name: 'CSV Test 2',
        username: 'csvtest2',
        joined_date: '2024-01-20',
        membership_type: 'free',
        amount_paid: 0,
        referrer: ''
      }
    ];

    let csvAttributed = 0;
    for (const member of csvMembers) {
      const response = await fetch(`${BASE_URL}/api/conversions/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skool_email: member.email,
          skool_name: member.name,
          skool_username: member.username,
          joined_at: member.joined_date,
          membership_type: member.membership_type,
          price_paid: member.amount_paid,
          allumi_id: member.referrer.includes('allumi_id') ? linkData.shortId : undefined
        })
      });

      const result = await response.json();
      if (result.attributed) csvAttributed++;
    }

    log('✓ CSV import simulated', 'green');
    log(`  Members imported: ${csvMembers.length}`);
    log(`  Attributed: ${csvAttributed}\n`);

    // ==========================
    // RESULTS SUMMARY
    // ==========================
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'magenta');
    log('📊 TEST RESULTS SUMMARY', 'magenta');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'magenta');

    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(v => v).length;

    Object.entries(results).forEach(([test, passed]) => {
      const icon = passed ? '✓' : '✗';
      const color = passed ? 'green' : 'red';
      log(`${icon} ${test.replace(/([A-Z])/g, ' $1').trim()}: ${passed ? 'PASSED' : 'FAILED'}`, color);
    });

    log('');
    log(`Total: ${passedTests}/${totalTests} tests passed`, passedTests === totalTests ? 'green' : 'yellow');

    if (passedTests === totalTests) {
      log('\n🎉 All tests passed! Attribution system is working correctly.', 'green');
    } else {
      log('\n⚠️ Some tests failed. Please check the attribution system.', 'red');
    }

    // ==========================
    // CLEANUP
    // ==========================
    log('\n🧹 Cleaning up test data...', 'yellow');

    // Delete test conversions
    await supabase
      .from('conversions')
      .delete()
      .in('skool_email', [
        'test-member@example.com',
        'webhook-test@example.com',
        'csv-test1@example.com',
        'csv-test2@example.com'
      ]);

    log('✓ Test data cleaned up', 'green');

  } catch (error) {
    log(`\n❌ Test failed with error: ${error.message}`, 'red');
    console.error(error);
  }
}

// Run the test
log('Allumi Attribution System - End-to-End Test', 'magenta');
log('════════════════════════════════════════════\n', 'magenta');

testE2EAttribution().catch(console.error);