import { NextResponse, NextRequest } from 'next/server';
import { calculateAttribution, generateFingerprint } from '@/lib/click-tracking';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      userEmail,
      conversionType,
      revenue,
      currency = 'USD',
      metadata = {}
    } = body;

    // Get tracking identifiers
    const cookieId = request.cookies.get('allumi_id')?.value;
    const sessionId = request.cookies.get('allumi_session')?.value;
    const fingerprint = generateFingerprint(request);

    // Calculate attribution
    const attribution = await calculateAttribution(
      userEmail,
      fingerprint,
      sessionId,
      cookieId
    );

    // Store conversion with attribution
    const { data: conversion, error: conversionError } = await supabase
      .from('conversions')
      .insert({
        user_id: userId,
        attributed_link_id: attribution?.click?.link_id || null,
        attributed_click_id: attribution?.click?.id || null,
        attribution_method: attribution?.method || 'direct',
        confidence_score: attribution?.confidence || 0,
        conversion_type: conversionType,
        revenue: revenue,
        currency: currency,
        first_touch_source: attribution?.click?.utm_source || 'direct',
        last_touch_source: attribution?.click?.utm_source || 'direct',
        attribution_window_days: attribution?.click ?
          Math.floor((Date.now() - new Date(attribution.click.clicked_at).getTime()) / (1000 * 60 * 60 * 24)) :
          0,
        device_fingerprint: fingerprint,
        session_id: sessionId,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '0.0.0.0',
        metadata: metadata,
        raw_attribution_data: attribution || {}
      })
      .select()
      .single();

    if (conversionError) {
      throw conversionError;
    }

    // Update affiliate referral if applicable
    if (attribution?.click?.utm_source === 'affiliate' && attribution?.click?.utm_content) {
      const affiliateCode = attribution.click.utm_content;

      // Find affiliate by code
      const { data: affiliate } = await supabase
        .from('users')
        .select('id')
        .eq('affiliate_code', affiliateCode)
        .single();

      if (affiliate) {
        // Calculate commission (40% default)
        const commissionAmount = revenue ? revenue * 0.4 : 0;

        await supabase
          .from('affiliate_referrals')
          .insert({
            affiliate_id: affiliate.id,
            referred_user_id: userId,
            referral_code: affiliateCode,
            click_id: attribution.click.id,
            conversion_id: conversion.id,
            commission_rate: 40.00,
            commission_amount: commissionAmount,
            commission_status: 'pending',
            converted_at: new Date().toISOString()
          });
      }
    }

    // Update campaign metrics
    if (attribution?.click?.utm_campaign) {
      const campaign = attribution.click.utm_campaign;
      const today = new Date().toISOString().split('T')[0];

      // Upsert campaign metrics
      const { data: existing } = await supabase
        .from('campaign_metrics')
        .select('*')
        .eq('campaign_name', campaign)
        .eq('period_start', today)
        .single();

      if (existing) {
        await supabase
          .from('campaign_metrics')
          .update({
            conversions: existing.conversions + 1,
            revenue: existing.revenue + (revenue || 0),
            attributed_conversions: existing.attributed_conversions + (attribution ? 1 : 0),
            attribution_confidence_avg:
              (existing.attribution_confidence_avg * existing.conversions + (attribution?.confidence || 0)) /
              (existing.conversions + 1),
            conversion_rate: ((existing.conversions + 1) / existing.total_clicks) * 100,
            avg_order_value: (existing.revenue + (revenue || 0)) / (existing.conversions + 1),
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('campaign_metrics')
          .insert({
            campaign_name: campaign,
            total_clicks: 1,
            unique_clicks: 1,
            conversions: 1,
            revenue: revenue || 0,
            conversion_rate: 100,
            avg_order_value: revenue || 0,
            attributed_conversions: attribution ? 1 : 0,
            attribution_confidence_avg: attribution?.confidence || 0,
            period_start: today,
            period_end: today
          });
      }
    }

    return NextResponse.json({
      success: true,
      conversion: conversion,
      attribution: {
        method: attribution?.method || 'direct',
        confidence: attribution?.confidence || 0,
        source: attribution?.click?.utm_source || 'direct'
      }
    });
  } catch (error) {
    console.error('Conversion tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track conversion' },
      { status: 500 }
    );
  }
}