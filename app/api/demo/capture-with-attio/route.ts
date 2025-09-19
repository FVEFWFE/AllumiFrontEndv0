import { NextRequest, NextResponse } from 'next/server';
import { sendDemoNotification } from '@/lib/email-notifications';

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

    // Send email notification to Jan
    await sendDemoNotification({
      email: data.email,
      firstName: data.firstName,
      skoolUrl: cleanSkoolUrl,
      skoolUsername,
      source: data.source,
      captureType: data.captureType,
      leadScore: calculateLeadScore(data, cleanSkoolUrl),
      enrichedExisting: attioResult?.enrichedSkoolProfile || false
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

      // Search by Skool Profile URL using correct Attio filter format
      console.log('🔍 Searching for Skool profile:', data.skoolUrl);
      console.log('Username extracted:', data.skoolUsername);

      // Use the correct filter formats that work with Attio's API
      const searchStrategies = [
        // 1. Exact match of the clean URL format (most likely to match)
        {
          filter: { skool_profile_url: data.skoolUrl }
        },
        // 2. Contains operator for partial match
        {
          filter: { skool_profile_url: { '$contains': `@${data.skoolUsername}` } }
        },
        // 3. Just the username in case stored differently
        {
          filter: { skool_profile_url: { '$contains': data.skoolUsername } }
        },
        // 4. Try with full URL format
        {
          filter: { skool_profile_url: `https://www.skool.com/@${data.skoolUsername}` }
        },
        // 5. Try $or operator to match multiple formats
        {
          filter: {
            '$or': [
              { skool_profile_url: data.skoolUrl },
              { skool_profile_url: `https://www.skool.com/@${data.skoolUsername}` },
              { skool_profile_url: `https://www.skool.com/@${data.skoolUsername}?g=skoolers` }
            ]
          }
        }
      ];

      let existingSkoolRecord: any = null;

      for (const searchQuery of searchStrategies) {
        console.log(`Trying search strategy:`, JSON.stringify(searchQuery.filter));

        const response = await fetch(`${ATTIO_API_URL}/objects/people/records/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ATTIO_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(searchQuery)
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`API response: ${result.data?.length || 0} records found`);
          if (result.data && result.data.length > 0) {
            existingSkoolRecord = result.data[0];
            console.log(`✅ Found match with strategy:`, searchQuery.filter);
            const skoolUrl = existingSkoolRecord.values?.skool_profile_url?.[0];
            console.log('Found record Skool URL:', skoolUrl?.value || skoolUrl);
            console.log('Found record emails:', existingSkoolRecord.values?.email_addresses);
            break;
          }
        } else {
          const errorText = await response.text();
          console.log(`Search error:`, errorText.substring(0, 200));
        }
      }

      if (existingSkoolRecord) {
        existingRecord = existingSkoolRecord;
        searchedBySkool = true;
        console.log('✅ Found existing Skool profile:', existingRecord.id?.record_id);
      } else {
        console.log('❌ No Skool profile found with any search strategy');
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
            email_addresses: data.email
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

    // Handle email addresses - key field for enrichment
    if (searchedBySkool && existingRecord) {
      // CRITICAL: Found by Skool - ENRICH with email!
      console.log('🎯 Enriching Skool profile with email:', data.email);
      const existingEmails = existingRecord.values?.email_addresses || [];

      // Check if email already exists (handle different possible formats)
      const hasEmail = existingEmails.some((e: any) => {
        const emailValue = e.email_address || e.value || e.email || e;
        return emailValue === data.email;
      });

      if (!hasEmail) {
        // Using PATCH will append to existing emails
        // Try simple format first - Attio may auto-format it
        personData.values.email_addresses = [data.email];
        console.log('Adding email to Skool profile');
      }
    } else if (!existingRecord) {
      // New record - add email in simple format
      personData.values.email_addresses = [data.email];
    } else if (!existingRecord.values?.email_addresses?.length) {
      // Existing record with no email - add it
      personData.values.email_addresses = [data.email];
    }

    // Set name - use proper Attio format
    if (!existingRecord || !existingRecord.values?.name ||
        (Array.isArray(existingRecord.values?.name) && !existingRecord.values?.name[0]?.first_name)) {
      personData.values.name = [{
        first_name: data.firstName,
        full_name: data.firstName
      }];
    }

    // Skip custom fields that don't exist in Attio
    // You can add these fields in Attio later if needed:
    // - demo_source
    // - demo_capture_type
    // - demo_lead_score
    // - demo_requested_at

    // Add Skool URL - try different formats
    if (data.skoolUrl && (!existingRecord || !existingRecord.values?.skool_profile_url)) {
      // Try as a text field (most likely format)
      personData.values.skool_profile_url = data.skoolUrl;
    }

    let recordId: string;

    if (existingRecord) {
      // UPDATE existing record (whether found by Skool or email)
      console.log('Updating existing record:', existingRecord.id.record_id);
      console.log('Was found by Skool?', searchedBySkool);
      console.log('Update payload:', JSON.stringify(personData, null, 2));

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
        console.error('Failed update payload:', JSON.stringify(personData, null, 2));

        // Try simpler update with just email
        if (searchedBySkool) {
          console.log('Trying fallback simple email update...');
          const simpleUpdate = await fetch(`${ATTIO_API_URL}/objects/people/records/${existingRecord.id.record_id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${ATTIO_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: {
                values: {
                  email_addresses: [data.email]
                }
              }
            })
          });
          if (!simpleUpdate.ok) {
            const simpleError = await simpleUpdate.text();
            console.error('Simple email update also failed:', simpleError);
          } else {
            console.log('✅ Email successfully added via fallback method');
          }
        }
      } else {
        console.log('✅ Successfully updated Attio record');
      }

      recordId = existingRecord.id.record_id;
    } else {
      // CREATE new person (no existing Skool or email match)
      console.log('Creating new person record');

      // For new records, ensure we have all basic fields
      personData.values.email_addresses = [data.email];
      personData.values.name = [{
        first_name: data.firstName,
        full_name: data.firstName
      }];

      if (data.skoolUrl) {
        // For new records, set as simple string
        personData.values.skool_profile_url = data.skoolUrl;
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