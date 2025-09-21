const crypto = require('crypto');

// Test Whop webhook endpoint
const WEBHOOK_URL = 'http://localhost:3005/api/webhooks/whop';
const WEBHOOK_SECRET = 'ws_2da9fdb5e2cfd79c4cb668767da6d19439aebfad60393d25124c65de44076ec0'; // Full secret from Whop

// Test events
const testEvents = [
  {
    id: 'evt_test_' + Date.now(),
    type: 'subscription.created',
    data: {
      customer: {
        id: 'cus_test123',
        email: 'test@allumi.com',
        name: 'Test User'
      },
      plan: {
        id: 'plan_ufRzE7PHJgEXR',
        name: 'Allumi Beta',
        price: 5900 // $59.00 in cents
      },
      status: 'active',
      affiliate: {
        code: 'TEST40',
        commission: 40 // 40% commission
      }
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'evt_test_payment_' + Date.now(),
    type: 'payment.succeeded',
    data: {
      customer: {
        id: 'cus_test123',
        email: 'test@allumi.com'
      },
      amount: 5900,
      currency: 'usd',
      description: 'Subscription payment for Allumi Beta'
    },
    created_at: new Date().toISOString()
  }
];

async function testWebhook(event) {
  const payload = JSON.stringify(event);

  // Create signature (would normally be done by Whop)
  const signature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  console.log(`\n📮 Sending ${event.type} webhook...`);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Whop-Signature': signature
      },
      body: payload
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✅ Success: ${JSON.stringify(result)}`);
    } else {
      console.log(`❌ Error: ${response.status} - ${JSON.stringify(result)}`);
    }
  } catch (error) {
    console.error(`❌ Failed to send webhook:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Testing Whop Webhook Integration');
  console.log('====================================\n');

  // First, check if endpoint is reachable
  console.log('🔍 Checking webhook endpoint status...');
  try {
    const statusResponse = await fetch(WEBHOOK_URL.replace('/whop', '/whop'), {
      method: 'GET'
    });

    if (statusResponse.ok) {
      const status = await statusResponse.json();
      console.log('✅ Webhook endpoint is ready');
      console.log(`   Events supported: ${status.events?.join(', ') || 'Various'}`);
    } else {
      console.log('⚠️ Webhook endpoint returned status:', statusResponse.status);
    }
  } catch (error) {
    console.log('❌ Cannot reach webhook endpoint. Make sure the server is running.');
    return;
  }

  // Test each event
  for (const event of testEvents) {
    await testWebhook(event);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait between events
  }

  console.log('\n✨ Webhook testing complete!');
  console.log('\nNext steps:');
  console.log('1. Check Supabase dashboard for whop_events table entries');
  console.log('2. Verify user subscription status was updated');
  console.log('3. Configure the real webhook URL in Whop dashboard');
  console.log('4. Get the full webhook secret from Whop and update .env.local');
}

// Run tests
runTests().catch(console.error);