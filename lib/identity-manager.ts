import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface Identity {
  id: string;
  emails: string[];
  device_fingerprints: string[];
  confidence_score: number;
  metadata: Record<string, any>;
  last_seen: string;
}

/**
 * Find or create identity by email - the core identification function
 */
export async function findOrCreateIdentity(
  email: string,
  metadata?: Record<string, any>
): Promise<Identity> {
  // First, try to find existing identity with this email
  const { data: existingIdentity } = await supabase
    .from('identities')
    .select('*')
    .contains('emails', [email])
    .single();

  if (existingIdentity) {
    // Update last_seen and metadata
    const { data: updated } = await supabase
      .from('identities')
      .update({
        last_seen: new Date().toISOString(),
        metadata: { ...existingIdentity.metadata, ...metadata },
        confidence_score: 0.95 // Email match = 95% confidence
      })
      .eq('id', existingIdentity.id)
      .select()
      .single();

    return updated!;
  }

  // Create new identity
  const identityId = generateIdentityId(email);

  const { data: newIdentity } = await supabase
    .from('identities')
    .insert({
      id: identityId,
      emails: [email],
      device_fingerprints: [],
      confidence_score: 0.95,
      metadata: metadata || {},
      last_seen: new Date().toISOString(),
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  return newIdentity!;
}

/**
 * Merge multiple identities when email matches
 */
export async function mergeIdentities(
  primaryEmail: string,
  secondaryEmails: string[]
): Promise<Identity> {
  // Find all identities with these emails
  const allEmails = [primaryEmail, ...secondaryEmails];

  const { data: identities } = await supabase
    .from('identities')
    .select('*')
    .or(allEmails.map(e => `emails.cs.["${e}"]`).join(','));

  if (!identities || identities.length === 0) {
    // Create new identity if none exist
    return findOrCreateIdentity(primaryEmail);
  }

  if (identities.length === 1) {
    // Only one identity found, update it with all emails
    const identity = identities[0];
    const mergedEmails = Array.from(new Set([...identity.emails, ...allEmails]));

    const { data: updated } = await supabase
      .from('identities')
      .update({
        emails: mergedEmails,
        confidence_score: 0.95,
        last_seen: new Date().toISOString()
      })
      .eq('id', identity.id)
      .select()
      .single();

    return updated!;
  }

  // Multiple identities found - merge them
  const primaryIdentity = identities[0];
  const secondaryIdentities = identities.slice(1);

  // Collect all unique emails and fingerprints
  const allUniqueEmails = Array.from(new Set(
    identities.flatMap(i => i.emails).concat(allEmails)
  ));

  const allFingerprints = Array.from(new Set(
    identities.flatMap(i => i.device_fingerprints || [])
  ));

  // Merge metadata
  const mergedMetadata = identities.reduce((acc, identity) => ({
    ...acc,
    ...identity.metadata
  }), {});

  // Update primary identity with merged data
  const { data: merged } = await supabase
    .from('identities')
    .update({
      emails: allUniqueEmails,
      device_fingerprints: allFingerprints,
      metadata: mergedMetadata,
      confidence_score: 0.95,
      last_seen: new Date().toISOString()
    })
    .eq('id', primaryIdentity.id)
    .select()
    .single();

  // Update all references from secondary identities to primary
  const secondaryIds = secondaryIdentities.map(i => i.id);

  await Promise.all([
    // Update clicks
    supabase
      .from('clicks')
      .update({ identity_id: primaryIdentity.id })
      .in('identity_id', secondaryIds),

    // Update conversions
    supabase
      .from('conversions')
      .update({ identity_id: primaryIdentity.id })
      .in('identity_id', secondaryIds),

    // Update pixel_events
    supabase
      .from('pixel_events')
      .update({ identity_id: primaryIdentity.id })
      .in('identity_id', secondaryIds),

    // Update members
    supabase
      .from('members')
      .update({ identity_id: primaryIdentity.id })
      .in('identity_id', secondaryIds)
  ]);

  // Delete secondary identities
  await supabase
    .from('identities')
    .delete()
    .in('id', secondaryIds);

  return merged!;
}

/**
 * Enrich identity with member data
 */
export async function enrichIdentityFromMember(
  identityId: string,
  memberData: Record<string, any>
): Promise<Identity> {
  const { data: identity } = await supabase
    .from('identities')
    .select('*')
    .eq('id', identityId)
    .single();

  if (!identity) {
    throw new Error(`Identity ${identityId} not found`);
  }

  const enrichedMetadata = {
    ...identity.metadata,
    member_name: memberData.name,
    member_joined: memberData.joined_date,
    skool_member_id: memberData.skool_member_id,
    enriched_at: new Date().toISOString()
  };

  const { data: updated } = await supabase
    .from('identities')
    .update({
      metadata: enrichedMetadata,
      last_seen: new Date().toISOString()
    })
    .eq('id', identityId)
    .select()
    .single();

  return updated!;
}

/**
 * Find identity by device fingerprint
 */
export async function findIdentityByFingerprint(
  fingerprint: string
): Promise<Identity | null> {
  const { data: identity } = await supabase
    .from('identities')
    .select('*')
    .contains('device_fingerprints', [fingerprint])
    .single();

  return identity;
}

/**
 * Add device fingerprint to identity
 */
export async function addFingerprintToIdentity(
  identityId: string,
  fingerprint: string
): Promise<void> {
  const { data: identity } = await supabase
    .from('identities')
    .select('device_fingerprints')
    .eq('id', identityId)
    .single();

  if (identity) {
    const fingerprints = identity.device_fingerprints || [];

    if (!fingerprints.includes(fingerprint)) {
      fingerprints.push(fingerprint);

      await supabase
        .from('identities')
        .update({
          device_fingerprints: fingerprints,
          last_seen: new Date().toISOString()
        })
        .eq('id', identityId);
    }
  }
}

/**
 * Match pending conversions to identity
 */
export async function matchPendingConversions(
  email: string,
  identityId: string,
  fingerprint?: string
): Promise<number> {
  // Find conversions without attribution
  const query = supabase
    .from('conversions')
    .select('id')
    .is('attributed_link_id', null);

  // Match by email or fingerprint
  if (fingerprint) {
    query.or(`email.eq.${email},device_fingerprint.eq.${fingerprint}`);
  } else {
    query.eq('email', email);
  }

  const { data: conversions } = await query;

  if (!conversions || conversions.length === 0) {
    return 0;
  }

  // Update conversions with identity
  const { error } = await supabase
    .from('conversions')
    .update({
      identity_id: identityId,
      attribution_method: 'email_match',
      confidence_score: 0.95,
      updated_at: new Date().toISOString()
    })
    .in('id', conversions.map(c => c.id));

  if (error) {
    console.error('Error matching conversions:', error);
    return 0;
  }

  return conversions.length;
}

// Helper function to generate identity ID
function generateIdentityId(email: string): string {
  const hash = crypto
    .createHash('sha256')
    .update(email + Date.now())
    .digest('hex');

  return `identity_${hash.substring(0, 16)}`;
}