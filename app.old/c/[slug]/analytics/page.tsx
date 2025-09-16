'use client';

import { useState, use } from 'react';
import { 
  TrendingUp, Users, DollarSign, Target, Globe, 
  Calendar, Settings, Download, Filter, ChevronRight,
  ArrowUpRight, ArrowDownRight, Zap, Brain, AlertCircle,
  Youtube, Twitter, Instagram, Linkedin, Facebook,
  Search, Mail, ShoppingCart, ExternalLink, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface CommunityAnalyticsProps {
  params: Promise<{ slug: string }>;
}

export default function CommunityAnalytics({ params }: CommunityAnalyticsProps) {
  const { slug } = use(params);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Community-specific data
  const communityName = slug === 'growth-lab' ? 'The Growth Lab' : 'Community';
  
  const stats = {
    revenue: { value: 12450, change: 15.3, period: 'vs last month' },
    members: { value: 1247, change: 12.5, period: 'vs last month' },
    conversion: { value: 3.8, change: 0.5, period: 'vs last month' },
    avgValue: { value: 47.50, change: 2.3, period: 'vs last month' }
  };

  const topSources = [
    { name: 'YouTube', revenue: 4230, members: 423, color: '#FF0000', icon: Youtube, roi: 320 },
    { name: 'Twitter', revenue: 3120, members: 312, color: '#1DA1F2', icon: Twitter, roi: 280 },
    { name: 'Email', revenue: 2340, members: 234, color: '#10B981', icon: Mail, roi: 450 },
    { name: 'Instagram', revenue: 1560, members: 156, color: '#E4405F', icon: Instagram, roi: 190 },
    { name: 'Direct', revenue: 1200, members: 122, color: '#6B7280', icon: Globe, roi: null }
  ];

  const revenueBySource = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    youtube: Math.floor(Math.random() * 200) + 100,
    twitter: Math.floor(Math.random() * 150) + 80,
    email: Math.floor(Math.random() * 100) + 50,
    instagram: Math.floor(Math.random() * 80) + 30,
    direct: Math.floor(Math.random() * 60) + 20,
  }));

  const conversionFunnel = [
    { stage: 'Page Views', value: 12450, rate: 100 },
    { stage: 'Sign Ups', value: 892, rate: 7.2 },
    { stage: 'Trials', value: 423, rate: 3.4 },
    { stage: 'Paid', value: 147, rate: 1.2 }
  ];

  const campaigns = [
    {
      name: 'Black Friday Launch',
      source: 'youtube',
      utm: 'utm_source=youtube&utm_campaign=bf2024',
      revenue: 3450,
      conversions: 34,
      roi: 412,
      status: 'active'
    },
    {
      name: 'Email Nurture',
      source: 'email',
      utm: 'utm_source=email&utm_campaign=nurture',
      revenue: 2340,
      conversions: 23,
      roi: 567,
      status: 'active'
    },
    {
      name: 'Twitter Threads',
      source: 'twitter',
      utm: 'utm_source=twitter&utm_campaign=threads',
      revenue: 1890,
      conversions: 19,
      roi: 234,
      status: 'paused'
    }
  ];

  const aiInsights = [
    {
      type: 'success',
      title: 'YouTube driving highest ROI',
      description: 'Your YouTube content generates 3.2x more revenue per member than other channels.',
      action: 'Double down on video content'
    },
    {
      type: 'warning',
      title: 'Instagram conversion dropping',
      description: 'Instagram traffic converts 40% lower than last month. Consider refreshing content strategy.',
      action: 'Review Instagram strategy'
    },
    {
      type: 'info',
      title: 'Email subscribers most valuable',
      description: 'Email subscribers have 2.5x higher lifetime value than social media members.',
      action: 'Expand email campaigns'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/c/${slug}`}
                className="text-gray-400 hover:text-white"
              >
                {communityName}
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <h1 className="text-xl font-bold text-white">Attribution Analytics</h1>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="px-6">
          <div className="flex gap-6">
            {['overview', 'sources', 'campaigns', 'funnels'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                  <span className={`text-xs flex items-center gap-1 ${stats.revenue.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stats.revenue.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(stats.revenue.change)}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">${stats.revenue.value.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Revenue</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-6 h-6 text-purple-500" />
                  <span className={`text-xs flex items-center gap-1 ${stats.members.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stats.members.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(stats.members.change)}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.members.value.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Members</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-6 h-6 text-blue-500" />
                  <span className={`text-xs flex items-center gap-1 ${stats.conversion.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stats.conversion.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(stats.conversion.change)}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.conversion.value}%</div>
                <div className="text-sm text-gray-500">Conversion Rate</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-6 h-6 text-yellow-500" />
                  <span className={`text-xs flex items-center gap-1 ${stats.avgValue.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stats.avgValue.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(stats.avgValue.change)}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">${stats.avgValue.value}</div>
                <div className="text-sm text-gray-500">Avg Member Value</div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">AI Insights</h2>
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                  Powered by Attribution AI
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {insight.type === 'success' && <Zap className="w-5 h-5 text-emerald-400 mt-0.5" />}
                      {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />}
                      {insight.type === 'info' && <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />}
                      <div>
                        <div className="text-sm font-medium text-white">{insight.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{insight.description}</div>
                        <button className="text-xs text-emerald-400 hover:text-emerald-300 mt-2">
                          {insight.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Revenue by Source</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueBySource}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#9CA3AF' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="youtube" stackId="1" stroke="#FF0000" fill="#FF0000" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="twitter" stackId="1" stroke="#1DA1F2" fill="#1DA1F2" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="email" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="instagram" stackId="1" stroke="#E4405F" fill="#E4405F" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="direct" stackId="1" stroke="#6B7280" fill="#6B7280" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Top Traffic Sources</h2>
                <div className="space-y-3">
                  {topSources.map((source) => (
                    <div key={source.name} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <source.icon className="w-5 h-5" style={{ color: source.color }} />
                        <div>
                          <div className="text-sm font-medium text-white">{source.name}</div>
                          <div className="text-xs text-gray-500">{source.members} members</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">${source.revenue.toLocaleString()}</div>
                        {source.roi && (
                          <div className="text-xs text-emerald-400">ROI: {source.roi}%</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Traffic Source Performance</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-800">
                      <th className="pb-3 text-sm font-medium text-gray-400">Source</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">Members</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">Revenue</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">Conversion</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">Avg Value</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">ROI</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSources.map((source) => (
                      <tr key={source.name} className="border-b border-gray-800/50">
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <source.icon className="w-4 h-4" style={{ color: source.color }} />
                            <span className="text-white">{source.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-gray-300">{source.members}</td>
                        <td className="py-4 text-gray-300">${source.revenue.toLocaleString()}</td>
                        <td className="py-4 text-gray-300">3.2%</td>
                        <td className="py-4 text-gray-300">${(source.revenue / source.members).toFixed(2)}</td>
                        <td className="py-4">
                          {source.roi ? (
                            <span className="text-emerald-400">{source.roi}%</span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="py-4">
                          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Active Campaigns</h2>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  New Campaign
                </button>
              </div>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.name} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-white font-medium">{campaign.name}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            campaign.status === 'active' 
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {campaign.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <code className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">
                            {campaign.utm}
                          </code>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-white">${campaign.revenue.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">{campaign.conversions} conversions</div>
                        <div className="text-xs text-emerald-400 mt-1">ROI: {campaign.roi}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'funnels' && (
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Conversion Funnel</h2>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{stage.stage}</span>
                      <span className="text-sm text-white">{stage.value.toLocaleString()} ({stage.rate}%)</span>
                    </div>
                    <div className="relative h-8 bg-gray-800 rounded-lg overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg"
                        style={{ width: `${stage.rate}%` }}
                      />
                    </div>
                    {index < conversionFunnel.length - 1 && (
                      <div className="flex justify-center my-2">
                        <ArrowDownRight className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}