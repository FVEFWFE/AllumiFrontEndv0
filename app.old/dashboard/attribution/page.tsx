'use client';

import { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, 
  Target, Filter, Download, Calendar, ExternalLink, 
  ChevronRight, Info, Settings, RefreshCw, ArrowUpRight,
  Link2, Zap, Eye, MousePointer, UserCheck, Copy
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  FunnelChart, Funnel, LabelList, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap, Sankey
} from 'recharts';
import { generateAttributionData } from '@/lib/mock-data';

const COLORS = ['#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];

export default function AttributionDashboard() {
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const data = useMemo(() => generateAttributionData(), []);

  // Calculate key metrics
  const totalRevenue = data.sources.reduce((sum, s) => sum + s.revenue, 0);
  const totalConversions = data.sources.reduce((sum, s) => sum + s.conversions, 0);
  const avgConversionRate = (totalConversions / data.sources.reduce((sum, s) => sum + s.visitors, 0) * 100).toFixed(2);
  const topSource = data.sources.sort((a, b) => b.revenue - a.revenue)[0];

  // Prepare chart data
  const sourcePerformance = data.sources.map(source => ({
    name: source.name,
    revenue: source.revenue,
    conversions: source.conversions,
    roi: source.roi,
    spend: source.spend
  }));

  const conversionFunnel = [
    { name: 'Visitors', value: 10000, fill: '#10B981' },
    { name: 'Signups', value: 3500, fill: '#8B5CF6' },
    { name: 'Active Users', value: 2100, fill: '#F59E0B' },
    { name: 'Paid Members', value: 850, fill: '#3B82F6' },
    { name: 'Advocates', value: 120, fill: '#EC4899' }
  ];

  const timeSeriesData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    youtube: Math.floor(Math.random() * 3000) + 1000,
    google: Math.floor(Math.random() * 2500) + 800,
    instagram: Math.floor(Math.random() * 2000) + 500,
    facebook: Math.floor(Math.random() * 1500) + 300,
    direct: Math.floor(Math.random() * 1000) + 200,
  }));

  const customerJourney = [
    { source: 'YouTube', target: 'Landing Page', value: 2500 },
    { source: 'Google Ads', target: 'Landing Page', value: 2000 },
    { source: 'Instagram', target: 'Landing Page', value: 1500 },
    { source: 'Landing Page', target: 'Sign Up', value: 3000 },
    { source: 'Sign Up', target: 'Free Trial', value: 2000 },
    { source: 'Free Trial', target: 'Paid', value: 800 },
    { source: 'Sign Up', target: 'Direct Purchase', value: 500 },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Target className="w-8 h-8 text-emerald-500" />
              Attribution Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Track revenue sources and optimize your marketing spend with AI-powered insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all ${
                refreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="last90days">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:bg-gray-900/70 transition-all">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-emerald-500" />
            <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">
              +12.5%
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Total Attributed Revenue</h3>
          <p className="text-3xl font-bold text-white mt-2">${totalRevenue.toLocaleString()}</p>
          <div className="mt-4 text-xs text-gray-500">
            <span className="text-emerald-400">{topSource.name}</span> is your top source
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:bg-gray-900/70 transition-all">
          <div className="flex items-center justify-between mb-4">
            <UserCheck className="w-8 h-8 text-purple-500" />
            <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
              +8.3%
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Total Conversions</h3>
          <p className="text-3xl font-bold text-white mt-2">{totalConversions.toLocaleString()}</p>
          <div className="mt-4 text-xs text-gray-500">
            <span className="text-purple-400">{avgConversionRate}%</span> conversion rate
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:bg-gray-900/70 transition-all">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
              +25.7%
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Average ROI</h3>
          <p className="text-3xl font-bold text-white mt-2">
            {(data.sources.reduce((sum, s) => sum + s.roi, 0) / data.sources.length).toFixed(0)}%
          </p>
          <div className="mt-4 text-xs text-gray-500">
            Best: <span className="text-blue-400">YouTube (412%)</span>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:bg-gray-900/70 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-yellow-500" />
            <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded-full">
              -3.2%
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Customer Lifetime Value</h3>
          <p className="text-3xl font-bold text-white mt-2">$1,247</p>
          <div className="mt-4 text-xs text-gray-500">
            Highest from <span className="text-yellow-400">Email</span> referrals
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue by Source */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Revenue by Source</h2>
            <button className="text-gray-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sourcePerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="revenue"
              >
                {sourcePerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ROI by Channel */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">ROI by Channel</h2>
            <button className="text-gray-400 hover:text-white">
              <Info className="w-5 h-5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourcePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Bar dataKey="roi" fill="#10B981" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="roi" position="top" formatter={(value: number) => `${value}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time Series Revenue */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Revenue Trends Over Time</h2>
          <div className="flex items-center gap-4">
            {['YouTube', 'Google', 'Instagram', 'Facebook', 'Direct'].map((source, index) => (
              <div key={source} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm text-gray-400">{source}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Area type="monotone" dataKey="youtube" stackId="1" stroke="#10B981" fill="#10B981" />
            <Area type="monotone" dataKey="google" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
            <Area type="monotone" dataKey="instagram" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
            <Area type="monotone" dataKey="facebook" stackId="1" stroke="#EF4444" fill="#EF4444" />
            <Area type="monotone" dataKey="direct" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Funnel and Source Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Conversion Funnel */}
        <div className="lg:col-span-1 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Conversion Funnel</h2>
          <ResponsiveContainer width="100%" height={400}>
            <FunnelChart>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Funnel dataKey="value" data={conversionFunnel} isAnimationActive>
                <LabelList position="center" fill="#fff" stroke="none" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {conversionFunnel.map((stage, index) => (
              <div key={stage.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.fill }} />
                  <span className="text-gray-400">{stage.name}</span>
                </div>
                <span className="text-white font-medium">{stage.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Source Details Table */}
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Source Performance Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-800">
                  <th className="pb-3 text-sm font-medium text-gray-400">Source</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Revenue</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Conversions</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Conv. Rate</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Avg. Order</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">ROI</th>
                  <th className="pb-3 text-sm font-medium text-gray-400"></th>
                </tr>
              </thead>
              <tbody>
                {data.sources.map((source) => (
                  <tr 
                    key={source.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedSource(source.id)}
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <Link2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{source.name}</div>
                          <div className="text-xs text-gray-500">{source.visitors.toLocaleString()} visitors</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="font-semibold text-white">${source.revenue.toLocaleString()}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-gray-300">{source.conversions.toLocaleString()}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-gray-300">{source.conversionRate}%</div>
                    </td>
                    <td className="py-4">
                      <div className="text-gray-300">${source.avgOrderValue}</div>
                    </td>
                    <td className="py-4">
                      <div className={`font-semibold ${source.roi > 100 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {source.roi}%
                      </div>
                    </td>
                    <td className="py-4">
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* UTM Parameters Preview */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Sample UTM Parameters</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <code className="px-2 py-1 bg-gray-900 rounded text-emerald-400">
                  ?utm_source=youtube&utm_medium=video&utm_campaign=launch2024
                </code>
                <button className="text-gray-400 hover:text-white">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Track every link with automatic UTM generation and QR codes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-gradient-to-br from-emerald-900/20 to-purple-900/20 border border-emerald-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Zap className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">AI-Powered Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-900/50 rounded-lg">
            <h3 className="text-sm font-medium text-emerald-400 mb-2">🎯 Opportunity Alert</h3>
            <p className="text-sm text-gray-300">
              YouTube traffic has 3x higher LTV than other sources. Consider increasing video content budget by 40%.
            </p>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-400 mb-2">⚠️ Optimization Needed</h3>
            <p className="text-sm text-gray-300">
              Facebook Ads ROI dropped 23% this week. Review targeting and creative performance.
            </p>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-lg">
            <h3 className="text-sm font-medium text-purple-400 mb-2">💡 Growth Prediction</h3>
            <p className="text-sm text-gray-300">
              Based on current trends, Q2 revenue will reach $142K with 68% from organic sources.
            </p>
          </div>
        </div>
      </div>

      {/* Source Detail Modal */}
      {selectedSource && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {data.sources.find(s => s.id === selectedSource)?.name} - Detailed Analytics
                </h2>
                <button
                  onClick={() => setSelectedSource(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-400">
                Detailed attribution analytics for this source would appear here, including:
                customer journey paths, cohort analysis, multi-touch attribution models,
                and predictive revenue forecasting.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}