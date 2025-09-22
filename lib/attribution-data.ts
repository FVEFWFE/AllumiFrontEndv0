import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface AttributionMember {
  id: string;
  name: string;
  email: string;
  source: string;
  joinedDate: string;
  revenue: number;
  confidence: number;
  touchpoints: number;
  firstTouch: string;
  lastTouch: string;
  attributionMethod: string;
}

export interface SourceMetrics {
  source: string;
  members: number;
  revenue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface ConversionPathway {
  name: string;
  touchpoints: number;
  conversions: number;
  avgTime: string;
  revenue: number;
  topSources: string[];
}

export async function getAttributionOverview(userId: string) {
  try {
    const { data: conversions } = await supabase
      .from('conversions')
      .select('*')
      .eq('user_id', userId);

    const totalMembers = conversions?.length || 0;
    const attributedMembers = conversions?.filter(c => c.confidence_score > 0).length || 0;
    const totalRevenue = conversions?.reduce((sum, c) => sum + (c.revenue || 0), 0) || 0;
    const avgConfidence = attributedMembers > 0
      ? conversions!.reduce((sum, c) => sum + (c.confidence_score || 0), 0) / attributedMembers
      : 0;

    return {
      totalMembers,
      attributedMembers,
      totalRevenue,
      avgConfidence: Math.round(avgConfidence),
      attributionRate: totalMembers > 0 ? (attributedMembers / totalMembers) * 100 : 0
    };
  } catch (error) {
    console.error('Error fetching attribution overview:', error);
    return {
      totalMembers: 0,
      attributedMembers: 0,
      totalRevenue: 0,
      avgConfidence: 0,
      attributionRate: 0
    };
  }
}

export async function getAttributedMembers(userId: string, limit: number = 100): Promise<AttributionMember[]> {
  try {
    const { data: conversions } = await supabase
      .from('conversions')
      .select(`
        *,
        users!conversions_user_id_fkey (
          id,
          email,
          full_name
        ),
        clicks!conversions_attributed_click_id_fkey (
          *
        )
      `)
      .eq('user_id', userId)
      .order('converted_at', { ascending: false })
      .limit(limit);

    if (!conversions || conversions.length === 0) {
      return [];
    }

    return conversions.map(conversion => ({
      id: conversion.id,
      name: conversion.users?.full_name || 'Unknown User',
      email: conversion.users?.email || 'unknown@email.com',
      source: conversion.last_touch_source || 'direct',
      joinedDate: conversion.converted_at,
      revenue: conversion.revenue || 0,
      confidence: conversion.confidence_score || 0,
      touchpoints: conversion.attribution_window_days || 1,
      firstTouch: conversion.first_touch_source || 'direct',
      lastTouch: conversion.last_touch_source || 'direct',
      attributionMethod: conversion.attribution_method || 'unknown'
    }));
  } catch (error) {
    console.error('Error fetching attributed members:', error);
    return [];
  }
}

export async function getSourceMetrics(userId: string): Promise<SourceMetrics[]> {
  try {
    const { data: conversions } = await supabase
      .from('conversions')
      .select('*')
      .eq('user_id', userId);

    if (!conversions || conversions.length === 0) {
      return [];
    }

    // Group by source
    const sourceMap: { [key: string]: any } = {};

    conversions.forEach(conversion => {
      const source = conversion.last_touch_source || 'direct';
      if (!sourceMap[source]) {
        sourceMap[source] = {
          source,
          members: 0,
          revenue: 0,
          totalConfidence: 0,
          conversions: []
        };
      }
      sourceMap[source].members++;
      sourceMap[source].revenue += conversion.revenue || 0;
      sourceMap[source].totalConfidence += conversion.confidence_score || 0;
      sourceMap[source].conversions.push(conversion);
    });

    // Calculate trends (mock for now - would compare with previous period)
    return Object.values(sourceMap).map((metrics: any) => {
      const avgConfidence = metrics.members > 0
        ? metrics.totalConfidence / metrics.members
        : 0;

      // Mock trend calculation
      const trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable';
      const changePercent = trend === 'up' ? Math.random() * 30 :
                           trend === 'down' ? -Math.random() * 20 : 0;

      return {
        source: metrics.source,
        members: metrics.members,
        revenue: metrics.revenue,
        confidence: Math.round(avgConfidence),
        trend: trend as 'up' | 'down' | 'stable',
        changePercent: Math.round(changePercent)
      };
    }).sort((a, b) => b.revenue - a.revenue);
  } catch (error) {
    console.error('Error fetching source metrics:', error);
    return [];
  }
}

export async function getConversionPathways(userId: string): Promise<ConversionPathway[]> {
  try {
    const { data: paths } = await supabase
      .from('attribution_paths')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!paths || paths.length === 0) {
      // Return some default pathways if none exist yet
      return [
        {
          name: 'Direct → Purchase',
          touchpoints: 1,
          conversions: 0,
          avgTime: '< 1 hour',
          revenue: 0,
          topSources: ['direct']
        },
        {
          name: 'Social → Email → Purchase',
          touchpoints: 3,
          conversions: 0,
          avgTime: '2 days',
          revenue: 0,
          topSources: ['instagram', 'email']
        }
      ];
    }

    // Group similar paths
    const pathwayMap: { [key: string]: any } = {};

    paths.forEach(path => {
      const channels = (path.channels || ['direct']).join(' → ');
      if (!pathwayMap[channels]) {
        pathwayMap[channels] = {
          name: channels,
          touchpoints: path.total_touchpoints || 1,
          conversions: 0,
          totalTime: 0,
          revenue: 0,
          sources: new Set(path.channels || [])
        };
      }
      pathwayMap[channels].conversions++;
      pathwayMap[channels].totalTime += path.journey_duration_hours || 0;
      pathwayMap[channels].revenue += path.first_touch_value || 0;
    });

    return Object.values(pathwayMap).map((pathway: any) => {
      const avgHours = pathway.conversions > 0
        ? pathway.totalTime / pathway.conversions
        : 0;

      const avgTime = avgHours < 1 ? '< 1 hour' :
                      avgHours < 24 ? `${Math.round(avgHours)} hours` :
                      `${Math.round(avgHours / 24)} days`;

      return {
        name: pathway.name,
        touchpoints: pathway.touchpoints,
        conversions: pathway.conversions,
        avgTime,
        revenue: pathway.revenue,
        topSources: Array.from(pathway.sources)
      };
    }).slice(0, 5);
  } catch (error) {
    console.error('Error fetching conversion pathways:', error);
    return [];
  }
}

export async function getAttributionTrends(userId: string, days: number = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: conversions } = await supabase
      .from('conversions')
      .select('converted_at, confidence_score, revenue')
      .eq('user_id', userId)
      .gte('converted_at', startDate.toISOString())
      .order('converted_at', { ascending: true });

    if (!conversions || conversions.length === 0) {
      return [];
    }

    // Group by day
    const dailyData: { [key: string]: any } = {};

    conversions.forEach(conversion => {
      const date = new Date(conversion.converted_at).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          conversions: 0,
          revenue: 0,
          totalConfidence: 0
        };
      }
      dailyData[date].conversions++;
      dailyData[date].revenue += conversion.revenue || 0;
      dailyData[date].totalConfidence += conversion.confidence_score || 0;
    });

    return Object.values(dailyData).map((day: any) => ({
      date: day.date,
      conversions: day.conversions,
      revenue: day.revenue,
      avgConfidence: day.conversions > 0
        ? Math.round(day.totalConfidence / day.conversions)
        : 0
    }));
  } catch (error) {
    console.error('Error fetching attribution trends:', error);
    return [];
  }
}