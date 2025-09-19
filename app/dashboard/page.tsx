'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import TooltipGuide from '@/components/onboarding/TooltipGuide';
import EmptyState from '@/components/dashboard/EmptyState';
import SetupProgress from '@/components/dashboard/SetupProgress';
import IntegrationStatus from '@/components/dashboard/IntegrationStatus';

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
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/sign-in');
    }
  };

  const loadDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // Get all user's links with their click counts from the clicks column
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (linksError) {
        console.error('Error loading links:', linksError);
        return;
      }

      // Get all clicks for this user
      const { data: clicks } = await supabase
        .from('clicks')
        .select('*')
        .eq('user_id', userId);

      // Get conversions count
      const { data: conversions, count: conversionsCount } = await supabase
        .from('conversions')
        .select('*', { count: 'exact', head: false })
        .eq('user_id', userId);

      // Calculate total clicks from links table (using the clicks column)
      const totalClicks = links?.reduce((sum, link) => {
        return sum + (link.clicks || 0);
      }, 0) || 0;

      const totalLinks = links?.length || 0;
      const totalConversions = conversionsCount || 0;
      const conversionRate = totalClicks > 0
        ? (totalConversions / totalClicks) * 100
        : 0;

      setStats({
        totalLinks,
        totalClicks,
        totalConversions,
        conversionRate
      });

      setRecentLinks(links?.slice(0, 5) || []);

      // Check if user needs onboarding (no links created yet)
      if (!links || links.length === 0) {
        const hasSeenOnboarding = localStorage.getItem('onboarding_completed');
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      }

      // Load recent conversions
      const { data: recentConversionsData } = await supabase
        .from('conversions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentConversions(recentConversionsData || []);

      // Calculate campaign performance from links data
      if (links && links.length > 0) {
        const campaignStats = links.map(link => {
          // Calculate conversions for this specific link/campaign
          const linkConversions = conversions?.filter(conv => {
            // Check if conversion is attributed to this campaign
            if (conv.attribution_data) {
              return Object.keys(conv.attribution_data).includes(link.campaign_name);
            }
            return false;
          }).length || 0;

          const linkClicks = link.clicks || 0;
          const conversionRate = linkClicks > 0 ? (linkConversions / linkClicks) * 100 : 0;

          // Calculate attributed revenue for this campaign
          const attributedRevenue = conversions?.reduce((sum, conv) => {
            if (conv.attribution_data && conv.attribution_data[link.campaign_name]) {
              return sum + (conv.revenue_tracked || 0);
            }
            return sum;
          }, 0) || 0;

          return {
            campaign_name: link.campaign_name,
            clicks: linkClicks,
            conversions: linkConversions,
            conversion_rate: conversionRate,
            attributed_revenue: attributedRevenue
          };
        });

        setCampaigns(campaignStats);
      } else {
        setCampaigns([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const copyLink = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Link copied to clipboard!');
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
      {/* Onboarding Flow for New Users */}
      {showOnboarding && (
        <OnboardingFlow
          onComplete={() => {
            setShowOnboarding(false);
            loadDashboardData(); // Refresh data after onboarding
          }}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header with Create Link Button */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Attribution Dashboard</h1>
            <p className="text-muted-foreground">Track your Skool community growth and attribution</p>
          </div>
          <TooltipGuide
            id="create-link-button-top"
            title="Create Tracking Links"
            content="Create unique links for each piece of content to track what drives conversions."
            position="left"
          >
            <button
              onClick={() => router.push('/dashboard/links/create')}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2 group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Link
            </button>
          </TooltipGuide>
        </div>

        {/* Setup Progress for New Users */}
        <SetupProgress />

        {/* Integration Status */}
        <IntegrationStatus />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Total Links</div>
            <div className="text-3xl font-bold text-foreground">{stats?.totalLinks || 0}</div>
            {stats?.totalLinks === 0 && (
              <button
                onClick={() => router.push('/dashboard/links/create')}
                className="text-xs text-accent hover:underline mt-2"
              >
                Create your first →
              </button>
            )}
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
                    <td colSpan={5} className="p-0">
                      <EmptyState type="campaigns" />
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Recent Links</h2>
              <button
                onClick={() => router.push('/dashboard/links/create')}
                className="text-sm px-3 py-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition"
              >
                + New Link
              </button>
            </div>
            <div className="space-y-3">
              {recentLinks.map(link => {
                const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/l/${link.short_id}`;
                const clickCount = link.clicks || 0;

                return (
                  <div key={link.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {link.campaign_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {clickCount} clicks • {formatDate(link.created_at)}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                        {link.destination_url}
                      </div>
                    </div>
                    <button
                      onClick={() => copyLink(shortUrl)}
                      className="px-3 py-1 text-xs bg-accent text-accent-foreground rounded hover:opacity-90"
                    >
                      Copy
                    </button>
                  </div>
                );
              })}
              {recentLinks.length === 0 && (
                <EmptyState type="links" />
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
                <EmptyState type="conversions" />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}