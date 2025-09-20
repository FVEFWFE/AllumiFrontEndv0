import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Webhook handler for Skool events (via Zapier or direct integration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract Skool event data
    const {
      event_type,
      email,
      name,
      username,
      joined_at,
      membership_type,
      price_paid,
      community_name,
      community_url,
      referrer_tracking_id, // allumi_id from URL params
      device_id, // device fingerprint if available
      webhook_secret
    } = body;

    // Verify webhook secret if provided
    const expectedSecret = process.env.SKOOL_WEBHOOK_SECRET;
    if (expectedSecret && webhook_secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Invalid webhook secret' },
        { status: 401 }
      );
    }

    // Handle different Skool events
    switch (event_type) {
      case 'member.joined':
      case 'member.upgraded':
      case 'payment.succeeded':
        // Track conversion using our conversion tracking API
        const conversionResponse = await fetch(
          `${request.nextUrl.origin}/api/conversions/track`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              skool_email: email,
              skool_name: name,
              skool_username: username,
              joined_at: joined_at || new Date().toISOString(),
              membership_type: membership_type || (price_paid > 0 ? 'paid' : 'free'),
              price_paid: price_paid || 0,
              allumi_id: referrer_tracking_id,
              device_fingerprint: device_id
            })
          }
        );

        const conversionResult = await conversionResponse.json();

        if (!conversionResponse.ok) {
          console.error('Failed to track conversion:', conversionResult);
          return NextResponse.json(
            { error: 'Failed to track conversion', details: conversionResult },
            { status: 500 }
          );
        }

        // Log successful conversion
        console.log(`✅ Skool conversion tracked:`, {
          email,
          event_type,
          conversion_id: conversionResult.conversion_id,
          attributed: conversionResult.attributed,
          confidence_score: conversionResult.confidence_score,
          revenue_attributed: conversionResult.revenue_attributed
        });

        return NextResponse.json({
          success: true,
          message: `${event_type} conversion tracked successfully`,
          conversion_id: conversionResult.conversion_id,
          attributed: conversionResult.attributed,
          attribution: conversionResult.attribution
        });

      case 'member.cancelled':
      case 'member.churned':
        // Handle churn events (update user status)
        console.log(`Member churned: ${email}`);
        // TODO: Update user status in database
        return NextResponse.json({
          success: true,
          message: `${event_type} event processed`
        });

      default:
        console.log(`Unknown Skool event type: ${event_type}`);
        return NextResponse.json({
          success: true,
          message: `Event ${event_type} received but not processed`
        });
    }

  } catch (error) {
    console.error('Skool webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to verify webhook is working
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/webhooks/skool',
    accepted_events: [
      'member.joined',
      'member.upgraded',
      'payment.succeeded',
      'member.cancelled',
      'member.churned'
    ],
    instructions: {
      zapier: 'Use this URL as webhook destination in Zapier',
      direct: 'Send POST requests with event data and optional webhook_secret',
      tracking: 'Include referrer_tracking_id (allumi_id) and device_id for attribution'
    }
  });
}