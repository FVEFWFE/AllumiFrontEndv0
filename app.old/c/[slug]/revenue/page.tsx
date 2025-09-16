'use client';

import { useState } from 'react';
import { 
  DollarSign, TrendingUp, Users, Target, Link, Youtube, 
  Twitter, Mail, Globe, Instagram, Facebook, Linkedin,
  ArrowUpRight, ArrowDownRight, Download, Filter, Calendar,
  AlertCircle, ChevronRight, Zap, Activity, PieChart as PieChartIcon,
  BarChart3, LineChart as LineChartIcon, Sparkles, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, Sankey, Treemap, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, Funnel, FunnelChart, LabelList
} from 'recharts';

interface RevenueAnalyticsProps {
  params: {
    slug: string;
  };
}

export default function RevenueAnalytics({ params }: RevenueAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [viewMode, setViewMode] = useState('sources');
  const [comparisonMode, setComparisonMode] = useState(false);

  // Enhanced revenue data with attribution
  const revenueMetrics = {
    total: 42380,
    recurring: 38920,
    oneTime: 3460,
    mrr: 6890,
    arr: 82680,
    ltv: 2340,
    churn: 2.3,
    growth: 15.7
  };

  // Channel performance with ROI
  const channelData = [
    {
      channel: 'YouTube',
      icon: Youtube,
      color: '#FF0000',
      revenue: 15420,
      cost: 1200,
      roi: 1185,
      conversions: 89,
      avgValue: 173,
      trend: 12.5,
      topVideo: 'Attribution Setup Guide',
      attribution: {
        firstTouch: 45,
        lastTouch: 32,
        multiTouch: 23
      }
    },
    {
      channel: 'Twitter/X',
      icon: Twitter,
      color: '#1DA1F2',
      revenue: 9870,
      cost: 450,
      roi: 2093,
      conversions: 67,
      avgValue: 147,
      trend: 8.3,
      topTweet: 'Thread about revenue tracking',
      attribution: {
        firstTouch: 28,
        lastTouch: 45,
        multiTouch: 27
      }
    },
    {
      channel: 'Email',
      icon: Mail,
      color: '#10B981',
      revenue: 7650,
      cost: 200,
      roi: 3725,
      conversions: 52,
      avgValue: 147,
      trend: 23.1,
      topCampaign: 'Weekly Newsletter #47',
      attribution: {
        firstTouch: 15,
        lastTouch: 60,
        multiTouch: 25
      }
    },
    {
      channel: 'LinkedIn',
      icon: Linkedin,
      color: '#0077B5',
      revenue: 4320,
      cost: 600,
      roi: 620,
      conversions: 28,
      avgValue: 154,
      trend: -5.2,
      topPost: 'Case study post',
      attribution: {
        firstTouch: 35,
        lastTouch: 40,
        multiTouch: 25
      }
    },
    {
      channel: 'Direct/Organic',
      icon: Globe,
      color: '#6B7280',
      revenue: 3890,
      cost: 0,
      roi: null,
      conversions: 31,
      avgValue: 125,
      trend: 2.1,
      topSource: 'Google Search',
      attribution: {
        firstTouch: 20,
        lastTouch: 55,
        multiTouch: 25
      }
    },
    {
      channel: 'Facebook',
      icon: Facebook,
      color: '#1877F2',
      revenue: 1230,
      cost: 300,
      roi: 310,
      conversions: 9,
      avgValue: 137,
      trend: -12.4,
      topPost: 'Community launch announcement',
      attribution: {
        firstTouch: 40,
        lastTouch: 35,
        multiTouch: 25
      }
    }
  ];

  // Customer journey data
  const journeyData = [
    { stage: 'Awareness', value: 10000, conversion: 100 },
    { stage: 'Interest', value: 3500, conversion: 35 },
    { stage: 'Consideration', value: 1200, conversion: 34.3 },
    { stage: 'Purchase', value: 412, conversion: 34.3 },
    { stage: 'Retention', value: 387, conversion: 93.9 },
    { stage: 'Advocacy', value: 142, conversion: 36.7 }
  ];

  // Time series revenue data
  const timeSeriesData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      youtube: Math.floor(Math.random() * 600) + 400,
      twitter: Math.floor(Math.random() * 400) + 200,
      email: Math.floor(Math.random() * 300) + 150,
      linkedin: Math.floor(Math.random() * 200) + 100,
      direct: Math.floor(Math.random() * 150) + 50,
      total: 0
    };
  });
  timeSeriesData.forEach(d => {
    d.total = d.youtube + d.twitter + d.email + d.linkedin + d.direct;
  });

  // Cohort analysis data
  const cohortData = [
    { month: 'Jan', m0: 100, m1: 92, m2: 87, m3: 82, m4: 78, m5: 75 },
    { month: 'Feb', m0: 100, m1: 89, m2: 83, m3: 79, m4: 76 },
    { month: 'Mar', m0: 100, m1: 94, m2: 88, m3: 84 },
    { month: 'Apr', m0: 100, m1: 91, m2: 86 },
    { month: 'May', m0: 100, m1: 93 },
    { month: 'Jun', m0: 100 }
  ];

  // Attribution model comparison
  const attributionModels = [
    { model: 'First Touch', youtube: 45, twitter: 28, email: 15, linkedin: 35, direct: 20 },
    { model: 'Last Touch', youtube: 32, twitter: 45, email: 60, linkedin: 40, direct: 55 },
    { model: 'Multi-Touch', youtube: 23, twitter: 27, email: 25, linkedin: 25, direct: 25 },
    { model: 'Data-Driven', youtube: 38, twitter: 35, email: 42, linkedin: 32, direct: 38 }
  ];

  const COLORS = ['#FF0000', '#1DA1F2', '#10B981', '#0077B5', '#6B7280', '#1877F2'];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DollarSign className="w-6 h-6 text-emerald-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">Revenue Attribution</h1>
                <p className="text-sm text-gray-400">See exactly where your revenue comes from</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="12m">Last 12 months</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Button size="sm">
                <Link className="w-4 h-4 mr-2" />
                Setup Attribution
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-emerald-600/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <Badge className="bg-emerald-600">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {revenueMetrics.growth}%
                </Badge>
              </div>
              <div className="text-2xl font-bold text-white">${revenueMetrics.total.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Revenue</div>
              <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <Badge className="bg-purple-600">${revenueMetrics.mrr.toLocaleString()}</Badge>
              </div>
              <div className="text-2xl font-bold text-white">${revenueMetrics.ltv.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Avg Customer LTV</div>
              <div className="text-xs text-gray-500 mt-1">6 month average</div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <Badge className="bg-blue-600">Best</Badge>
              </div>
              <div className="text-2xl font-bold text-white">3,725%</div>
              <div className="text-sm text-gray-400">Best Channel ROI</div>
              <div className="text-xs text-gray-500 mt-1">Email marketing</div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-yellow-600/20 rounded-lg">
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <Badge className="bg-red-600">
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                  {revenueMetrics.churn}%
                </Badge>
              </div>
              <div className="text-2xl font-bold text-white">{revenueMetrics.churn}%</div>
              <div className="text-sm text-gray-400">Churn Rate</div>
              <div className="text-xs text-gray-500 mt-1">vs 3.1% last month</div>
            </CardContent>
          </Card>
        </div>

        {/* Attribution Alert */}
        <Alert className="mb-6 bg-emerald-600/10 border-emerald-600/50">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <AlertDescription className="text-emerald-300">
            <strong>Attribution Insight:</strong> Your YouTube channel drives 36% of revenue but only costs 25% of your marketing budget. 
            Consider reallocating budget from Facebook (-12.4% trend) to YouTube for better ROI.
          </AlertDescription>
        </Alert>

        {/* Main Content Tabs */}
        <Tabs defaultValue="channels" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-900/50">
            <TabsTrigger value="channels">Channel Performance</TabsTrigger>
            <TabsTrigger value="attribution">Attribution Models</TabsTrigger>
            <TabsTrigger value="journey">Customer Journey</TabsTrigger>
            <TabsTrigger value="cohorts">Cohort Analysis</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          {/* Channel Performance Tab */}
          <TabsContent value="channels" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Revenue by Source Chart */}
              <Card className="col-span-2 border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle>Revenue by Source Over Time</CardTitle>
                  <CardDescription>Track how each channel performs day by day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                        labelStyle={{ color: '#9CA3AF' }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="youtube" stackId="1" stroke="#FF0000" fill="#FF0000" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="twitter" stackId="1" stroke="#1DA1F2" fill="#1DA1F2" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="email" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="linkedin" stackId="1" stroke="#0077B5" fill="#0077B5" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="direct" stackId="1" stroke="#6B7280" fill="#6B7280" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Channel Distribution Pie */}
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle>Revenue Distribution</CardTitle>
                  <CardDescription>Percentage by channel</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Channel Performance Table */}
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Channel Performance Details</CardTitle>
                <CardDescription>Deep dive into each channel\'s metrics and ROI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelData.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <div key={channel.channel} className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-700 rounded-lg">
                              <Icon className="w-5 h-5" style={{ color: channel.color }} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{channel.channel}</h4>
                              <p className="text-sm text-gray-400">Top performer: {channel.topVideo || channel.topTweet || channel.topCampaign || channel.topPost || channel.topSource}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {channel.trend > 0 ? (
                              <Badge className="bg-emerald-600">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                {channel.trend}%
                              </Badge>
                            ) : (
                              <Badge className="bg-red-600">
                                <ArrowDownRight className="w-3 h-3 mr-1" />
                                {Math.abs(channel.trend)}%
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Revenue</p>
                            <p className="text-xl font-bold text-white">${channel.revenue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Cost</p>
                            <p className="text-xl font-bold text-white">${channel.cost.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">ROI</p>
                            <p className="text-xl font-bold text-emerald-400">
                              {channel.roi ? `${channel.roi}%` : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Conversions</p>
                            <p className="text-xl font-bold text-white">{channel.conversions}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Avg Value</p>
                            <p className="text-xl font-bold text-white">${channel.avgValue}</p>
                          </div>
                        </div>

                        {/* Attribution breakdown */}
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <p className="text-sm text-gray-400 mb-2">Attribution Model Impact</p>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">First Touch</span>
                                <span className="text-gray-300">{channel.attribution.firstTouch}%</span>
                              </div>
                              <Progress value={channel.attribution.firstTouch} className="h-1" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">Last Touch</span>
                                <span className="text-gray-300">{channel.attribution.lastTouch}%</span>
                              </div>
                              <Progress value={channel.attribution.lastTouch} className="h-1" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">Multi-Touch</span>
                                <span className="text-gray-300">{channel.attribution.multiTouch}%</span>
                              </div>
                              <Progress value={channel.attribution.multiTouch} className="h-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attribution Models Tab */}
          <TabsContent value="attribution" className="space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Attribution Model Comparison</CardTitle>
                <CardDescription>See how different attribution models affect channel credit</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={attributionModels}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="model" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#9CA3AF' }}
                    />
                    <Legend />
                    <Bar dataKey="youtube" fill="#FF0000" />
                    <Bar dataKey="twitter" fill="#1DA1F2" />
                    <Bar dataKey="email" fill="#10B981" />
                    <Bar dataKey="linkedin" fill="#0077B5" />
                    <Bar dataKey="direct" fill="#6B7280" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Alert className="bg-blue-600/10 border-blue-600/50">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-300">
                <strong>Recommendation:</strong> Based on your customer journey data, the Multi-Touch attribution model 
                provides the most balanced view of channel contribution. Email shows strong last-touch performance (60%) 
                but lower first-touch (15%), indicating it\'s better for closing than attracting new leads.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Customer Journey Tab */}
          <TabsContent value="journey" className="space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Customer Journey Funnel</CardTitle>
                <CardDescription>Track conversion through each stage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <FunnelChart>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#9CA3AF' }}
                    />
                    <Funnel
                      dataKey="value"
                      data={journeyData}
                      isAnimationActive
                    >
                      <LabelList position="center" fill="#fff" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
                
                <div className="grid grid-cols-6 gap-4 mt-6">
                  {journeyData.map((stage, index) => (
                    <div key={stage.stage} className="text-center">
                      <div className="text-2xl font-bold text-white">{stage.value.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">{stage.stage}</div>
                      {index > 0 && (
                        <div className="text-xs text-emerald-400 mt-1">{stage.conversion}% conversion</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cohort Analysis Tab */}
          <TabsContent value="cohorts" className="space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Revenue Retention Cohorts</CardTitle>
                <CardDescription>Track revenue retention by monthly cohorts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 text-gray-400">Cohort</th>
                        <th className="text-center py-2 text-gray-400">Month 0</th>
                        <th className="text-center py-2 text-gray-400">Month 1</th>
                        <th className="text-center py-2 text-gray-400">Month 2</th>
                        <th className="text-center py-2 text-gray-400">Month 3</th>
                        <th className="text-center py-2 text-gray-400">Month 4</th>
                        <th className="text-center py-2 text-gray-400">Month 5</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cohortData.map((cohort) => (
                        <tr key={cohort.month} className="border-b border-gray-800">
                          <td className="py-3 font-medium text-white">{cohort.month} 2025</td>
                          <td className="text-center py-3">
                            <span className="px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded">
                              {cohort.m0}%
                            </span>
                          </td>
                          <td className="text-center py-3">
                            {cohort.m1 && (
                              <span className={`px-2 py-1 rounded ${
                                cohort.m1 >= 90 ? 'bg-emerald-600/20 text-emerald-400' :
                                cohort.m1 >= 80 ? 'bg-yellow-600/20 text-yellow-400' :
                                'bg-red-600/20 text-red-400'
                              }`}>
                                {cohort.m1}%
                              </span>
                            )}
                          </td>
                          <td className="text-center py-3">
                            {cohort.m2 && (
                              <span className={`px-2 py-1 rounded ${
                                cohort.m2 >= 85 ? 'bg-emerald-600/20 text-emerald-400' :
                                cohort.m2 >= 75 ? 'bg-yellow-600/20 text-yellow-400' :
                                'bg-red-600/20 text-red-400'
                              }`}>
                                {cohort.m2}%
                              </span>
                            )}
                          </td>
                          <td className="text-center py-3">
                            {cohort.m3 && (
                              <span className={`px-2 py-1 rounded ${
                                cohort.m3 >= 80 ? 'bg-emerald-600/20 text-emerald-400' :
                                cohort.m3 >= 70 ? 'bg-yellow-600/20 text-yellow-400' :
                                'bg-red-600/20 text-red-400'
                              }`}>
                                {cohort.m3}%
                              </span>
                            )}
                          </td>
                          <td className="text-center py-3">
                            {cohort.m4 && (
                              <span className={`px-2 py-1 rounded ${
                                cohort.m4 >= 75 ? 'bg-emerald-600/20 text-emerald-400' :
                                cohort.m4 >= 65 ? 'bg-yellow-600/20 text-yellow-400' :
                                'bg-red-600/20 text-red-400'
                              }`}>
                                {cohort.m4}%
                              </span>
                            )}
                          </td>
                          <td className="text-center py-3">
                            {cohort.m5 && (
                              <span className={`px-2 py-1 rounded ${
                                cohort.m5 >= 70 ? 'bg-emerald-600/20 text-emerald-400' :
                                cohort.m5 >= 60 ? 'bg-yellow-600/20 text-yellow-400' :
                                'bg-red-600/20 text-red-400'
                              }`}>
                                {cohort.m5}%
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forecasting Tab */}
          <TabsContent value="forecasting" className="space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
                <CardDescription>AI-powered predictions based on attribution data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Next Month Forecast</p>
                    <p className="text-2xl font-bold text-white">$48,920</p>
                    <p className="text-sm text-emerald-400">+15.4% growth</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Q4 2025 Projection</p>
                    <p className="text-2xl font-bold text-white">$167,340</p>
                    <p className="text-sm text-emerald-400">On track for target</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Annual Run Rate</p>
                    <p className="text-2xl font-bold text-white">$586,800</p>
                    <p className="text-sm text-emerald-400">Based on current growth</p>
                  </div>
                </div>

                <Alert className="bg-purple-600/10 border-purple-600/50">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <AlertDescription className="text-purple-300">
                    <strong>AI Insight:</strong> If you increase YouTube content frequency by 2x (based on its 1,185% ROI), 
                    you could reach $62,000/month by Q1 2026, accelerating your path to the $1M exit valuation.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}