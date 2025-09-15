import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';

interface AttributionMetrics {
  totalEvents: number;
  totalRevenue: number;
  channels: ChannelData[];
  campaigns: CampaignData[];
}

interface ChannelData {
  name: string;
  events: number;
  revenue: number;
  conversions: number;
  revenueShare: number;
}

interface CampaignData {
  name: string;
  events: number;
  revenue: number;
  conversions: number;
  revenueShare: number;
}

interface RevenueAnalytics {
  period: {
    days: number;
    from: string;
    to: string;
  };
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    avgDaysToConversion: number;
    dailyAverage: number;
    projectedMonthly: number;
    revenueByModel: Array<{
      model: string;
      revenue: number;
      percentage: number;
    }>;
    revenueByChannel: Array<{
      channel: string;
      revenue: number;
      percentage: number;
    }>;
    dailyTrend: Array<{
      date: string;
      revenue: number;
    }>;
  };
  channelPerformance: Array<{
    channel: string;
    visits: number;
    signups: number;
    purchases: number;
    revenue: number;
    conversionRate: number;
    avgOrderValue: number;
  }>;
  campaignPerformance: Array<{
    campaign: string;
    orders: number;
    revenue: number;
    customers: number;
    avgOrderValue: number;
  }>;
  conversionPaths: Array<{
    path: string;
    conversions: number;
    revenue: number;
    avgValue: number;
  }>;
  roiByChannel: Array<{
    channel: string;
    spend: number;
    revenue: number;
    profit: number;
    roi: number;
    roas: number;
  }>;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch attribution data');
  }
  return response.json();
};

/**
 * Hook to fetch attribution events
 */
export function useAttributionEvents(
  communityId?: string,
  userId?: string,
  days: number = 30
) {
  const params = new URLSearchParams();
  if (communityId) params.append('community_id', communityId);
  if (userId) params.append('user_id', userId);
  params.append('days', days.toString());
  
  const { data, error, isLoading, mutate } = useSWR<{
    events: any[];
    metrics: AttributionMetrics;
    period: string;
  }>(
    `/api/attribution/track?${params.toString()}`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );
  
  return {
    events: data?.events || [],
    metrics: data?.metrics || null,
    period: data?.period || `${days} days`,
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch revenue analytics
 */
export function useRevenueAnalytics(
  communitySlug: string,
  days: number = 30,
  model: string = 'all'
) {
  const params = new URLSearchParams();
  params.append('community', communitySlug);
  params.append('days', days.toString());
  params.append('model', model);
  
  const { data, error, isLoading, mutate } = useSWR<RevenueAnalytics>(
    communitySlug ? `/api/analytics/revenue?${params.toString()}` : null,
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
    }
  );
  
  return {
    analytics: data || null,
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to track and fetch real-time conversions
 */
export function useRealTimeConversions(communityId?: string) {
  const [conversions, setConversions] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    if (!communityId) return;
    
    // In production, this would connect to a WebSocket or Server-Sent Events
    // For now, we'll poll the API
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/attribution/track?community_id=${communityId}&days=1`);
        const data = await response.json();
        
        // Filter for conversion events
        const recentConversions = data.events?.filter((e: any) => 
          e.event_type === 'purchase' && 
          new Date(e.created_at).getTime() > Date.now() - 3600000 // Last hour
        ) || [];
        
        setConversions(recentConversions);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to fetch real-time conversions:', error);
        setIsConnected(false);
      }
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, [communityId]);
  
  return {
    conversions,
    isConnected,
  };
}

/**
 * Hook to calculate attribution ROI
 */
export function useAttributionROI(
  revenue: number,
  spend: Record<string, number>
) {
  const [roi, setROI] = useState<{
    total: number;
    byChannel: Record<string, number>;
    roas: number;
  }>({
    total: 0,
    byChannel: {},
    roas: 0,
  });
  
  useEffect(() => {
    const totalSpend = Object.values(spend).reduce((sum, val) => sum + val, 0);
    const totalROI = totalSpend > 0 ? ((revenue - totalSpend) / totalSpend) * 100 : 0;
    const roas = totalSpend > 0 ? revenue / totalSpend : 0;
    
    const byChannel: Record<string, number> = {};
    Object.entries(spend).forEach(([channel, channelSpend]) => {
      if (channelSpend > 0) {
        // This would need actual channel revenue data
        // For now, we'll estimate based on proportion
        const channelRevenue = revenue * (channelSpend / totalSpend);
        byChannel[channel] = ((channelRevenue - channelSpend) / channelSpend) * 100;
      }
    });
    
    setROI({
      total: totalROI,
      byChannel,
      roas,
    });
  }, [revenue, spend]);
  
  return roi;
}

/**
 * Hook to get attribution summary stats
 */
export function useAttributionSummary(communityId?: string) {
  const { events, metrics, isLoading } = useAttributionEvents(communityId, undefined, 30);
  
  const summary = {
    totalTouchpoints: events.length,
    uniqueVisitors: new Set(events.map(e => e.session_id)).size,
    topChannel: metrics?.channels?.[0]?.name || 'direct',
    topCampaign: metrics?.campaigns?.[0]?.name || 'none',
    totalRevenue: metrics?.totalRevenue || 0,
    conversionRate: 0,
  };
  
  // Calculate conversion rate
  if (events.length > 0) {
    const conversions = events.filter(e => e.event_type === 'purchase').length;
    const sessions = new Set(events.map(e => e.session_id)).size;
    summary.conversionRate = sessions > 0 ? (conversions / sessions) * 100 : 0;
  }
  
  return {
    summary,
    isLoading,
  };
}

/**
 * Hook for cohort analysis
 */
export function useCohortAnalysis(communityId: string, cohortType: 'weekly' | 'monthly' = 'weekly') {
  const [cohorts, setCohorts] = useState<any[]>([]);
  
  useEffect(() => {
    // This would fetch cohort data from the API
    // For now, we'll generate sample data
    const sampleCohorts = Array.from({ length: 8 }, (_, i) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (7 * (7 - i)));
      
      return {
        period: weekStart.toISOString().split('T')[0],
        users: Math.floor(Math.random() * 100) + 20,
        week0: 100,
        week1: Math.floor(Math.random() * 30) + 60,
        week2: Math.floor(Math.random() * 20) + 40,
        week3: Math.floor(Math.random() * 15) + 30,
        week4: Math.floor(Math.random() * 10) + 20,
      };
    });
    
    setCohorts(sampleCohorts);
  }, [communityId, cohortType]);
  
  return cohorts;
}