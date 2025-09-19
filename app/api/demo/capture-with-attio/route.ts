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
      message: attioResult?.enrichedSkoolProfile ?
        'Successfully enriched existing Skool profile with email!' :
        attioResult?.wasExisting ?
        'Updated existing record' :
        'New record created successfully',
      data: {
        email: data.email,
        firstName: data.firstName,
        skoolUrl: cleanSkoolUrl,
        skoolUsername,
        attioId: attioResult?.id,
        enrichedSkoolProfile: attioResult?.enrichedSkoolProfile || false,
        wasExisting: attioResult?.wasExisting || false
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
    let existingRecord: any = null;
    let searchedBySkool = false;

    // PRIORITY 1: If we have a Skool username, search by that FIRST
    // This is because you already have Skool profiles without emails
    if (data.skoolUsername || data.skoolUrl) {
      console.log('Searching for existing Skool profile:', data.skoolUsername || data.skoolUrl);

      // Search by Skool Profile URL or username
      const skoolSearchResponse = await fetch(`${ATTIO_API_URL}/objects/people/records/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ATTIO_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filter: {
            or: [
              // Search by exact Skool Profile URL
              data.skoolUrl ? {
                attribute: 'skool_profile_url',
                relation: 'equals',
                value: data.skoolUrl
              } : null,
              // Also search by username pattern in Skool Profile URL
              data.skoolUsername ? {
                attribute: 'skool_profile_url',
                relation: 'contains',
                value: `@${data.skoolUsername}`
              } : null
            ].filter(Boolean)
          }
        })
      });

      if (skoolSearchResponse.ok) {
        const skoolResult = await skoolSearchResponse.json();
        if (skoolResult.data && skoolResult.data.length > 0) {
          existingRecord = skoolResult.data[0];
          searchedBySkool = true;
          console.log('Found existing Skool profile:', existingRecord.id?.record_id);
        }
      }
    }

    // PRIORITY 2: If no Skool match found, search by email
    if (!existingRecord) {
      console.log('No Skool profile found, searching by email:', data.email);
      const emailSearchResponse = await fetch(`${ATTIO_API_URL}/objects/people/records/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ATTIO_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filter: {
            attribute: 'email_addresses',
            relation: 'contains',
            value: data.email
          }
        })
      });

      if (emailSearchResponse.ok) {
        const emailResult = await emailSearchResponse.json();
        if (emailResult.data && emailResult.data.length > 0) {
          existingRecord = emailResult.data[0];
          console.log('Found existing record by email:', existingRecord.id?.record_id);
        }
      }
    }

    // Prepare the person data
    const personData: any = {
      values: {}
    };

    // IMPORTANT: Only add email if it doesn't exist or if we're creating new
    // This prevents overwriting existing emails
    if (!existingRecord || !existingRecord.values?.email_addresses?.length) {
      personData.values.email_addresses = [{ email_address: data.email }];
    } else if (searchedBySkool && existingRecord) {
      // We found by Skool and they have no email - ADD the email!
      const hasEmail = existingRecord.values?.email_addresses?.some((e: any) =>
        e.email_address === data.email
      );
      if (!hasEmail) {
        personData.values.email_addresses = [
          ...(existingRecord.values.email_addresses || []),
          { email_address: data.email }
        ];
      }
    }

    // Only update name if not present
    if (!existingRecord || !existingRecord.values?.name?.length) {
      personData.values.name = [{ first_name: data.firstName }];
    }

    // Add/update custom attributes - using the actual Attio field names from your schema
    // Note: Some of these might need to be arrays or specific formats

    // Always update these demo-specific fields
    personData.values.demo_source = data.source;
    personData.values.demo_capture_type = data.captureType;
    personData.values.demo_lead_score = data.leadScore;
    personData.values.demo_requested_at = new Date().toISOString();

    // Only add Skool URL if not already present
    if (data.skoolUrl && (!existingRecord || !existingRecord.values?.skool_profile_url)) {
      personData.values.skool_profile_url = [{ value: data.skoolUrl }];
    }

    let recordId: string;

    if (existingRecord) {
      // UPDATE existing record (whether found by Skool or email)
      console.log('Updating existing record with demo data and email:', existingRecord.id.record_id);

      const updateResponse = await fetch(`${ATTIO_API_URL}/objects/people/records/${existingRecord.id.record_id}`, {
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
        // Try simpler update with just email
        if (searchedBySkool) {
          const simpleUpdate = await fetch(`${ATTIO_API_URL}/objects/people/records/${existingRecord.id.record_id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${ATTIO_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: {
                values: {
                  email_addresses: [{ email_address: data.email }]
                }
              }
            })
          });
          if (!simpleUpdate.ok) {
            console.error('Simple email update also failed:', await simpleUpdate.text());
          }
        }
      }

      recordId = existingRecord.id.record_id;
    } else {
      // CREATE new person (no existing Skool or email match)
      console.log('Creating new person record');

      // For new records, ensure we have all basic fields
      personData.values.email_addresses = [{ email_address: data.email }];
      personData.values.name = [{ first_name: data.firstName }];

      if (data.skoolUrl) {
        personData.values.skool_profile_url = [{ value: data.skoolUrl }];
      }

      const createResponse = await fetch(`${ATTIO_API_URL}/objects/people/records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ATTIO_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: personData })
      });

      if (createResponse.ok) {
        const createResult = await createResponse.json();
        recordId = createResult.data.id.record_id;
      } else {
        const errorText = await createResponse.text();
        console.error('Attio create error:', errorText);
        return null;
      }
    }

    // Create a note about the demo request
    if (recordId) {
      const enrichmentNote = searchedBySkool ?
        '🎯 ENRICHED EXISTING SKOOL PROFILE WITH EMAIL\n' :
        existingRecord ?
        '📧 Updated existing email record\n' :
        '✨ Created new record\n';

      const noteText = enrichmentNote +
        `Demo requested from ${data.source}\n` +
        `Email: ${data.email}\n` +
        `Name: ${data.firstName}\n` +
        `Capture type: ${data.captureType}\n` +
        `Lead score: ${data.leadScore}/100\n` +
        (data.skoolUrl ? `Skool URL: ${data.skoolUrl}\n` : '') +
        (data.skoolUsername ? `Skool Username: ${data.skoolUsername}\n` : '') +
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
            parent_record_id: recordId,
            title: searchedBySkool ? '🎯 Demo Request - Skool Profile Enriched' : 'Demo Request',
            content: noteText,
            format: 'plaintext'
          }
        })
      });
    }

    return {
      id: recordId,
      enrichedSkoolProfile: searchedBySkool,
      wasExisting: !!existingRecord
    };
  } catch (error) {
    console.error('Attio enrichment error:', error);
    return null;
  }
}