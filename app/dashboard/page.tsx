'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DashboardStats {
  totalLinks: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
}

interface CampaignData {
  campaign_name: string;
  clicks: number;
  conversions: number;
  conversion_rate: number;
  attributed_revenue: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [recentLinks, setRecentLinks] = useState<any[]>([]);
  const [recentConversions, setRecentConversions] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/auth/login');
    }
  };

  const loadDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // Load stats
      const [linksRes, clicksRes, conversionsRes] = await Promise.all([
        supabase.from('links').select('*').eq('user_id', userId),
        supabase.from('clicks').select('*').eq('user_id', userId),
        supabase.from('conversions').select('*').eq('user_id', userId)
      ]);

      const totalLinks = linksRes.data?.length || 0;
      const totalClicks = clicksRes.data?.length || 0;
      const totalConversions = conversionsRes.data?.length || 0;
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

      setStats({
        totalLinks,
        totalClicks,
        totalConversions,
        conversionRate
      });

      // Load recent links
      const { data: links } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRecentLinks(links || []);

      // Load recent conversions
      const { data: conversions } = await supabase
        .from('conversions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentConversions(conversions || []);

      // Calculate campaign performance
      if (clicksRes.data && conversionsRes.data) {
        const campaignMap = new Map<string, CampaignData>();
        
        // Count clicks per campaign
        clicksRes.data.forEach(click => {
          const name = click.campaign_name || 'Direct';
          if (!campaignMap.has(name)) {
            campaignMap.set(name, {
              campaign_name: name,
              clicks: 0,
              conversions: 0,
              conversion_rate: 0,
              attributed_revenue: 0
            });
          }
          const campaign = campaignMap.get(name)!;
          campaign.clicks++;
        });

        // Count conversions per campaign
        conversionsRes.data.forEach(conversion => {
          if (conversion.attribution_data) {
            Object.entries(conversion.attribution_data).forEach(([campaign, data]: [string, any]) => {
              if (!campaignMap.has(campaign)) {
                campaignMap.set(campaign, {
                  campaign_name: campaign,
                  clicks: 0,
                  conversions: 0,
                  conversion_rate: 0,
                  attributed_revenue: 0
                });
              }
              const campaignData = campaignMap.get(campaign)!;
              campaignData.conversions++;
              campaignData.attributed_revenue += conversion.revenue_tracked || 0;
            });
          }
        });

        // Calculate conversion rates
        campaignMap.forEach(campaign => {
          campaign.conversion_rate = campaign.clicks > 0 
            ? (campaign.conversions / campaign.clicks) * 100 
            : 0;
        });

        setCampaigns(Array.from(campaignMap.values()));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const copyLink = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Attribution Dashboard</h1>
          <p className="text-muted-foreground">Track your Skool community growth and attribution</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Total Links</div>
            <div className="text-3xl font-bold text-foreground">{stats?.totalLinks || 0}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Total Clicks</div>
            <div className="text-3xl font-bold text-foreground">{stats?.totalClicks || 0}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Conversions</div>
            <div className="text-3xl font-bold text-foreground">{stats?.totalConversions || 0}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Conversion Rate</div>
            <div className="text-3xl font-bold text-foreground">
              {stats?.conversionRate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Campaign Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-muted-foreground">Campaign</th>
                  <th className="text-right p-2 text-muted-foreground">Clicks</th>
                  <th className="text-right p-2 text-muted-foreground">Conversions</th>
                  <th className="text-right p-2 text-muted-foreground">CVR</th>
                  <th className="text-right p-2 text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-2 text-foreground">{campaign.campaign_name}</td>
                    <td className="text-right p-2 text-foreground">{campaign.clicks}</td>
                    <td className="text-right p-2 text-foreground">{campaign.conversions}</td>
                    <td className="text-right p-2 text-foreground">
                      {campaign.conversion_rate.toFixed(1)}%
                    </td>
                    <td className="text-right p-2 text-foreground">
                      ${campaign.attributed_revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {campaigns.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-muted-foreground">
                      No campaign data yet. Create your first tracking link!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Links */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Links</h2>
            <div className="space-y-3">
              {recentLinks.map(link => (
                <div key={link.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-foreground">{link.campaign_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {link.clicks} clicks • {formatDate(link.created_at)}
                    </div>
                  </div>
                  <button
                    onClick={() => copyLink(`${process.env.NEXT_PUBLIC_APP_URL}/l/${link.short_id}`)}
                    className="px-3 py-1 text-xs bg-accent text-accent-foreground rounded hover:opacity-90"
                  >
                    Copy
                  </button>
                </div>
              ))}
              {recentLinks.length === 0 && (
                <div className="text-center p-4 text-muted-foreground">
                  No links created yet
                </div>
              )}
            </div>
          </div>

          {/* Recent Conversions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Conversions</h2>
            <div className="space-y-3">
              {recentConversions.map(conversion => (
                <div key={conversion.id} className="p-3 bg-background rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {conversion.skool_name || conversion.skool_email}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(conversion.joined_at)}
                      </div>
                    </div>
                    <div className="text-xs text-accent">
                      {conversion.confidence_score}% confidence
                    </div>
                  </div>
                  {conversion.attribution_data && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Source: {Object.keys(conversion.attribution_data)[0]}
                    </div>
                  )}
                </div>
              ))}
              {recentConversions.length === 0 && (
                <div className="text-center p-4 text-muted-foreground">
                  No conversions tracked yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Link Button */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => router.push('/dashboard/links/create')}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium shadow-lg hover:opacity-90 transition"
          >
            + Create Link
          </button>
        </div>
      </div>
    </div>
  );
}