'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Link2,
  MousePointerClick,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ConversionData {
  id: string;
  skool_email: string;
  skool_name: string;
  skool_username: string;
  joined_at: string;
  membership_type: 'free' | 'paid';
  revenue_tracked: number;
  attributed_link_id: string;
  attribution_data: any;
  confidence_score: number;
  created_at: string;
  metadata: {
    attributed_revenue: Record<string, number>;
    attribution_method: string;
  };
}

interface CampaignMetrics {
  campaign_name: string;
  total_clicks: number;
  conversions: number;
  conversion_rate: number;
  revenue: number;
  avg_confidence: number;
  top_sources: Array<{ source: string; count: number }>;
}

export default function AnalyticsPage() {
  const [conversions, setConversions] = useState<ConversionData[]>([]);
  const [campaignMetrics, setCampaignMetrics] = useState<CampaignMetrics[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [avgConfidence, setAvgConfidence] = useState(0);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    switch (timeRange) {
      case '24h': startDate.setHours(now.getHours() - 24); break;
      case '7d': startDate.setDate(now.getDate() - 7); break;
      case '30d': startDate.setDate(now.getDate() - 30); break;
      case '90d': startDate.setDate(now.getDate() - 90); break;
    }

    // Fetch conversions
    const { data: conversionData, error: conversionError } = await supabase
      .from('conversions')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (conversionData && !conversionError) {
      setConversions(conversionData);

      // Calculate metrics
      const revenue = conversionData.reduce((sum, c) => sum + (c.revenue_tracked || 0), 0);
      setTotalRevenue(revenue);

      const avgConf = conversionData.reduce((sum, c) => sum + (c.confidence_score || 0), 0) / conversionData.length;
      setAvgConfidence(avgConf || 0);
    }

    // Fetch clicks for conversion rate
    const { data: clickData, error: clickError } = await supabase
      .from('clicks')
      .select('campaign_name, utm_source')
      .gte('clicked_at', startDate.toISOString());

    if (clickData && conversionData) {
      const totalClicks = clickData.length;
      const totalConversions = conversionData.length;
      setConversionRate(totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0);

      // Calculate campaign metrics
      const campaignMap = new Map<string, CampaignMetrics>();

      // Group clicks by campaign
      clickData.forEach(click => {
        const campaign = click.campaign_name || 'Unknown';
        if (!campaignMap.has(campaign)) {
          campaignMap.set(campaign, {
            campaign_name: campaign,
            total_clicks: 0,
            conversions: 0,
            conversion_rate: 0,
            revenue: 0,
            avg_confidence: 0,
            top_sources: []
          });
        }
        const metrics = campaignMap.get(campaign)!;
        metrics.total_clicks++;
      });

      // Add conversion data to campaigns
      conversionData.forEach((conversion: ConversionData) => {
        if (conversion.attribution_data) {
          Object.entries(conversion.attribution_data).forEach(([campaign, data]: [string, any]) => {
            if (campaignMap.has(campaign)) {
              const metrics = campaignMap.get(campaign)!;
              metrics.conversions++;
              metrics.revenue += (conversion.metadata?.attributed_revenue?.[campaign] || 0);
              metrics.avg_confidence = (metrics.avg_confidence + conversion.confidence_score) / 2;
            }
          });
        }
      });

      // Calculate conversion rates and sort
      const metricsArray = Array.from(campaignMap.values());
      metricsArray.forEach(m => {
        m.conversion_rate = m.total_clicks > 0 ? (m.conversions / m.total_clicks) * 100 : 0;
      });
      metricsArray.sort((a, b) => b.revenue - a.revenue);

      setCampaignMetrics(metricsArray);
    }

    setLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-500">High ({score}%)</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-500">Medium ({score}%)</Badge>;
    return <Badge className="bg-red-500">Low ({score}%)</Badge>;
  };

  const getAttributionMethodIcon = (method: string) => {
    switch (method) {
      case 'direct': return <Link2 className="h-4 w-4" />;
      case 'fingerprint': return <Target className="h-4 w-4" />;
      case 'email': return <Users className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Attribution Analytics</h1>
          <p className="text-muted-foreground">Track your content ROI and conversion sources</p>
        </div>

        {/* Time Range Selector */}
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="24h">24 Hours</TabsTrigger>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {conversions.filter(c => c.membership_type === 'paid').length} paid members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              {conversions.length} conversions tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConfidence.toFixed(0)}%</div>
            <Progress value={avgConfidence} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignMetrics.length}</div>
            <p className="text-xs text-muted-foreground">
              Driving conversions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Revenue and conversion metrics by campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading analytics...</p>
            ) : campaignMetrics.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No campaign data available</p>
            ) : (
              campaignMetrics.slice(0, 5).map((campaign, index) => (
                <div key={campaign.campaign_name} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">#{index + 1}</span>
                      <h4 className="font-medium">{campaign.campaign_name}</h4>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MousePointerClick className="h-3 w-3" />
                        {campaign.total_clicks} clicks
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {campaign.conversions} conversions
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {campaign.conversion_rate.toFixed(1)}% rate
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatCurrency(campaign.revenue)}</p>
                    <Badge variant="outline" className="mt-1">
                      {campaign.avg_confidence.toFixed(0)}% confidence
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Conversions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Conversions</CardTitle>
          <CardDescription>Latest tracked conversions with attribution details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {conversions.slice(0, 10).map((conversion) => (
              <div key={conversion.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {getAttributionMethodIcon(conversion.metadata?.attribution_method || 'unknown')}
                  <div>
                    <p className="font-medium">
                      {conversion.skool_name || conversion.skool_email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(conversion.created_at).toLocaleDateString()} • {conversion.membership_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {conversion.revenue_tracked > 0 && (
                    <span className="font-semibold">{formatCurrency(conversion.revenue_tracked)}</span>
                  )}
                  {getConfidenceBadge(conversion.confidence_score)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}