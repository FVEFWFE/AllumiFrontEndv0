export interface PricingTier {
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  trial: string;
  spots?: number;
  spotsRemaining?: number;
  features: string[];
  badge?: string;
  popular?: boolean;
}

export const PRICING_TIERS = {
  beta: {
    name: 'Beta Launch',
    price: '$59',
    originalPrice: '$79',
    period: '/month',
    trial: '14-day free trial',
    spots: 15,
    spotsRemaining: 15, // TODO: Update dynamically from database
    badge: 'LIMITED TIME',
    popular: true,
    features: [
      'Full attribution tracking for Skool',
      'Unlimited tracking links',
      'Zapier webhook integration',
      'Chrome extension (bulk export)',
      'Time-decay attribution models',
      'Priority support & onboarding',
      '🔥 Founder pricing locked forever'
    ]
  } as PricingTier,

  regular: {
    name: 'Professional',
    price: '$79',
    period: '/month',
    trial: '14-day free trial',
    features: [
      'Full attribution tracking for Skool',
      'Unlimited tracking links',
      'Zapier webhook integration',
      'Chrome extension (bulk export)',
      'Time-decay attribution models',
      'Email support'
    ]
  } as PricingTier,

  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    trial: 'Custom trial period',
    features: [
      'Everything in Professional',
      'White-label options',
      'Custom integrations',
      'Dedicated account manager',
      'Priority phone support',
      'Custom attribution models',
      'API access'
    ]
  } as PricingTier
};

// Get current pricing based on beta availability
export function getCurrentPricing(): PricingTier {
  // TODO: Check actual remaining spots from database
  // For now, return beta pricing if spots available
  const betaSpotsRemaining = PRICING_TIERS.beta.spotsRemaining || 0;

  if (betaSpotsRemaining > 0) {
    return PRICING_TIERS.beta;
  }

  return PRICING_TIERS.regular;
}

// Get all pricing tiers for comparison
export function getAllPricingTiers(): PricingTier[] {
  const betaSpotsRemaining = PRICING_TIERS.beta.spotsRemaining || 0;

  if (betaSpotsRemaining > 0) {
    // Show beta and enterprise during beta phase
    return [PRICING_TIERS.beta, PRICING_TIERS.enterprise];
  }

  // Show regular and enterprise after beta
  return [PRICING_TIERS.regular, PRICING_TIERS.enterprise];
}

// Check if user qualifies for beta pricing
export async function checkBetaEligibility(email?: string): Promise<boolean> {
  // TODO: Implement actual checks:
  // 1. Check if beta spots remain
  // 2. Check if user is on beta waitlist
  // 3. Check if user has special beta code

  const betaSpotsRemaining = PRICING_TIERS.beta.spotsRemaining || 0;
  return betaSpotsRemaining > 0;
}

// Track beta signup
export async function recordBetaSignup(email: string): Promise<void> {
  // TODO: Implement:
  // 1. Decrement beta spots in database
  // 2. Record user as beta customer
  // 3. Lock in beta pricing for user

  console.log(`Beta signup recorded for ${email}`);
}