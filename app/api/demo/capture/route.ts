import { NextRequest, NextResponse } from 'next/server';

interface DemoCaptureData {
  email: string;
  firstName: string;
  skoolUrl?: string | null;
  source: 'demo' | 'audit' | 'community' | 'trial';
  captureType: 'email_only' | 'email_and_url' | 'community_join';
}

interface EnrichmentData {
  communityName?: string;
  memberCount?: number;
  estimatedMrr?: number;
  category?: string;
  isWhale?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const data: DemoCaptureData = await request.json();

    // Validate required fields
    if (!data.email || !data.firstName) {
      return NextResponse.json(
        { error: 'Email and first name are required' },
        { status: 400 }
      );
    }

    // Initialize enrichment data
    let enrichmentData: EnrichmentData = {};

    // If Skool URL provided, attempt enrichment
    if (data.skoolUrl) {
      enrichmentData = await enrichSkoolProfile(data.skoolUrl);
    }

    // Save to database (replace with your actual database logic)
    const captureResult = await saveCaptureEvent({
      ...data,
      enrichment: enrichmentData,
      capturedAt: new Date().toISOString(),
      // Calculate quality score based on data completeness
      qualityScore: calculateQualityScore(data, enrichmentData)
    });

    // Send to Attio CRM if configured
    if (process.env.ATTIO_API_KEY) {
      await sendToAttio({
        email: data.email,
        firstName: data.firstName,
        skoolUrl: data.skoolUrl,
        ...enrichmentData,
        source: data.source,
        captureType: data.captureType
      });
    }

    // Track event in PostHog if configured
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      await trackInPostHog({
        distinctId: data.email,
        event: 'demo_capture',
        properties: {
          source: data.source,
          hasSkoolUrl: !!data.skoolUrl,
          enrichmentSuccess: Object.keys(enrichmentData).length > 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Information captured successfully',
      enriched: Object.keys(enrichmentData).length > 0,
      data: {
        // Return some data for immediate UI feedback
        communityName: enrichmentData.communityName,
        memberCount: enrichmentData.memberCount
      }
    });

  } catch (error) {
    console.error('Demo capture error:', error);
    return NextResponse.json(
      { error: 'Failed to capture information' },
      { status: 500 }
    );
  }
}

// Enrichment function - matches Skool URL to scraped database
async function enrichSkoolProfile(skoolUrl: string): Promise<EnrichmentData> {
  try {
    // Extract username from URL
    const username = extractSkoolUsername(skoolUrl);
    if (!username) return {};

    // TODO: Query your scraped database here
    // For now, return mock data for testing
    const mockData: EnrichmentData = {
      communityName: `${username}'s Community`,
      memberCount: Math.floor(Math.random() * 5000) + 100,
      estimatedMrr: 0,
      category: 'Business',
      isWhale: false
    };

    // Calculate estimated MRR (assuming $50 average price)
    mockData.estimatedMrr = mockData.memberCount * 50;
    mockData.isWhale = mockData.estimatedMrr > 10000;

    return mockData;
  } catch (error) {
    console.error('Enrichment error:', error);
    return {};
  }
}

// Extract username from various Skool URL formats
function extractSkoolUsername(url: string): string | null {
  try {
    // Handle various formats:
    // https://www.skool.com/@username?g=groupname
    // skool.com/@username
    // @username
    // username

    let cleanUrl = url.toLowerCase().trim();

    // Remove protocol if present
    cleanUrl = cleanUrl.replace(/^https?:\/\//, '');

    // Remove www. if present
    cleanUrl = cleanUrl.replace(/^www\./, '');

    // Extract username from Skool URL
    if (cleanUrl.includes('skool.com')) {
      const match = cleanUrl.match(/skool\.com\/@([^/?]+)/);
      if (match && match[1]) {
        return match[1];
      }
    } else {
      // Handle just username or @username
      cleanUrl = cleanUrl.replace(/^@/, '');
      // Remove any query parameters
      cleanUrl = cleanUrl.split('?')[0];
      // Remove any slashes
      cleanUrl = cleanUrl.replace(/\//g, '');

      return cleanUrl || null;
    }

    return null;
  } catch {
    return null;
  }
}

// Calculate lead quality score based on data completeness
function calculateQualityScore(
  data: DemoCaptureData,
  enrichment: EnrichmentData
): number {
  let score = 0;

  // Base score for email capture
  score += 30;

  // Additional points for Skool URL
  if (data.skoolUrl) score += 20;

  // Points for successful enrichment
  if (enrichment.communityName) score += 10;
  if (enrichment.memberCount) score += 10;

  // Bonus for whale status
  if (enrichment.isWhale) score += 30;

  return Math.min(100, score);
}

// Mock database save function (replace with actual implementation)
async function saveCaptureEvent(data: any) {
  // TODO: Implement actual database save
  console.log('Saving capture event:', data);
  return { id: Date.now().toString() };
}

// Send to Attio CRM
async function sendToAttio(data: any) {
  if (!process.env.ATTIO_API_KEY) return;

  try {
    const response = await fetch('https://api.attio.com/v2/people', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ATTIO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          values: {
            email_addresses: [{ email_address: data.email }],
            name: [{ first_name: data.firstName }],
            // Add custom attributes based on your Attio configuration
            skool_url: data.skoolUrl,
            email_source: data.source,
            estimated_mrr: data.estimatedMrr,
            is_whale: data.isWhale
          }
        }
      })
    });

    if (!response.ok) {
      console.error('Attio API error:', await response.text());
    }
  } catch (error) {
    console.error('Failed to send to Attio:', error);
  }
}

// Track in PostHog
async function trackInPostHog(data: any) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  try {
    const response = await fetch('https://app.posthog.com/capture/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
        distinct_id: data.distinctId,
        event: data.event,
        properties: data.properties,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      console.error('PostHog tracking error:', await response.text());
    }
  } catch (error) {
    console.error('Failed to track in PostHog:', error);
  }
}