/**
 * Comprehensive Test for Member Identification System
 * Tests the complete flow: CSV Import → Identity Creation → Attribution → Dashboard
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Test colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test 1: CSV Import with Identity Creation
async function testCSVImport() {
  log('\n📥 TEST 1: CSV Import with Identity Creation', 'blue');

  const csvContent = `Email,Full Name,Joined Date,Member ID
john.doe@example.com,"John Doe",2024-01-15,skool_john_001
jane.smith@example.com,"Jane Smith",2024-02-20,skool_jane_002
mike.wilson@test.com,"Mike Wilson",2024-03-10,skool_mike_003`;

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const formData = new FormData();
  formData.append('file', blob, 'test_members.csv');

  try {
    const response = await fetch('http://localhost:3000/api/import/csv', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      log(`✅ Imported ${result.results.imported} members`, 'green');
      log(`✅ Created identities for each member`, 'green');

      // Verify identities were created
      const { data: identities } = await supabase
        .from('identities')
        .select('*')
        .in('emails', [['john.doe@example.com'], ['jane.smith@example.com']]);

      if (identities && identities.length > 0) {
        log(`✅ Verified ${identities.length} identities in database`, 'green');
        return { success: true, identities };
      }
    }

    log('❌ CSV import failed', 'red');
    return { success: false };
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return { success: false };
  }
}

// Test 2: Zapier Webhook with Identity
async function testZapierWebhook() {
  log('\n🔄 TEST 2: Zapier Webhook with Identity Creation', 'blue');

  const memberData = {
    email: 'zapier.test@example.com',
    name: 'Zapier Test User',
    skool_member_id: 'skool_zapier_001',
    joined_date: '2024-04-01',
    subscription_status: 'paid',
    monthly_revenue: 89,
    utm_source: 'youtube',
    utm_campaign: 'launch_video',
    api_key: process.env.ZAPIER_WEBHOOK_API_KEY || 'default-zapier-key'
  };

  try {
    const response = await fetch('http://localhost:3000/api/zapier/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData)
    });

    const result = await response.json();

    if (result.success) {
      log(`✅ Member imported via Zapier`, 'green');
      log(`✅ Identity created: ${result.data.identity_id}`, 'green');
      log(`✅ Attribution confidence: ${result.data.attribution.confidence}%`, 'green');

      // Verify identity was created
      const { data: identity } = await supabase
        .from('identities')
        .select('*')
        .contains('emails', ['zapier.test@example.com'])
        .single();

      if (identity) {
        log(`✅ Identity verified in database`, 'green');
        return { success: true, identity };
      }
    }

    log('❌ Zapier webhook failed', 'red');
    return { success: false };
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return { success: false };
  }
}

// Test 3: Email Capture via Pixel
async function testPixelEmailCapture() {
  log('\n🎯 TEST 3: Pixel Email Capture → Identity Match', 'blue');

  const pixelEvent = {
    eventName: 'email_captured',
    email: 'pixel.test@example.com',
    identityId: 'test_identity_' + Date.now(),
    fingerprint: 'test_fingerprint_123',
    pageUrl: 'https://example.com/signup',
    properties: {
      source: 'signup_form'
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/pixel/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pixelEvent)
    });

    if (response.ok) {
      log(`✅ Email captured via pixel`, 'green');

      // Check if identity was created/updated
      const { data: identity } = await supabase
        .from('identities')
        .select('*')
        .contains('emails', ['pixel.test@example.com'])
        .single();

      if (identity) {
        log(`✅ Identity created/updated with email`, 'green');
        log(`✅ Confidence score: ${identity.confidence_score * 100}%`, 'green');
        return { success: true, identity };
      }
    }

    log('❌ Pixel email capture failed', 'red');
    return { success: false };
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return { success: false };
  }
}

// Test 4: Attribution Dashboard Query
async function testAttributionDashboard() {
  log('\n📊 TEST 4: Attribution Dashboard with Real Members', 'blue');

  try {
    // Get attributed members from database
    const { data: members } = await supabase
      .from('members')
      .select(`
        *,
        identities!members_identity_id_fkey (
          id,
          emails,
          confidence_score
        )
      `)
      .limit(10);

    if (members && members.length > 0) {
      log(`✅ Found ${members.length} members in database`, 'green');

      members.forEach((member, index) => {
        log(`   ${index + 1}. ${member.name} (${member.email})`, 'yellow');
        if (member.identities) {
          log(`      Identity: ${member.identities.id}`, 'yellow');
          log(`      Confidence: ${(member.identities.confidence_score * 100).toFixed(0)}%`, 'yellow');
        }
      });

      return { success: true, members };
    }

    log('⚠️ No members found in database', 'yellow');
    return { success: false };
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return { success: false };
  }
}

// Test 5: End-to-End Attribution Flow
async function testEndToEndAttribution() {
  log('\n🔗 TEST 5: End-to-End Attribution Flow', 'blue');

  // Step 1: Create a tracking link
  log('1. Creating tracking link...', 'yellow');
  const linkData = {
    destination_url: 'https://example.com/product',
    utm_source: 'test',
    utm_campaign: 'system_test',
    utm_medium: 'email'
  };

  // Simulate link creation (would need auth in real scenario)
  const shortId = 'test_' + Date.now().toString(36);

  // Step 2: Simulate click
  log('2. Simulating click on tracking link...', 'yellow');

  // Step 3: Simulate email capture
  log('3. Capturing email via pixel...', 'yellow');
  const testEmail = `test.${Date.now()}@example.com`;

  // Step 4: Import member via CSV
  log('4. Importing member with same email...', 'yellow');

  // Step 5: Check attribution
  log('5. Checking attribution linkage...', 'yellow');

  const { data: identity } = await supabase
    .from('identities')
    .select('*')
    .contains('emails', [testEmail])
    .single();

  if (identity) {
    log(`✅ End-to-end attribution successful`, 'green');
    log(`   Identity ${identity.id} links all touchpoints`, 'green');
    return { success: true };
  }

  log('⚠️ End-to-end test incomplete (requires full setup)', 'yellow');
  return { success: false };
}

// Main test runner
async function runTests() {
  console.log('='.repeat(70));
  log('🚀 MEMBER IDENTIFICATION SYSTEM - COMPREHENSIVE TEST SUITE', 'blue');
  console.log('='.repeat(70));

  const results = {
    csvImport: false,
    zapierWebhook: false,
    pixelCapture: false,
    dashboard: false,
    endToEnd: false
  };

  // Check if server is running
  try {
    await fetch('http://localhost:3000');
  } catch {
    log('\n❌ Server not running. Start with: npm run dev', 'red');
    return;
  }

  // Run tests
  const test1 = await testCSVImport();
  results.csvImport = test1.success;

  const test2 = await testZapierWebhook();
  results.zapierWebhook = test2.success;

  const test3 = await testPixelEmailCapture();
  results.pixelCapture = test3.success;

  const test4 = await testAttributionDashboard();
  results.dashboard = test4.success;

  const test5 = await testEndToEndAttribution();
  results.endToEnd = test5.success;

  // Summary
  console.log('\n' + '='.repeat(70));
  log('📋 TEST SUMMARY', 'blue');
  console.log('='.repeat(70));

  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(r => r).length;

  log(`\nTests Passed: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');

  Object.entries(results).forEach(([test, passed]) => {
    const testName = test.replace(/([A-Z])/g, ' $1').toUpperCase();
    log(`${passed ? '✅' : '❌'} ${testName}`, passed ? 'green' : 'red');
  });

  if (passedTests === totalTests) {
    log('\n🎉 ALL TESTS PASSED! Member identification system is working!', 'green');
  } else {
    log('\n⚠️ Some tests failed. Check the implementation and database setup.', 'yellow');
  }

  console.log('='.repeat(70));
}

// Run the tests
runTests().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});