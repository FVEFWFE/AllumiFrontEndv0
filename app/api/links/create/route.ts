import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      campaignName, 
      destinationUrl,
      utmSource,
      utmMedium,
      utmCampaign,
      recipientId 
    } = body;

    if (!userId || !campaignName || !destinationUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const shortId = nanoid(8);

    // Use the request origin for local development, fallback to env var for production
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL;
    const shortUrl = `${origin}/l/${shortId}`;

    const { data, error } = await supabase
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

    if (error) {
      console.error('Error creating link:', error);
      return NextResponse.json(
        { error: 'Failed to create link', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      shortUrl,
      shortId,
      link: data
    });

  } catch (error) {
    console.error('Error in link creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}