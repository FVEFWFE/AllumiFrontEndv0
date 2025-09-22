'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  Users,
  TrendingUp,
  Copy,
  Gift,
  Star,
  Award,
  Zap,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AffiliatesPage() {
  const [affiliateLink] = useState('https://allumi.to/partner/YOURCODE');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    toast.success('Affiliate link copied!');
  };

  const topAffiliates = [
    { name: 'Sarah Johnson', referrals: 45, earnings: 1602, status: 'gold' },
    { name: 'Mike Chen', referrals: 32, earnings: 1139, status: 'silver' },
    { name: 'Emily Davis', referrals: 28, earnings: 996, status: 'silver' },
    { name: 'Alex Thompson', referrals: 19, earnings: 676, status: 'bronze' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Affiliate Program</h1>
        <p className="text-muted-foreground mt-2">
          Earn 40% recurring commission for every customer you refer
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,413</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+$423</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40%</div>
            <p className="text-xs text-muted-foreground">Recurring monthly</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Tier</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold">Gold</span>
            </div>
            <p className="text-xs text-muted-foreground">Top 10% affiliate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-200 dark:border-violet-800">
        <CardHeader>
          <CardTitle>Your Affiliate Link</CardTitle>
          <CardDescription>Share this link to start earning commissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={affiliateLink}
              readOnly
              className="font-mono text-sm"
            />
            <Button onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              40% commission
            </Badge>
            <Badge variant="secondary">
              <Zap className="h-3 w-3 mr-1" />
              Instant tracking
            </Badge>
            <Badge variant="secondary">
              <TrendingUp className="h-3 w-3 mr-1" />
              Monthly payouts
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="referrals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="referrals">Your Referrals</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
              <CardDescription>Track your referred customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">john.doe@example.com</p>
                    <p className="text-sm text-muted-foreground">Joined 2 days ago</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$35.60/mo</p>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">jane.smith@example.com</p>
                    <p className="text-sm text-muted-foreground">Joined 5 days ago</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$35.60/mo</p>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">mike.wilson@example.com</p>
                    <p className="text-sm text-muted-foreground">Joined 1 week ago</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$35.60/mo</p>
                    <Badge variant="outline" className="text-xs">Trial</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Affiliates</CardTitle>
              <CardDescription>See how you rank against other affiliates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAffiliates.map((affiliate, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{affiliate.name}</p>
                        <p className="text-sm text-muted-foreground">{affiliate.referrals} referrals</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        affiliate.status === 'gold' ? 'default' :
                        affiliate.status === 'silver' ? 'secondary' : 'outline'
                      }>
                        {affiliate.status}
                      </Badge>
                      <span className="font-medium">${affiliate.earnings}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Materials</CardTitle>
                <CardDescription>Ready-to-use promotional content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between">
                    Email Templates
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    Social Media Posts
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    Banner Ads
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Affiliate Guide</CardTitle>
                <CardDescription>Learn how to maximize your earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between">
                    Getting Started Guide
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    Best Practices
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    FAQ
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}