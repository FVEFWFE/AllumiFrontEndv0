'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, Settings, Globe, Users, Mail, Bell, Shield, Zap, 
  DollarSign, TrendingUp, BarChart, Tag, FileText, Search,
  Gift, Puzzle, Hash, ScrollText, Compass, Activity, CreditCard,
  Info, Save, AlertCircle, Check, ChevronRight, Lock, Sparkles,
  Copy, RefreshCw, ExternalLink, Upload, Download, HelpCircle,
  Plus, Trash2, Eye, EyeOff, Link2, Code, ArrowUp, ArrowDown,
  Edit2, Calendar, Clock, Percent, ChevronUp, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
  communitySlug?: string;
}

const tabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart },
  { id: 'invite', label: 'Invite', icon: Users },
  { id: 'payouts', label: 'Payouts', icon: CreditCard },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'affiliates', label: 'Affiliates', icon: Gift },
  { id: 'plugins', label: 'Plugins', icon: Puzzle },
  { id: 'tabs', label: 'Tabs', icon: Hash },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'rules', label: 'Rules', icon: ScrollText },
  { id: 'discovery', label: 'Discovery', icon: Compass },
  { id: 'metrics', label: 'Metrics', icon: Activity },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export function SettingsModalComplete({ isOpen, onClose, defaultTab = 'general', communitySlug = 'community' }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Form states for all tabs
  const [generalSettings, setGeneralSettings] = useState({
    name: 'The Growth Lab',
    description: 'Learn growth strategies that actually work from founders who\'ve done it.',
    url: 'growth-lab',
    isPublic: true,
    requireApproval: false,
    logo: '',
    coverImage: '',
    supportEmail: 'support@growth-lab.com',
  });

  const [dashboardSettings, setDashboardSettings] = useState({
    visibleMetrics: ['revenue', 'members', 'engagement', 'attribution', 'content'],
    defaultTimeRange: '30days',
    showComparison: true,
    exportFormat: 'csv',
  });

  const [inviteSettings, setInviteSettings] = useState({
    inviteCode: 'GROWTH2025',
    allowPublicJoin: true,
    requireEmailVerification: true,
    autoApprove: false,
    maxInvites: 100,
    emailList: '',
    csvFile: null as File | null,
  });

  const [payoutSettings, setPayoutSettings] = useState({
    paymentMethod: 'stripe',
    stripeConnected: false,
    bankCountry: 'US',
    currency: 'USD',
    minimumPayout: 100,
    payoutSchedule: 'monthly',
  });

  const [pricingTiers, setPricingTiers] = useState([
    { id: 'free', type: 'free', name: 'Free', monthly: 0, annual: 0, current: false },
    { id: 'pro', type: 'paid', name: 'Pro', monthly: 89, annual: 890, current: true },
    { id: 'vip', type: 'paid', name: 'VIP', monthly: 299, annual: 2990, current: false },
  ]);

  const [affiliateSettings, setAffiliateSettings] = useState({
    enabled: true,
    commission: 40,
    cookieDuration: 60,
    minimumPayout: 50,
    autoApprove: true,
    customTerms: '',
  });

  const [pluginsSettings, setPluginsSettings] = useState({
    zapier: { enabled: true, apiKey: '', pro: false },
    slack: { enabled: false, webhook: '', pro: true },
    discord: { enabled: false, botToken: '', pro: true },
    mailchimp: { enabled: false, apiKey: '', pro: true },
    convertkit: { enabled: false, apiKey: '', pro: true },
    googleAnalytics: { enabled: true, trackingId: 'G-XXXXXXXXXX', pro: false },
  });

  const [tabsSettings, setTabsSettings] = useState([
    { id: 'community', label: 'Community', enabled: true, order: 0 },
    { id: 'classroom', label: 'Classroom', enabled: true, order: 1 },
    { id: 'calendar', label: 'Calendar', enabled: true, order: 2 },
    { id: 'members', label: 'Members', enabled: true, order: 3 },
    { id: 'leaderboard', label: 'Leaderboard', enabled: true, order: 4 },
    { id: 'about', label: 'About', enabled: true, order: 5 },
  ]);

  const [categories, setCategories] = useState([
    { id: '1', name: 'Announcements', color: '#10B981', order: 0 },
    { id: '2', name: 'General', color: '#6366F1', order: 1 },
    { id: '3', name: 'Wins', color: '#F59E0B', order: 2 },
    { id: '4', name: 'Questions', color: '#EF4444', order: 3 },
  ]);

  const [rules, setRules] = useState([
    { id: '1', text: 'Be respectful and professional', order: 0 },
    { id: '2', text: 'No spam or self-promotion without permission', order: 1 },
    { id: '3', text: 'Keep discussions relevant to the community topic', order: 2 },
    { id: '4', text: 'No sharing of copyrighted content', order: 3 },
    { id: '5', text: 'Help others and contribute value', order: 4 },
  ]);

  const [discoverySettings, setDiscoverySettings] = useState({
    listed: false, // We intentionally default to false
    searchable: false,
    tags: ['growth', 'marketing', 'startups'],
    category: 'business',
    language: 'en',
  });

  const [metricsSettings, setMetricsSettings] = useState({
    publicMetrics: false,
    showMemberCount: true,
    showActiveMembers: true,
    showPostCount: true,
    showEngagementRate: false,
    showRevenue: false,
  });

  const [billingSettings, setBillingSettings] = useState({
    plan: 'pro',
    nextBilling: '2025-02-14',
    amount: 99,
    paymentMethod: '**** 4242',
    autoRenew: true,
  });

  // Handle modal close
  const handleClose = () => {
    if (Object.values(unsavedChanges).some(v => v)) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
        setUnsavedChanges({});
      }
    } else {
      onClose();
    }
  };

  const markAsChanged = (tab: string) => {
    setUnsavedChanges(prev => ({ ...prev, [tab]: true }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setUnsavedChanges({});
  };

  // Handle CSV file upload
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInviteSettings(prev => ({ ...prev, csvFile: file }));
      markAsChanged('invite');
    }
  };

  // Add new pricing tier
  const addPricingTier = () => {
    const newTier = {
      id: Date.now().toString(),
      type: 'paid' as const,
      name: 'New Tier',
      monthly: 99,
      annual: 990,
      current: false,
    };
    setPricingTiers(prev => [...prev, newTier]);
    markAsChanged('pricing');
  };

  // Make pricing tier current
  const makePricingCurrent = (id: string) => {
    setPricingTiers(prev => prev.map(tier => ({
      ...tier,
      current: tier.id === id
    })));
    markAsChanged('pricing');
  };

  // Add category
  const addCategory = () => {
    const newCategory = {
      id: Date.now().toString(),
      name: 'New Category',
      color: '#6366F1',
      order: categories.length,
    };
    setCategories(prev => [...prev, newCategory]);
    markAsChanged('categories');
  };

  // Add rule
  const addRule = () => {
    const newRule = {
      id: Date.now().toString(),
      text: 'New rule',
      order: rules.length,
    };
    setRules(prev => [...prev, newRule]);
    markAsChanged('rules');
  };

  // Move item up/down
  const moveItem = (items: any[], index: number, direction: 'up' | 'down', setter: Function, tab: string) => {
    const newItems = [...items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < items.length) {
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      newItems.forEach((item, i) => item.order = i);
      setter(newItems);
      markAsChanged(tab);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <p className="text-sm text-gray-400 mt-1">{generalSettings.name}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-800 px-6 overflow-x-auto bg-gray-900/50">
          <div className="flex gap-1 min-w-max">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium transition-all relative group",
                    activeTab === tab.id
                      ? "text-emerald-400"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {unsavedChanges[tab.id] && (
                      <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-black">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">General Settings</h3>
                <p className="text-sm text-gray-400">Configure your community's basic information and appearance</p>
              </div>

              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Community Logo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                        {generalSettings.logo ? (
                          <img src={generalSettings.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-600" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">Upload Logo</Button>
                        <p className="text-xs text-gray-500">Recommended: 400x400px</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Cover Image
                    </label>
                    <div className="h-24 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                      {generalSettings.coverImage ? (
                        <img src={generalSettings.coverImage} alt="Cover" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Button variant="outline" size="sm">Set Cover Image</Button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Community Name
                  </label>
                  <Input
                    value={generalSettings.name}
                    onChange={(e) => {
                      setGeneralSettings(prev => ({ ...prev, name: e.target.value }));
                      markAsChanged('general');
                    }}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={generalSettings.description}
                    onChange={(e) => {
                      setGeneralSettings(prev => ({ ...prev, description: e.target.value }));
                      markAsChanged('general');
                    }}
                    rows={3}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Custom URL
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">allumi.com/c/</span>
                    <Input
                      value={generalSettings.url}
                      onChange={(e) => {
                        setGeneralSettings(prev => ({ ...prev, url: e.target.value }));
                        markAsChanged('general');
                      }}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Public Community</div>
                      <div className="text-sm text-gray-400">Anyone can view and join</div>
                    </div>
                    <Switch
                      checked={generalSettings.isPublic}
                      onCheckedChange={(checked) => {
                        setGeneralSettings(prev => ({ ...prev, isPublic: checked }));
                        markAsChanged('general');
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Require Approval</div>
                      <div className="text-sm text-gray-400">Manually approve new members</div>
                    </div>
                    <Switch
                      checked={generalSettings.requireApproval}
                      onCheckedChange={(checked) => {
                        setGeneralSettings(prev => ({ ...prev, requireApproval: checked }));
                        markAsChanged('general');
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Support Email
                  </label>
                  <Input
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) => {
                      setGeneralSettings(prev => ({ ...prev, supportEmail: e.target.value }));
                      markAsChanged('general');
                    }}
                    className="bg-gray-800 border-gray-700"
                    placeholder="support@example.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Dashboard Settings</h3>
                <p className="text-sm text-gray-400">Configure metrics and analytics display</p>
              </div>

              <div className="grid gap-6">
                <div className="p-6 bg-gray-800/50 rounded-lg space-y-4">
                  <h4 className="font-medium text-white">Key Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <div className="text-2xl font-bold text-white">$12,450</div>
                      <div className="text-sm text-gray-400">MRR</div>
                      <div className="text-xs text-emerald-400 mt-1">+12.5% from last month</div>
                    </div>
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <div className="text-2xl font-bold text-white">324</div>
                      <div className="text-sm text-gray-400">Active Members</div>
                      <div className="text-xs text-emerald-400 mt-1">+8.3% from last month</div>
                    </div>
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <div className="text-2xl font-bold text-white">7.2%</div>
                      <div className="text-sm text-gray-400">Churn Rate</div>
                      <div className="text-xs text-red-400 mt-1">-1.2% from last month</div>
                    </div>
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <div className="text-2xl font-bold text-white">$127</div>
                      <div className="text-sm text-gray-400">Avg LTV</div>
                      <div className="text-xs text-emerald-400 mt-1">+5.7% from last month</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3">Visible Metrics</h4>
                  <div className="space-y-2">
                    {[
                      'Revenue & MRR',
                      'Member Growth',
                      'Engagement Rate',
                      'Attribution Sources',
                      'Content Performance',
                      'Conversion Funnel',
                    ].map(metric => (
                      <label key={metric} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <input
                          type="checkbox"
                          defaultChecked
                          onChange={() => markAsChanged('dashboard')}
                          className="w-4 h-4 text-emerald-500 rounded"
                        />
                        <span className="text-gray-300">{metric}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Default Time Range
                  </label>
                  <Select defaultValue="30days" onValueChange={() => markAsChanged('dashboard')}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                      <SelectItem value="year">Last year</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Invite Tab */}
          {activeTab === 'invite' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Invite Members</h3>
                <p className="text-sm text-gray-400">Manage how new members join your community</p>
              </div>

              <div className="grid gap-6">
                {/* Invite Link */}
                <div className="p-6 bg-gray-800/50 rounded-lg space-y-4">
                  <h4 className="font-medium text-white">Share Invite Link</h4>
                  <div className="flex gap-2">
                    <Input
                      value={`allumi.com/join/${inviteSettings.inviteCode}?ref=${communitySlug}`}
                      readOnly
                      className="bg-gray-900 border-gray-700 font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-emerald-400">
                    ✨ Includes your 40% lifetime referral commission automatically
                  </p>
                </div>

                {/* Email Invites */}
                <div className="p-6 bg-gray-800/50 rounded-lg space-y-4">
                  <h4 className="font-medium text-white">Email Invitations</h4>
                  <Textarea
                    placeholder="Enter email addresses separated by commas..."
                    rows={4}
                    className="bg-gray-900 border-gray-700"
                    onChange={() => markAsChanged('invite')}
                  />
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Send Invitations
                  </Button>
                </div>

                {/* CSV Import */}
                <div className="p-6 bg-gray-800/50 rounded-lg space-y-4">
                  <h4 className="font-medium text-white">Bulk Import via CSV</h4>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">Drop CSV file here or click to browse</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span>Choose File</span>
                      </Button>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    CSV should contain: email, first_name, last_name
                  </p>
                </div>

                {/* Zapier Integration */}
                <div className="p-6 bg-gray-800/50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">Zapier Integration</h4>
                    <Badge className="bg-purple-600">Connected</Badge>
                  </div>
                  <p className="text-sm text-gray-400">
                    Automatically add members from your favorite apps
                  </p>
                  <Button variant="outline" size="sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Configure Zapier
                  </Button>
                </div>

                {/* Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Auto-approve Members</div>
                      <div className="text-sm text-gray-400">Skip manual approval</div>
                    </div>
                    <Switch
                      checked={inviteSettings.autoApprove}
                      onCheckedChange={(checked) => {
                        setInviteSettings(prev => ({ ...prev, autoApprove: checked }));
                        markAsChanged('invite');
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payouts Tab */}
          {activeTab === 'payouts' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Payouts</h3>
                <p className="text-sm text-gray-400">Configure how you receive payments</p>
              </div>

              <div className="grid gap-6">
                <div className="p-6 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-emerald-400">Available Balance</h4>
                    <span className="text-2xl font-bold text-white">$3,247.50</span>
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 w-full">
                    Request Payout
                  </Button>
                </div>

                <div className="p-6 bg-gray-800/50 rounded-lg space-y-4">
                  <h4 className="font-medium text-white">Stripe Connect</h4>
                  {payoutSettings.stripeConnected ? (
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Stripe Connected</div>
                          <div className="text-sm text-gray-400">acct_1234****</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  ) : (
                    <Button variant="outline">
                      Connect Stripe Account
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Payout Schedule
                    </label>
                    <Select defaultValue="monthly" onValueChange={() => markAsChanged('payouts')}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Minimum Payout
                    </label>
                    <Input
                      type="number"
                      value={payoutSettings.minimumPayout}
                      onChange={(e) => {
                        setPayoutSettings(prev => ({ ...prev, minimumPayout: Number(e.target.value) }));
                        markAsChanged('payouts');
                      }}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3">Recent Payouts</h4>
                  <div className="space-y-2">
                    {[
                      { date: '2025-01-01', amount: '$2,450.00', status: 'completed' },
                      { date: '2024-12-01', amount: '$2,120.00', status: 'completed' },
                      { date: '2024-11-01', amount: '$1,890.00', status: 'completed' },
                    ].map((payout, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{payout.amount}</div>
                          <div className="text-sm text-gray-400">{payout.date}</div>
                        </div>
                        <Badge variant="outline" className="text-emerald-400">
                          {payout.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Pricing</h3>
                <p className="text-sm text-gray-400">Set up your membership pricing tiers</p>
              </div>

              <div className="grid gap-6">
                <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-400">
                        Tip: Customers expect a 20% discount when paying annually
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {pricingTiers.map((tier, index) => (
                    <div key={tier.id} className={cn(
                      "p-6 rounded-lg border",
                      tier.current 
                        ? "bg-emerald-900/20 border-emerald-500/50" 
                        : "bg-gray-800/50 border-gray-700"
                    )}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Input
                            value={tier.name}
                            onChange={(e) => {
                              setPricingTiers(prev => prev.map(t => 
                                t.id === tier.id ? { ...t, name: e.target.value } : t
                              ));
                              markAsChanged('pricing');
                            }}
                            className="bg-gray-900 border-gray-700 font-semibold mb-2"
                          />
                          {tier.current && (
                            <Badge className="bg-emerald-600">Current</Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!tier.current && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => makePricingCurrent(tier.id)}
                            >
                              Make Current
                            </Button>
                          )}
                          {tier.type !== 'free' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setPricingTiers(prev => prev.filter(t => t.id !== tier.id));
                                markAsChanged('pricing');
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {tier.type === 'free' ? (
                        <div className="text-2xl font-bold text-white">Free</div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Monthly Price
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">$</span>
                              <Input
                                type="number"
                                value={tier.monthly}
                                onChange={(e) => {
                                  setPricingTiers(prev => prev.map(t => 
                                    t.id === tier.id ? { ...t, monthly: Number(e.target.value) } : t
                                  ));
                                  markAsChanged('pricing');
                                }}
                                className="bg-gray-900 border-gray-700"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Annual Price
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">$</span>
                              <Input
                                type="number"
                                value={tier.annual}
                                onChange={(e) => {
                                  setPricingTiers(prev => prev.map(t => 
                                    t.id === tier.id ? { ...t, annual: Number(e.target.value) } : t
                                  ));
                                  markAsChanged('pricing');
                                }}
                                className="bg-gray-900 border-gray-700"
                              />
                              {tier.monthly > 0 && (
                                <Badge variant="outline" className="text-emerald-400">
                                  {Math.round((1 - tier.annual / (tier.monthly * 12)) * 100)}% off
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={addPricingTier}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pricing Tier
                </Button>
              </div>
            </div>
          )}

          {/* Affiliates Tab */}
          {activeTab === 'affiliates' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Affiliate Program</h3>
                <p className="text-sm text-gray-400">Manage your referral program settings</p>
              </div>

              <div className="grid gap-6">
                <div className="p-6 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-emerald-400">Program Status</h4>
                    <Switch
                      checked={affiliateSettings.enabled}
                      onCheckedChange={(checked) => {
                        setAffiliateSettings(prev => ({ ...prev, enabled: checked }));
                        markAsChanged('affiliates');
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {affiliateSettings.commission}%
                      </div>
                      <div className="text-sm text-gray-400">Commission Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">47</div>
                      <div className="text-sm text-gray-400">Active Affiliates</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">$8,420</div>
                      <div className="text-sm text-gray-400">Total Paid Out</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Commission Rate (%)
                    </label>
                    <Input
                      type="number"
                      value={affiliateSettings.commission}
                      onChange={(e) => {
                        setAffiliateSettings(prev => ({ ...prev, commission: Number(e.target.value) }));
                        markAsChanged('affiliates');
                      }}
                      className="bg-gray-800 border-gray-700"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lifetime recurring commission</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Cookie Duration (days)
                    </label>
                    <Input
                      type="number"
                      value={affiliateSettings.cookieDuration}
                      onChange={(e) => {
                        setAffiliateSettings(prev => ({ ...prev, cookieDuration: Number(e.target.value) }));
                        markAsChanged('affiliates');
                      }}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Auto-approve Affiliates</div>
                      <div className="text-sm text-gray-400">Skip manual approval for new affiliates</div>
                    </div>
                    <Switch
                      checked={affiliateSettings.autoApprove}
                      onCheckedChange={(checked) => {
                        setAffiliateSettings(prev => ({ ...prev, autoApprove: checked }));
                        markAsChanged('affiliates');
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Custom Terms & Conditions
                  </label>
                  <Textarea
                    value={affiliateSettings.customTerms}
                    onChange={(e) => {
                      setAffiliateSettings(prev => ({ ...prev, customTerms: e.target.value }));
                      markAsChanged('affiliates');
                    }}
                    rows={4}
                    className="bg-gray-800 border-gray-700"
                    placeholder="Add any custom terms for your affiliate program..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Plugins Tab */}
          {activeTab === 'plugins' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Plugins & Integrations</h3>
                <p className="text-sm text-gray-400">Connect your favorite tools</p>
              </div>

              <div className="grid gap-4">
                {Object.entries(pluginsSettings).map(([key, plugin]) => (
                  <div key={key} className="p-6 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          plugin.enabled ? "bg-emerald-600" : "bg-gray-700"
                        )}>
                          <Puzzle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white capitalize">{key}</div>
                          {plugin.pro && (
                            <Badge variant="outline" className="text-purple-400 ml-2">PRO</Badge>
                          )}
                        </div>
                      </div>
                      <Switch
                        checked={plugin.enabled}
                        disabled={plugin.pro}
                        onCheckedChange={(checked) => {
                          setPluginsSettings(prev => ({
                            ...prev,
                            [key]: { ...prev[key as keyof typeof prev], enabled: checked }
                          }));
                          markAsChanged('plugins');
                        }}
                      />
                    </div>
                    {plugin.enabled && (
                      <div className="mt-4">
                        <Input
                          placeholder={key === 'googleAnalytics' ? 'Tracking ID' : 'API Key'}
                          className="bg-gray-900 border-gray-700"
                          onChange={() => markAsChanged('plugins')}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs Tab */}
          {activeTab === 'tabs' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Navigation Tabs</h3>
                <p className="text-sm text-gray-400">Customize which tabs appear in your community</p>
              </div>

              <div className="space-y-2">
                {tabsSettings.map((tab, index) => (
                  <div key={tab.id} className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveItem(tabsSettings, index, 'up', setTabsSettings, 'tabs')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveItem(tabsSettings, index, 'down', setTabsSettings, 'tabs')}
                        disabled={index === tabsSettings.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{tab.label}</div>
                    </div>
                    <Switch
                      checked={tab.enabled}
                      onCheckedChange={(checked) => {
                        setTabsSettings(prev => prev.map(t => 
                          t.id === tab.id ? { ...t, enabled: checked } : t
                        ));
                        markAsChanged('tabs');
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Post Categories</h3>
                <p className="text-sm text-gray-400">Organize your community content</p>
              </div>

              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div key={category.id} className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveItem(categories, index, 'up', setCategories, 'categories')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveItem(categories, index, 'down', setCategories, 'categories')}
                        disabled={index === categories.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <Input
                      value={category.name}
                      onChange={(e) => {
                        setCategories(prev => prev.map(c => 
                          c.id === category.id ? { ...c, name: e.target.value } : c
                        ));
                        markAsChanged('categories');
                      }}
                      className="flex-1 bg-gray-900 border-gray-700"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCategories(prev => prev.filter(c => c.id !== category.id));
                        markAsChanged('categories');
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={addCategory}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Community Rules</h3>
                <p className="text-sm text-gray-400">Set guidelines for your community members</p>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Rules URL</div>
                  <div className="text-sm text-gray-400">allumi.com/c/{communitySlug}/rules</div>
                </div>
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>

              <div className="space-y-2">
                {rules.map((rule, index) => (
                  <div key={rule.id} className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-gray-500">{index + 1}.</div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveItem(rules, index, 'up', setRules, 'rules')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveItem(rules, index, 'down', setRules, 'rules')}
                        disabled={index === rules.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      value={rule.text}
                      onChange={(e) => {
                        setRules(prev => prev.map(r => 
                          r.id === rule.id ? { ...r, text: e.target.value } : r
                        ));
                        markAsChanged('rules');
                      }}
                      className="flex-1 bg-gray-900 border-gray-700"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setRules(prev => prev.filter(r => r.id !== rule.id));
                        markAsChanged('rules');
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={addRule}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </div>
          )}

          {/* Discovery Tab */}
          {activeTab === 'discovery' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Discovery Settings</h3>
                <p className="text-sm text-gray-400">Control how people find your community</p>
              </div>

              <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-400">Anti-Discovery by Default</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Unlike Skool, we don't force communities into a discovery page. 
                      You control your growth channels with full attribution tracking.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="font-medium text-white">List in Discovery</div>
                    <div className="text-sm text-gray-400">Allow your community to be discovered</div>
                  </div>
                  <Switch
                    checked={discoverySettings.listed}
                    onCheckedChange={(checked) => {
                      setDiscoverySettings(prev => ({ ...prev, listed: checked }));
                      markAsChanged('discovery');
                    }}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="font-medium text-white">Searchable</div>
                    <div className="text-sm text-gray-400">Appear in search results</div>
                  </div>
                  <Switch
                    checked={discoverySettings.searchable}
                    onCheckedChange={(checked) => {
                      setDiscoverySettings(prev => ({ ...prev, searchable: checked }));
                      markAsChanged('discovery');
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Category
                </label>
                <Select defaultValue="business" onValueChange={() => markAsChanged('discovery')}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="health">Health & Fitness</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Tags (comma separated)
                </label>
                <Input
                  value={discoverySettings.tags.join(', ')}
                  onChange={(e) => {
                    setDiscoverySettings(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(t => t.trim()) 
                    }));
                    markAsChanged('discovery');
                  }}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
          )}

          {/* Metrics Tab */}
          {activeTab === 'metrics' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">About Page Metrics</h3>
                <p className="text-sm text-gray-400">Choose what stats to display publicly</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="font-medium text-white">Public Metrics</div>
                    <div className="text-sm text-gray-400">Show metrics on about page</div>
                  </div>
                  <Switch
                    checked={metricsSettings.publicMetrics}
                    onCheckedChange={(checked) => {
                      setMetricsSettings(prev => ({ ...prev, publicMetrics: checked }));
                      markAsChanged('metrics');
                    }}
                  />
                </div>

                {metricsSettings.publicMetrics && (
                  <>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">Member Count</div>
                        <div className="text-sm text-gray-400">Display total members</div>
                      </div>
                      <Switch
                        checked={metricsSettings.showMemberCount}
                        onCheckedChange={(checked) => {
                          setMetricsSettings(prev => ({ ...prev, showMemberCount: checked }));
                          markAsChanged('metrics');
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">Active Members</div>
                        <div className="text-sm text-gray-400">Show online members</div>
                      </div>
                      <Switch
                        checked={metricsSettings.showActiveMembers}
                        onCheckedChange={(checked) => {
                          setMetricsSettings(prev => ({ ...prev, showActiveMembers: checked }));
                          markAsChanged('metrics');
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">Post Count</div>
                        <div className="text-sm text-gray-400">Display total posts</div>
                      </div>
                      <Switch
                        checked={metricsSettings.showPostCount}
                        onCheckedChange={(checked) => {
                          setMetricsSettings(prev => ({ ...prev, showPostCount: checked }));
                          markAsChanged('metrics');
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">Engagement Rate</div>
                        <div className="text-sm text-gray-400">Show community engagement</div>
                      </div>
                      <Switch
                        checked={metricsSettings.showEngagementRate}
                        onCheckedChange={(checked) => {
                          setMetricsSettings(prev => ({ ...prev, showEngagementRate: checked }));
                          markAsChanged('metrics');
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">Revenue</div>
                        <div className="text-sm text-gray-400">Display MRR publicly</div>
                      </div>
                      <Switch
                        checked={metricsSettings.showRevenue}
                        onCheckedChange={(checked) => {
                          setMetricsSettings(prev => ({ ...prev, showRevenue: checked }));
                          markAsChanged('metrics');
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Billing</h3>
                <p className="text-sm text-gray-400">Manage your Allumi subscription</p>
              </div>

              <div className="p-6 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-medium text-white">Current Plan</h4>
                    <p className="text-sm text-gray-400">Professional</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">$99/mo</div>
                    <p className="text-sm text-gray-400">Next billing: {billingSettings.nextBilling}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-gray-300">Unlimited communities</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-gray-300">Advanced attribution tracking</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-gray-300">White-label branding</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-gray-300">Priority support</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="outline">Update Payment Method</Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Billing History</h4>
                <div className="space-y-2">
                  {[
                    { date: '2025-01-01', amount: '$99.00', status: 'paid' },
                    { date: '2024-12-01', amount: '$99.00', status: 'paid' },
                    { date: '2024-11-01', amount: '$99.00', status: 'paid' },
                  ].map((invoice, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{invoice.amount}</div>
                        <div className="text-sm text-gray-400">{invoice.date}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-emerald-400">
                          {invoice.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-800 bg-gray-900">
          <div className="text-sm text-gray-400">
            {Object.values(unsavedChanges).some(v => v) && (
              <span className="text-yellow-400">You have unsaved changes</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !Object.values(unsavedChanges).some(v => v)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}