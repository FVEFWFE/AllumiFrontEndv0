'use client';

import { useState } from 'react';
import { 
  CreditCard, Shield, Check, X, AlertCircle,
  Download, ChevronRight, Sparkles, TrendingUp,
  Calendar, DollarSign, Award, Zap, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Current subscription info
  const currentPlan = {
    name: 'Pro',
    price: 89,
    billingCycle: 'monthly',
    nextBilling: 'January 15, 2025',
    status: 'active'
  };

  const usage = {
    communities: { used: 3, limit: 'Unlimited' },
    members: { used: 1859, limit: 'Unlimited' },
    storage: { used: 12.4, limit: 'Unlimited', unit: 'GB' },
    videoHours: { used: 34, limit: 'Unlimited' }
  };

  const invoices = [
    { id: 'INV-2024-12', date: 'Dec 15, 2024', amount: 89, status: 'paid' },
    { id: 'INV-2024-11', date: 'Nov 15, 2024', amount: 89, status: 'paid' },
    { id: 'INV-2024-10', date: 'Oct 15, 2024', amount: 89, status: 'paid' }
  ];

  const plans = [
    {
      name: 'Growth',
      monthlyPrice: 49,
      yearlyPrice: 490,
      features: [
        'Unlimited members',
        'Basic attribution (last-click)',
        'Community features',
        'Courses & content',
        'Your custom domain',
        'Email support',
        'Standard video hosting'
      ],
      notIncluded: [
        'Full Attribution Dashboard™',
        'AI insights',
        'White-label branding',
        'API access'
      ]
    },
    {
      name: 'Pro',
      monthlyPrice: 89,
      yearlyPrice: 890,
      current: true,
      features: [
        'Everything in Growth',
        'Full Attribution Dashboard™',
        'Multi-touch attribution',
        'AI insights & recommendations',
        'White-label branding',
        'API access',
        'Priority support',
        'Advanced video hosting'
      ],
      notIncluded: []
    },
    {
      name: 'Scale',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      features: [
        'Everything in Pro',
        'Multiple communities',
        'Team accounts',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'Custom onboarding',
        'Priority feature requests'
      ],
      notIncluded: []
    }
  ];

  const savings = {
    vsSkool: billingCycle === 'monthly' ? 10 : 120,
    withYearly: billingCycle === 'yearly' ? 178 : 0
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Billing & Subscription</h1>
              <p className="text-sm text-gray-400 mt-1">Manage your Allumi platform subscription</p>
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
        {/* Current Plan Overview */}
        <div className="bg-gradient-to-r from-emerald-900/20 to-purple-900/20 border border-emerald-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Allumi {currentPlan.name} Plan
                  </h2>
                  <p className="text-sm text-gray-400">
                    ${currentPlan.price}/{currentPlan.billingCycle} • Next billing: {currentPlan.nextBilling}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white">
                    ${savings.vsSkool}
                  </div>
                  <div className="text-sm text-emerald-400">Saved vs Skool this month</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    ${savings.vsSkool * 12}
                  </div>
                  <div className="text-sm text-emerald-400">Annual savings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-gray-400">Attribution accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">40%</div>
                  <div className="text-sm text-purple-400">Affiliate commission</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setShowUpgradeModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upgrade to Scale
              </button>
              <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Change Plan
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Usage Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Current Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Communities</span>
                    <span className="text-sm text-white">
                      {usage.communities.used} / {usage.communities.limit}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Total Members</span>
                    <span className="text-sm text-white">
                      {usage.members.used.toLocaleString()} / {usage.members.limit}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Storage</span>
                    <span className="text-sm text-white">
                      {usage.storage.used} {usage.storage.unit} / {usage.storage.limit}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Video Hours</span>
                    <span className="text-sm text-white">
                      {usage.videoHours.used} hours / {usage.videoHours.limit}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '34%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Billing History</h3>
                <button className="text-sm text-emerald-400 hover:text-emerald-300">
                  View all invoices
                </button>
              </div>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-white font-medium">{invoice.id}</div>
                        <div className="text-sm text-gray-500">{invoice.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white">${invoice.amount}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                        {invoice.status}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-white">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Method & Actions */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
              <div className="p-4 bg-gray-800/50 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-white">•••• •••• •••• 4242</div>
                      <div className="text-sm text-gray-500">Expires 12/25</div>
                    </div>
                  </div>
                  <button className="text-sm text-emerald-400 hover:text-emerald-300">
                    Update
                  </button>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400">Secure billing via Stripe</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-left flex items-center justify-between">
                  <span>Download all invoices</span>
                  <Download className="w-4 h-4" />
                </button>
                <button className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-left flex items-center justify-between">
                  <span>Update billing info</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-left flex items-center justify-between">
                  <span>Switch to yearly (save 2 months)</span>
                  <TrendingUp className="w-4 h-4" />
                </button>
                <button className="w-full px-4 py-3 bg-gray-800 text-red-400 rounded-lg hover:bg-gray-700 transition-colors text-left">
                  Cancel subscription
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Earn 40% Commission</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Refer others to Allumi and earn 40% recurring commission on their subscriptions.
              </p>
              <Link 
                href="/dashboard/affiliate"
                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
              >
                View affiliate program
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* All Plans Comparison */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Compare All Plans</h2>
            <p className="text-gray-400">All plans include attribution tracking and custom domain</p>
            
            <div className="inline-flex items-center gap-3 mt-4 p-1 bg-gray-800 rounded-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly (2 months free)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-gray-900/50 border rounded-xl p-6 ${
                  plan.current
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-gray-800'
                }`}
              >
                {plan.current && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full mb-4">
                    <Check className="w-4 h-4" />
                    Current Plan
                  </div>
                )}
                
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-white">
                    ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-gray-400">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-500">
                      <X className="w-4 h-4 text-gray-600 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {!plan.current && (
                  <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    {plan.monthlyPrice < currentPlan.price ? 'Downgrade' : 'Upgrade'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}