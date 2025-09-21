'use client';

import { Check, X, ArrowRight } from 'lucide-react';
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
          <div className="relative rounded-2xl border border-border bg-card/50 p-6 lg:p-8">
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground mb-4">Competitor</p>
              <h3 className="text-2xl font-semibold mb-2">Hyros</h3>
              <div className="text-3xl lg:text-4xl font-bold">
                $379+<span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Complex enterprise solution</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Steep learning curve</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Complex setup process</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Requires technical expertise</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">30+ day implementation</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">No Skool-specific features</span>
              </li>
            </ul>

            <button
              className="w-full py-3 rounded-lg bg-muted text-muted-foreground font-medium cursor-not-allowed opacity-50"
              disabled
            >
              Not Available
            </button>
          </div>

          {/* Professional Plan - Most Popular */}
          <div className="relative rounded-2xl border-2 border-primary bg-card p-6 lg:p-8 shadow-xl">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                MOST POPULAR
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-4">Professional</h3>
              <div className="text-4xl lg:text-5xl font-bold">
                $79<span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-primary mt-3 font-semibold">
                Beta: $59/mo forever
              </p>
              <p className="text-sm text-muted-foreground mt-1">Everything you need to scale</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Unlimited members tracked</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Full attribution dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">First & last-click attribution</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Multi-touch attribution</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Source → Revenue tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">LTV by channel</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Free-to-paid conversion tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Churn detection (payment-based)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Custom alerts (CAC exceeds limits)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Cohort analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Predictive scoring</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Zapier integration</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">CSV exports</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Priority chat support</span>
              </li>
            </ul>

            <button
              onClick={() => handlePlanClick('professional')}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              Start Free 14-Day Trial
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-xs text-muted-foreground mt-3">
              No credit card required • Instant setup
            </p>
          </div>

          {/* DFY Ad Management */}
          <div className="relative rounded-2xl border border-border bg-card p-6 lg:p-8">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                DONE-FOR-YOU
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-4">DFY Growth</h3>
              <div className="text-3xl lg:text-4xl font-bold">
                $1,997<span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">+ Ad spend</p>
              <p className="text-sm text-muted-foreground mt-1">We manage everything</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">Everything in Professional</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Complete ad management</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Facebook & Google Ads</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Creative development</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Weekly optimization calls</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Custom funnel development</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Dedicated growth manager</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">ROI guarantee</span>
              </li>
            </ul>

            <button
              onClick={() => handlePlanClick('dfy')}
              className="w-full py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
            >
              Apply Now
            </button>

            <p className="text-center text-xs text-muted-foreground mt-3">
              Limited spots • Application required
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">Trusted by 100+ Skool communities</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="text-base">🔒</span>
              Bank-level security
            </span>
            <span className="flex items-center gap-2">
              <span className="text-base">⚡</span>
              99.9% uptime
            </span>
            <span className="flex items-center gap-2">
              <span className="text-base">🚀</span>
              5-minute setup
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}