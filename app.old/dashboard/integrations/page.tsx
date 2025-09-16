'use client';

import { useState } from 'react';
import { 
  Zap, Search, Check, ExternalLink, Shield,
  Mail, MessageSquare, Calendar, CreditCard,
  Video, Database, Code, Webhook, ChevronRight,
  Star, Users, TrendingUp, Lock, Unlock
} from 'lucide-react';
import Link from 'next/link';

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Integrations', count: 24 },
    { id: 'marketing', name: 'Marketing', count: 8 },
    { id: 'payment', name: 'Payment', count: 4 },
    { id: 'analytics', name: 'Analytics', count: 5 },
    { id: 'communication', name: 'Communication', count: 7 }
  ];

  const integrations = [
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'payment',
      description: 'Accept payments and manage subscriptions',
      icon: CreditCard,
      color: 'bg-purple-500',
      connected: true,
      popular: true,
      features: ['Payment processing', 'Subscription management', 'Invoice generation']
    },
    {
      id: 'zapier',
      name: 'Zapier',
      category: 'automation',
      description: 'Connect Allumi to 5,000+ apps',
      icon: Zap,
      color: 'bg-orange-500',
      connected: false,
      popular: true,
      features: ['5,000+ app connections', 'Custom workflows', 'No-code automation']
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      category: 'marketing',
      description: 'Email marketing and automation',
      icon: Mail,
      color: 'bg-yellow-500',
      connected: false,
      popular: true,
      features: ['Email campaigns', 'Audience segmentation', 'Marketing automation']
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      category: 'analytics',
      description: 'Track website traffic and user behavior',
      icon: TrendingUp,
      color: 'bg-blue-500',
      connected: true,
      popular: false,
      features: ['Traffic analytics', 'Conversion tracking', 'Custom events']
    },
    {
      id: 'zoom',
      name: 'Zoom',
      category: 'communication',
      description: 'Host webinars and video calls',
      icon: Video,
      color: 'bg-blue-600',
      connected: false,
      popular: true,
      features: ['Video meetings', 'Webinars', 'Recording & transcription']
    },
    {
      id: 'slack',
      name: 'Slack',
      category: 'communication',
      description: 'Team communication and notifications',
      icon: MessageSquare,
      color: 'bg-purple-600',
      connected: false,
      popular: false,
      features: ['Real-time messaging', 'Channel integration', 'Bot automation']
    },
    {
      id: 'calendly',
      name: 'Calendly',
      category: 'communication',
      description: 'Schedule meetings without the back-and-forth',
      icon: Calendar,
      color: 'bg-indigo-500',
      connected: false,
      popular: false,
      features: ['Meeting scheduling', 'Calendar sync', 'Automated reminders']
    },
    {
      id: 'webhook',
      name: 'Webhooks',
      category: 'developer',
      description: 'Send data to any URL in real-time',
      icon: Webhook,
      color: 'bg-gray-600',
      connected: true,
      popular: false,
      features: ['Real-time events', 'Custom endpoints', 'JSON payloads']
    }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = integrations.filter(i => i.connected).length;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Integrations</h1>
              <p className="text-sm text-gray-400 mt-1">Connect your favorite tools to Allumi</p>
            </div>
            <Link
              href="/dashboard"
              className="text-gray-400 hover:text-white flex items-center gap-2"
            >
              Back to Dashboard
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{connectedCount}</div>
                <div className="text-sm text-gray-400">Connected</div>
              </div>
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{integrations.length}</div>
                <div className="text-sm text-gray-400">Available</div>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">5,000+</div>
                <div className="text-sm text-gray-400">Via Zapier</div>
              </div>
              <Code className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">API</div>
                <div className="text-sm text-gray-400">Full Access</div>
              </div>
              <Database className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search integrations..."
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Featured Integration */}
        <div className="bg-gradient-to-r from-emerald-900/20 to-purple-900/20 border border-emerald-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <Zap className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">API Access</h3>
                <p className="text-gray-300 mb-4">
                  Build custom integrations with our full REST API. Access all your community data, 
                  trigger automations, and create powerful workflows.
                </p>
                <div className="flex items-center gap-4">
                  <Link 
                    href="/docs/api"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
                  >
                    View API Docs
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link 
                    href="/dashboard/api-keys"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
                  >
                    Get API Keys
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gray-900/70 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${integration.color} rounded-lg`}>
                    <integration.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      {integration.name}
                      {integration.popular && (
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Popular
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">{integration.category}</p>
                  </div>
                </div>
                {integration.connected ? (
                  <Unlock className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-600" />
                )}
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{integration.description}</p>
              
              <div className="space-y-2 mb-4">
                {integration.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-3 h-3 text-emerald-400" />
                    {feature}
                  </div>
                ))}
              </div>
              
              {integration.connected ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-400">Connected</span>
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    Configure
                  </button>
                </div>
              ) : (
                <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Request Integration */}
        <div className="mt-12 bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Don't see what you need?</h3>
          <p className="text-gray-400 mb-6">
            We're always adding new integrations. Let us know what tools you'd like to connect.
          </p>
          <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Request Integration
          </button>
        </div>
      </div>
    </div>
  );
}