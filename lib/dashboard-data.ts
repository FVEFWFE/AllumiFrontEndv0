import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface DashboardStats {
  totalMembers: number;
  attributedMembers: number;
  revenue: number;
  avgConfidence: number;
  topSource: string;
  conversionRate: number;
  monthlyGrowth: number;
  activeCampaigns: number;
}

export interface AttributionSource {
  source: string;
  members: number;
  revenue: number;
  confidence: number;
}

export interface ConversionPath {
  name: string;
  touchpoints: number;
  conversions: number;
  avgTime: string;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  try {
    // Get total members/conversions
    const { count: totalMembers } = await supabase
      .from('conversions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get attributed members with confidence > 0
    const { data: attributedData, count: attributedMembers } = await supabase
      .from('conversions')
      .select('confidence_score, revenue')
      .eq('user_id', userId)
      .gt('confidence_score', 0);

    // Calculate totals
    const revenue = attributedData?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0;
    const avgConfidence = attributedData?.length
      ? attributedData.reduce((sum, item) => sum + item.confidence_score, 0) / attributedData.length
      : 0;

    // Get top source
    const { data: topSourceData } = await supabase
      .from('conversions')
      .select('last_touch_source')
      .eq('user_id', userId)
      .order('converted_at', { ascending: false })
      .limit(100);

    const sourceCounts = topSourceData?.reduce((acc: any, item) => {
      const source = item.last_touch_source || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    const topSource = sourceCounts
      ? Object.keys(sourceCounts).sort((a, b) => sourceCounts[b] - sourceCounts[a])[0]
      : 'direct';

    // Get active campaigns
    const { count: activeCampaigns } = await supabase
      .from('links')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_active', true);

    // Calculate conversion rate (attributed/total clicks)
    const { count: totalClicks } = await supabase
      .from('clicks')
      .select('*', { count: 'exact', head: true })
      .in('link_id',
        supabase
          .from('links')
          .select('id')
          .eq('user_id', userId)
      );

    const conversionRate = totalClicks && attributedMembers
      ? (attributedMembers / totalClicks) * 100
      : 0;

    // Calculate monthly growth
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: lastMonthMembers } = await supabase
      .from('conversions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .lt('converted_at', thirtyDaysAgo.toISOString());

    const monthlyGrowth = lastMonthMembers && totalMembers
      ? ((totalMembers - lastMonthMembers) / lastMonthMembers) * 100
      : 0;

    return {
      totalMembers: totalMembers || 0,
      attributedMembers: attributedMembers || 0,
      revenue,
      avgConfidence: Math.round(avgConfidence),
      topSource,
      conversionRate: Math.round(conversionRate * 10) / 10,
      monthlyGrowth: Math.round(monthlyGrowth),
      activeCampaigns: activeCampaigns || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values if error
    return {
      totalMembers: 0,
      attributedMembers: 0,
      revenue: 0,
      avgConfidence: 0,
      topSource: 'direct',
      conversionRate: 0,
      monthlyGrowth: 0,
      activeCampaigns: 0
    };
  }
}

export async function getAttributionSources(userId: string): Promise<AttributionSource[]> {
  try {
    const { data: conversions } = await supabase
      .from('conversions')
      .select('last_touch_source, revenue, confidence_score')
      .eq('user_id', userId);

    if (!conversions || conversions.length === 0) {
      return [];
    }

    // Group by source
    const sourceMap = conversions.reduce((acc: any, item) => {
      const source = item.last_touch_source || 'direct';
      if (!acc[source]) {
        acc[source] = {
          source,
          members: 0,
          revenue: 0,
          totalConfidence: 0
        };
      }
      acc[source].members++;
      acc[source].revenue += item.revenue || 0;
      acc[source].totalConfidence += item.confidence_score || 0;
      return acc;
    }, {});

    return Object.values(sourceMap).map((item: any) => ({
      source: item.source,
      members: item.members,
      revenue: item.revenue,
      confidence: Math.round(item.totalConfidence / item.members)
    }));
  } catch (error) {
    console.error('Error fetching attribution sources:', error);
    return [];
  }
}

export async function getConversionPaths(userId: string): Promise<ConversionPath[]> {
  try {
    const { data: paths } = await supabase
      .from('attribution_paths')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!paths || paths.length === 0) {
      return [];
    }

    return paths.map(path => ({
      name: path.dominant_channel || 'Unknown',
      touchpoints: path.total_touchpoints || 1,
      conversions: 1,
      avgTime: path.journey_duration_hours
        ? `${Math.round(path.journey_duration_hours)} hours`
        : '< 1 hour'
    }));
  } catch (error) {
    console.error('Error fetching conversion paths:', error);
    return [];
  }
}

export async function getRecentActivity(userId: string, limit: number = 10) {
  try {
    const { data: recentClicks } = await supabase
      .from('clicks')
      .select(`
        *,
        links!inner(
          id,
          user_id,
          name,
          destination_url
        )
      `)
      .eq('links.user_id', userId)
      .order('clicked_at', { ascending: false })
      .limit(limit);

    return recentClicks?.map(click => ({
      id: click.id,
      type: 'click',
      linkName: click.links.name,
      source: click.utm_source || 'direct',
      timestamp: click.clicked_at,
      device: click.device_type || 'unknown',
      location: click.country || 'unknown'
    })) || [];
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

export async function getCampaignPerformance(userId: string) {
  try {
    // Get all links for the user
    const { data: userLinks } = await supabase
      .from('links')
      .select('id')
      .eq('user_id', userId);

    if (!userLinks || userLinks.length === 0) {
      return [];
    }

    const linkIds = userLinks.map(link => link.id);

    // Get campaign metrics
    const { data: campaigns } = await supabase
      .from('clicks')
      .select('utm_campaign, utm_source')
      .in('link_id', linkIds);

    if (!campaigns || campaigns.length === 0) {
      return [];
    }

    // Group by campaign
    const campaignMap = campaigns.reduce((acc: any, click) => {
      const campaign = click.utm_campaign || 'No Campaign';
      if (!acc[campaign]) {
        acc[campaign] = {
          name: campaign,
          clicks: 0,
          sources: new Set()
        };
      }
      acc[campaign].clicks++;
      if (click.utm_source) {
        acc[campaign].sources.add(click.utm_source);
      }
      return acc;
    }, {});

    return Object.values(campaignMap).map((campaign: any) => ({
      name: campaign.name,
      clicks: campaign.clicks,
      sources: Array.from(campaign.sources).join(', ') || 'direct',
      status: 'active'
    }));
  } catch (error) {
    console.error('Error fetching campaign performance:', error);
    return [];
  }
}