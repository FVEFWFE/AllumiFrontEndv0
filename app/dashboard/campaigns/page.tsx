'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  MousePointerClick,
  BarChart3,
  Activity,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Calculator,
  AlertCircle
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import {
  getROIByCampaign,
  getConversionsBySource,
  updateCampaignSpend,
  getCampaignSpend
} from '@/lib/analytics-data';
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Campaign {
  name: string;
  source: string;
  clicks: number;
  conversions: number;
  revenue: number;
  spend: number;
  roi: number;
  conversionRate: number;
  avgOrderValue: number;
  status: 'active' | 'paused' | 'completed';
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [editingSpend, setEditingSpend] = useState<string | null>(null);
  const [spendInput, setSpendInput] = useState('');
  const [totalStats, setTotalStats] = useState({
    totalSpend: 0,
    totalRevenue: 0,
    totalROI: 0,
    totalConversions: 0
  });

  useEffect(() => {
    fetchCampaignData();
  }, [timeRange]);

  const fetchCampaignData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const startDate = new Date();
      switch (timeRange) {
        case '7d': startDate.setDate(startDate.getDate() - 7); break;
        case '30d': startDate.setDate(startDate.getDate() - 30); break;
        case '90d': startDate.setDate(startDate.getDate() - 90); break;
      }

      const { data: clicks } = await supabase
        .from('clicks')
        .select('*')
        .gte('clicked_at', startDate.toISOString());

      const { data: conversions } = await supabase
        .from('conversions')
        .select('*')
        .gte('converted_at', startDate.toISOString());

      const campaignMap = new Map<string, Campaign>();

      clicks?.forEach(click => {
        const campaignName = click.utm_campaign || click.campaign_name || 'Direct';
        const source = click.utm_source || 'organic';

        if (!campaignMap.has(campaignName)) {
          campaignMap.set(campaignName, {
            name: campaignName,
            source: source,
            clicks: 0,
            conversions: 0,
            revenue: 0,
            spend: 0,
            roi: 0,
            conversionRate: 0,
            avgOrderValue: 0,
            status: 'active'
          });
        }

        const campaign = campaignMap.get(campaignName)!;
        campaign.clicks++;
      });

      conversions?.forEach(conversion => {
        const campaignName = conversion.utm_campaign ||
                           conversion.last_touch_campaign ||
                           'Direct';

        if (!campaignMap.has(campaignName)) {
          campaignMap.set(campaignName, {
            name: campaignName,
            source: conversion.last_touch_source || 'direct',
            clicks: 0,
            conversions: 0,
            revenue: 0,
            spend: 0,
            roi: 0,
            conversionRate: 0,
            avgOrderValue: 0,
            status: 'active'
          });
        }

        const campaign = campaignMap.get(campaignName)!;
        campaign.conversions++;
        campaign.revenue += conversion.revenue || 0;
      });

      const campaignsArray = await Promise.all(
        Array.from(campaignMap.values()).map(async (campaign) => {
          const spend = await getCampaignSpend(session.user.id, campaign.name);
          campaign.spend = spend;
          campaign.conversionRate = campaign.clicks > 0
            ? (campaign.conversions / campaign.clicks) * 100
            : 0;
          campaign.avgOrderValue = campaign.conversions > 0
            ? campaign.revenue / campaign.conversions
            : 0;
          campaign.roi = campaign.spend > 0
            ? ((campaign.revenue - campaign.spend) / campaign.spend) * 100
            : campaign.revenue > 0 ? 100 : 0;
          return campaign;
        })
      );

      setCampaigns(campaignsArray.sort((a, b) => b.revenue - a.revenue));

      const totals = campaignsArray.reduce((acc, campaign) => ({
        totalSpend: acc.totalSpend + campaign.spend,
        totalRevenue: acc.totalRevenue + campaign.revenue,
        totalROI: 0,
        totalConversions: acc.totalConversions + campaign.conversions
      }), { totalSpend: 0, totalRevenue: 0, totalROI: 0, totalConversions: 0 });

      totals.totalROI = totals.totalSpend > 0
        ? ((totals.totalRevenue - totals.totalSpend) / totals.totalSpend) * 100
        : 0;

      setTotalStats(totals);
    } catch (error) {
      console.error('Error fetching campaign data:', error);
      toast.error('Failed to load campaign data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSpend = async (campaignName: string) => {
    const spend = parseFloat(spendInput);
    if (isNaN(spend) || spend < 0) {
      toast.error('Please enter a valid spend amount');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const success = await updateCampaignSpend(session.user.id, campaignName, spend);

      if (success) {
        toast.success('Campaign spend updated');
        setEditingSpend(null);
        setSpendInput('');
        fetchCampaignData();
      } else {
        toast.error('Failed to update spend');
      }
    } catch (error) {
      console.error('Error updating spend:', error);
      toast.error('Failed to update spend');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getRoiBadge = (roi: number) => {
    if (roi >= 100) return <Badge className="bg-green-500">+{roi.toFixed(0)}%</Badge>;
    if (roi >= 50) return <Badge className="bg-yellow-500">+{roi.toFixed(0)}%</Badge>;
    if (roi >= 0) return <Badge variant="secondary">+{roi.toFixed(0)}%</Badge>;
    return <Badge variant="destructive">{roi.toFixed(0)}%</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campaign Performance</h1>
          <p className="text-muted-foreground mt-2">
            Track ROI and optimize your content marketing campaigns
          </p>
        </div>

        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalStats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {totalStats.totalConversions} conversions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ad Spend</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalStats.totalSpend)}</div>
            <p className="text-xs text-muted-foreground">
              Across {campaigns.length} campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats.totalROI >= 0 ? '+' : ''}{totalStats.totalROI.toFixed(0)}%
            </div>
            <Progress
              value={Math.min(Math.max(totalStats.totalROI, 0), 200)}
              max={200}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalStats.totalRevenue - totalStats.totalSpend)}
            </div>
            <p className="text-xs text-muted-foreground">
              Revenue minus ad spend
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Individual campaign performance metrics</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Track New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading campaigns...</p>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No campaigns found</p>
              <p className="text-sm text-muted-foreground">
                Start tracking campaigns by adding UTM parameters to your links
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.name} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{campaign.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{campaign.source}</Badge>
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{formatCurrency(campaign.revenue)}</p>
                      {getRoiBadge(campaign.roi)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Clicks</p>
                      <p className="font-medium flex items-center gap-1">
                        <MousePointerClick className="h-3 w-3" />
                        {campaign.clicks}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Conversions</p>
                      <p className="font-medium flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {campaign.conversions}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Conv. Rate</p>
                      <p className="font-medium">{campaign.conversionRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg. Order</p>
                      <p className="font-medium">{formatCurrency(campaign.avgOrderValue)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ad Spend</p>
                      {editingSpend === campaign.name ? (
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            value={spendInput}
                            onChange={(e) => setSpendInput(e.target.value)}
                            placeholder="0"
                            className="h-6 w-20 text-sm"
                          />
                          <Button
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => handleUpdateSpend(campaign.name)}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <p className="font-medium flex items-center gap-1">
                          {formatCurrency(campaign.spend)}
                          <button
                            onClick={() => {
                              setEditingSpend(campaign.name);
                              setSpendInput(campaign.spend.toString());
                            }}
                            className="ml-1 text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                        </p>
                      )}
                    </div>
                  </div>

                  {campaign.spend > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">ROI Progress</span>
                        <span className="font-medium">
                          {formatCurrency(campaign.revenue - campaign.spend)} profit
                        </span>
                      </div>
                      <Progress
                        value={Math.min(Math.max(campaign.roi, -100), 300) + 100}
                        max={400}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Pro Tip: Track Your Campaign Spend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">
            Enter your ad spend for each campaign to calculate accurate ROI. This helps you:
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Identify your most profitable campaigns</li>
            <li>• Optimize budget allocation</li>
            <li>• Calculate true return on ad spend (ROAS)</li>
            <li>• Make data-driven marketing decisions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}