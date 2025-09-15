'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, Settings, Globe, Users, Mail, Bell, Shield, Zap, 
  DollarSign, TrendingUp, BarChart, Tag, FileText, Search,
  Gift, Plugin, Hash, ScrollText, Compass, Activity, CreditCard,
  Info, Save, AlertCircle, Check, ChevronRight, Lock, Sparkles,
  Copy, RefreshCw, ExternalLink, Upload, Download, HelpCircle
} from 'lucide-react';

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
  { id: 'plugins', label: 'Plugins', icon: Plugin },
  { id: 'tabs', label: 'Tabs', icon: Hash },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'rules', label: 'Rules', icon: ScrollText },
  { id: 'discovery', label: 'Discovery', icon: Compass },
  { id: 'metrics', label: 'Metrics', icon: Activity },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'about', label: 'About', icon: Info },
];

export function SettingsModal({ isOpen, onClose, defaultTab = 'general', communitySlug = 'community' }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Form state for different tabs
  const [generalSettings, setGeneralSettings] = useState({
    name: 'The Growth Lab',
    description: 'Learn growth strategies that actually work from founders who\'ve done it.',
    url: 'growth-lab',
    isPublic: true,
    requireApproval: false,
    logo: '',
  });

  const [pricingTiers, setPricingTiers] = useState([
    { id: '1', name: 'Free', price: 0, description: 'Basic access', features: ['Community access', 'Weekly newsletter'] },
    { id: '2', name: 'Pro', price: 49, description: 'Full access', features: ['All courses', 'Direct messaging', 'Monthly calls'] },
    { id: '3', name: 'VIP', price: 199, description: 'Premium experience', features: ['1-on-1 coaching', 'Private mastermind', 'Early access'] },
  ]);

  const [inviteSettings, setInviteSettings] = useState({
    allowPublicJoin: true,
    requireEmailVerification: true,
    autoApprove: false,
    inviteCode: 'GROWTH2025',
    maxInvites: 100,
  });

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Close on outside click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (Object.values(unsavedChanges).some(v => v)) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setUnsavedChanges({});
  };

  const markAsChanged = (tab: string) => {
    setUnsavedChanges(prev => ({ ...prev, [tab]: true }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-zinc-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button
            onClick={handleClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-zinc-800 px-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-emerald-500'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
                {unsavedChanges[tab.id] && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full" />
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">General</h3>
                <p className="text-sm text-zinc-400">Basic information about your community</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Community Name
                  </label>
                  <input
                    type="text"
                    value={generalSettings.name}
                    onChange={(e) => {
                      setGeneralSettings(prev => ({ ...prev, name: e.target.value }));
                      markAsChanged('general');
                    }}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={generalSettings.description}
                    onChange={(e) => {
                      setGeneralSettings(prev => ({ ...prev, description: e.target.value }));
                      markAsChanged('general');
                    }}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Community URL
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">allumi.com/c/</span>
                    <input
                      type="text"
                      value={generalSettings.url}
                      onChange={(e) => {
                        setGeneralSettings(prev => ({ ...prev, url: e.target.value }));
                        markAsChanged('general');
                      }}
                      className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Community Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-zinc-800 rounded-lg flex items-center justify-center">
                      {generalSettings.logo ? (
                        <img src={generalSettings.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Upload className="w-8 h-8 text-zinc-600" />
                      )}
                    </div>
                    <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors">
                      Upload Logo
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Public Community</div>
                      <div className="text-sm text-zinc-400">Anyone can view and join</div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={generalSettings.isPublic}
                      onChange={(e) => {
                        setGeneralSettings(prev => ({ ...prev, isPublic: e.target.checked }));
                        markAsChanged('general');
                      }}
                      className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Require Approval</div>
                      <div className="text-sm text-zinc-400">Manually approve new members</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={generalSettings.requireApproval}
                      onChange={(e) => {
                        setGeneralSettings(prev => ({ ...prev, requireApproval: e.target.checked }));
                        markAsChanged('general');
                      }}
                      className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Dashboard</h3>
                <p className="text-sm text-zinc-400">Configure your dashboard and analytics preferences</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-zinc-800/50 rounded-lg space-y-3">
                  <h4 className="font-medium text-white">Visible Metrics</h4>
                  {['Revenue', 'Members', 'Engagement', 'Attribution Sources', 'Content Performance'].map(metric => (
                    <label key={metric} className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        defaultChecked
                        onChange={() => markAsChanged('dashboard')}
                        className="w-4 h-4 text-emerald-500 rounded"
                      />
                      <span className="text-zinc-300">{metric}</span>
                    </label>
                  ))}
                </div>

                <div className="p-4 bg-zinc-800/50 rounded-lg">
                  <h4 className="font-medium text-white mb-3">Default Time Range</h4>
                  <select 
                    className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                    onChange={() => markAsChanged('dashboard')}
                  >
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>Last year</option>
                    <option>All time</option>
                  </select>
                </div>

                <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-emerald-400">Attribution Dashboard</h4>
                      <p className="text-sm text-zinc-400 mt-1">
                        Your attribution dashboard is automatically configured to track all revenue sources. 
                        This is a key differentiator from Skool.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invite Tab */}
          {activeTab === 'invite' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Invite</h3>
                <p className="text-sm text-zinc-400">Manage how new members join your community</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Invite Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inviteSettings.inviteCode}
                      onChange={(e) => {
                        setInviteSettings(prev => ({ ...prev, inviteCode: e.target.value }));
                        markAsChanged('invite');
                      }}
                      className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono"
                    />
                    <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Invite Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`allumi.com/join/${inviteSettings.inviteCode}`}
                      readOnly
                      className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400"
                    />
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Allow Public Join</div>
                      <div className="text-sm text-zinc-400">Anyone with the link can join</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={inviteSettings.allowPublicJoin}
                      onChange={(e) => {
                        setInviteSettings(prev => ({ ...prev, allowPublicJoin: e.target.checked }));
                        markAsChanged('invite');
                      }}
                      className="w-5 h-5 text-emerald-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Require Email Verification</div>
                      <div className="text-sm text-zinc-400">Members must verify their email</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={inviteSettings.requireEmailVerification}
                      onChange={(e) => {
                        setInviteSettings(prev => ({ ...prev, requireEmailVerification: e.target.checked }));
                        markAsChanged('invite');
                      }}
                      className="w-5 h-5 text-emerald-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Auto-Approve Members</div>
                      <div className="text-sm text-zinc-400">Skip manual approval process</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={inviteSettings.autoApprove}
                      onChange={(e) => {
                        setInviteSettings(prev => ({ ...prev, autoApprove: e.target.checked }));
                        markAsChanged('invite');
                      }}
                      className="w-5 h-5 text-emerald-500 rounded"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Max Invites Per Member
                  </label>
                  <input
                    type="number"
                    value={inviteSettings.maxInvites}
                    onChange={(e) => {
                      setInviteSettings(prev => ({ ...prev, maxInvites: parseInt(e.target.value) }));
                      markAsChanged('invite');
                    }}
                    className="w-32 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Pricing</h3>
                <p className="text-sm text-zinc-400">Set up your membership tiers and pricing</p>
              </div>

              <div className="space-y-4">
                {pricingTiers.map((tier, index) => (
                  <div key={tier.id} className="p-6 bg-zinc-800/50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          Tier Name
                        </label>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => {
                            const newTiers = [...pricingTiers];
                            newTiers[index].name = e.target.value;
                            setPricingTiers(newTiers);
                            markAsChanged('pricing');
                          }}
                          className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          Price (Monthly)
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500">$</span>
                          <input
                            type="number"
                            value={tier.price}
                            onChange={(e) => {
                              const newTiers = [...pricingTiers];
                              newTiers[index].price = parseInt(e.target.value);
                              setPricingTiers(newTiers);
                              markAsChanged('pricing');
                            }}
                            className="flex-1 px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          Whop Product ID
                        </label>
                        <input
                          type="text"
                          placeholder="prod_xxxxx"
                          className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                          onChange={() => markAsChanged('pricing')}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={tier.description}
                        onChange={(e) => {
                          const newTiers = [...pricingTiers];
                          newTiers[index].description = e.target.value;
                          setPricingTiers(newTiers);
                          markAsChanged('pricing');
                        }}
                        className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Features (one per line)
                      </label>
                      <textarea
                        rows={3}
                        value={tier.features.join('\n')}
                        onChange={(e) => {
                          const newTiers = [...pricingTiers];
                          newTiers[index].features = e.target.value.split('\n').filter(f => f.trim());
                          setPricingTiers(newTiers);
                          markAsChanged('pricing');
                        }}
                        className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                      />
                    </div>

                    {pricingTiers.length > 1 && (
                      <button
                        onClick={() => {
                          setPricingTiers(prev => prev.filter(t => t.id !== tier.id));
                          markAsChanged('pricing');
                        }}
                        className="mt-4 text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove Tier
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => {
                    setPricingTiers(prev => [...prev, {
                      id: Date.now().toString(),
                      name: 'New Tier',
                      price: 0,
                      description: '',
                      features: []
                    }]);
                    markAsChanged('pricing');
                  }}
                  className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  + Add Pricing Tier
                </button>

                <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-emerald-400">Whop Payments Integration</h4>
                      <p className="text-sm text-zinc-400 mt-1">
                        We use Whop for seamless payment processing. No Stripe setup required!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs can be added similarly */}
          {!['general', 'dashboard', 'invite', 'pricing'].includes(activeTab) && (
            <div className="max-w-3xl">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  {tabs.find(t => t.id === activeTab)?.icon && (
                    <div className="w-8 h-8 text-zinc-600">
                      {(() => {
                        const Icon = tabs.find(t => t.id === activeTab)?.icon;
                        return Icon ? <Icon className="w-full h-full" /> : null;
                      })()}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 capitalize">{activeTab} Settings</h3>
                <p className="text-sm text-zinc-400">This section is coming soon</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            {Object.values(unsavedChanges).some(v => v) && (
              <div className="flex items-center gap-2 text-yellow-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">You have unsaved changes</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!Object.values(unsavedChanges).some(v => v) || saving}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}