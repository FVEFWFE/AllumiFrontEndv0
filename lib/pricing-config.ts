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
    name: 'Beta Founder',
    price: '$49',
    originalPrice: '',
    period: '/month',
    trial: 'Limited to 10 communities',
    spots: 10,
    spotsRemaining: 7, // TODO: Update dynamically from database
    badge: '[7 spots remaining]',
    popular: true,
    features: [
      '✓ Everything you need to track attribution',
      '✓ Unlimited members tracked',
      '✓ Full attribution dashboard',
      '✓ First-click & last-click attribution',
      '✓ Source → Revenue tracking',
      '✓ LTV by channel',
      '✓ Conversion quality metrics',
      '✓ Free-to-paid conversion tracking',
      '✓ Churn detection',
      '✓ Zapier integration setup',
      '✓ CSV exports',
      '✓ Chat support',
      '✓ Beta exclusive: Weekly group office hours',
      '🔥 Lock this rate forever'
    ]
  } as PricingTier,

  professional: {
    name: 'Professional',
    price: '$79',
    period: '/month',
    trial: 'Everything you need to scale with confidence',
    badge: '[Most popular]',
    features: [
      '✓ Everything in Beta Founder',
      '✓ Priority support (4-hour response)',
      '✓ Custom tracking links',
      '✓ Advanced filters & segments',
      '✓ Monthly attribution insights email',
      '✓ ROI calculator dashboard'
    ]
  } as PricingTier,

  doneForYou: {
    name: 'Done-For-You Growth',
    price: '$1,997',
    period: '/month',
    trial: 'I personally manage your paid ads + attribution',
    spots: 5,
    spotsRemaining: 2,
    badge: '[2 spots available]',
    features: [
      '✓ Everything in Professional',
      '✓ Full ad management by Allumi founder',
      '✓ Daily optimization based on YOUR attribution data',
      '✓ 3-5 campaigns managed',
      '✓ Weekly 30-min strategy call',
      '✓ Creative testing & iteration',
      '✓ Custom scaling roadmap',
      '✓ Requirement: $2,000+ monthly ad spend',
      '✓ Limited to 5 clients total'
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

  return PRICING_TIERS.professional;
}

// Get all pricing tiers for comparison
export function getAllPricingTiers(): PricingTier[] {
  // Always show all three tiers
  return [PRICING_TIERS.beta, PRICING_TIERS.professional, PRICING_TIERS.doneForYou];
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