'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart, Funnel, FunnelChart, LabelList
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Target, TrendingUp, Clock, LinkIcon } from 'lucide-react';

// Mock data - replace with real Supabase queries
const conversionData = {
  summary: {
    totalConversions: 47,
    conversionRate: 3.2,
    averageTimeToConvert: '4.5 days',
    revenue: 2303,
    topChannel: 'YouTube',
  },
  byChannel: [
    { channel: 'YouTube', conversions: 23, revenue: 1127, rate: 4.1 },
    { channel: 'Instagram', conversions: 12, revenue: 588, rate: 3.2 },
    { channel: 'Twitter/X', conversions: 8, revenue: 392, rate: 2.8 },
    { channel: 'Skool', conversions: 4, revenue: 196, rate: 1.9 },
  ],
  byContent: [
    { content: 'How I Built $50K MRR', clicks: 342, conversions: 18, rate: 5.26 },
    { content: 'Skool vs Discord Video', clicks: 289, conversions: 12, rate: 4.15 },
    { content: 'Community Growth Guide', clicks: 198, conversions: 8, rate: 4.04 },
    { content: 'Instagram Story Series', clicks: 156, conversions: 5, rate: 3.21 },
    { content: 'Twitter Thread on CAC', clicks: 134, conversions: 4, rate: 2.99 },
  ],
  funnel: [
    { stage: 'Clicked Link', value: 1468, fill: '#8884d8' },
    { stage: 'Visited Landing', value: 892, fill: '#83a6ed' },
    { stage: 'Started Trial', value: 134, fill: '#8dd1e1' },
    { stage: 'Became Paying', value: 47, fill: '#82ca9d' },
  ],
  timeline: [
    { date: 'Mon', conversions: 5, revenue: 245 },
    { date: 'Tue', conversions: 8, revenue: 392 },
    { date: 'Wed', conversions: 6, revenue: 294 },
    { date: 'Thu', conversions: 12, revenue: 588 },
    { date: 'Fri', conversions: 9, revenue: 441 },
    { date: 'Sat', conversions: 4, revenue: 196 },
    { date: 'Sun', conversions: 3, revenue: 147 },
  ],
  attribution: {
    firstTouch: { YouTube: 45, Instagram: 28, Twitter: 20, Skool: 7 },
    lastTouch: { YouTube: 38, Instagram: 35, Twitter: 18, Skool: 9 },
    timeDecay: { YouTube: 42, Instagram: 30, Twitter: 19, Skool: 9 },
  },
  whaleConversions: [
    { name: 'Alex Chen', mrr: 25000, source: 'YouTube', timeToConvert: '2 days', touchpoints: 3 },
    { name: 'Sarah Johnson', mrr: 18000, source: 'Instagram DM', timeToConvert: '5 days', touchpoints: 7 },
    { name: 'Mike Roberts', mrr: 12000, source: 'Twitter', timeToConvert: '8 days', touchpoints: 5 },
  ]
};

export default function ConversionsDashboard() {
  const [selectedModel, setSelectedModel] = useState<'firstTouch' | 'lastTouch' | 'timeDecay'>('timeDecay');
  const [dateRange, setDateRange] = useState('7days');

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Conversion Tracking</h1>
        <p className="text-muted-foreground mt-2">
          Track how your content drives paying members to your Skool community
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionData.summary.totalConversions}</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +23% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversion Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionData.summary.conversionRate}%</div>
            <Progress value={conversionData.summary.conversionRate * 10} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Time to Convert</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionData.summary.averageTimeToConvert}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Clock className="h-4 w-4 mr-1" />
              Improving
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue Tracked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${conversionData.summary.revenue}</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <DollarSign className="h-4 w-4 mr-1" />
              +$441 today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Top Channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionData.summary.topChannel}</div>
            <Badge className="mt-2" variant="secondary">
              23 conversions
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="whales">Whale Tracking</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Journey from click to payment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <FunnelChart>
                    <Tooltip />
                    <Funnel
                      dataKey="value"
                      data={conversionData.funnel}
                      isAnimationActive
                    >
                      <LabelList position="center" fill="#fff" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Timeline</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={conversionData.timeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="conversions" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Channels Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
              <CardDescription>Conversions and revenue by channel</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversionData.byChannel}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="conversions" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attribution Tab */}
        <TabsContent value="attribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attribution Models Comparison</CardTitle>
              <CardDescription>See how different models attribute conversions</CardDescription>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedModel('firstTouch')}
                  className={`px-3 py-1 rounded ${selectedModel === 'firstTouch' ? 'bg-primary text-white' : 'bg-secondary'}`}
                >
                  First Touch
                </button>
                <button
                  onClick={() => setSelectedModel('lastTouch')}
                  className={`px-3 py-1 rounded ${selectedModel === 'lastTouch' ? 'bg-primary text-white' : 'bg-secondary'}`}
                >
                  Last Touch
                </button>
                <button
                  onClick={() => setSelectedModel('timeDecay')}
                  className={`px-3 py-1 rounded ${selectedModel === 'timeDecay' ? 'bg-primary text-white' : 'bg-secondary'}`}
                >
                  Time Decay
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(conversionData.attribution[selectedModel]).map(([key, value]) => ({
                      name: key,
                      value
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(conversionData.attribution[selectedModel]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Performance Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Converting Content</CardTitle>
              <CardDescription>Which content pieces drive the most conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionData.byContent.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.content}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.clicks} clicks → {item.conversions} conversions
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{item.rate}%</div>
                      <div className="text-sm text-muted-foreground">conversion rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Whale Tracking Tab */}
        <TabsContent value="whales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Whale Conversions</CardTitle>
              <CardDescription>High-value prospects who converted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionData.whaleConversions.map((whale, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-transparent">
                    <div>
                      <div className="font-semibold text-lg">{whale.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <Badge variant="outline" className="mr-2">${whale.mrr.toLocaleString()} MRR</Badge>
                        <Badge variant="secondary">{whale.source}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Converted in {whale.timeToConvert}</div>
                      <div className="text-sm text-muted-foreground">{whale.touchpoints} touchpoints</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}