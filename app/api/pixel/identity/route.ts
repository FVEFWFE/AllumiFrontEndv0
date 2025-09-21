import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Identity Resolution Endpoint
 * Updates and merges identities based on email and fingerprint
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      identityId,
      userId,
      email,
      fingerprint,
      sessionId,
      userAgent,
      timestamp
    } = data;

    console.log(`[Pixel Identity] Updating identity: ${identityId}, Email: ${email || 'none'}`);

    // Check if identity exists
    const { data: existingIdentity, error: fetchError } = await supabase
      .from('identities')
      .select('*')
      .eq('id', identityId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('[Pixel Identity] Error fetching identity:', fetchError);
      throw fetchError;
    }

    if (existingIdentity) {
      // Update existing identity
      const updatedData: any = {
        last_seen: timestamp || new Date().toISOString(),
        user_agent: userAgent
      };

      // Add email if new
      if (email && (!existingIdentity.emails || !existingIdentity.emails.includes(email))) {
        updatedData.emails = [...(existingIdentity.emails || []), email];
        console.log(`[Pixel Identity] 🎉 Adding email ${email} to identity ${identityId}`);
      }

      // Add fingerprint if new
      if (fingerprint && (!existingIdentity.device_fingerprints || !existingIdentity.device_fingerprints.includes(fingerprint))) {
        updatedData.device_fingerprints = [...(existingIdentity.device_fingerprints || []), fingerprint];
      }

      // Update metadata
      updatedData.metadata = {
        ...existingIdentity.metadata,
        last_session_id: sessionId,
        last_updated_by: 'pixel',
        user_id: userId || existingIdentity.metadata?.user_id
      };

      const { data: updated, error: updateError } = await supabase
        .from('identities')
        .update(updatedData)
        .eq('id', identityId)
        .select()
        .single();

      if (updateError) {
        console.error('[Pixel Identity] Error updating identity:', updateError);
        throw updateError;
      }

      // Check for identity merge opportunities
      if (email) {
        await checkForIdentityMerge(identityId, email, fingerprint);
      }

      return NextResponse.json({
        success: true,
        identity: updated,
        merged: false
      });

    } else {
      // Create new identity
      const newIdentity = {
        id: identityId,
        emails: email ? [email] : [],
        device_fingerprints: fingerprint ? [fingerprint] : [],
        user_agent: userAgent,
        last_seen: timestamp || new Date().toISOString(),
        confidence_score: email ? 0.95 : 0.5, // Higher confidence with email
        metadata: {
          created_by: 'pixel',
          session_id: sessionId,
          user_id: userId
        }
      };

      const { data: created, error: createError } = await supabase
        .from('identities')
        .insert(newIdentity)
        .select()
        .single();

      if (createError) {
        console.error('[Pixel Identity] Error creating identity:', createError);
        throw createError;
      }

      console.log(`[Pixel Identity] ✅ Created new identity ${identityId}`);

      return NextResponse.json({
        success: true,
        identity: created,
        merged: false
      });
    }

  } catch (error) {
    console.error('[Pixel Identity] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update identity' },
      { status: 500 }
    );
  }
}

/**
 * Check if this identity should be merged with another
 * Based on email or fingerprint matches
 */
async function checkForIdentityMerge(
  identityId: string,
  email: string,
  fingerprint: string | null
) {
  try {
    // Find other identities with same email
    const { data: emailMatches, error: emailError } = await supabase
      .from('identities')
      .select('*')
      .contains('emails', [email])
      .neq('id', identityId);

    if (emailError) {
      console.error('[Pixel Identity] Error finding email matches:', emailError);
      return;
    }

    if (emailMatches && emailMatches.length > 0) {
      console.log(`[Pixel Identity] Found ${emailMatches.length} identities with same email`);

      // Merge identities (keep the one with most data)
      for (const match of emailMatches) {
        await mergeIdentities(identityId, match.id);
      }
    }

    // Find other identities with same fingerprint (lower confidence merge)
    if (fingerprint) {
      const { data: fpMatches, error: fpError } = await supabase
        .from('identities')
        .select('*')
        .contains('device_fingerprints', [fingerprint])
        .neq('id', identityId);

      if (!fpError && fpMatches && fpMatches.length > 0) {
        console.log(`[Pixel Identity] Found ${fpMatches.length} identities with same fingerprint`);

        // Only merge if confidence is high enough
        for (const match of fpMatches) {
          // Check if they share other signals
          const sharedEmails = match.emails?.some((e: string) => email === e);

          if (sharedEmails) {
            await mergeIdentities(identityId, match.id);
          }
        }
      }
    }

  } catch (error) {
    console.error('[Pixel Identity] Error checking for merge:', error);
  }
}

/**
 * Merge two identities into one
 * Keeps the primary identity and marks the other as merged
 */
async function mergeIdentities(primaryId: string, secondaryId: string) {
  try {
    console.log(`[Pixel Identity] Merging ${secondaryId} into ${primaryId}`);

    // Get both identities
    const [{ data: primary }, { data: secondary }] = await Promise.all([
      supabase.from('identities').select('*').eq('id', primaryId).single(),
      supabase.from('identities').select('*').eq('id', secondaryId).single()
    ]);

    if (!primary || !secondary) {
      return;
    }

    // Merge data
    const mergedData = {
      emails: Array.from(new Set([...(primary.emails || []), ...(secondary.emails || [])])),
      phones: Array.from(new Set([...(primary.phones || []), ...(secondary.phones || [])])),
      device_fingerprints: Array.from(new Set([
        ...(primary.device_fingerprints || []),
        ...(secondary.device_fingerprints || [])
      ])),
      confidence_score: Math.max(primary.confidence_score || 0, secondary.confidence_score || 0),
      metadata: {
        ...primary.metadata,
        ...secondary.metadata,
        merged_from: [...(primary.metadata?.merged_from || []), secondaryId],
        merged_at: new Date().toISOString()
      }
    };

    // Update primary identity
    await supabase
      .from('identities')
      .update(mergedData)
      .eq('id', primaryId);

    // Mark secondary as merged
    await supabase
      .from('identities')
      .update({
        merged_with: primaryId,
        metadata: {
          ...secondary.metadata,
          merged_into: primaryId,
          merged_at: new Date().toISOString()
        }
      })
      .eq('id', secondaryId);

    // Update all references to secondary identity
    await Promise.all([
      supabase.from('clicks').update({ identity_id: primaryId }).eq('identity_id', secondaryId),
      supabase.from('conversions').update({ identity_id: primaryId }).eq('identity_id', secondaryId),
      supabase.from('pixel_events').update({ identity_id: primaryId }).eq('identity_id', secondaryId)
    ]);

    console.log(`[Pixel Identity] ✅ Successfully merged ${secondaryId} into ${primaryId}`);

  } catch (error) {
    console.error('[Pixel Identity] Error merging identities:', error);
  }
}