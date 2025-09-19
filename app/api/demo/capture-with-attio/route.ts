import { NextRequest, NextResponse } from 'next/server';

interface DemoCaptureData {
  email: string;
  firstName: string;
  skoolUrl?: string | null;
  source: 'demo' | 'audit' | 'community' | 'trial';
  captureType: 'email_only' | 'email_and_url' | 'community_join';
}

const ATTIO_API_KEY = '01f73fcc35ec1c5fb1fd6bd1556f966c6efc77beaf9fab08064a7cdb654067ac';
const ATTIO_API_URL = 'https://api.attio.com/v2';

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

    // Clean up Skool URL if provided (ensure skool.com/@username format)
    let cleanSkoolUrl: string | undefined;
    let skoolUsername: string | undefined;
    if (data.skoolUrl) {
      cleanSkoolUrl = formatSkoolUrl(data.skoolUrl);
      if (cleanSkoolUrl) {
        const match = cleanSkoolUrl.match(/@([^/?#]+)/);
        skoolUsername = match ? match[1] : undefined;
      }
    }

    // Create or update person in Attio
    const attioResult = await createOrUpdateAttioRecord({
      email: data.email,
      firstName: data.firstName,
      skoolUrl: cleanSkoolUrl,
      skoolUsername,
      source: data.source,
      captureType: data.captureType,
      leadScore: calculateLeadScore(data, cleanSkoolUrl)
    });

    return NextResponse.json({
      success: true,
      message: 'Information captured and enriched successfully',
      data: {
        email: data.email,
        firstName: data.firstName,
        skoolUrl: cleanSkoolUrl,
        skoolUsername,
        attioId: attioResult?.id
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

function formatSkoolUrl(url: string): string {
  if (!url) return '';

  // Remove any whitespace
  url = url.trim();

  // Remove protocol if present (https://, http://, www.)
  url = url.replace(/^(https?:\/\/)?(www\.)?/, '');

  // If already in correct format, return as is
  if (url.startsWith('skool.com/@')) {
    // Remove any query parameters or hash
    return url.split(/[?#]/)[0];
  }

  // Extract username from various formats
  let username = url;

  // If it contains skool.com but not in correct format
  if (url.includes('skool.com')) {
    // Try to extract username after @
    const match = url.match(/@([^/?#]+)/);
    if (match) {
      username = match[1];
    } else {
      // No @ found, return empty
      return '';
    }
  } else {
    // Just username provided (with or without @)
    username = username.replace(/^@/, '');
  }

  // Remove any trailing slashes or query params from username
  username = username.split(/[/?#]/)[0];

  // Return in correct format: skool.com/@username
  return username ? `skool.com/@${username}` : '';
}

function calculateLeadScore(data: DemoCaptureData, skoolUrl?: string): number {
  let score = 0;

  // Base score for providing email
  score += 30;

  // Additional score for first name
  score += 20;

  // Bonus for Skool URL
  if (skoolUrl) {
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

async function createOrUpdateAttioRecord(data: {
  email: string;
  firstName: string;
  skoolUrl?: string;
  skoolUsername?: string;
  source: string;
  captureType: string;
  leadScore: number;
}) {
  try {
    // First, try to find existing person by email
    const searchResponse = await fetch(`${ATTIO_API_URL}/people/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ATTIO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: {
          email_addresses: {
            email_address: data.email
          }
        }
      })
    });

    const searchResult = await searchResponse.json();
    const existingPerson = searchResult.data?.[0];

    // Prepare the person data
    const personData = {
      values: {
        email_addresses: [{ email_address: data.email }],
        name: [{ first_name: data.firstName }]
      }
    };

    // Add custom attributes if they exist in your Attio workspace
    // These may need to be adjusted based on your actual Attio schema
    const customAttributes: any = {
      demo_source: data.source,
      capture_type: data.captureType,
      lead_score: data.leadScore,
      demo_requested_at: new Date().toISOString()
    };

    if (data.skoolUrl) {
      customAttributes.skool_profile_url = data.skoolUrl;
    }
    if (data.skoolUsername) {
      customAttributes.skool_handle = data.skoolUsername;
    }

    // Add custom attributes to person data
    Object.assign(personData.values, customAttributes);

    let personId: string;

    if (existingPerson) {
      // Update existing person
      const updateResponse = await fetch(`${ATTIO_API_URL}/people/${existingPerson.id.record_id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${ATTIO_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: personData })
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('Attio update error:', errorText);
        // Continue anyway - don't fail the whole request
      }

      personId = existingPerson.id.record_id;
    } else {
      // Create new person
      const createResponse = await fetch(`${ATTIO_API_URL}/people`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ATTIO_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: personData })
      });

      if (createResponse.ok) {
        const createResult = await createResponse.json();
        personId = createResult.data.id.record_id;
      } else {
        const errorText = await createResponse.text();
        console.error('Attio create error:', errorText);
        return null;
      }
    }

    // Create a note about the demo request
    if (personId) {
      const noteText = `Demo requested from ${data.source}\n` +
        `Capture type: ${data.captureType}\n` +
        `Lead score: ${data.leadScore}/100\n` +
        (data.skoolUrl ? `Skool URL: ${data.skoolUrl}\n` : '') +
        `Timestamp: ${new Date().toISOString()}`;

      await fetch(`${ATTIO_API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ATTIO_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            parent_object: 'people',
            parent_record_id: personId,
            title: 'Demo Request',
            content: noteText,
            format: 'plaintext'
          }
        })
      });
    }

    return { id: personId };
  } catch (error) {
    console.error('Attio enrichment error:', error);
    return null;
  }
}