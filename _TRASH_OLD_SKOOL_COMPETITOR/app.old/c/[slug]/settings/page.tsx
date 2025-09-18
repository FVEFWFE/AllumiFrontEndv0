'use client';

import { useState } from 'react';
import { 
  Settings, Globe, CreditCard, Users, Mail, Bell, Shield, 
  Zap, Link, Save, Check, X, AlertCircle, ExternalLink,
  DollarSign, TrendingUp, Lock, Sparkles, Copy, RefreshCw,
  ChevronRight, Info, HelpCircle, ArrowRight
} from 'lucide-react';

export default function CommunitySettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [customDomain, setCustomDomain] = useState('');
  const [domainVerified, setDomainVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDomainInstructions, setShowDomainInstructions] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'domain', label: 'Custom Domain', icon: Globe, badge: 'PRO' },
    { id: 'monetization', label: 'Monetization', icon: DollarSign },
    { id: 'attribution', label: 'Attribution', icon: TrendingUp },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'emails', label: 'Email Automation', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Zap },
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  const handleDomainVerification = () => {
    setTimeout(() => setDomainVerified(true), 2000);
  };

  return (
    <div className="flex-1 min-h-screen bg-black">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800 bg-gray-900/50 min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold text-white mb-6">Community Settings</h1>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-white mb-6">General Settings</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Community Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Community Name
                      </label>
                      <input
                        type="text"
                        defaultValue="The Growth Lab"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        defaultValue="Learn growth strategies that actually work from founders who've done it."
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Community URL
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">allumi.com/c/</span>
                        <input
                          type="text"
                          defaultValue="growth-lab"
                          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">Public Community</div>
                        <div className="text-sm text-gray-400">Anyone can view and join</div>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">Require Approval</div>
                        <div className="text-sm text-gray-400">Manually approve new members</div>
                      </div>
                      <input type="checkbox" className="toggle" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom Domain Settings */}
          {activeTab === 'domain' && (
            <div className="max-w-4xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Custom Domain</h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Skool doesn't have this!</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-900/20 to-purple-900/20 border border-emerald-500/30 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Globe className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Build Your Brand, Not Ours
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Use your own domain to strengthen your brand identity. Your members will access your 
                      community at <span className="text-emerald-400 font-medium">community.yourdomain.com</span> instead 
                      of a generic platform URL. This is a key differentiator from Skool.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Configure Your Domain</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Custom Domain
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={customDomain}
                          onChange={(e) => setCustomDomain(e.target.value)}
                          placeholder="community.yourdomain.com"
                          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                        />
                        <button
                          onClick={handleDomainVerification}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Verify DNS
                        </button>
                      </div>
                    </div>

                    {customDomain && (
                      <div className={`p-4 rounded-lg border ${
                        domainVerified 
                          ? 'bg-emerald-500/10 border-emerald-500/30' 
                          : 'bg-yellow-500/10 border-yellow-500/30'
                      }`}>
                        <div className="flex items-start gap-3">
                          {domainVerified ? (
                            <Check className="w-5 h-5 text-emerald-400 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <h4 className={`font-medium ${
                              domainVerified ? 'text-emerald-400' : 'text-yellow-400'
                            }`}>
                              {domainVerified ? 'Domain Verified!' : 'Pending Verification'}
                            </h4>
                            <p className="text-sm text-gray-400 mt-1">
                              {domainVerified 
                                ? `Your community is now accessible at ${customDomain}`
                                : 'Please add the following DNS records to verify ownership:'}
                            </p>
                            
                            {!domainVerified && (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
                                  <code className="text-xs text-gray-300">
                                    CNAME: {customDomain} → proxy.allumi.com
                                  </code>
                                  <button className="text-gray-400 hover:text-white">
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => setShowDomainInstructions(true)}
                                  className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                >
                                  View detailed instructions
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">SSL Certificate</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm text-gray-300">
                            Automatic SSL included (Let's Encrypt)
                          </span>
                        </div>
                        <span className="text-xs text-emerald-400">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Domain Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'Better SEO', desc: 'Improve search rankings with your domain' },
                      { title: 'Brand Trust', desc: 'Members trust your domain more' },
                      { title: 'Full Control', desc: 'You own the relationship' },
                      { title: 'No Competition', desc: 'No "Discovery" page distractions' },
                    ].map((benefit) => (
                      <div key={benefit.title} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-white">{benefit.title}</div>
                          <div className="text-sm text-gray-400">{benefit.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Monetization Settings */}
          {activeTab === 'monetization' && (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-white mb-6">Monetization Settings</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Payment Provider</h3>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full">
                      Your Own Stripe
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CreditCard className="w-5 h-5 text-emerald-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-emerald-400">Connected: Stripe Account</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            acct_1234567890 • You own the payment relationship
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Standard Stripe fees apply (~2.9% + $0.30). No additional platform fees.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-2xl font-bold text-white">$12,450</div>
                        <div className="text-sm text-gray-400">This Month</div>
                      </div>
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-2xl font-bold text-white">$142,320</div>
                        <div className="text-sm text-gray-400">Total Revenue</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Pricing Tiers</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Free', price: 0, members: 523 },
                      { name: 'Pro Monthly', price: 49, members: 128 },
                      { name: 'Pro Annual', price: 470, members: 45 },
                      { name: 'VIP', price: 199, members: 12 },
                    ].map((tier) => (
                      <div key={tier.name} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{tier.name}</div>
                          <div className="text-sm text-gray-400">{tier.members} members</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-semibold text-white">
                            ${tier.price}{tier.price > 0 && '/mo'}
                          </div>
                          <button className="text-gray-400 hover:text-white">
                            <Settings className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    + Add Pricing Tier
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Attribution Settings */}
          {activeTab === 'attribution' && (
            <div className="max-w-4xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Attribution Settings</h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Allumi Exclusive</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-900/20 to-purple-900/20 border border-emerald-500/30 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Track Every Revenue Source
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Know exactly where your revenue comes from. This feature alone is worth 10x 
                      what you save vs Skool.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">UTM Tracking</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">Auto-generate UTM links</div>
                        <div className="text-sm text-gray-400">Create tracked links automatically</div>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">Track organic sources</div>
                        <div className="text-sm text-gray-400">Identify direct and referral traffic</div>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">Multi-touch attribution</div>
                        <div className="text-sm text-gray-400">Track entire customer journey</div>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </label>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Attribution Models</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'First Touch', desc: 'Credit first interaction', active: false },
                      { name: 'Last Touch', desc: 'Credit final interaction', active: true },
                      { name: 'Linear', desc: 'Equal credit to all touches', active: false },
                      { name: 'Time Decay', desc: 'More credit to recent touches', active: false },
                    ].map((model) => (
                      <label key={model.name} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800/70">
                        <input 
                          type="radio" 
                          name="attribution-model" 
                          defaultChecked={model.active}
                          className="text-emerald-500" 
                        />
                        <div className="flex-1">
                          <div className="font-medium text-white">{model.name}</div>
                          <div className="text-sm text-gray-400">{model.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="max-w-4xl mt-8">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Domain Instructions Modal */}
      {showDomainInstructions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Domain Setup Instructions</h3>
              <button
                onClick={() => setShowDomainInstructions(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>Follow these steps to connect your custom domain:</p>
              <ol className="space-y-3 list-decimal list-inside">
                <li>Log in to your domain registrar (GoDaddy, Namecheap, etc.)</li>
                <li>Navigate to DNS settings for your domain</li>
                <li>Add a CNAME record with these values:
                  <div className="mt-2 p-3 bg-gray-800 rounded">
                    <code className="text-sm">
                      Host: community<br />
                      Points to: proxy.allumi.com
                    </code>
                  </div>
                </li>
                <li>Save changes and wait 5-30 minutes for propagation</li>
                <li>Click "Verify DNS" to complete setup</li>
              </ol>
              <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                <p className="text-sm text-emerald-400">
                  Need help? Our support team can assist with domain setup. This feature saves you 
                  from being locked into a platform subdomain like Skool.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}