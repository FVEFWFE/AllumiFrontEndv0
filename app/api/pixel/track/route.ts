import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Universal Pixel Event Tracking
 * The "Game Changer" endpoint that captures emails and events
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      userId,
      identityId,
      sessionId,
      email,
      eventName,
      properties,
      fingerprint,
      pageUrl,
      pageTitle,
      referrer,
      timestamp,
      metadata
    } = data;

    console.log(`[Pixel Track] Event: ${eventName}, Email: ${email || 'none'}, Identity: ${identityId}`);

    // Store the pixel event
    const { data: pixelEvent, error: pixelError } = await supabase
      .from('pixel_events')
      .insert({
        user_id: userId,
        identity_id: identityId,
        session_id: sessionId,
        event_name: eventName,
        event_properties: properties,
        page_url: pageUrl,
        page_title: pageTitle,
        referrer: referrer,
        email: email,
        device_fingerprint: fingerprint,
        metadata: metadata,
        tracked_at: timestamp || new Date().toISOString()
      })
      .select()
      .single();

    if (pixelError) {
      console.error('[Pixel Track] Error storing event:', pixelError);
      // Don't throw - we want to continue processing
    }

    // If email is captured, this is THE MAGIC MOMENT!
    if (email && eventName === 'email_captured') {
      console.log('[Pixel Track] 🎉 EMAIL CAPTURED! Updating identity...');

      // Update or create identity with email
      const { data: identity, error: identityError } = await supabase
        .from('identities')
        .upsert({
          id: identityId,
          emails: [email],
          device_fingerprints: fingerprint ? [fingerprint] : [],
          last_seen: new Date().toISOString(),
          metadata: {
            ...metadata,
            email_capture_source: 'pixel',
            email_capture_page: pageUrl
          }
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (identityError) {
        console.error('[Pixel Track] Error updating identity:', identityError);
      }

      // Check if this email matches any pending conversions
      await matchPendingConversions(email, identityId, fingerprint);
    }

    // Track other important events
    if (eventName === 'page_view' && fingerprint) {
      // Update identity last seen
      await supabase
        .from('identities')
        .update({
          last_seen: new Date().toISOString(),
          metadata: {
            last_page_viewed: pageUrl,
            last_page_title: pageTitle
          }
        })
        .eq('id', identityId);
    }

    return NextResponse.json({
      success: true,
      identityId: identityId,
      eventId: pixelEvent?.id
    });

  } catch (error) {
    console.error('[Pixel Track] Error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

/**
 * Match pending conversions based on email
 * This dramatically improves attribution accuracy
 */
async function matchPendingConversions(
  email: string,
  identityId: string,
  fingerprint: string | null
) {
  try {
    // Find conversions with matching email but no identity
    const { data: conversions, error } = await supabase
      .from('conversions')
      .select('*')
      .eq('skool_email', email)
      .is('identity_id', null);

    if (error || !conversions || conversions.length === 0) {
      return;
    }

    console.log(`[Pixel Track] Found ${conversions.length} pending conversions for ${email}`);

    // Update conversions with identity
    for (const conversion of conversions) {
      const { error: updateError } = await supabase
        .from('conversions')
        .update({
          identity_id: identityId,
          device_fingerprint: fingerprint,
          confidence_score: 95, // Email match = 95% confidence
          metadata: {
            ...conversion.metadata,
            matched_by: 'pixel_email',
            matched_at: new Date().toISOString()
          }
        })
        .eq('id', conversion.id);

      if (!updateError) {
        console.log(`[Pixel Track] ✅ Matched conversion ${conversion.id} to identity ${identityId}`);
      }
    }

    // Now try to attribute clicks to this identity
    await attributeClicksToIdentity(identityId, fingerprint);

  } catch (error) {
    console.error('[Pixel Track] Error matching conversions:', error);
  }
}

/**
 * Attribute historical clicks to this identity
 * This creates the full customer journey
 */
async function attributeClicksToIdentity(
  identityId: string,
  fingerprint: string | null
) {
  try {
    // Find clicks with matching fingerprint but no identity
    const { data: clicks, error } = await supabase
      .from('clicks')
      .select('*')
      .eq('device_fingerprint', fingerprint)
      .is('identity_id', null)
      .order('clicked_at', { ascending: false })
      .limit(50); // Last 50 clicks

    if (error || !clicks || clicks.length === 0) {
      return;
    }

    console.log(`[Pixel Track] Found ${clicks.length} unattributed clicks for fingerprint`);

    // Update clicks with identity
    for (const click of clicks) {
      await supabase
        .from('clicks')
        .update({
          identity_id: identityId,
          metadata: {
            ...click.metadata,
            attributed_by: 'pixel_fingerprint',
            attributed_at: new Date().toISOString()
          }
        })
        .eq('id', click.id);
    }

    console.log(`[Pixel Track] ✅ Attributed ${clicks.length} clicks to identity ${identityId}`);

  } catch (error) {
    console.error('[Pixel Track] Error attributing clicks:', error);
  }
}

// Support for beacon API (uses text/plain)
export async function PUT(request: NextRequest) {
  try {
    const text = await request.text();
    const data = JSON.parse(text);

    // Reuse POST logic
    return POST(new NextRequest(request.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }));
  } catch (error) {
    console.error('[Pixel Track] Beacon error:', error);
    return NextResponse.json(
      { error: 'Failed to process beacon' },
      { status: 500 }
    );
  }
}