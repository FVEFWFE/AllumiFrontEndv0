'use client';

import { useState } from 'react';
import { 
  Bell, Mail, MessageSquare, Heart, Users, Calendar,
  DollarSign, TrendingUp, Award, Shield, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export default function NotificationSettings() {
  const [emailFrequency, setEmailFrequency] = useState('daily');
  const [notifications, setNotifications] = useState({
    // Activity
    mentions: { push: true, email: true, inApp: true },
    replies: { push: true, email: false, inApp: true },
    likes: { push: false, email: false, inApp: true },
    follows: { push: true, email: false, inApp: true },
    
    // Community
    newMembers: { push: true, email: true, inApp: true },
    newPosts: { push: false, email: false, inApp: true },
    events: { push: true, email: true, inApp: true },
    announcements: { push: true, email: true, inApp: true },
    
    // Revenue
    newSubscriptions: { push: true, email: true, inApp: true },
    cancellations: { push: true, email: true, inApp: true },
    paymentIssues: { push: true, email: true, inApp: true },
    milestones: { push: true, email: true, inApp: true },
    
    // Platform
    productUpdates: { push: false, email: true, inApp: true },
    securityAlerts: { push: true, email: true, inApp: true },
    weeklyDigest: { push: false, email: true, inApp: false },
    monthlyReport: { push: false, email: true, inApp: false },
  });

  const toggleNotification = (key: string, type: 'push' | 'email' | 'inApp') => {
    setNotifications(prev => ({
      ...prev,
      [key]: {
        ...prev[key as keyof typeof prev],
        [type]: !prev[key as keyof typeof prev][type]
      }
    }));
  };

  const notificationGroups = [
    {
      title: 'Activity Notifications',
      description: 'Notifications about your posts and interactions',
      icon: MessageSquare,
      items: [
        { key: 'mentions', label: 'Mentions', description: 'When someone mentions you in a post or comment' },
        { key: 'replies', label: 'Replies', description: 'When someone replies to your posts or comments' },
        { key: 'likes', label: 'Likes', description: 'When someone likes your content' },
        { key: 'follows', label: 'New Followers', description: 'When someone follows you' },
      ]
    },
    {
      title: 'Community Updates',
      description: 'Stay informed about community activity',
      icon: Users,
      items: [
        { key: 'newMembers', label: 'New Members', description: 'When new members join your communities' },
        { key: 'newPosts', label: 'New Posts', description: 'When new posts are published in your communities' },
        { key: 'events', label: 'Events', description: 'Reminders about upcoming events' },
        { key: 'announcements', label: 'Announcements', description: 'Important community announcements' },
      ]
    },
    {
      title: 'Revenue & Analytics',
      description: 'Track your community growth and revenue',
      icon: DollarSign,
      items: [
        { key: 'newSubscriptions', label: 'New Subscriptions', description: 'When someone subscribes to your community' },
        { key: 'cancellations', label: 'Cancellations', description: 'When a member cancels their subscription' },
        { key: 'paymentIssues', label: 'Payment Issues', description: 'Failed payments and billing issues' },
        { key: 'milestones', label: 'Milestones', description: 'Revenue and member milestones achieved' },
      ]
    },
    {
      title: 'Platform Updates',
      description: 'Allumi platform news and updates',
      icon: Bell,
      items: [
        { key: 'productUpdates', label: 'Product Updates', description: 'New features and improvements' },
        { key: 'securityAlerts', label: 'Security Alerts', description: 'Important security notifications' },
        { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Weekly summary of your communities' },
        { key: 'monthlyReport', label: 'Monthly Report', description: 'Monthly analytics and insights' },
      ]
    }
  ];

  return (
    <div className="p-6 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Notification Settings</h2>
        <p className="text-gray-400">Choose how and when you want to be notified</p>
      </div>

      {/* Email Frequency */}
      <Card className="border-gray-800 bg-gray-900/50 mb-6">
        <CardHeader>
          <CardTitle>Email Frequency</CardTitle>
          <CardDescription>How often should we send you email summaries?</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={emailFrequency} onValueChange={setEmailFrequency}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="realtime" id="realtime" />
              <Label htmlFor="realtime" className="font-normal">
                Real-time (as they happen)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily" className="font-normal">
                Daily digest (once per day at 9am)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly" className="font-normal">
                Weekly digest (Mondays at 9am)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never" id="never" />
              <Label htmlFor="never" className="font-normal">
                Never (turn off email notifications)
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      {notificationGroups.map((group, groupIndex) => {
        const Icon = group.icon;
        return (
          <Card key={groupIndex} className="border-gray-800 bg-gray-900/50 mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600/20 rounded-lg">
                  <Icon className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <CardTitle>{group.title}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Headers */}
                <div className="grid grid-cols-5 gap-4 pb-2 border-b border-gray-800">
                  <div className="col-span-2 text-sm font-medium text-gray-400">Notification</div>
                  <div className="text-sm font-medium text-gray-400 text-center">Push</div>
                  <div className="text-sm font-medium text-gray-400 text-center">Email</div>
                  <div className="text-sm font-medium text-gray-400 text-center">In-App</div>
                </div>

                {/* Notification Items */}
                {group.items.map((item) => (
                  <div key={item.key} className="grid grid-cols-5 gap-4 items-center">
                    <div className="col-span-2">
                      <div className="font-medium text-white">{item.label}</div>
                      <div className="text-sm text-gray-400">{item.description}</div>
                    </div>
                    <div className="flex justify-center">
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications].push}
                        onCheckedChange={() => toggleNotification(item.key, 'push')}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications].email}
                        onCheckedChange={() => toggleNotification(item.key, 'email')}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications].inApp}
                        onCheckedChange={() => toggleNotification(item.key, 'inApp')}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Quiet Hours */}
      <Card className="border-gray-800 bg-gray-900/50 mb-6">
        <CardHeader>
          <CardTitle>Quiet Hours</CardTitle>
          <CardDescription>Pause notifications during specific hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Quiet Hours</Label>
              <p className="text-sm text-gray-400 mt-1">No push notifications between selected hours</p>
            </div>
            <Switch />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Label>From</Label>
              <Select defaultValue="22">
                <SelectTrigger className="mt-1 bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, '0')}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>To</Label>
              <Select defaultValue="8">
                <SelectTrigger className="mt-1 bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, '0')}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" className="text-gray-400">
          Reset to Defaults
        </Button>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
}