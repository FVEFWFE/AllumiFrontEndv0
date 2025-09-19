'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  CreditCard,
  Check,
  X,
  Zap,
  TrendingUp,
  Calendar,
  AlertCircle,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    period: 'month',
    description: 'Perfect for content creators getting started',
    features: [
      { name: 'Up to 5,000 clicks/month', included: true },
      { name: 'Unlimited tracking links', included: true },
      { name: 'Basic attribution tracking', included: true },
      { name: 'Email support', included: true },
      { name: 'FingerprintJS integration', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'API access', included: false }
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 79,
    period: 'month',
    description: 'For creators scaling their communities',
    popular: true,
    features: [
      { name: 'Up to 50,000 clicks/month', included: true },
      { name: 'Unlimited tracking links', included: true },
      { name: 'Advanced attribution tracking', included: true },
      { name: 'Priority support', included: true },
      { name: 'FingerprintJS integration', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'API access', included: false }
    ]
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 149,
    period: 'month',
    description: 'For serious community builders',
    features: [
      { name: 'Unlimited clicks', included: true },
      { name: 'Unlimited tracking links', included: true },
      { name: 'Multi-touch attribution', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'FingerprintJS integration', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'API access', included: true }
    ]
  }
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<string>('trial');
  const [loading, setLoading] = useState(false);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [trialDaysLeft, setTrialDaysLeft] = useState(14);
  const [canCustomizeShortlink, setCanCustomizeShortlink] = useState(false);

  useEffect(() => {
    loadBillingInfo();
  }, []);

  const loadBillingInfo = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Load user's current plan from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_plan, subscription_status')
        .eq('id', session.user.id)
        .single();

      if (profile?.subscription_plan) {
        setCurrentPlan(profile.subscription_plan);
      }

      // Calculate trial days left
      const signupDate = new Date(session.user.created_at || Date.now());
      const now = new Date();
      const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysLeft = Math.max(0, 14 - daysSinceSignup);
      setTrialDaysLeft(daysLeft);

      // Check if user can customize shortlinks (paid plan feature)
      setCanCustomizeShortlink(profile?.subscription_plan && profile.subscription_plan !== 'trial');

      // Mock billing history for now
      setBillingHistory([
        {
          date: '2024-12-01',
          amount: 79,
          status: 'paid',
          invoice: '#INV-001'
        },
        {
          date: '2024-11-01',
          amount: 79,
          status: 'paid',
          invoice: '#INV-002'
        }
      ]);
    } catch (error) {
      console.error('Error loading billing info:', error);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setLoading(true);

    // Mock upgrade process - in production, integrate with Whop
    toast.success(`Upgrading to ${planId} plan... (Coming soon!)`);

    setTimeout(() => {
      setLoading(false);
      toast.success('Please contact support to upgrade your plan');
    }, 1000);
  };

  const handleCancelSubscription = () => {
    toast.error('Please contact support to cancel your subscription');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Current Plan</h2>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-accent capitalize">
                {currentPlan === 'trial' ? '14-Day Free Trial' : currentPlan}
              </span>
              {currentPlan === 'trial' && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  trialDaysLeft <= 3
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {trialDaysLeft} days remaining
                </span>
              )}
            </div>
          </div>
          {currentPlan !== 'free' && (
            <button
              onClick={handleCancelSubscription}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition"
            >
              Cancel Subscription
            </button>
          )}
        </div>

        {currentPlan === 'trial' && (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg border ${
              trialDaysLeft <= 3
                ? 'bg-red-500/5 border-red-500/10'
                : 'bg-accent/5 border-accent/10'
            }`}>
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-5 h-5 mt-0.5 ${
                  trialDaysLeft <= 3 ? 'text-red-500' : 'text-accent'
                }`} />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {trialDaysLeft <= 3
                      ? 'Your trial is ending very soon!'
                      : 'You\'re on the 14-day free trial'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    After your trial ends, you'll automatically be upgraded to the Growth plan ($89/mo).
                    Cancel anytime or upgrade now for additional features.
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Features Notice */}
            <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong className="text-purple-500">🎨 Want custom short links?</strong> Upgrade to any paid plan
                to customize your tracking links (e.g., allumi.to/youtube-video-1)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Plans */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-card border rounded-lg p-6 ${
                plan.popular
                  ? 'border-accent shadow-lg shadow-accent/10'
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${
                      feature.included ? 'text-foreground' : 'text-muted-foreground/50'
                    }`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading || currentPlan === plan.id}
                className={`w-full py-2.5 rounded-lg font-medium transition ${
                  currentPlan === plan.id
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : plan.popular
                    ? 'bg-accent text-accent-foreground hover:opacity-90'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {currentPlan === plan.id
                  ? 'Current Plan'
                  : currentPlan === 'free'
                  ? 'Start Free Trial'
                  : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Billing History</h2>

        {billingHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-sm text-muted-foreground">Date</th>
                  <th className="text-left p-2 text-sm text-muted-foreground">Invoice</th>
                  <th className="text-right p-2 text-sm text-muted-foreground">Amount</th>
                  <th className="text-right p-2 text-sm text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((item, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="p-2 text-sm text-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="p-2 text-sm text-foreground">{item.invoice}</td>
                    <td className="text-right p-2 text-sm text-foreground">${item.amount}</td>
                    <td className="text-right p-2">
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No billing history yet</p>
        )}
      </div>

      {/* Payment Method */}
      <div className="mt-8 bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Payment Method</h2>
          <button className="text-sm text-accent hover:underline">
            Add Payment Method
          </button>
        </div>

        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <CreditCard className="w-8 h-8 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">No payment method on file</p>
            <p className="text-xs text-muted-foreground">Add a payment method to upgrade your plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}