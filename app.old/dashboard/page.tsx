'use client';

import { useState } from 'react';
import { 
  Plus, TrendingUp, Users, DollarSign, Calendar,
  Settings, ExternalLink, MoreVertical, Search,
  Bell, ChevronRight, Sparkles, Target, Zap,
  Globe, Shield, Award, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function OwnerDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for multiple communities
  const communities = [
    {
      id: 1,
      name: 'The Growth Lab',
      slug: 'growth-lab',
      avatar: 'https://picsum.photos/seed/growth/100/100',
      members: 1247,
      revenue: 12450,
      mrr: 6200,
      domain: 'community.growthlab.io',
      growth: 12.5,
      active: true,
    },
    {
      id: 2,
      name: 'SaaS Founders',
      slug: 'saas-founders',
      avatar: 'https://picsum.photos/seed/saas/100/100',
      members: 523,
      revenue: 8920,
      mrr: 4100,
      domain: null,
      growth: 8.3,
      active: true,
    },
    {
      id: 3,
      name: 'Creator Economy',
      slug: 'creator-economy',
      avatar: 'https://picsum.photos/seed/creator/100/100',
      members: 89,
      revenue: 1240,
      mrr: 890,
      domain: null,
      growth: -2.1,
      active: false,
    },
  ];

  const aggregateStats = {
    totalCommunities: 3,
    totalMembers: 1859,
    totalMRR: 11190,
    totalRevenue: 22610,
    avgMemberValue: 12.16,
    topSource: 'YouTube',
    platformPlan: 'Allumi Pro',
    monthlyCost: 89,
    savedVsSkool: 120,
  };

  const recentActivity = [
    { type: 'member', community: 'The Growth Lab', text: '12 new members joined', time: '2 hours ago' },
    { type: 'revenue', community: 'SaaS Founders', text: 'New pro subscription $199/mo', time: '4 hours ago' },
    { type: 'content', community: 'The Growth Lab', text: 'New course published', time: '6 hours ago' },
    { type: 'event', community: 'Creator Economy', text: 'Webinar scheduled for Dec 20', time: '1 day ago' },
  ];

  const revenueData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: Math.floor(Math.random() * 1000) + 200,
  }));

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-white">Allumi Dashboard</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search communities..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-white">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link
                href="/create-community"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Community
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Platform Subscription Banner */}
        <div className="bg-gradient-to-r from-emerald-900/20 to-purple-900/20 border border-emerald-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {aggregateStats.platformPlan} • ${aggregateStats.monthlyCost}/month
                </h2>
                <p className="text-sm text-gray-300 mt-1">
                  Saving ${aggregateStats.savedVsSkool}/year vs Skool • Unlimited communities • Attribution included
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/billing"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Manage Billing
              </Link>
              <Link
                href="/dashboard/affiliate"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                Earn 40% Commission
              </Link>
            </div>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-6 h-6 text-emerald-500" />
              <span className="text-xs text-emerald-400">Active</span>
            </div>
            <div className="text-2xl font-bold text-white">{aggregateStats.totalCommunities}</div>
            <div className="text-sm text-gray-500">Total Communities</div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-6 h-6 text-purple-500" />
              <span className="text-xs text-purple-400">+124 this month</span>
            </div>
            <div className="text-2xl font-bold text-white">{aggregateStats.totalMembers.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Members</div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-6 h-6 text-blue-500" />
              <span className="text-xs text-blue-400">+15.2%</span>
            </div>
            <div className="text-2xl font-bold text-white">${aggregateStats.totalMRR.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total MRR</div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
              <span className="text-xs text-yellow-400">{aggregateStats.topSource}</span>
            </div>
            <div className="text-2xl font-bold text-white">${aggregateStats.avgMemberValue}</div>
            <div className="text-sm text-gray-500">Avg Member Value</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Communities List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Your Communities</h2>
              <button className="text-sm text-gray-400 hover:text-white">View all</button>
            </div>

            {communities.map((community) => (
              <div key={community.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gray-900/70 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Image
                      src={community.avatar}
                      alt={community.name}
                      width={64}
                      height={64}
                      className="rounded-lg"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{community.name}</h3>
                        {community.active ? (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                            Paused
                          </span>
                        )}
                      </div>
                      {community.domain ? (
                        <div className="flex items-center gap-1 mt-1">
                          <Globe className="w-3 h-3 text-emerald-400" />
                          <span className="text-sm text-emerald-400">{community.domain}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">allumi.com/c/{community.slug}</span>
                      )}
                      
                      <div className="flex items-center gap-6 mt-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">{community.members} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">${community.mrr}/mo</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {community.growth > 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`text-sm ${community.growth > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {Math.abs(community.growth)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/c/${community.slug}/analytics`}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <TrendingUp className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/c/${community.slug}/settings`}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/c/${community.slug}`}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      View
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Revenue Chart */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">30-Day Revenue</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" hide />
                  <YAxis stroke="#9CA3AF" hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-300">{activity.text}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {activity.community} • {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/dashboard/analytics"
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm text-gray-300">View Attribution Report</span>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </Link>
                <Link
                  href="/dashboard/billing"
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm text-gray-300">Manage Subscription</span>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </Link>
                <Link
                  href="/create-community"
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm text-gray-300">Create New Community</span>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}