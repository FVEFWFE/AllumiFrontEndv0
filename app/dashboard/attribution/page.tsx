'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  DollarSign,
  TrendingUp,
  Target,
  BarChart3,
  ArrowUpRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import {
  getAttributionOverview,
  getAttributedMembers,
  getSourceMetrics,
  getConversionPathways,
  type SourceMetrics,
  type ConversionPathway,
  type AttributionMember
} from '@/lib/attribution-data';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AttributionPage() {
  const [selectedSource, setSelectedSource] = useState('all');
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [attributionData, setAttributionData] = useState<SourceMetrics[]>([]);
  const [pathways, setPathways] = useState<ConversionPathway[]>([]);
  const [members, setMembers] = useState<AttributionMember[]>([]);

  useEffect(() => {
    loadAttributionData();
  }, []);

  const loadAttributionData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // Load all attribution data
      const [overviewData, sourceData, pathwayData, memberData] = await Promise.all([
        getAttributionOverview(userId),
        getSourceMetrics(userId),
        getConversionPathways(userId),
        getAttributedMembers(userId, 50)
      ]);

      setOverview(overviewData);
      setAttributionData(sourceData);
      setPathways(pathwayData);
      setMembers(memberData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading attribution data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading attribution data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attribution Tracking</h1>
        <p className="text-muted-foreground mt-2">
          See exactly where your Skool members come from and their journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attributed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.attributedMembers || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {overview?.totalMembers || 0} total members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attributed Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(overview?.totalRevenue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {overview?.attributionRate?.toFixed(1) || 0}% attribution rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.avgConfidence || 0}%</div>
            <Progress value={overview?.avgConfidence || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Journey Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.9 days</div>
            <p className="text-xs text-muted-foreground">Click to conversion</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attribution by Source</CardTitle>
          <CardDescription>Track where your paying members originate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attributionData.map((source) => (
              <div key={source.source} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{source.source}</span>
                    <Badge variant="outline" className="text-xs">
                      {source.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{source.members} members</span>
                    <span className="font-medium">${source.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <Progress
                  value={(source.revenue / 32846) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Conversion Pathways</CardTitle>
          <CardDescription>Most common journeys from click to membership</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pathways.map((pathway, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{pathway.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {pathway.touchpoints} touchpoints • Avg: {pathway.avgTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{pathway.conversions}</span>
                  <span className="text-muted-foreground text-sm">conversions</span>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
              </div>
            ))}
            {pathways.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No conversion pathways tracked yet. Start by creating tracking links.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <CardTitle>Improve Attribution Accuracy</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">Connect Zapier to automatically track new Skool members and improve attribution confidence.</p>
          <Button>Connect Zapier</Button>
        </CardContent>
      </Card>
    </div>
  );
}