'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Save, Copy, Eye, EyeOff, Key, Webhook, User, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import ZapierSetupWizard from '@/components/dashboard/ZapierSetupWizard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UserSettings {
  email: string;
  name: string;
  fingerprintApiKey?: string;
  zapierWebhookUrl?: string;
  emailNotifications: boolean;
  weeklyReports: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    email: '',
    name: '',
    fingerprintApiKey: '',
    zapierWebhookUrl: '',
    emailNotifications: true,
    weeklyReports: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/sign-in');
        return;
      }

      // Load user settings from profile or settings table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setSettings({
          email: session.user.email || '',
          name: profile.name || '',
          fingerprintApiKey: profile.fingerprint_api_key || '',
          zapierWebhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://allumi.com'}/api/webhooks/zapier/${session.user.id}`,
          emailNotifications: profile.email_notifications ?? true,
          weeklyReports: profile.weekly_reports ?? false
        });
      } else {
        // Default settings if no profile exists
        setSettings({
          email: session.user.email || '',
          name: '',
          fingerprintApiKey: '',
          zapierWebhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://allumi.com'}/api/webhooks/zapier/${session.user.id}`,
          emailNotifications: true,
          weeklyReports: false
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expired. Please login again.');
        router.push('/sign-in');
        return;
      }

      // Upsert profile settings
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          name: settings.name,
          fingerprint_api_key: settings.fingerprintApiKey,
          email_notifications: settings.emailNotifications,
          weekly_reports: settings.weeklyReports,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(settings.zapierWebhookUrl);
    toast.success('Webhook URL copied to clipboard!');
  };

  const copyApiExample = () => {
    const example = `curl -X POST ${settings.zapierWebhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com", "name": "John Doe", "joined_at": "2024-12-19T10:00:00Z"}'`;
    navigator.clipboard.writeText(example);
    toast.success('API example copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and integrations
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold">Profile Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  disabled
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold">API Keys</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  FingerprintJS API Key
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Get your API key from{' '}
                  <a
                    href="https://fingerprintjs.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    fingerprintjs.com
                  </a>
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={settings.fingerprintApiKey}
                      onChange={(e) => setSettings({ ...settings, fingerprintApiKey: e.target.value })}
                      placeholder="Enter your FingerprintJS API key"
                      className="w-full px-4 py-2 pr-10 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Zapier Setup Wizard */}
          <ZapierSetupWizard webhookUrl={settings.zapierWebhookUrl} />

          {/* Notification Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="w-4 h-4 text-accent rounded focus:ring-accent"
                />
                <div>
                  <div className="text-sm font-medium">Email Notifications</div>
                  <div className="text-xs text-muted-foreground">
                    Receive email alerts for new conversions
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.weeklyReports}
                  onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
                  className="w-4 h-4 text-accent rounded focus:ring-accent"
                />
                <div>
                  <div className="text-sm font-medium">Weekly Reports</div>
                  <div className="text-xs text-muted-foreground">
                    Get weekly attribution performance reports
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}