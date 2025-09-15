'use client';

import { useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, Target, 
  Calendar, Download, Filter, ChevronRight,
  ArrowUpRight, ArrowDownRight, Activity,
  BarChart3, PieChart, Globe, Zap, Trophy
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart as RePieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedCommunity, setSelectedCommunity] = useState('all');

  const overviewStats = [
    {
      title: 'Total Revenue',
      value: '$22,610',
      change: 15.3,
      period: 'vs last month',
      icon: DollarSign,
      color: 'text-emerald-500'
    },
    {
      title: 'Active Members',
      value: '1,859',
      change: 12.5,
      period: 'vs last month',
      icon: Users,
      color: 'text-purple-500'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: 0.5,
      period: 'vs last month',
      icon: Target,
      color: 'text-blue-500'
    },
    {
      title: 'Avg Member Value',
      value: '$47.50',
      change: 8.7,
      period: 'vs last month',
      icon: TrendingUp,
      color: 'text-yellow-500'
    }
  ];

  const revenueData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: Math.floor(Math.random() * 1000) + 500,
    members: Math.floor(Math.random() * 50) + 20,
  }));

  const sourceBreakdown = [
    { name: 'YouTube', value: 4230, percentage: 35, color: '#FF0000' },
    { name: 'Twitter', value: 3120, percentage: 26, color: '#1DA1F2' },
    { name: 'Email', value: 2340, percentage: 19, color: '#10B981' },
    { name: 'Instagram', value: 1560, percentage: 13, color: '#E4405F' },
    { name: 'Direct', value: 860, percentage: 7, color: '#6B7280' }
  ];

  const communityPerformance = [
    { name: 'Growth Lab', revenue: 12450, members: 1247, growth: 12.5 },
    { name: 'SaaS Founders', revenue: 8920, members: 523, growth: 8.3 },
    { name: 'Creator Economy', revenue: 1240, members: 89, growth: -2.1 }
  ];

  const memberActivity = [
    { hour: '00:00', active: 45 },
    { hour: '04:00', active: 32 },
    { hour: '08:00', active: 128 },
    { hour: '12:00', active: 245 },
    { hour: '16:00', active: 189 },
    { hour: '20:00', active: 167 },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Overview</h1>
          <p className="text-gray-400">Track performance across all your communities</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Communities</option>
            <option value="growth-lab">The Growth Lab</option>
            <option value="saas-founders">SaaS Founders</option>
            <option value="creator-economy">Creator Economy</option>
          </select>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {overviewStats.map((stat) => (
          <div key={stat.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <span className={`text-xs flex items-center gap-1 ${stat.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(stat.change)}%
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.title}</div>
            <div className="text-xs text-gray-600 mt-1">{stat.period}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Revenue Trend</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
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
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Member Growth */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Member Growth</h2>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line 
                type="monotone" 
                dataKey="members" 
                stroke="#A78BFA" 
                strokeWidth={2}
                dot={{ fill: '#A78BFA', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Breakdown */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Traffic Sources</h2>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie
                data={sourceBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {sourceBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              />
            </RePieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {sourceBreakdown.map((source) => (
              <div key={source.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-sm text-gray-300">{source.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-white font-medium">${source.value}</span>
                  <span className="text-xs text-gray-500 ml-2">({source.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Performance */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Top Communities</h2>
            <Trophy className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {communityPerformance.map((community, index) => (
              <div key={community.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">{community.name}</div>
                    <div className="text-xs text-gray-500">{community.members} members</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">${community.revenue.toLocaleString()}</div>
                  <div className={`text-xs flex items-center gap-1 ${community.growth > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {community.growth > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(community.growth)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Activity */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Peak Activity</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={memberActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              />
              <Bar dataKey="active" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Most Active</span>
              <span className="text-sm text-white font-medium">12:00 PM - 2:00 PM</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">Peak Day</span>
              <span className="text-sm text-white font-medium">Wednesday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}