'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Key,
  Bell,
  Shield,
  Link,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Zap,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyReports: true,
    trialReminders: true,
    newConversions: false,
  });
  const [apiKey, setApiKey] = useState('Loading...');
  const [webhookUrl, setWebhookUrl] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/settings', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setApiKey(data.settings.api_key);
          setWebhookUrl(data.settings.webhook_url || `https://allumi.to/api/webhooks/${data.settings.user_id}`);
          setNotifications(data.settings.notifications || notifications);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateNotifications = async (newNotifications: typeof notifications) => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notifications: newNotifications })
      });

      if (response.ok) {
        setNotifications(newNotifications);
        toast.success('Notification preferences updated');
      } else {
        toast.error('Failed to update notifications');
      }
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Failed to update notifications');
    } finally {
      setSaving(false);
    }
  };

  const regenerateApiKey = async () => {
    if (!confirm('Are you sure you want to regenerate your API key? This will invalidate your current key.')) {
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ regenerateApiKey: true })
      });

      if (response.ok) {
        const data = await response.json();
        setApiKey(data.settings.api_key);
        toast.success('API key regenerated successfully');
      } else {
        toast.error('Failed to regenerate API key');
      }
    } catch (error) {
      console.error('Error regenerating API key:', error);
      toast.error('Failed to regenerate API key');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and integrations
        </p>
      </div>

      <Tabs defaultValue="api" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api">API & Webhooks</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Key</CardTitle>
                  <CardDescription>Use this key to authenticate API requests</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Encrypted
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Your API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      readOnly
                      className="font-mono text-sm pr-10"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Button onClick={() => copyToClipboard(apiKey, 'API key')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Keep this key secret. Regenerate if compromised.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={regenerateApiKey}
                disabled={saving || loading}
              >
                {saving ? 'Regenerating...' : 'Regenerate API Key'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Endpoint</CardTitle>
              <CardDescription>Send conversion data to this endpoint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={webhookUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button onClick={() => copyToClipboard(webhookUrl, 'Webhook URL')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">Webhook Events:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">member.created</Badge>
                  <Badge variant="secondary">member.upgraded</Badge>
                  <Badge variant="secondary">payment.succeeded</Badge>
                  <Badge variant="secondary">link.clicked</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Integrations</CardTitle>
              <CardDescription>Manage your third-party connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Zapier</p>
                    <p className="text-sm text-muted-foreground">Automate Skool member imports</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Skool</p>
                    <p className="text-sm text-muted-foreground">Direct Skool API integration</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Not connected
                  </Badge>
                  <Button size="sm">
                    Connect
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Key className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">FingerprintJS</p>
                    <p className="text-sm text-muted-foreground">Advanced visitor tracking</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                  <Button variant="outline" size="sm">
                    Setup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-violet-600" />
                <CardTitle>Quick Setup Guide</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Complete your integration setup for maximum attribution accuracy:</p>
              <ol className="space-y-2 text-sm">
                <li>1. Connect Zapier to automate member imports</li>
                <li>2. Add webhook to your Skool community</li>
                <li>3. Install tracking pixel on your landing pages</li>
              </ol>
              <Button className="mt-4" size="sm">
                View Setup Guide
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what emails you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-alerts">Conversion Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new members are attributed
                  </p>
                </div>
                <Switch
                  id="email-alerts"
                  checked={notifications.emailAlerts}
                  disabled={saving || loading}
                  onCheckedChange={(checked) => {
                    const newNotifications = {...notifications, emailAlerts: checked};
                    updateNotifications(newNotifications);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly attribution performance summaries
                  </p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={notifications.weeklyReports}
                  disabled={saving || loading}
                  onCheckedChange={(checked) => {
                    const newNotifications = {...notifications, weeklyReports: checked};
                    updateNotifications(newNotifications);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trial-reminders">Trial Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Important updates about your trial status
                  </p>
                </div>
                <Switch
                  id="trial-reminders"
                  checked={notifications.trialReminders}
                  disabled={saving || loading}
                  onCheckedChange={(checked) => {
                    const newNotifications = {...notifications, trialReminders: checked};
                    updateNotifications(newNotifications);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-conversions">Real-time Conversions</Label>
                  <p className="text-sm text-muted-foreground">
                    Instant notification for each new conversion
                  </p>
                </div>
                <Switch
                  id="new-conversions"
                  checked={notifications.newConversions}
                  disabled={saving || loading}
                  onCheckedChange={(checked) => {
                    const newNotifications = {...notifications, newConversions: checked};
                    updateNotifications(newNotifications);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value="test@allumi.com" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Test User" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="America/New_York" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}