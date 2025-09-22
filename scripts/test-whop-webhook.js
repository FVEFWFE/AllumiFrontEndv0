const crypto = require('crypto');
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function testWhopWebhook() {
  console.log('🎯 Testing Whop Webhook\n');
  console.log('=' .repeat(50));

  // Simulate a Whop webhook payload
  const webhookPayload = {
    action: 'payment.succeeded',
    data: {
      id: 'pay_' + Date.now(),
      status: 'completed',
      customer: {
        id: 'cus_test_' + Date.now(),
        email: 'test_webhook@allumi.com',
        name: 'Test Webhook User'
      },
      product: {
        id: 'prod_allumi',
        name: 'Allumi Pro',
        price: 5900 // $59 in cents
      },
      metadata: {
        user_id: 'ab54ac98-06ec-4eb8-a771-182d23c88665',
        source: 'webhook_test'
      },
      created_at: new Date().toISOString()
    }
  };

  // Create webhook signature (simplified for testing)
  const webhookSecret = process.env.WHOP_WEBHOOK_SECRET || 'test_secret';
  const payloadString = JSON.stringify(webhookPayload);
  const signature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payloadString)
    .digest('hex');

  console.log('📝 Webhook Payload:', {
    action: webhookPayload.action,
    customer_email: webhookPayload.data.customer.email,
    amount: webhookPayload.data.product.price / 100
  });

  console.log('\n🔐 Signature:', signature.substring(0, 20) + '...');

  try {
    // Send webhook to local endpoint
    console.log('\n📤 Sending webhook to http://localhost:3000/api/webhooks/whop');

    const response = await fetch('http://localhost:3000/api/webhooks/whop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Whop-Signature': signature,
        'X-Webhook-Secret': webhookSecret
      },
      body: payloadString
    });

    const responseText = await response.text();

    console.log('\n📥 Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers));

    if (response.ok) {
      console.log('✅ Webhook processed successfully!');
      console.log('Response:', responseText);
    } else {
      console.log('❌ Webhook failed:', response.status, response.statusText);
      console.log('Error:', responseText);
    }

    // Test subscription.created webhook
    console.log('\n' + '='.repeat(50));
    console.log('\n🔄 Testing subscription.created webhook...\n');

    const subscriptionPayload = {
      action: 'subscription.created',
      data: {
        id: 'sub_' + Date.now(),
        status: 'active',
        customer: {
          id: 'cus_test_' + Date.now(),
          email: 'test_subscription@allumi.com',
          name: 'Test Subscription User'
        },
        product: {
          id: 'prod_allumi_monthly',
          name: 'Allumi Monthly',
          price: 5900
        },
        interval: 'month',
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      }
    };

    const subPayloadString = JSON.stringify(subscriptionPayload);
    const subSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(subPayloadString)
      .digest('hex');

    console.log('📝 Subscription Payload:', {
      action: subscriptionPayload.action,
      customer_email: subscriptionPayload.data.customer.email,
      interval: subscriptionPayload.data.interval
    });

    const subResponse = await fetch('http://localhost:3000/api/webhooks/whop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Whop-Signature': subSignature,
        'X-Webhook-Secret': webhookSecret
      },
      body: subPayloadString
    });

    const subResponseText = await subResponse.text();

    if (subResponse.ok) {
      console.log('✅ Subscription webhook processed successfully!');
    } else {
      console.log('❌ Subscription webhook failed:', subResponse.status);
      console.log('Error:', subResponseText);
    }

  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 Webhook testing complete!\n');
}

// Run the test
testWhopWebhook().catch(console.error);