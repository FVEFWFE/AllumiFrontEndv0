import { NextResponse, NextRequest } from 'next/server';
import { trackClick, enrichClickData } from '@/lib/click-tracking';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  try {
    const { shortId } = params;

    // Get the link from database
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('*')
      .eq('short_url', shortId)
      .single();

    if (linkError || !link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Track the click
    const clickData = await trackClick(
      shortId,
      link.id,
      request,
      link.destination_url
    );

    if (clickData?.clickId) {
      // Enrich with geo data asynchronously
      enrichClickData(clickData.clickId, clickData.fingerprint);

      // Update link click count
      await supabase
        .from('links')
        .update({
          clicks_count: (link.clicks_count || 0) + 1,
          last_clicked_at: new Date().toISOString()
        })
        .eq('id', link.id);
    }

    // Set tracking cookies in response
    const response = NextResponse.redirect(link.destination_url);

    if (clickData) {
      response.cookies.set('allumi_session', clickData.sessionId, {
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      response.cookies.set('allumi_id', clickData.cookieId, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }

    return response;
  } catch (error) {
    console.error('Track endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to process click' },
      { status: 500 }
    );
  }
}