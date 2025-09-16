'use client';

import { useState } from 'react';
import { 
  Users, DollarSign, TrendingUp, Link, Copy, Check,
  Share2, Gift, Zap, Target, Award, ChevronRight,
  ExternalLink, Download, Filter, Calendar, Info,
  Mail, MessageCircle, Globe, ArrowUpRight, Sparkles
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Image from 'next/image';

const COLORS = ['#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6'];

export default function AffiliateDashboard() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Mock data
  const affiliateLink = 'https://allumi.com/?ref=growth-lab-x7y2';
  const affiliateCode = 'growth-lab-x7y2';

  const stats = {
    totalEarnings: 4250,
    pendingEarnings: 820,
    lifetimeEarnings: 12450,
    activeReferrals: 34,
    conversionRate: 24.5,
    avgCommission: 125,
    recurringRevenue: 1360,
    nextPayout: 'Dec 15',
  };

  const referrals = [
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      avatar: 'https://i.pravatar.cc/150?img=1',
      plan: 'Pro', 
      status: 'active',
      joinedDate: '2024-11-15',
      revenue: 49,
      lifetime: 147,
      commission: 58.80
    },
    { 
      id: 2, 
      name: 'Mike Chen', 
      avatar: 'https://i.pravatar.cc/150?img=2',
      plan: 'VIP', 
      status: 'active',
      joinedDate: '2024-11-10',
      revenue: 199,
      lifetime: 398,
      commission: 159.20
    },
    { 
      id: 3, 
      name: 'Emma Wilson', 
      avatar: 'https://i.pravatar.cc/150?img=3',
      plan: 'Pro Annual', 
      status: 'active',
      joinedDate: '2024-10-28',
      revenue: 470,
      lifetime: 470,
      commission: 188
    },
    { 
      id: 4, 
      name: 'Alex Thompson', 
      avatar: 'https://i.pravatar.cc/150?img=4',
      plan: 'Pro', 
      status: 'churned',
      joinedDate: '2024-10-15',
      revenue: 0,
      lifetime: 98,
      commission: 39.20
    },
  ];

  const earningsData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    earnings: Math.floor(Math.random() * 200) + 50,
    referrals: Math.floor(Math.random() * 5),
  }));

  const trafficSources = [
    { name: 'YouTube', value: 45, color: '#EF4444' },
    { name: 'Email', value: 28, color: '#10B981' },
    { name: 'Twitter', value: 15, color: '#3B82F6' },
    { name: 'Blog', value: 12, color: '#8B5CF6' },
  ];

  const promotionalAssets = [
    { type: 'Email Templates', count: 5, icon: Mail },
    { type: 'Social Media Posts', count: 12, icon: MessageCircle },
    { type: 'Banner Ads', count: 8, icon: Globe },
    { type: 'Video Scripts', count: 3, icon: Zap },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Gift className="w-8 h-8 text-emerald-500" />
              Affiliate Program
            </h1>
            <p className="text-gray-400 mt-2">
              Earn 40% recurring commission for every referral - forever
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6">
          {['overview', 'referrals', 'assets', 'payouts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Affiliate Link Section */}
          <div className="bg-gradient-to-br from-emerald-900/20 to-purple-900/20 border border-emerald-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <Link className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white mb-2">Your Affiliate Link</h2>
                <div className="flex items-center gap-3 mb-3">
                  <code className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-emerald-400 font-mono text-sm">
                    {affiliateLink}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  Share this link to earn 40% recurring commission on all referrals. 
                  Your commission continues as long as they remain a customer.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-6 h-6 text-emerald-500" />
                <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">
                  +18%
                </span>
              </div>
              <div className="text-2xl font-bold text-white">${stats.totalEarnings.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Earnings</div>
              <div className="mt-3 text-xs text-gray-400">
                ${stats.pendingEarnings} pending
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-6 h-6 text-purple-500" />
                <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                  {stats.activeReferrals}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.activeReferrals}</div>
              <div className="text-sm text-gray-500">Active Referrals</div>
              <div className="mt-3 text-xs text-gray-400">
                {stats.conversionRate}% conversion
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
                  Monthly
                </span>
              </div>
              <div className="text-2xl font-bold text-white">${stats.recurringRevenue}</div>
              <div className="text-sm text-gray-500">Recurring Revenue</div>
              <div className="mt-3 text-xs text-gray-400">
                40% commission rate
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full">
                  Lifetime
                </span>
              </div>
              <div className="text-2xl font-bold text-white">${stats.lifetimeEarnings.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Lifetime Earnings</div>
              <div className="mt-3 text-xs text-gray-400">
                Next payout: {stats.nextPayout}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Earnings Chart */}
            <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Earnings & Referrals</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis yAxisId="left" stroke="#9CA3AF" />
                  <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="referrals" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Traffic Sources */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Traffic Sources</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {trafficSources.map((source) => (
                  <div key={source.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                      <span className="text-gray-400">{source.name}</span>
                    </div>
                    <span className="text-white font-medium">{source.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Share2 className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="font-medium text-white mb-1">Share</h4>
                <p className="text-sm text-gray-400">Share your unique link</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-medium text-white mb-1">Refer</h4>
                <p className="text-sm text-gray-400">People sign up with your link</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-medium text-white mb-1">Convert</h4>
                <p className="text-sm text-gray-400">They become paying customers</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-yellow-400" />
                </div>
                <h4 className="font-medium text-white mb-1">Earn</h4>
                <p className="text-sm text-gray-400">Get 40% recurring forever</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Referrals Tab */}
      {activeTab === 'referrals' && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Your Referrals</h2>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-800">
                  <th className="px-6 py-3 text-sm font-medium text-gray-400">Customer</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-400">Plan</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-400">Joined</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-400">Monthly</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-400">Lifetime</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-400">Commission</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral) => (
                  <tr key={referral.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={referral.avatar}
                          alt={referral.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="font-medium text-white">{referral.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{referral.plan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        referral.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">{referral.joinedDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">${referral.revenue}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">${referral.lifetime}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-400 font-semibold">${referral.commission}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-900/20 to-purple-900/20 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-emerald-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Promotional Materials
                </h3>
                <p className="text-gray-300 text-sm">
                  Use these professionally designed assets to promote Allumi and maximize your conversions.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {promotionalAssets.map((asset) => {
              const Icon = asset.icon;
              return (
                <div key={asset.type} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gray-900/70 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-6 h-6 text-emerald-500" />
                    <span className="text-sm text-gray-500">{asset.count} items</span>
                  </div>
                  <h3 className="font-medium text-white mb-2">{asset.type}</h3>
                  <button className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                    View assets
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Share Links</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">Twitter/X Share</div>
                  <div className="text-sm text-gray-400">Pre-written tweet about Allumi</div>
                </div>
                <button className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Share
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">LinkedIn Post</div>
                  <div className="text-sm text-gray-400">Professional post template</div>
                </div>
                <button className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Share
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">Email Template</div>
                  <div className="text-sm text-gray-400">Ready-to-send email copy</div>
                </div>
                <button className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}