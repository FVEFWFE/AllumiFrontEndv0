import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  try {
    const shortId = params.shortId;
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Get link details
    const { data: linkData, error: linkError } = await supabase
      .from('links')
      .select('*')
      .eq('short_id', shortId)
      .single();

    if (linkError || !linkData) {
      return NextResponse.redirect(new URL('/404', request.url));
    }

    // Get device fingerprint from query params (set by client-side)
    const fingerprint = request.nextUrl.searchParams.get('fp') || null;

    // Create or update identity
    let identityId = null;
    if (linkData.recipient_id || fingerprint) {
      const { data: identity } = await supabase
        .from('identities')
        .upsert({
          recipient_id: linkData.recipient_id,
          device_fingerprints: fingerprint ? [fingerprint] : [],
          last_seen: new Date().toISOString()
        }, {
          onConflict: 'recipient_id'
        })
        .select()
        .single();
      
      identityId = identity?.id;
    }

    // Track click
    const { error: clickError } = await supabase
      .from('clicks')
      .insert({
        link_id: linkData.id,
        identity_id: identityId,
        user_id: linkData.user_id,
        campaign_name: linkData.campaign_name,
        recipient_id: linkData.recipient_id,
        utm_source: linkData.utm_source,
        utm_medium: linkData.utm_medium,
        utm_campaign: linkData.utm_campaign,
        ip_address: ip,
        user_agent: userAgent,
        device_fingerprint: fingerprint,
        clicked_at: new Date().toISOString()
      });

    if (clickError) {
      console.error('Error tracking click:', clickError);
    }

    // Update link click count
    await supabase
      .from('links')
      .update({ 
        clicks: (linkData.clicks || 0) + 1,
        last_clicked_at: new Date().toISOString()
      })
      .eq('id', linkData.id);

    // Build destination URL with UTM parameters
    const destinationUrl = new URL(linkData.destination_url);
    if (linkData.utm_source) destinationUrl.searchParams.set('utm_source', linkData.utm_source);
    if (linkData.utm_medium) destinationUrl.searchParams.set('utm_medium', linkData.utm_medium);
    if (linkData.utm_campaign) destinationUrl.searchParams.set('utm_campaign', linkData.utm_campaign);
    destinationUrl.searchParams.set('allumi_id', shortId);

    // Redirect to destination
    return NextResponse.redirect(destinationUrl.toString());

  } catch (error) {
    console.error('Error in click tracking:', error);
    return NextResponse.redirect(new URL('/404', request.url));
  }
}