import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the test webhook
    console.log('Test webhook received:', body);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Webhook endpoint is working correctly',
        received: body,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process test webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Allow GET requests for easy testing
  return NextResponse.json(
    {
      status: 'ready',
      message: 'Webhook endpoint is ready to receive POST requests',
      endpoint: '/api/webhooks/test',
      method: 'POST',
      expectedBody: {
        test: true,
        data: 'Your test data here'
      }
    },
    { status: 200 }
  );
}