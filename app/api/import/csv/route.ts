import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parseSkoolCSV } from '@/lib/member-import';
import { findOrCreateIdentity } from '@/lib/identity-manager';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get CSV content from request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const csvContent = await file.text();

    // Parse Skool CSV format
    const members = await parseSkoolCSV(csvContent);

    if (!members.length) {
      return NextResponse.json({ error: 'No valid members found in CSV' }, { status: 400 });
    }

    // Process members in batches of 100
    const batchSize = 100;
    const results = {
      imported: 0,
      skipped: 0,
      errors: []
    };

    for (let i = 0; i < members.length; i += batchSize) {
      const batch = members.slice(i, i + batchSize);

      // Create identities for each member
      const identityPromises = batch.map(async (member) => {
        try {
          // Find or create identity by email
          const identity = await findOrCreateIdentity(member.email, {
            name: member.name,
            source: 'csv_import'
          });

          // Check if member already exists
          const { data: existingMember } = await supabase
            .from('members')
            .select('id')
            .eq('email', member.email)
            .single();

          if (existingMember) {
            // Update existing member with identity
            await supabase
              .from('members')
              .update({
                identity_id: identity.id,
                skool_member_id: member.skool_member_id,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingMember.id);

            results.skipped++;
          } else {
            // Create new member
            await supabase.from('members').insert({
              email: member.email,
              name: member.name,
              skool_member_id: member.skool_member_id,
              joined_date: member.joined_date,
              identity_id: identity.id,
              metadata: member.metadata || {},
              created_at: new Date().toISOString()
            });

            results.imported++;
          }
        } catch (error: any) {
          results.errors.push({
            email: member.email,
            error: error.message
          });
        }
      });

      await Promise.all(identityPromises);
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Imported ${results.imported} members, skipped ${results.skipped} existing`
    });

  } catch (error: any) {
    console.error('CSV import error:', error);
    return NextResponse.json(
      { error: 'Import failed', details: error.message },
      { status: 500 }
    );
  }
}