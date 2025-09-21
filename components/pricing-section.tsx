'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, ClockIcon, SparklesIcon, RocketIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getAllPricingTiers, type PricingTier } from '@/lib/pricing-config';
import { trackEvent } from './posthog-provider';
import { useRouter } from 'next/navigation';

export function PricingSection() {
  const router = useRouter();
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);

  useEffect(() => {
    // Get all pricing tiers
    const tiers = getAllPricingTiers();
    setPricingTiers(tiers);
  }, []);

  const handleStartTrial = (tier: PricingTier) => {
    trackEvent('pricing_cta_clicked', {
      pricing_tier: tier.name,
      price: tier.price,
      spots_remaining: tier.spotsRemaining
    });

    // Redirect to trial signup
    router.push('/api/start-trial');
  };

  if (pricingTiers.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Choose Your Growth Path
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Start with a 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => {
            const isBeta = tier.name === 'Beta Founder';
            const isDFY = tier.name === 'Done-For-You Growth';

            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl border-2 ${
                  tier.popular
                    ? 'border-orange-500 shadow-xl shadow-orange-500/20'
                    : isDFY
                    ? 'border-purple-500 shadow-xl shadow-purple-500/20'
                    : 'border-gray-200 dark:border-gray-700'
                } bg-white dark:bg-gray-900 p-8`}
              >
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className={`${
                      isDFY
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'bg-gradient-to-r from-orange-500 to-red-500'
                    } text-white px-4 py-1`}>
                      {isDFY ? (
                        <>
                          <RocketIcon className="h-3 w-3 mr-1" />
                          {tier.badge}
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="h-3 w-3 mr-1" />
                          {tier.badge}
                        </>
                      )}
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    {tier.originalPrice && (
                      <span className="text-2xl text-gray-400 line-through">{tier.originalPrice}</span>
                    )}
                    <span className="text-5xl font-bold">{tier.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">{tier.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-semibold">
                    {tier.trial}
                  </p>
                </div>

                <Button
                  onClick={() => handleStartTrial(tier)}
                  className={`w-full mb-6 py-6 text-lg font-semibold ${
                    tier.popular
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                      : isDFY
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                      : ''
                  }`}
                  size="lg"
                >
                  {isDFY ? 'Apply Now' : 'Start Your Free Trial'}
                  {tier.spotsRemaining && ` (${tier.spotsRemaining} spots left)`}
                </Button>

                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className={feature.startsWith('🔥') ? 'font-semibold' : ''}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {isBeta && (
                  <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <p className="text-sm text-orange-800 dark:text-orange-200 text-center">
                      <strong>Beta Special:</strong> Lock in this price forever as one of our founding members.
                      Price increases to $79/mo after beta.
                    </p>
                  </div>
                )}

                {isDFY && (
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <p className="text-sm text-purple-800 dark:text-purple-200 text-center">
                      <strong>Limited Availability:</strong> Personal attention from Allumi founder.
                      Only 5 spots total - apply today!
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">✅ Cancel anytime</p>
          <p className="mb-2">✅ No setup fees</p>
          <p>✅ Start tracking in 2 minutes</p>
        </div>

        {/* Competitor comparison */}
        <div className="mt-12 max-w-2xl mx-auto p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <h4 className="font-semibold mb-4 text-center">Why Allumi vs Competitors?</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Hyros (generic attribution)</span>
              <span className="font-semibold">$399/mo</span>
            </div>
            <div className="flex justify-between">
              <span>TripleWhale (e-commerce)</span>
              <span className="font-semibold">$299/mo</span>
            </div>
            <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
              <span>Allumi (built for Skool)</span>
              <span>From $49/mo</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
            Save up to 87% compared to generic attribution tools
          </p>
        </div>
      </div>
    </section>
  );
}
