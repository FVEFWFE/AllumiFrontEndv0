'use client';

import { useState } from 'react';
import { Check, X, Shield, Clock, Users, Star, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Mock community data - would come from API
const communityData = {
  name: 'Growth Lab',
  logo: 'https://i.pravatar.cc/150?img=20',
  tagline: 'Master growth marketing with proven strategies',
  memberCount: 2847,
  onlineCount: 342,
};

// Pricing tiers
const pricingTiers = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '',
    description: 'Get started with basic access',
    features: [
      { text: 'Community discussions', included: true },
      { text: 'Weekly newsletter', included: true },
      { text: 'Basic resources', included: true },
      { text: 'Live events', included: false },
      { text: 'Premium courses', included: false },
      { text: 'Attribution dashboard', included: false },
      { text: '1-on-1 coaching', included: false },
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$49',
    period: '/month',
    description: 'Full access, billed monthly',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'All premium courses', included: true },
      { text: 'Live weekly events', included: true },
      { text: 'Attribution dashboard', included: true },
      { text: 'Private mastermind', included: true },
      { text: 'Direct chat access', included: true },
      { text: '1-on-1 coaching calls', included: false },
    ],
    cta: 'Subscribe',
    popular: true,
    whopProductId: 'prod_growth_monthly', // Whop product ID
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$470',
    period: '/year',
    description: 'Best value with annual billing',
    originalPrice: '$588',
    savings: 'Save $118',
    features: [
      { text: 'Everything in Monthly', included: true },
      { text: '2 months FREE', included: true },
      { text: 'Quarterly 1-on-1 coaching', included: true },
      { text: 'Early access to new content', included: true },
      { text: 'Annual member badge', included: true },
      { text: 'Bonus resources pack', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Subscribe',
    popular: false,
    bestValue: true,
    whopProductId: 'prod_growth_annual', // Whop product ID
  },
];

// Testimonials
const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Marketing Director',
    avatar: 'https://i.pravatar.cc/150?img=5',
    content: 'The attribution dashboard alone is worth 10x the price. Finally know exactly which content drives revenue.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Founder',
    avatar: 'https://i.pravatar.cc/150?img=8',
    content: 'Switched from Skool and saved $50/month. Plus my community is on MY domain now.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Jessica Kim',
    role: 'Growth Manager',
    avatar: 'https://i.pravatar.cc/150?img=9',
    content: 'The weekly events and mastermind sessions are game-changing. Real strategies that work.',
    rating: 5,
  },
];

export default function PricingPage({ params }: { params: { slug: string } }) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  
  const handleCheckout = (tier: any) => {
    if (tier.whopProductId) {
      // Redirect to Whop checkout with the product ID
      // In production, this would be a proper Whop checkout URL
      window.location.href = `https://whop.com/checkout/${tier.whopProductId}?community=${params.slug}`;
    } else if (tier.id === 'free') {
      // Free tier - just sign up
      window.location.href = `/signup?plan=free&community=${params.slug}`;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-purple-900/20" />
        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            {/* Community Info */}
            <div className="mb-8 flex items-center justify-center gap-4">
              <Image
                src={communityData.logo}
                alt={communityData.name}
                width={64}
                height={64}
                className="rounded-lg"
              />
              <div className="text-left">
                <h1 className="text-2xl font-bold text-white">{communityData.name}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {communityData.memberCount.toLocaleString()} members
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    {communityData.onlineCount} online now
                  </span>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <p className="mb-8 text-xl text-gray-300">{communityData.tagline}</p>

            {/* Value Props */}
            <div className="mb-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                30-day money back
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-500" />
                Cancel anytime
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-500" />
                Instant access
              </div>
            </div>

            {/* Powered by */}
            <div className="mb-8 text-xs text-gray-500">
              Powered by Allumi • Secure checkout via Whop
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-8 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.id}
              className={cn(
                "relative border-gray-800 bg-gray-900/50 backdrop-blur transition-all hover:scale-105",
                tier.popular && "ring-2 ring-emerald-500",
                tier.bestValue && "ring-2 ring-purple-500"
              )}
            >
              {/* Badges */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-emerald-600 text-white">Most Popular</Badge>
                </div>
              )}
              {tier.bestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white">Best Value</Badge>
                </div>
              )}

              <CardContent className="p-6">
                {/* Header */}
                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-xl font-bold text-white">{tier.name}</h3>
                  <p className="mb-4 text-sm text-gray-400">{tier.description}</p>
                  
                  {/* Price */}
                  <div className="mb-2">
                    {tier.originalPrice && (
                      <div className="text-gray-500 line-through">{tier.originalPrice}</div>
                    )}
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-white">{tier.price}</span>
                      {tier.period && <span className="text-gray-400">{tier.period}</span>}
                    </div>
                    {tier.savings && (
                      <Badge variant="default" className="mt-2 bg-emerald-600">
                        {tier.savings}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="mb-6 space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {feature.included ? (
                        <>
                          <Check className="h-5 w-5 flex-shrink-0 text-emerald-500" />
                          <span className="text-sm text-gray-300">{feature.text}</span>
                        </>
                      ) : (
                        <>
                          <X className="h-5 w-5 flex-shrink-0 text-gray-600" />
                          <span className="text-sm text-gray-500 line-through">{feature.text}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  onClick={() => handleCheckout(tier)}
                  className={cn(
                    "w-full",
                    tier.id === 'free' 
                      ? "border border-gray-700 bg-transparent hover:bg-gray-800"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  )}
                >
                  {tier.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Whop Badge */}
                {tier.whopProductId && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield className="h-3 w-3" />
                    Secure checkout via Whop
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Urgency */}
        <div className="mt-8 text-center">
          <p className="text-sm text-orange-400">
            ⚡ Only 7 spots remaining at this price
          </p>
          <p className="mt-2 text-xs text-gray-500">
            342 members joined this week
          </p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="border-t border-gray-800 bg-gray-900/30 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-2xl font-bold text-white">
            What Members Are Saying
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="rounded-lg bg-gray-800/50 p-6">
                <div className="mb-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="mb-4 text-gray-300">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              SSL Encrypted
            </div>
            <div className="flex items-center gap-2">
              <Image src="/whop-logo.svg" alt="Whop" width={60} height={20} className="opacity-50" />
            </div>
            <div className="text-sm">
              Trusted by 500+ community owners
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Link */}
      <div className="pb-16 text-center">
        <p className="text-gray-400">
          Questions?{' '}
          <Link href={`/c/${params.slug}/about`} className="text-emerald-500 hover:underline">
            Visit our FAQ
          </Link>
        </p>
      </div>
    </div>
  );
}