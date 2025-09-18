import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Hash email to create consistent recipient ID
function hashEmail(email: string): string {
  return crypto
    .createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex')
    .substring(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId,
      campaignName,
      destinationUrl,
      recipients, // Array of {email, name?, customData?}
      utmSource,
      utmMedium,
      utmCampaign,
      includePixel = true
    } = body;

    if (!userId || !campaignName || !destinationUrl || !recipients || !Array.isArray(recipients)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate campaign ID for this batch
    const campaignId = nanoid(12);
    const results = [];

    // Process each recipient
    for (const recipient of recipients) {
      const recipientId = hashEmail(recipient.email);
      const shortId = nanoid(8);
      const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/l/${shortId}`;
      
      // Create personalized link
      const { data: linkData, error: linkError } = await supabase
        .from('links')
        .insert({
          short_id: shortId,
          user_id: userId,
          destination_url: destinationUrl,
          campaign_name: campaignName,
          recipient_id: recipientId,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (linkError) {
        console.error('Error creating link for', recipient.email, linkError);
        continue;
      }

      // Store recipient identity
      await supabase
        .from('identities')
        .upsert({
          recipient_id: recipientId,
          emails: [recipient.email],
          created_at: new Date().toISOString(),
          last_seen: new Date().toISOString()
        }, {
          onConflict: 'recipient_id'
        });

      // Generate tracking pixel if requested
      let pixelUrl = '';
      let pixelHtml = '';
      if (includePixel) {
        pixelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/pixel/${campaignId}_${recipientId}.gif`;
        pixelHtml = `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;" />`;
      }

      results.push({
        email: recipient.email,
        name: recipient.name || '',
        recipientId,
        shortUrl,
        shortId,
        pixelUrl,
        pixelHtml,
        customData: recipient.customData || {}
      });
    }

    // Generate CSV content for easy import to email tools
    const csvHeader = 'email,name,tracking_link,pixel_url,recipient_id\n';
    const csvRows = results.map(r => 
      `"${r.email}","${r.name}","${r.shortUrl}","${r.pixelUrl}","${r.recipientId}"`
    ).join('\n');
    const csvContent = csvHeader + csvRows;

    return NextResponse.json({
      success: true,
      campaignId,
      totalRecipients: recipients.length,
      linksCreated: results.length,
      links: results,
      csv: csvContent,
      instructions: {
        email: 'Use the tracking_link in your email CTA buttons',
        pixel: 'Add the pixel_url as an image at the bottom of your email',
        merge: 'Use these as merge tags in your email service provider'
      }
    });

  } catch (error) {
    console.error('Error in bulk link creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}