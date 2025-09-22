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
    // First get conversions with identity information
    const { data: conversions } = await supabase
      .from('conversions')
      .select(`
        *,
        users!conversions_user_id_fkey (
          id,
          email,
          full_name,
          skool_member_id,
          identity_id
        ),
        identities!conversions_identity_id_fkey (
          id,
          emails,
          confidence_score,
          metadata
        ),
        clicks!conversions_attributed_click_id_fkey (
          *
        )
      `)
      .eq('user_id', userId)
      .order('converted_at', { ascending: false })
      .limit(limit);

    if (!conversions || conversions.length === 0) {
      // If no conversions, try to get members directly
      const { data: members } = await supabase
        .from('members')
        .select(`
          *,
          identities!members_identity_id_fkey (
            id,
            emails,
            confidence_score,
            metadata
          )
        `)
        .limit(limit);

      if (members && members.length > 0) {
        return members.map(member => ({
          id: member.id,
          name: member.name || member.email.split('@')[0],
          email: member.email,
          source: member.identities?.metadata?.source || 'import',
          joinedDate: member.joined_date || member.created_at,
          revenue: 0, // No conversion yet
          confidence: member.identities?.confidence_score || 0,
          touchpoints: 0,
          firstTouch: 'import',
          lastTouch: 'import',
          attributionMethod: 'csv_import'
        }));
      }

      return [];
    }

    // Map conversions to members with identity resolution
    return conversions.map(conversion => {
      // Try to get email from multiple sources
      const email = conversion.email ||
                   conversion.users?.email ||
                   conversion.identities?.emails?.[0] ||
                   'unknown@email.com';

      // Get name from user or identity metadata
      const name = conversion.users?.full_name ||
                  conversion.identities?.metadata?.name ||
                  conversion.identities?.metadata?.member_name ||
                  email.split('@')[0];

      // Use identity confidence if available, otherwise conversion confidence
      const confidence = conversion.identities?.confidence_score ||
                        conversion.confidence_score ||
                        0;

      return {
        id: conversion.id,
        name: name,
        email: email,
        source: conversion.last_touch_source || 'direct',
        joinedDate: conversion.converted_at,
        revenue: conversion.revenue || 0,
        confidence: confidence,
        touchpoints: conversion.attribution_window_days || 1,
        firstTouch: conversion.first_touch_source || 'direct',
        lastTouch: conversion.last_touch_source || 'direct',
        attributionMethod: conversion.attribution_method || 'unknown'
      };
    });
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

    // Calculate trends by comparing with previous period
    return Promise.all(Object.values(sourceMap).map(async (metrics: any) => {
      const avgConfidence = metrics.members > 0
        ? metrics.totalConfidence / metrics.members
        : 0;

      // Calculate real trend by comparing with previous period
      const previousPeriod = new Date();
      previousPeriod.setDate(previousPeriod.getDate() - 30);

      const { data: previousConversions } = await supabase
        .from('conversions')
        .select('last_touch_source, revenue')
        .eq('user_id', userId)
        .eq('last_touch_source', metrics.source)
        .lt('converted_at', previousPeriod.toISOString());

      const previousRevenue = previousConversions?.reduce((sum, c) => sum + (c.revenue || 0), 0) || 0;
      const changePercent = previousRevenue > 0
        ? ((metrics.revenue - previousRevenue) / previousRevenue) * 100
        : 0;

      const trend = changePercent > 5 ? 'up' : changePercent < -5 ? 'down' : 'stable';

      return {
        source: metrics.source,
        members: metrics.members,
        revenue: metrics.revenue,
        confidence: Math.round(avgConfidence),
        trend: trend as 'up' | 'down' | 'stable',
        changePercent: Math.round(changePercent)
      };
    })).then(results => results.sort((a, b) => b.revenue - a.revenue));
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
      // Try to derive pathways from conversions if no attribution_paths exist
      const { data: conversions } = await supabase
        .from('conversions')
        .select('*')
        .eq('user_id', userId)
        .order('converted_at', { ascending: false })
        .limit(50);

      if (!conversions || conversions.length === 0) {
        return [];
      }

      // Group conversions by journey pattern
      const derivedPaths: { [key: string]: any } = {};

      conversions.forEach(conversion => {
        const firstTouch = conversion.first_touch_source || 'direct';
        const lastTouch = conversion.last_touch_source || 'direct';
        const pathName = firstTouch === lastTouch ? firstTouch : `${firstTouch} → ${lastTouch}`;

        if (!derivedPaths[pathName]) {
          derivedPaths[pathName] = {
            name: pathName,
            touchpoints: conversion.attribution_window_days || 1,
            conversions: 0,
            totalTime: 0,
            revenue: 0,
            sources: new Set([firstTouch, lastTouch].filter(s => s))
          };
        }

        derivedPaths[pathName].conversions++;
        derivedPaths[pathName].revenue += conversion.revenue || 0;
        derivedPaths[pathName].totalTime += conversion.attribution_window_days || 1;
      });

      return Object.values(derivedPaths).map((pathway: any) => {
        const avgDays = pathway.conversions > 0
          ? pathway.totalTime / pathway.conversions
          : 0;

        const avgTime = avgDays < 1 ? '< 1 day' :
                       avgDays === 1 ? '1 day' :
                       `${Math.round(avgDays)} days`;

        return {
          name: pathway.name,
          touchpoints: pathway.touchpoints,
          conversions: pathway.conversions,
          avgTime,
          revenue: pathway.revenue,
          topSources: Array.from(pathway.sources)
        };
      }).sort((a, b) => b.conversions - a.conversions).slice(0, 5);
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