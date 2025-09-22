import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getConversionsBySource(userId: string) {
  const { data } = await supabase
    .from('conversions')
    .select(`
      *,
      identities (
        emails,
        confidence_score
      )
    `)
    .eq('user_id', userId)
    .order('converted_at', { ascending: false });

  const sourceMap = new Map();
  data?.forEach(conversion => {
    const source = conversion.last_touch_source || 'direct';
    if (!sourceMap.has(source)) {
      sourceMap.set(source, { count: 0, revenue: 0 });
    }
    const current = sourceMap.get(source);
    current.count++;
    current.revenue += conversion.revenue || 0;
  });

  return Array.from(sourceMap.entries()).map(([source, stats]) => ({
    source,
    conversions: stats.count,
    revenue: stats.revenue
  }));
}

export async function getConversionFunnel(userId: string) {
  const { data: clicks } = await supabase
    .from('clicks')
    .select('count')
    .eq('user_id', userId)
    .single();

  const { data: emailCaptures } = await supabase
    .from('pixel_events')
    .select('count')
    .eq('user_id', userId)
    .eq('event_name', 'email_captured')
    .single();

  const { data: conversions } = await supabase
    .from('conversions')
    .select('count')
    .eq('user_id', userId)
    .single();

  return {
    clicks: clicks?.count || 0,
    emailCaptures: emailCaptures?.count || 0,
    conversions: conversions?.count || 0
  };
}

export async function getROIByCampaign(userId: string) {
  const { data } = await supabase
    .from('conversions')
    .select('utm_campaign, revenue')
    .eq('user_id', userId)
    .not('utm_campaign', 'is', null);

  const campaignROI = new Map();
  data?.forEach(conversion => {
    const campaign = conversion.utm_campaign;
    if (!campaignROI.has(campaign)) {
      campaignROI.set(campaign, { revenue: 0, spend: 0 });
    }
    campaignROI.get(campaign).revenue += conversion.revenue || 0;
  });

  return Array.from(campaignROI.entries()).map(([campaign, stats]) => ({
    campaign,
    revenue: stats.revenue,
    spend: stats.spend,
    roi: stats.spend > 0 ? ((stats.revenue - stats.spend) / stats.spend * 100) : 0
  }));
}

export async function getRevenueOverTime(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from('conversions')
    .select('converted_at, revenue')
    .eq('user_id', userId)
    .gte('converted_at', startDate.toISOString())
    .order('converted_at', { ascending: true });

  const revenueByDay = new Map();
  data?.forEach(conversion => {
    const date = new Date(conversion.converted_at).toLocaleDateString();
    if (!revenueByDay.has(date)) {
      revenueByDay.set(date, 0);
    }
    revenueByDay.set(date, revenueByDay.get(date) + (conversion.revenue || 0));
  });

  return Array.from(revenueByDay.entries()).map(([date, revenue]) => ({
    date,
    revenue
  }));
}

export async function getAttributionStats(userId: string) {
  const { data: conversions } = await supabase
    .from('conversions')
    .select('confidence_score, attribution_method')
    .eq('user_id', userId);

  const totalConversions = conversions?.length || 0;
  const avgConfidence = totalConversions > 0
    ? conversions!.reduce((sum, c) => sum + (c.confidence_score || 0), 0) / totalConversions
    : 0;

  const methodCounts = new Map();
  conversions?.forEach(conversion => {
    const method = conversion.attribution_method || 'unknown';
    methodCounts.set(method, (methodCounts.get(method) || 0) + 1);
  });

  return {
    totalConversions,
    avgConfidence: Math.round(avgConfidence),
    attributionMethods: Array.from(methodCounts.entries()).map(([method, count]) => ({
      method,
      count,
      percentage: totalConversions > 0 ? (count / totalConversions * 100) : 0
    }))
  };
}

export async function getCampaignSpend(userId: string, campaignName: string): Promise<number> {
  const { data } = await supabase
    .from('campaign_spend')
    .select('amount')
    .eq('user_id', userId)
    .eq('campaign_name', campaignName)
    .single();

  return data?.amount || 0;
}

export async function updateCampaignSpend(userId: string, campaignName: string, amount: number) {
  const { error } = await supabase
    .from('campaign_spend')
    .upsert({
      user_id: userId,
      campaign_name: campaignName,
      amount: amount,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error updating campaign spend:', error);
    return false;
  }
  return true;
}