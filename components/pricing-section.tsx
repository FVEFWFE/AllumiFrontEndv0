'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, ClockIcon, SparklesIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getCurrentPricing, getAllPricingTiers, type PricingTier } from '@/lib/pricing-config';
import { trackEvent } from './posthog-provider';
import { useRouter } from 'next/navigation';

export function PricingSection() {
  const router = useRouter();
  const [pricing, setPricing] = useState<PricingTier | null>(null);
  const [spotsRemaining, setSpotsRemaining] = useState<number>(15);

  useEffect(() => {
    // Get current pricing tier
    const currentPricing = getCurrentPricing();
    setPricing(currentPricing);

    // Update spots remaining if beta
    if (currentPricing.spots) {
      setSpotsRemaining(currentPricing.spotsRemaining || 0);
    }
  }, []);

  const handleStartTrial = () => {
    trackEvent('pricing_cta_clicked', {
      pricing_tier: pricing?.name,
      price: pricing?.price,
      spots_remaining: spotsRemaining
    });

    // Redirect to trial signup
    router.push('/api/start-trial');
  };

  if (!pricing) {
    return null;
  }

  const isBeta = pricing.name === 'Beta Launch';

  return (
    <section className="py-20 px-4" id="pricing">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {isBeta ? 'Limited Beta Launch Pricing' : 'Simple, Transparent Pricing'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Start with a 14-day free trial. No credit card required.
          </p>
          {isBeta && (
            <div className="mt-4 inline-flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <ClockIcon className="h-5 w-5" />
              <span className="font-semibold">Only {spotsRemaining} beta spots remaining!</span>
            </div>
          )}
        </div>

        <div className="max-w-md mx-auto">
          <div className={`relative rounded-2xl border-2 ${isBeta ? 'border-orange-500 shadow-xl shadow-orange-500/20' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-900 p-8`}>
            {isBeta && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1">
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  LIMITED TIME - SAVE $20/MO FOREVER
                </Badge>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{pricing.name}</h3>
              <div className="flex items-baseline justify-center gap-2">
                {pricing.originalPrice && (
                  <span className="text-2xl text-gray-400 line-through">{pricing.originalPrice}</span>
                )}
                <span className="text-5xl font-bold">{pricing.price}</span>
                <span className="text-gray-600 dark:text-gray-400">{pricing.period}</span>
              </div>
              <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-semibold">
                {pricing.trial}
              </p>
            </div>

            <Button
              onClick={handleStartTrial}
              className={`w-full mb-6 py-6 text-lg font-semibold ${
                isBeta
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                  : ''
              }`}
              size="lg"
            >
              Start Your Free Trial
              {isBeta && ` (${spotsRemaining} spots left)`}
            </Button>

            <ul className="space-y-3">
              {pricing.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
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
          </div>

          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">✅ Cancel anytime</p>
            <p className="mb-2">✅ No setup fees</p>
            <p>✅ Start tracking in 2 minutes</p>
          </div>

          {/* Competitor comparison */}
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
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
                <span>{pricing.price}/mo</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              Save {isBeta ? '85%' : '80%'} compared to generic attribution tools
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}