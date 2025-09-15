import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Track attribution events (page views, signups, purchases)
export async function POST(req: NextRequest) {
  try {
    const {
      event_type,
      community_id,
      user_id,
      revenue,
      metadata = {}
    } = await req.json();

    // Get UTM parameters from cookies or request
    const cookieStore = cookies();
    const utm_source = cookieStore.get('utm_source')?.value || metadata.utm_source || null;
    const utm_medium = cookieStore.get('utm_medium')?.value || metadata.utm_medium || null;
    const utm_campaign = cookieStore.get('utm_campaign')?.value || metadata.utm_campaign || null;
    const utm_term = cookieStore.get('utm_term')?.value || metadata.utm_term || null;
    const utm_content = cookieStore.get('utm_content')?.value || metadata.utm_content || null;
    const referrer = cookieStore.get('initial_referrer')?.value || req.headers.get('referer') || null;
    const session_id = cookieStore.get('session_id')?.value || generateSessionId();
    
    // Get user agent and IP
    const user_agent = req.headers.get('user-agent') || null;
    const ip_address = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      null;

    // Get landing page
    const landing_page = metadata.landing_page || cookieStore.get('landing_page')?.value || null;

    // Insert attribution event
    const { data: event, error } = await supabase
      .from('attribution_events')
      .insert({
        event_type,
        community_id,
        user_id,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        referrer,
        landing_page,
        ip_address,
        user_agent,
        session_id,
        revenue,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Handle specific event types
    switch (event_type) {
      case 'signup':
        await handleSignupAttribution(event);
        break;
      case 'purchase':
        await handlePurchaseAttribution(event);
        break;
      case 'page_view':
        await updateUserJourney(event);
        break;
    }

    // Set attribution cookies to persist data
    const response = NextResponse.json({ 
      success: true, 
      event_id: event.id,
      session_id 
    });

    // Set cookies for 30 days
    const cookieOptions = {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: false,
      sameSite: 'lax' as const,
      path: '/',
    };

    if (utm_source) response.cookies.set('utm_source', utm_source, cookieOptions);
    if (utm_medium) response.cookies.set('utm_medium', utm_medium, cookieOptions);
    if (utm_campaign) response.cookies.set('utm_campaign', utm_campaign, cookieOptions);
    if (utm_term) response.cookies.set('utm_term', utm_term, cookieOptions);
    if (utm_content) response.cookies.set('utm_content', utm_content, cookieOptions);
    if (referrer) response.cookies.set('initial_referrer', referrer, cookieOptions);
    if (landing_page) response.cookies.set('landing_page', landing_page, cookieOptions);
    response.cookies.set('session_id', session_id, cookieOptions);

    return response;
  } catch (error: any) {
    console.error('Attribution tracking error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to track attribution' },
      { status: 500 }
    );
  }
}

// Get attribution data for a user or community
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const community_id = searchParams.get('community_id');
    const user_id = searchParams.get('user_id');
    const days = parseInt(searchParams.get('days') || '30');

    if (!community_id && !user_id) {
      return NextResponse.json(
        { error: 'community_id or user_id required' },
        { status: 400 }
      );
    }

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    let query = supabase
      .from('attribution_events')
      .select('*')
      .gte('created_at', dateFrom.toISOString())
      .order('created_at', { ascending: false });

    if (community_id) {
      query = query.eq('community_id', community_id);
    }
    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    const { data: events, error } = await query;

    if (error) {
      throw error;
    }

    // Calculate attribution metrics
    const metrics = calculateAttributionMetrics(events || []);

    return NextResponse.json({
      events,
      metrics,
      period: `${days} days`,
    });
  } catch (error: any) {
    console.error('Attribution fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch attribution data' },
      { status: 500 }
    );
  }
}

// Helper functions
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function handleSignupAttribution(event: any) {
  // Track first-touch attribution for signup
  if (event.user_id && (event.utm_source || event.referrer)) {
    await supabase
      .from('profiles')
      .update({
        first_touch_source: event.utm_source || extractChannel(event.referrer),
        first_touch_campaign: event.utm_campaign,
        signup_attribution: {
          utm_source: event.utm_source,
          utm_medium: event.utm_medium,
          utm_campaign: event.utm_campaign,
          referrer: event.referrer,
          landing_page: event.landing_page,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', event.user_id);
  }
}

async function handlePurchaseAttribution(event: any) {
  if (!event.user_id || !event.revenue) return;

  // Get user's attribution journey
  const { data: journey } = await supabase
    .from('attribution_events')
    .select('*')
    .eq('user_id', event.user_id)
    .order('created_at', { ascending: true });

  if (!journey || journey.length === 0) return;

  // Calculate attribution models
  const firstTouch = journey[0];
  const lastTouch = journey[journey.length - 1];
  
  // First-touch attribution
  await supabase.from('revenue_attribution').insert({
    community_id: event.community_id,
    user_id: event.user_id,
    order_id: event.metadata?.order_id || `order_${Date.now()}`,
    revenue: event.revenue,
    attribution_model: 'first_touch',
    channel: firstTouch.utm_source || extractChannel(firstTouch.referrer),
    campaign: firstTouch.utm_campaign,
    touchpoints: [firstTouch],
    conversion_path: journey.map(j => ({
      source: j.utm_source,
      timestamp: j.created_at,
    })),
    days_to_conversion: Math.floor(
      (new Date(event.created_at).getTime() - new Date(firstTouch.created_at).getTime()) / 
      (1000 * 60 * 60 * 24)
    ),
    created_at: new Date().toISOString(),
  });

  // Last-touch attribution
  await supabase.from('revenue_attribution').insert({
    community_id: event.community_id,
    user_id: event.user_id,
    order_id: event.metadata?.order_id || `order_${Date.now()}`,
    revenue: event.revenue,
    attribution_model: 'last_touch',
    channel: lastTouch.utm_source || extractChannel(lastTouch.referrer),
    campaign: lastTouch.utm_campaign,
    touchpoints: [lastTouch],
    conversion_path: journey.map(j => ({
      source: j.utm_source,
      timestamp: j.created_at,
    })),
    days_to_conversion: Math.floor(
      (new Date(event.created_at).getTime() - new Date(firstTouch.created_at).getTime()) / 
      (1000 * 60 * 60 * 24)
    ),
    created_at: new Date().toISOString(),
  });

  // Linear attribution (equal credit to all touchpoints)
  const revenuePerTouch = event.revenue / journey.length;
  for (const touchpoint of journey) {
    await supabase.from('revenue_attribution').insert({
      community_id: event.community_id,
      user_id: event.user_id,
      order_id: event.metadata?.order_id || `order_${Date.now()}`,
      revenue: revenuePerTouch,
      attribution_model: 'linear',
      channel: touchpoint.utm_source || extractChannel(touchpoint.referrer),
      campaign: touchpoint.utm_campaign,
      touchpoints: [touchpoint],
      conversion_path: journey.map(j => ({
        source: j.utm_source,
        timestamp: j.created_at,
      })),
      created_at: new Date().toISOString(),
    });
  }
}

async function updateUserJourney(event: any) {
  // Update user's journey in their profile
  if (event.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('journey')
      .eq('id', event.user_id)
      .single();

    const journey = profile?.journey || [];
    journey.push({
      timestamp: event.created_at,
      event_type: event.event_type,
      source: event.utm_source,
      page: event.landing_page,
    });

    await supabase
      .from('profiles')
      .update({
        journey: journey.slice(-50), // Keep last 50 events
        last_seen_at: new Date().toISOString(),
      })
      .eq('id', event.user_id);
  }
}

function extractChannel(referrer?: string): string {
  if (!referrer) return 'direct';
  
  if (referrer.includes('google')) return 'google';
  if (referrer.includes('facebook')) return 'facebook';
  if (referrer.includes('twitter') || referrer.includes('x.com')) return 'twitter';
  if (referrer.includes('youtube')) return 'youtube';
  if (referrer.includes('linkedin')) return 'linkedin';
  if (referrer.includes('reddit')) return 'reddit';
  if (referrer.includes('tiktok')) return 'tiktok';
  
  return 'referral';
}

function calculateAttributionMetrics(events: any[]) {
  const channels = new Map();
  const campaigns = new Map();
  let totalRevenue = 0;
  
  events.forEach(event => {
    const channel = event.utm_source || extractChannel(event.referrer);
    const campaign = event.utm_campaign || 'none';
    
    // Channel metrics
    if (!channels.has(channel)) {
      channels.set(channel, {
        events: 0,
        revenue: 0,
        conversions: 0,
      });
    }
    const channelData = channels.get(channel);
    channelData.events++;
    if (event.revenue) {
      channelData.revenue += event.revenue;
      totalRevenue += event.revenue;
    }
    if (event.event_type === 'purchase') {
      channelData.conversions++;
    }
    
    // Campaign metrics
    if (!campaigns.has(campaign)) {
      campaigns.set(campaign, {
        events: 0,
        revenue: 0,
        conversions: 0,
      });
    }
    const campaignData = campaigns.get(campaign);
    campaignData.events++;
    if (event.revenue) {
      campaignData.revenue += event.revenue;
    }
    if (event.event_type === 'purchase') {
      campaignData.conversions++;
    }
  });
  
  return {
    totalEvents: events.length,
    totalRevenue,
    channels: Array.from(channels.entries()).map(([name, data]) => ({
      name,
      ...data,
      revenueShare: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
    })),
    campaigns: Array.from(campaigns.entries()).map(([name, data]) => ({
      name,
      ...data,
      revenueShare: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
    })),
  };
}