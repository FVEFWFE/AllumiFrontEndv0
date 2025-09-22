import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface SkoolMember {
  email: string;
  name: string;
  skool_member_id?: string;
  joined_date: string;
  metadata?: Record<string, any>;
}

/**
 * Parse Skool CSV export format
 * Expected columns: Email, Name, Joined Date, Member ID, etc.
 */
export async function parseSkoolCSV(csvContent: string): Promise<SkoolMember[]> {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  // Parse headers (case-insensitive)
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));

  const emailIndex = headers.findIndex(h => h.includes('email'));
  const nameIndex = headers.findIndex(h => h.includes('name') || h.includes('full name'));
  const joinedIndex = headers.findIndex(h => h.includes('joined') || h.includes('date'));
  const idIndex = headers.findIndex(h => h.includes('member') && h.includes('id'));

  if (emailIndex === -1) {
    throw new Error('CSV must contain an email column');
  }

  const members: SkoolMember[] = [];

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    const email = values[emailIndex]?.trim().toLowerCase();
    if (!email || !isValidEmail(email)) continue;

    const member: SkoolMember = {
      email,
      name: values[nameIndex]?.trim() || email.split('@')[0],
      joined_date: parseDate(values[joinedIndex]) || new Date().toISOString(),
      skool_member_id: values[idIndex]?.trim() || generateMemberId(email),
      metadata: extractMetadata(headers, values)
    };

    members.push(member);
  }

  return members;
}

/**
 * Bulk create members with deduplication
 */
export async function bulkCreateMembers(members: SkoolMember[]) {
  const results = {
    created: 0,
    updated: 0,
    failed: 0
  };

  // Get existing members by email
  const emails = members.map(m => m.email);
  const { data: existingMembers } = await supabase
    .from('members')
    .select('id, email')
    .in('email', emails);

  const existingEmails = new Set(existingMembers?.map(m => m.email) || []);

  // Separate new and existing members
  const newMembers = members.filter(m => !existingEmails.has(m.email));
  const updateMembers = members.filter(m => existingEmails.has(m.email));

  // Bulk insert new members
  if (newMembers.length > 0) {
    const { error } = await supabase
      .from('members')
      .insert(newMembers.map(m => ({
        ...m,
        created_at: new Date().toISOString()
      })));

    if (error) {
      console.error('Bulk insert error:', error);
      results.failed += newMembers.length;
    } else {
      results.created += newMembers.length;
    }
  }

  // Update existing members
  for (const member of updateMembers) {
    const { error } = await supabase
      .from('members')
      .update({
        skool_member_id: member.skool_member_id,
        metadata: member.metadata,
        updated_at: new Date().toISOString()
      })
      .eq('email', member.email);

    if (error) {
      results.failed++;
    } else {
      results.updated++;
    }
  }

  return results;
}

/**
 * Link members to existing identities
 */
export async function linkMembersToIdentities(members: SkoolMember[]) {
  const linked = [];

  for (const member of members) {
    // Find identity by email
    const { data: identity } = await supabase
      .from('identities')
      .select('id')
      .contains('emails', [member.email])
      .single();

    if (identity) {
      // Update member with identity_id
      await supabase
        .from('members')
        .update({ identity_id: identity.id })
        .eq('email', member.email);

      linked.push({ member: member.email, identity: identity.id });
    }
  }

  return linked;
}

// Helper functions
function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result.map(v => v.replace(/^"|"$/g, ''));
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseDate(dateStr: string | undefined): string | null {
  if (!dateStr) return null;

  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date.toISOString();
  } catch {
    return null;
  }
}

function generateMemberId(email: string): string {
  return `skool_${email.split('@')[0]}_${Date.now()}`;
}

function extractMetadata(headers: string[], values: string[]): Record<string, any> {
  const metadata: Record<string, any> = {};

  headers.forEach((header, index) => {
    // Skip core fields
    if (header.includes('email') || header.includes('name') ||
        header.includes('joined') || header.includes('member')) {
      return;
    }

    const value = values[index]?.trim();
    if (value) {
      metadata[header] = value;
    }
  });

  return metadata;
}