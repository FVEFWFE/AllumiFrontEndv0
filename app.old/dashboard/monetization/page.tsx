'use client';

import { useState } from 'react';
import { 
  DollarSign, CreditCard, TrendingUp, Users, Package, 
  Plus, Settings, Check, X, AlertCircle, ExternalLink,
  Zap, Gift, Lock, Unlock, Eye, EyeOff, Copy, 
  ArrowUpRight, ArrowDownRight, RefreshCw, ChevronRight,
  Sparkles, Shield, Info, Edit2, Trash2, MoreVertical
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function MonetizationDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showStripeConnect, setShowStripeConnect] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);

  // Mock data
  const revenueData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: Math.floor(Math.random() * 2000) + 500,
    mrr: Math.floor(Math.random() * 15000) + 10000,
  }));

  const pricingTiers = [
    { 
      id: 1, 
      name: 'Free', 
      price: 0, 
      interval: 'forever', 
      members: 523, 
      revenue: 0,
      features: ['Community access', 'Basic content', 'Group chat'],
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Pro', 
      price: 49, 
      interval: 'month', 
      members: 128, 
      revenue: 6272,
      features: ['Everything in Free', 'Premium content', 'Weekly calls', 'Direct messaging'],
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Pro Annual', 
      price: 470, 
      interval: 'year', 
      members: 45, 
      revenue: 1762,
      features: ['Everything in Pro', '2 months free', 'Priority support'],
      status: 'active'
    },
    { 
      id: 4, 
      name: 'VIP', 
      price: 199, 
      interval: 'month', 
      members: 12, 
      revenue: 2388,
      features: ['Everything in Pro', '1-on-1 coaching', 'Custom resources', 'Mastermind access'],
      status: 'active'
    },
  ];

  const metrics = {
    mrr: 12450,
    totalRevenue: 142320,
    activeMembers: 708,
    avgRevPerMember: 17.58,
    churnRate: 3.2,
    ltv: 1247,
  };

  const upcomingPayouts = [
    { date: 'Dec 15', amount: 4250, status: 'pending' },
    { date: 'Dec 22', amount: 3890, status: 'pending' },
    { date: 'Dec 29', amount: 4120, status: 'scheduled' },
  ];

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-emerald-500" />
              Monetization
            </h1>
            <p className="text-gray-400 mt-2">
              Manage pricing, payments, and track revenue - all with your own Stripe account
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStripeConnect(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Stripe Settings
            </button>
            <button
              onClick={() => setShowPricingModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Pricing Tier
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6">
          {['overview', 'pricing', 'payouts', 'subscribers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-xs text-emerald-400">+12.5%</span>
              </div>
              <div className="text-2xl font-bold text-white">${metrics.mrr.toLocaleString()}</div>
              <div className="text-xs text-gray-500">MRR</div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-blue-400">All time</span>
              </div>
              <div className="text-2xl font-bold text-white">${metrics.totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total Revenue</div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="text-xs text-purple-400">+28</span>
              </div>
              <div className="text-2xl font-bold text-white">{metrics.activeMembers}</div>
              <div className="text-xs text-gray-500">Paid Members</div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-5 h-5 text-yellow-500" />
                <span className="text-xs text-yellow-400">+$2.40</span>
              </div>
              <div className="text-2xl font-bold text-white">${metrics.avgRevPerMember}</div>
              <div className="text-xs text-gray-500">Avg Revenue</div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <ArrowDownRight className="w-5 h-5 text-red-500" />
                <span className="text-xs text-red-400">-0.5%</span>
              </div>
              <div className="text-2xl font-bold text-white">{metrics.churnRate}%</div>
              <div className="text-xs text-gray-500">Churn Rate</div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <span className="text-xs text-emerald-400">+$124</span>
              </div>
              <div className="text-2xl font-bold text-white">${metrics.ltv}</div>
              <div className="text-xs text-gray-500">LTV</div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Upcoming Payouts</h2>
              <div className="space-y-3">
                {upcomingPayouts.map((payout, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">${payout.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{payout.date}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payout.status === 'pending' 
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {payout.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                View Payout History
              </button>
            </div>
          </div>

          {/* Stripe Connection Status */}
          <div className="bg-gradient-to-br from-emerald-900/20 to-purple-900/20 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  You Own Your Payments
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Connected to Stripe account: <span className="text-emerald-400 font-mono">acct_1234567890</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-gray-300">Direct payouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-gray-300">No platform fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-gray-300">Your customer data</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Manage Stripe
              </button>
            </div>
          </div>
        </>
      )}

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          {/* Active Pricing Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pricingTiers.map((tier) => (
              <div key={tier.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 relative">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setSelectedTier(tier)}
                    className="text-gray-400 hover:text-white"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">${tier.price}</span>
                  {tier.price > 0 && (
                    <span className="text-gray-500">/{tier.interval}</span>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Members</span>
                    <span className="text-white font-medium">{tier.members}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-500">Revenue</span>
                    <span className="text-emerald-400 font-medium">${tier.revenue}/mo</span>
                  </div>
                </div>
                
                <button className="mt-4 w-full px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                  Edit Tier
                </button>
              </div>
            ))}
          </div>

          {/* Comparison with Skool */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">How You Save vs Skool</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">$0</div>
                <div className="text-sm text-gray-400 mt-1">Additional platform fees</div>
                <div className="text-xs text-gray-500 mt-2">(Skool charges on top of Stripe)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">100%</div>
                <div className="text-sm text-gray-400 mt-1">Revenue goes to you</div>
                <div className="text-xs text-gray-500 mt-2">(After standard Stripe fees)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">Direct</div>
                <div className="text-sm text-gray-400 mt-1">Customer relationship</div>
                <div className="text-xs text-gray-500 mt-2">(You own the data)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create Pricing Tier</h2>
              <button
                onClick={() => setShowPricingModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tier Name</label>
                <input
                  type="text"
                  placeholder="e.g., Premium"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="99"
                      className="w-full pl-8 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Billing Period</label>
                  <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none">
                    <option>Monthly</option>
                    <option>Yearly</option>
                    <option>One-time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Features</label>
                <textarea
                  rows={4}
                  placeholder="Enter features, one per line"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                <p className="text-sm text-emerald-400">
                  💡 Tip: Price your annual plan at 10 months to incentivize yearly subscriptions
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPricingModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Create Tier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stripe Connect Modal */}
      {showStripeConnect && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Stripe Connection</h2>
              <button
                onClick={() => setShowStripeConnect(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-medium text-emerald-400">Connected</div>
                    <div className="text-sm text-gray-400">Account: acct_1234567890</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-sm text-gray-300">Payments</span>
                  <span className="text-sm text-emerald-400">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-sm text-gray-300">Payouts</span>
                  <span className="text-sm text-emerald-400">Daily</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-sm text-gray-300">Currency</span>
                  <span className="text-sm text-white">USD</span>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Open Stripe Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}