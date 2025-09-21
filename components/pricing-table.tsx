'use client';

import { Check, X, ArrowRight } from 'lucide-react';
import { trackEvent } from './posthog-provider';
import { PricingBento } from './PricingBento';
import { type SVGProps } from 'react';

interface PricingTableProps {
  onGetStarted?: () => void;
}

export default function PricingTable({ onGetStarted }: PricingTableProps) {
  const handlePlanClick = (plan: string) => {
    trackEvent('pricing_plan_clicked', { plan });

    if (plan === 'professional' && onGetStarted) {
      onGetStarted();
    } else if (plan === 'dfy') {
      // Open Featurebase chat instead of Calendly
      if (typeof window !== 'undefined' && (window as any).Featurebase) {
        (window as any).Featurebase('show');
      }
    }
  };

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Track every dollar back to its source
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Hyros Comparison */}
          <PricingBento
            className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50"
            enableGlow={false}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect={false}
            particleCount={0}
          >
            <header className="flex flex-col gap-4 px-8 pb-0 pt-10">
              <p className="text-center text-xs text-gray-500 uppercase tracking-wider">Competitor</p>
              <span className="text-center text-3xl font-medium lg:text-4xl">$379+</span>
              <div className="flex flex-col">
                <h5 className="text-center text-lg font-medium lg:text-xl">Hyros</h5>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 lg:text-base">
                  per month
                </p>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-6 p-6 !pb-12 lg:p-8">
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 lg:text-base">
                  <X className="mt-0.5 w-4 h-4 text-red-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Steep learning curve</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 lg:text-base">
                  <X className="mt-0.5 w-4 h-4 text-red-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Complex setup process</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 lg:text-base">
                  <X className="mt-0.5 w-4 h-4 text-red-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Requires technical expertise</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 lg:text-base">
                  <X className="mt-0.5 w-4 h-4 text-red-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>30+ day implementation</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 lg:text-base">
                  <X className="mt-0.5 w-4 h-4 text-red-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>No Skool-specific features</span>
                </li>
              </ul>
            </div>
            <footer className="relative flex w-full items-center self-stretch p-8 pt-0">
              <button
                className="z-10 w-full px-6 py-3 rounded-lg font-medium border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                disabled
              >
                Not Available
              </button>
            </footer>
          </PricingBento>

          {/* Professional Plan - Most Popular */}
          <PricingBento
            className="flex flex-1 flex-col overflow-hidden rounded-2xl border-2 border-purple-500 bg-white dark:bg-gray-900/50 shadow-lg"
            enableGlow={true}
            glowColor="139, 92, 246"
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            particleCount={12}
          >
            <header className="flex flex-col gap-4 px-8 pb-0 pt-10 relative">
              <span className="absolute left-1/2 top-4 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-medium lg:text-sm">
                MOST POPULAR
              </span>
              <div className="mt-6">
                <span className="text-center block text-4xl font-bold lg:text-5xl">$79</span>
                <span className="text-center block text-sm text-purple-600 font-semibold mt-2">
                  Beta: $59/mo forever
                </span>
              </div>
              <div className="flex flex-col">
                <h5 className="text-center text-lg font-medium lg:text-xl">Professional</h5>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 lg:text-base">
                  Everything you need to scale
                </p>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-6 p-6 !pb-12 lg:p-8">
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-purple-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Unlimited members tracked</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-purple-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Full attribution dashboard</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-purple-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>First & last-click attribution</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-purple-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Multi-touch attribution</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-purple-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Source → Revenue tracking</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-purple-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>LTV by channel</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-purple-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Free-to-paid conversion tracking</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-purple-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Churn detection (payment-based)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-purple-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Custom alerts (CAC exceeds limits)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-purple-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Cohort analysis</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-purple-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Predictive scoring</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-purple-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Zapier integration</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-purple-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>CSV exports</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-purple-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Priority chat support</span>
                </li>
              </ul>
            </div>
            <footer className="relative flex w-full items-center self-stretch p-8 pt-0">
              <Shadow className="pointer-events-none absolute left-0 top-0 h-full w-full origin-bottom scale-[2.0] text-purple-500" />
              <button
                onClick={() => handlePlanClick('professional')}
                className="z-10 w-full px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Free 14-Day Trial
                <ArrowRight className="w-4 h-4" />
              </button>
            </footer>
          </PricingBento>

          {/* DFY Ad Management */}
          <PricingBento
            className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50"
            enableGlow={true}
            glowColor="107, 114, 128"
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            particleCount={6}
          >
            <header className="flex flex-col gap-4 px-8 pb-0 pt-10 relative">
              <span className="absolute left-1/2 top-4 -translate-x-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-4 py-1 rounded-full text-xs font-medium lg:text-sm">
                DONE-FOR-YOU
              </span>
              <div className="mt-6">
                <span className="text-center block text-3xl font-bold lg:text-4xl">$1,997</span>
              </div>
              <div className="flex flex-col">
                <h5 className="text-center text-lg font-medium lg:text-xl">DFY Growth</h5>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 lg:text-base">
                  per month + ad spend
                </p>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-6 p-6 !pb-12 lg:p-8">
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base font-semibold">
                  <Check className="mt-0.5 w-4 h-4 text-green-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Everything in Professional</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-green-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Complete ad management</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-green-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Facebook & Google Ads</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-green-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Creative development</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-green-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Weekly optimization calls</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-green-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Custom funnel development</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-green-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>Dedicated growth manager</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                  <Check className="mt-0.5 w-4 h-4 text-green-500 shrink-0 lg:w-5 lg:h-5" />
                  <span>ROI guarantee</span>
                </li>
              </ul>
            </div>
            <footer className="relative flex w-full items-center self-stretch p-8 pt-0">
              <button
                onClick={() => handlePlanClick('dfy')}
                className="z-10 w-full px-6 py-3 rounded-lg font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Apply Now
              </button>
            </footer>
            <p className="text-center text-xs text-gray-500 pb-6">
              Limited spots • Application required
            </p>
          </PricingBento>
        </div>
      </div>
    </section>
  );
}

function Shadow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 312 175" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g filter="url(#filter0_f_6956_27669)">
        <path
          d="M-41 398C-41 371.998 -35.9174 346.251 -26.0424 322.229C-16.1673 298.206 -1.69321 276.379 16.5535 257.993C34.8002 239.607 56.4622 225.022 80.3027 215.072C104.143 205.121 129.695 200 155.5 200C181.305 200 206.857 205.121 230.697 215.072C254.538 225.022 276.2 239.607 294.446 257.993C312.693 276.379 327.167 298.206 337.042 322.229C346.917 346.251 352 371.998 352 398L-41 398Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="598"
          id="filter0_f_6956_27669"
          width="793"
          x="-241"
          y="0"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur_6956_27669" stdDeviation="100" />
        </filter>
      </defs>
    </svg>
  );
}