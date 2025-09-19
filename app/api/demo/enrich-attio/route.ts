import { NextRequest, NextResponse } from 'next/server';

interface EnrichmentRequest {
  email: string;
  firstName: string;
  skoolUrl?: string;
  source: 'demo' | 'audit' | 'community' | 'trial';
  captureType: 'email_only' | 'email_and_url' | 'community_join';
}

export async function POST(request: NextRequest) {
  try {
    const data: EnrichmentRequest = await request.json();

    // Validate required fields
    if (!data.email || !data.firstName) {
      return NextResponse.json(
        { error: 'Email and first name are required' },
        { status: 400 }
      );
    }

    // Extract Skool username if URL provided
    let skoolUsername: string | undefined;
    if (data.skoolUrl) {
      const match = data.skoolUrl.match(/@([^/?#]+)/);
      skoolUsername = match ? match[1] : undefined;
    }

    // Create enrichment data object
    const enrichmentData = {
      email: data.email,
      firstName: data.firstName,
      skoolUrl: data.skoolUrl,
      skoolUsername,
      source: data.source,
      captureType: data.captureType,
      capturedAt: new Date().toISOString(),
      leadScore: calculateLeadScore(data)
    };

    // Log the enrichment for debugging
    console.log('Demo capture enrichment:', {
      email: data.email,
      firstName: data.firstName,
      skoolUrl: data.skoolUrl,
      skoolUsername,
      source: data.source
    });

    // Note: Actual Attio enrichment happens through MCP on the client side
    // This endpoint prepares and validates the data

    return NextResponse.json({
      success: true,
      message: 'Enrichment data prepared',
      data: enrichmentData
    });

  } catch (error) {
    console.error('Enrichment error:', error);
    return NextResponse.json(
      { error: 'Failed to prepare enrichment data' },
      { status: 500 }
    );
  }
}

function calculateLeadScore(data: EnrichmentRequest): number {
  let score = 0;

  // Base score for providing email
  score += 30;

  // Additional score for first name
  score += 20;

  // Bonus for Skool URL
  if (data.skoolUrl) {
    score += 30;
  }

  // Source-based scoring
  switch(data.source) {
    case 'demo':
      score += 20;
      break;
    case 'trial':
      score += 15;
      break;
    case 'audit':
      score += 10;
      break;
    case 'community':
      score += 5;
      break;
  }

  return Math.min(100, score);
}