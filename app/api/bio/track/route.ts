import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { linkId, slug } = await req.json();

    if (!linkId || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get bio page by slug
    const { data: bioPage, error: pageError } = await supabase
      .from('bio_pages')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!bioPage || pageError) {
      return NextResponse.json(
        { error: 'Bio page not found' },
        { status: 404 }
      );
    }

    // Get link details
    const { data: link, error: linkError } = await supabase
      .from('bio_links')
      .select('url')
      .eq('id', linkId)
      .eq('page_id', bioPage.id)
      .single();

    if (!link || linkError) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Record the click
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown';
    const userAgent = req.headers.get('user-agent') || '';
    const referrer = req.headers.get('referer') || '';

    // Insert click record
    await supabase
      .from('bio_link_clicks')
      .insert({
        link_id: linkId,
        page_id: bioPage.id,
        ip_address: ip.split(',')[0].trim(),
        user_agent: userAgent,
        referrer: referrer
      });

    // Update click count
    await supabase.rpc('increment', {
      table_name: 'bio_links',
      column_name: 'clicks',
      row_id: linkId
    });

    // Add UTM parameters to the URL
    const targetUrl = new URL(link.url);
    targetUrl.searchParams.set('utm_source', 'bio');
    targetUrl.searchParams.set('utm_medium', 'social');
    targetUrl.searchParams.set('utm_campaign', slug);

    return NextResponse.json({
      success: true,
      url: targetUrl.toString()
    });
  } catch (error) {
    console.error('Error tracking bio link click:', error);
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Track page view
    const { data: bioPage, error } = await supabase
      .from('bio_pages')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!bioPage || error) {
      return NextResponse.json(
        { error: 'Bio page not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await supabase.rpc('increment', {
      table_name: 'bio_pages',
      column_name: 'views',
      row_id: bioPage.id
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}