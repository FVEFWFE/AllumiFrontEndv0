'use client';

import { Check, X, ArrowRight, Zap, Crown } from 'lucide-react';
import { trackEvent } from './posthog-provider';

interface PricingTableProps {
  onGetStarted?: () => void;
}

export default function PricingTable({ onGetStarted }: PricingTableProps) {
  const handlePlanClick = (plan: string) => {
    trackEvent('pricing_plan_clicked', { plan });

    if (plan === 'professional' && onGetStarted) {
      onGetStarted();
    } else if (plan === 'dfy') {
      // Open application form or calendly
      window.open('https://calendly.com/allumi/strategy', '_blank');
    } else if (plan === 'hyros') {
      window.open('https://hyros.com', '_blank');
    }
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-300">
            Track every dollar back to its source
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Hyros Comparison */}
          <div className="relative rounded-2xl border border-gray-700 bg-gray-900/50 p-8 opacity-75">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gray-700 text-gray-300 px-4 py-1 rounded-full text-sm">
                Competitor
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-400 mb-2">Hyros</h3>
              <div className="text-4xl font-bold text-gray-300">
                $379+<span className="text-lg font-normal">/month</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Complex enterprise solution</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Steep learning curve</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Complex setup process</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Requires technical expertise</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">30+ day implementation</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">No Skool-specific features</span>
              </li>
            </ul>

            <button
              onClick={() => handlePlanClick('hyros')}
              className="w-full py-3 rounded-lg bg-gray-800 text-gray-400 font-semibold hover:bg-gray-700 transition-colors"
              disabled
            >
              Learn More
            </button>
          </div>

          {/* Professional Plan - Most Popular */}
          <div className="relative rounded-2xl border-2 border-purple-500 bg-gradient-to-b from-purple-900/20 to-black p-8 transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                MOST POPULAR
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <div className="text-5xl font-bold text-white">
                $79<span className="text-xl font-normal">/month</span>
              </div>
              <p className="text-sm text-purple-300 mt-2 font-semibold">
                Beta: $59/mo forever (limited spots)
              </p>
              <p className="text-sm text-gray-400 mt-1">Everything you need to scale</p>
            </div>

            <ul className="space-y-3 mb-8">
              {/* Combined features from both screenshots */}
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Unlimited members tracked</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Full attribution dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">First & last-click attribution</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Multi-touch attribution</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Source → Revenue tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">LTV by channel</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Free-to-paid conversion tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Churn detection (payment-based)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">API access (pull data anywhere)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Custom alerts (CAC exceeds $100)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Cohort analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Chrome extension tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Zapier integration</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">CSV exports</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Priority chat support</span>
              </li>
            </ul>

            <button
              onClick={() => handlePlanClick('professional')}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Free 14-Day Trial
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              No credit card required • Instant setup
            </p>
          </div>

          {/* DFY Ad Management */}
          <div className="relative rounded-2xl border border-yellow-500/50 bg-gradient-to-b from-yellow-900/10 to-black p-8">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                <Crown className="w-4 h-4" />
                DONE-FOR-YOU
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">DFY Growth</h3>
              <div className="text-4xl font-bold text-white">
                $1,997<span className="text-lg font-normal">/month</span>
              </div>
              <p className="text-sm text-yellow-300 mt-2">+ Ad spend</p>
              <p className="text-sm text-gray-400 mt-1">We manage everything</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm font-semibold">Everything in Professional</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Complete ad management</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Facebook & Google Ads</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Creative development</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Weekly optimization calls</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Custom funnel development</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">Dedicated growth manager</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">ROI guarantee</span>
              </li>
            </ul>

            <button
              onClick={() => handlePlanClick('dfy')}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold hover:from-yellow-600 hover:to-orange-600 transition-all"
            >
              Apply Now
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Limited spots • Application required
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-400 mb-4">Trusted by 100+ Skool communities</p>
          <div className="flex items-center justify-center gap-8 opacity-50">
            <span className="text-gray-500">🔒 Bank-level security</span>
            <span className="text-gray-500">⚡ 99.9% uptime</span>
            <span className="text-gray-500">🚀 5-minute setup</span>
          </div>
        </div>
      </div>
    </div>
  );
}