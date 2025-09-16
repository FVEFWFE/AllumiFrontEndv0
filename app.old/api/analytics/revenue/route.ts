import { NextRequest, NextResponse } from 'next/server';
import { requireCommunityOwner } from '@/lib/middleware/auth';
import { createClient } from '@supabase/supabase-js';

// GET /api/analytics/revenue - Get revenue analytics for a community
export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const searchParams = req.nextUrl.searchParams;
    const communitySlug = searchParams.get('community');
    const days = parseInt(searchParams.get('days') || '30');
    const model = searchParams.get('model') || 'all'; // first_touch, last_touch, linear, all

    if (!communitySlug) {
      return NextResponse.json(
        { error: 'Community slug required' },
        { status: 400 }
      );
    }

    // Verify user has access
    const authResult = await requireCommunityOwner(req, communitySlug);
    if ('error' in authResult) {
      return authResult;
    }

    const { membership } = authResult;
    const communityId = membership.community.id;

    // Calculate date range
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);
    const dateTo = new Date();

    // Get revenue attribution data
    let query = supabase
      .from('revenue_attribution')
      .select('*')
      .eq('community_id', communityId)
      .gte('created_at', dateFrom.toISOString())
      .lte('created_at', dateTo.toISOString());

    if (model !== 'all') {
      query = query.eq('attribution_model', model);
    }

    const { data: attributions, error: attrError } = await query;

    if (attrError) {
      throw attrError;
    }

    // Calculate metrics
    const metrics = calculateRevenueMetrics(attributions || [], days);

    // Get channel performance
    const channelPerformance = await getChannelPerformance(communityId, dateFrom, dateTo);

    // Get campaign performance
    const campaignPerformance = await getCampaignPerformance(communityId, dateFrom, dateTo);

    // Get conversion paths
    const conversionPaths = await getTopConversionPaths(communityId, dateFrom, dateTo);

    // Get ROI by channel
    const roiByChannel = await calculateROIByChannel(communityId, dateFrom, dateTo);

    return NextResponse.json({
      period: {
        days,
        from: dateFrom.toISOString(),
        to: dateTo.toISOString(),
      },
      metrics,
      channelPerformance,
      campaignPerformance,
      conversionPaths,
      roiByChannel,
      attributions: attributions?.slice(0, 100), // Latest 100 attributions
    });
  } catch (error: any) {
    console.error('Revenue analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch revenue analytics' },
      { status: 500 }
    );
  }
}

// Calculate revenue metrics
function calculateRevenueMetrics(attributions: any[], days: number) {
  const totalRevenue = attributions.reduce((sum, a) => sum + (a.revenue || 0), 0);
  const totalOrders = new Set(attributions.map(a => a.order_id)).size;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Revenue by attribution model
  const revenueByModel = new Map();
  attributions.forEach(a => {
    const model = a.attribution_model;
    if (!revenueByModel.has(model)) {
      revenueByModel.set(model, 0);
    }
    revenueByModel.set(model, revenueByModel.get(model) + a.revenue);
  });

  // Revenue by channel
  const revenueByChannel = new Map();
  attributions.forEach(a => {
    const channel = a.channel || 'direct';
    if (!revenueByChannel.has(channel)) {
      revenueByChannel.set(channel, 0);
    }
    revenueByChannel.set(channel, revenueByChannel.get(channel) + a.revenue);
  });

  // Daily revenue trend
  const dailyRevenue = new Map();
  attributions.forEach(a => {
    const date = new Date(a.created_at).toISOString().split('T')[0];
    if (!dailyRevenue.has(date)) {
      dailyRevenue.set(date, 0);
    }
    dailyRevenue.set(date, dailyRevenue.get(date) + a.revenue);
  });

  // Average days to conversion
  const daysToConversion = attributions
    .filter(a => a.days_to_conversion !== null)
    .map(a => a.days_to_conversion);
  const avgDaysToConversion = daysToConversion.length > 0
    ? daysToConversion.reduce((sum, d) => sum + d, 0) / daysToConversion.length
    : 0;

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    avgDaysToConversion,
    dailyAverage: totalRevenue / days,
    projectedMonthly: (totalRevenue / days) * 30,
    revenueByModel: Array.from(revenueByModel.entries()).map(([model, revenue]) => ({
      model,
      revenue,
      percentage: (revenue / totalRevenue) * 100,
    })),
    revenueByChannel: Array.from(revenueByChannel.entries())
      .map(([channel, revenue]) => ({
        channel,
        revenue,
        percentage: (revenue / totalRevenue) * 100,
      }))
      .sort((a, b) => b.revenue - a.revenue),
    dailyTrend: Array.from(dailyRevenue.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

// Get channel performance
async function getChannelPerformance(communityId: string, dateFrom: Date, dateTo: Date) {
  const { data: events } = await supabase
    .from('attribution_events')
    .select('*')
    .eq('community_id', communityId)
    .gte('created_at', dateFrom.toISOString())
    .lte('created_at', dateTo.toISOString());

  const channels = new Map();

  events?.forEach(event => {
    const channel = event.utm_source || extractChannel(event.referrer);
    
    if (!channels.has(channel)) {
      channels.set(channel, {
        visits: 0,
        signups: 0,
        purchases: 0,
        revenue: 0,
      });
    }

    const channelData = channels.get(channel);
    
    if (event.event_type === 'page_view') channelData.visits++;
    if (event.event_type === 'signup') channelData.signups++;
    if (event.event_type === 'purchase') {
      channelData.purchases++;
      channelData.revenue += event.revenue || 0;
    }
  });

  return Array.from(channels.entries()).map(([channel, data]) => ({
    channel,
    ...data,
    conversionRate: data.visits > 0 ? (data.purchases / data.visits) * 100 : 0,
    avgOrderValue: data.purchases > 0 ? data.revenue / data.purchases : 0,
  })).sort((a, b) => b.revenue - a.revenue);
}

// Get campaign performance
async function getCampaignPerformance(communityId: string, dateFrom: Date, dateTo: Date) {
  const { data: attributions } = await supabase
    .from('revenue_attribution')
    .select('*')
    .eq('community_id', communityId)
    .eq('attribution_model', 'last_touch')
    .gte('created_at', dateFrom.toISOString())
    .lte('created_at', dateTo.toISOString());

  const campaigns = new Map();

  attributions?.forEach(attr => {
    const campaign = attr.campaign || 'no_campaign';
    
    if (!campaigns.has(campaign)) {
      campaigns.set(campaign, {
        orders: 0,
        revenue: 0,
        customers: new Set(),
      });
    }

    const campaignData = campaigns.get(campaign);
    campaignData.orders++;
    campaignData.revenue += attr.revenue || 0;
    if (attr.user_id) {
      campaignData.customers.add(attr.user_id);
    }
  });

  return Array.from(campaigns.entries()).map(([campaign, data]) => ({
    campaign,
    orders: data.orders,
    revenue: data.revenue,
    customers: data.customers.size,
    avgOrderValue: data.orders > 0 ? data.revenue / data.orders : 0,
  })).sort((a, b) => b.revenue - a.revenue);
}

// Get top conversion paths
async function getTopConversionPaths(communityId: string, dateFrom: Date, dateTo: Date) {
  const { data: attributions } = await supabase
    .from('revenue_attribution')
    .select('conversion_path, revenue')
    .eq('community_id', communityId)
    .eq('attribution_model', 'first_touch')
    .gte('created_at', dateFrom.toISOString())
    .lte('created_at', dateTo.toISOString())
    .not('conversion_path', 'is', null);

  const paths = new Map();

  attributions?.forEach(attr => {
    if (!attr.conversion_path || !Array.isArray(attr.conversion_path)) return;
    
    const pathKey = attr.conversion_path
      .map((p: any) => p.source || 'direct')
      .join(' → ');
    
    if (!paths.has(pathKey)) {
      paths.set(pathKey, {
        count: 0,
        revenue: 0,
      });
    }

    const pathData = paths.get(pathKey);
    pathData.count++;
    pathData.revenue += attr.revenue || 0;
  });

  return Array.from(paths.entries())
    .map(([path, data]) => ({
      path,
      conversions: data.count,
      revenue: data.revenue,
      avgValue: data.count > 0 ? data.revenue / data.count : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10); // Top 10 paths
}

// Calculate ROI by channel
async function calculateROIByChannel(communityId: string, dateFrom: Date, dateTo: Date) {
  // Get ad spend data (would come from integrations or manual input)
  const { data: adSpend } = await supabase
    .from('ad_spend')
    .select('*')
    .eq('community_id', communityId)
    .gte('date', dateFrom.toISOString())
    .lte('date', dateTo.toISOString());

  const spendByChannel = new Map();
  adSpend?.forEach(spend => {
    const channel = spend.channel;
    if (!spendByChannel.has(channel)) {
      spendByChannel.set(channel, 0);
    }
    spendByChannel.set(channel, spendByChannel.get(channel) + spend.amount);
  });

  // Get revenue by channel
  const { data: revenue } = await supabase
    .from('revenue_attribution')
    .select('channel, revenue')
    .eq('community_id', communityId)
    .eq('attribution_model', 'last_touch')
    .gte('created_at', dateFrom.toISOString())
    .lte('created_at', dateTo.toISOString());

  const revenueByChannel = new Map();
  revenue?.forEach(r => {
    const channel = r.channel || 'direct';
    if (!revenueByChannel.has(channel)) {
      revenueByChannel.set(channel, 0);
    }
    revenueByChannel.set(channel, revenueByChannel.get(channel) + r.revenue);
  });

  // Calculate ROI
  const roiData = [];
  const allChannels = new Set([...spendByChannel.keys(), ...revenueByChannel.keys()]);
  
  allChannels.forEach(channel => {
    const spend = spendByChannel.get(channel) || 0;
    const revenue = revenueByChannel.get(channel) || 0;
    const profit = revenue - spend;
    const roi = spend > 0 ? ((revenue - spend) / spend) * 100 : revenue > 0 ? Infinity : 0;
    const roas = spend > 0 ? revenue / spend : revenue > 0 ? Infinity : 0;

    roiData.push({
      channel,
      spend,
      revenue,
      profit,
      roi: isFinite(roi) ? roi : revenue > 0 ? 10000 : 0, // Cap at 10000% for display
      roas: isFinite(roas) ? roas : revenue > 0 ? 100 : 0, // Cap at 100x for display
    });
  });

  return roiData.sort((a, b) => b.roi - a.roi);
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