'use client';

import { useState, use } from 'react';
import { 
  DollarSign, CreditCard, Users, TrendingUp, 
  Shield, Settings, ChevronRight, Plus, Edit,
  Trash2, AlertCircle, Check, X, Zap,
  Award, Lock, Unlock, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface CommunityMonetizationProps {
  params: Promise<{ slug: string }>;
}

export default function CommunityMonetization({ params }: CommunityMonetizationProps) {
  const { slug } = use(params);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Community-specific data
  const communityName = slug === 'growth-lab' ? 'The Growth Lab' : 'Community';
  
  const [pricingTiers, setPricingTiers] = useState([
    {
      id: 1,
      name: 'Free Member',
      price: 0,
      interval: 'free',
      features: ['Community access', 'Weekly newsletter'],
      members: 892,
      active: true
    },
    {
      id: 2,
      name: 'Pro Member',
      price: 49,
      interval: 'month',
      features: ['Everything in Free', 'All courses', 'Monthly coaching call', 'Private Discord'],
      members: 234,
      active: true
    },
    {
      id: 3,
      name: 'VIP Member',
      price: 199,
      interval: 'month',
      features: ['Everything in Pro', '1-on-1 coaching', 'Direct access', 'Custom resources'],
      members: 21,
      active: true
    }
  ]);

  const revenueStats = {
    mrr: 12450,
    totalRevenue: 89340,
    avgMemberValue: 47.50,
    churnRate: 2.3,
    ltv: 2068
  };

  const paymentSettings = {
    stripeConnected: true,
    stripeAccountId: 'acct_1234567890',
    payoutSchedule: 'daily',
    currency: 'USD',
    taxEnabled: true
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/c/${slug}`}
                className="text-gray-400 hover:text-white"
              >
                {communityName}
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <h1 className="text-xl font-bold text-white">Monetization</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Add Pricing Tier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="px-6">
          <div className="flex gap-6">
            {['overview', 'pricing', 'payments', 'affiliates'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                  <span className="text-xs text-emerald-400">+15.3%</span>
                </div>
                <div className="text-2xl font-bold text-white">${revenueStats.mrr.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Monthly Recurring</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                  <span className="text-xs text-purple-400">All-time</span>
                </div>
                <div className="text-2xl font-bold text-white">${revenueStats.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Revenue</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-white">${revenueStats.avgMemberValue}</div>
                <div className="text-sm text-gray-500">Avg Member Value</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold text-white">{revenueStats.churnRate}%</div>
                <div className="text-sm text-gray-500">Churn Rate</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-6 h-6 text-indigo-500" />
                </div>
                <div className="text-2xl font-bold text-white">${revenueStats.ltv.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Lifetime Value</div>
              </div>
            </div>

            {/* Pricing Tiers Overview */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Active Pricing Tiers</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pricingTiers.map((tier) => (
                  <div key={tier.id} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium">{tier.name}</h3>
                        <div className="text-2xl font-bold text-white mt-1">
                          {tier.price === 0 ? 'Free' : `$${tier.price}`}
                          {tier.price > 0 && <span className="text-sm text-gray-400">/{tier.interval}</span>}
                        </div>
                      </div>
                      {tier.active ? (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Active</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded-full">Inactive</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 mb-3">{tier.members} members</div>
                    <div className="text-sm text-gray-300">
                      Revenue: ${(tier.price * tier.members).toLocaleString()}/mo
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-emerald-900/20 to-green-900/20 border border-emerald-500/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">You Own Your Stripe</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Your Stripe account is connected. You have full control over your payment data and customer relationships.
                    </p>
                    <Link 
                      href="https://dashboard.stripe.com"
                      className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
                    >
                      Open Stripe Dashboard
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-purple-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Member Affiliates</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Let your members earn 30% commission for referring new members to your community.
                    </p>
                    <button className="text-sm text-purple-400 hover:text-purple-300">
                      Configure Affiliate Program →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Pricing Tiers</h2>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Tier
                </button>
              </div>
              
              <div className="space-y-4">
                {pricingTiers.map((tier) => (
                  <div key={tier.id} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-white font-medium">{tier.name}</h3>
                          {tier.active ? (
                            <Lock className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Unlock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="text-2xl font-bold text-white mt-2">
                          {tier.price === 0 ? 'Free' : `$${tier.price}`}
                          {tier.price > 0 && <span className="text-sm text-gray-400">/{tier.interval}</span>}
                        </div>
                        <div className="mt-3">
                          <div className="text-sm text-gray-400 mb-2">Features:</div>
                          <ul className="space-y-1">
                            {tier.features.map((feature, index) => (
                              <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                                <Check className="w-3 h-3 text-emerald-400" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Payment Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-white font-medium">Stripe Account</div>
                      <div className="text-sm text-gray-400">Connected: {paymentSettings.stripeAccountId}</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                    Manage
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Payout Schedule</div>
                    <div className="text-white font-medium capitalize">{paymentSettings.payoutSchedule}</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Currency</div>
                    <div className="text-white font-medium">{paymentSettings.currency}</div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-sm font-medium text-emerald-400">Direct Stripe Integration</div>
                      <div className="text-sm text-gray-300 mt-1">
                        You own 100% of your payment relationship. Allumi never touches your money.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'affiliates' && (
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Member Affiliate Program</h2>
              
              <div className="p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">30% Commission</h3>
                    <p className="text-sm text-gray-300">
                      Your members earn 30% recurring commission for every new paid member they refer.
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Edit Rate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Active Affiliates</div>
                  <div className="text-2xl font-bold text-white">47</div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Total Referred</div>
                  <div className="text-2xl font-bold text-white">124</div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Commissions Paid</div>
                  <div className="text-2xl font-bold text-white">$3,720</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}