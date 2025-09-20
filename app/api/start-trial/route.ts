import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get checkout link from environment
  const checkoutLink = process.env.WHOP_CHECKOUT_LINK;
  const productId = process.env.WHOP_PRODUCT_ID || 'prod_tm0tLYKsvpwxi';

  if (checkoutLink && checkoutLink !== 'link_XXXXXXXXXXXXXX') {
    // Use the configured checkout link with 14-day trial
    const whopUrl = `https://whop.com/checkout/${checkoutLink}/?d2c=true`;
    return NextResponse.redirect(whopUrl);
  }

  // Fallback: Try direct product checkout (may not have trial configured)
  // This will at least get users to the product page
  const fallbackUrl = `https://whop.com/checkout/${productId}/`;

  // Log that checkout link is not configured (for debugging)
  console.warn('WHOP_CHECKOUT_LINK not configured. Using product page fallback.');

  return NextResponse.redirect(fallbackUrl);
}