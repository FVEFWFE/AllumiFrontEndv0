import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const WHOP_API_KEY = process.env.WHOP_API_KEY!;
const WHOP_COMPANY_ID = process.env.WHOP_COMPANY_ID!;

export async function POST(req: Request) {
  try {
    const { 
      productId, 
      planId,
      email,
      metadata = {},
      returnUrl = '/dashboard'
    } = await req.json();

    // Get UTM parameters from cookies (set by attribution tracking)
    const cookieStore = cookies();
    const utmData = {
      utm_source: cookieStore.get('utm_source')?.value || null,
      utm_medium: cookieStore.get('utm_medium')?.value || null,
      utm_campaign: cookieStore.get('utm_campaign')?.value || null,
      utm_term: cookieStore.get('utm_term')?.value || null,
      utm_content: cookieStore.get('utm_content')?.value || null,
      referrer: cookieStore.get('initial_referrer')?.value || null,
      landing_page: cookieStore.get('landing_page')?.value || null,
    };

    // Create Whop checkout session
    const checkoutResponse = await fetch('https://api.whop.com/v5/checkout_sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHOP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_id: WHOP_COMPANY_ID,
        product_id: productId,
        plan_id: planId,
        customer_email: email,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}${returnUrl}?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?cancelled=true`,
        metadata: {
          ...metadata,
          ...utmData,
          session_id: cookieStore.get('session_id')?.value || null,
        },
        // Enable attribution tracking
        track_conversions: true,
        // Lifetime deal specific settings
        ...(planId?.includes('lifetime') && {
          payment_method_types: ['card', 'paypal'],
          allow_promotion_codes: true,
        }),
      }),
    });

    if (!checkoutResponse.ok) {
      const error = await checkoutResponse.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const checkoutData = await checkoutResponse.json();

    // Return checkout URL
    return NextResponse.json({
      checkoutUrl: checkoutData.checkout_url,
      sessionId: checkoutData.id,
    });
  } catch (error: any) {
    console.error('Whop checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Get available Whop products and plans
export async function GET() {
  try {
    // Fetch products from Whop
    const productsResponse = await fetch(
      `https://api.whop.com/v5/companies/${WHOP_COMPANY_ID}/products`,
      {
        headers: {
          'Authorization': `Bearer ${WHOP_API_KEY}`,
        },
      }
    );

    if (!productsResponse.ok) {
      throw new Error('Failed to fetch products');
    }

    const products = await productsResponse.json();

    // Format products for frontend
    const formattedProducts = products.data.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      plans: product.plans.map((plan: any) => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        interval: plan.billing_period,
        isLifetime: plan.billing_period === 'one_time',
        features: plan.features || [],
      })),
    }));

    // Define default products if none exist in Whop
    const defaultProducts = [
      {
        id: 'lifetime_deal',
        name: 'Allumi Lifetime Deal',
        description: 'One-time payment, lifetime access to everything',
        plans: [
          {
            id: 'lifetime_497',
            name: 'Lifetime Access',
            price: 49700, // $497 in cents
            currency: 'USD',
            interval: 'one_time',
            isLifetime: true,
            features: [
              'Unlimited communities',
              'Unlimited courses & content',
              'Unlimited members',
              'Advanced attribution tracking',
              'Revenue analytics dashboard',
              'Custom domain support',
              'Priority support',
              'All future updates',
              'No monthly fees ever',
            ],
          },
        ],
      },
      {
        id: 'monthly_plan',
        name: 'Allumi Monthly',
        description: 'Full platform access with monthly billing',
        plans: [
          {
            id: 'monthly_99',
            name: 'Monthly Subscription',
            price: 9900, // $99 in cents
            currency: 'USD',
            interval: 'month',
            isLifetime: false,
            features: [
              'Unlimited communities',
              'Unlimited courses & content',
              'Unlimited members',
              'Attribution tracking',
              'Revenue analytics',
              'Custom domain',
              'Email support',
              'Cancel anytime',
            ],
          },
        ],
      },
      {
        id: 'annual_plan',
        name: 'Allumi Annual',
        description: 'Save 2 months with annual billing',
        plans: [
          {
            id: 'annual_990',
            name: 'Annual Subscription',
            price: 99000, // $990 in cents (10 months)
            currency: 'USD',
            interval: 'year',
            isLifetime: false,
            features: [
              'Everything in Monthly',
              'Save $198/year (2 months free)',
              'Priority support',
              'Early access to new features',
              'Annual strategy call',
            ],
          },
        ],
      },
    ];

    return NextResponse.json({
      products: formattedProducts.length > 0 ? formattedProducts : defaultProducts,
      whopConfigured: formattedProducts.length > 0,
    });
  } catch (error: any) {
    console.error('Error fetching Whop products:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}