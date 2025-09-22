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
import DemoModeDashboard from '@/components/dashboard/DemoModeDashboard';
import {
  getDashboardStats,
  getAttributionSources,
  getConversionPaths,
  getRecentActivity,
  getCampaignPerformance,
  type DashboardStats as DashboardStatsType
} from '@/lib/dashboard-data';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CampaignData {
  name: string;
  clicks: number;
  sources: string;
  status: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [recentLinks, setRecentLinks] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDemoMode, setShowDemoMode] = useState(false);

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

      // Use new dashboard data functions
      const dashboardStats = await getDashboardStats(userId);
      setStats(dashboardStats);

      // Get campaign performance
      const campaignData = await getCampaignPerformance(userId);
      setCampaigns(campaignData);

      // Get recent activity
      const activity = await getRecentActivity(userId, 10);
      setRecentActivity(activity);

      // Get all user's links for recent links display
      const { data: links } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentLinks(links || []);

      // Check if user needs onboarding
      if (!links || links.length === 0) {
        const hasSeenDemo = localStorage.getItem('demo_completed');
        const hasSeenOnboarding = localStorage.getItem('onboarding_completed');
        if (!hasSeenDemo && !hasSeenOnboarding) {
          setShowDemoMode(true);
        } else if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
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

  // Show demo mode for brand new users
  if (showDemoMode && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <DemoModeDashboard
            onStartReal={() => {
              localStorage.setItem('demo_completed', 'true');
              setShowDemoMode(false);
              setShowOnboarding(true);
            }}
          />
        </div>
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
            localStorage.setItem('onboarding_completed', 'true');
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
            <div className="text-sm text-muted-foreground mb-2">Attributed Members</div>
            <div className="text-3xl font-bold text-foreground">{stats?.attributedMembers || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              of {stats?.totalMembers || 0} total
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Revenue</div>
            <div className="text-3xl font-bold text-foreground">
              ${(stats?.revenue || 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Avg Confidence</div>
            <div className="text-3xl font-bold text-foreground">{stats?.avgConfidence || 0}%</div>
            <div className="text-xs text-muted-foreground mt-1">attribution accuracy</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Top Source</div>
            <div className="text-2xl font-bold text-foreground capitalize">
              {stats?.topSource || 'Direct'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats?.conversionRate.toFixed(1)}% CVR
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
                  <th className="text-right p-2 text-muted-foreground">Sources</th>
                  <th className="text-right p-2 text-muted-foreground">Status</th>
                  <th className="text-right p-2 text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-2 text-foreground">{campaign.name}</td>
                    <td className="text-right p-2 text-foreground">{campaign.clicks}</td>
                    <td className="text-right p-2 text-foreground">{campaign.sources || 'direct'}</td>
                    <td className="text-right p-2 text-foreground">
                      <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded">
                        {campaign.status}
                      </span>
                    </td>
                    <td className="text-right p-2 text-foreground">-</td>
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

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map(activity => (
                <div key={activity.id} className="p-3 bg-background rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {activity.type === 'click' ? '👆 Click' : '✅ Conversion'}
                        {' on '}{activity.linkName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                    <div className="text-xs text-accent">
                      {activity.source || 'direct'}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {activity.device} • {activity.location}
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <EmptyState type="activity" />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}