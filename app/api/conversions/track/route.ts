import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getFingerprint } from '@/lib/fingerprint-server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ConversionData {
  skool_email: string;
  skool_name?: string;
  skool_username?: string;
  joined_at?: string;
  membership_type?: 'free' | 'paid';
  price_paid?: number;
  allumi_id?: string; // The tracking ID from URL params
  device_fingerprint?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ConversionData = await request.json();
    const {
      skool_email,
      skool_name,
      skool_username,
      joined_at = new Date().toISOString(),
      membership_type = 'paid',
      price_paid = 0,
      allumi_id,
      device_fingerprint
    } = body;

    if (!skool_email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Step 1: Look for recent clicks from this user
    let attributionData = {};
    let confidenceScore = 0;
    let attributedLinkId = null;
    let userId = null;

    // Try to find attribution by allumi_id (direct tracking)
    if (allumi_id) {
      const { data: clickData } = await supabase
        .from('clicks')
        .select('*, links(*)')
        .eq('short_id', allumi_id)
        .order('clicked_at', { ascending: false })
        .limit(1)
        .single();

      if (clickData) {
        attributedLinkId = clickData.link_id;
        userId = clickData.user_id;
        confidenceScore = 95; // High confidence with direct tracking
        attributionData = {
          [clickData.campaign_name]: {
            source: clickData.utm_source,
            medium: clickData.utm_medium,
            campaign: clickData.utm_campaign,
            clicked_at: clickData.clicked_at,
            attribution_weight: 1.0
          }
        };
      }
    }

    // Try device fingerprint matching if no direct attribution
    if (!attributedLinkId && device_fingerprint) {
      const { data: fingerprintClicks } = await supabase
        .from('clicks')
        .select('*, links(*)')
        .eq('device_fingerprint', device_fingerprint)
        .gte('clicked_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
        .order('clicked_at', { ascending: false });

      if (fingerprintClicks && fingerprintClicks.length > 0) {
        // Use time-decay attribution
        const now = Date.now();
        let totalWeight = 0;
        attributionData = {};

        fingerprintClicks.forEach(click => {
          const clickTime = new Date(click.clicked_at).getTime();
          const daysSince = (now - clickTime) / (1000 * 60 * 60 * 24);
          const weight = Math.exp(-daysSince / 7); // Exponential decay with 7-day half-life

          totalWeight += weight;

          if (!attributionData[click.campaign_name]) {
            attributionData[click.campaign_name] = {
              source: click.utm_source,
              medium: click.utm_medium,
              campaign: click.utm_campaign,
              clicked_at: click.clicked_at,
              attribution_weight: 0
            };
          }
          attributionData[click.campaign_name].attribution_weight += weight;
        });

        // Normalize weights
        Object.keys(attributionData).forEach(campaign => {
          attributionData[campaign].attribution_weight /= totalWeight;
        });

        attributedLinkId = fingerprintClicks[0].link_id;
        userId = fingerprintClicks[0].user_id;
        confidenceScore = Math.min(80, 50 + (fingerprintClicks.length * 10)); // Max 80% for fingerprint matching
      }
    }

    // Try email-based identity resolution
    if (!attributedLinkId) {
      const { data: identityData } = await supabase
        .from('identities')
        .select('*, clicks(*, links(*))')
        .eq('email', skool_email)
        .single();

      if (identityData && identityData.clicks && identityData.clicks.length > 0) {
        const recentClick = identityData.clicks[0];
        attributedLinkId = recentClick.link_id;
        userId = recentClick.user_id;
        confidenceScore = 70; // Medium confidence for email matching
        attributionData = {
          [recentClick.campaign_name]: {
            source: recentClick.utm_source,
            medium: recentClick.utm_medium,
            campaign: recentClick.utm_campaign,
            clicked_at: recentClick.clicked_at,
            attribution_weight: 1.0
          }
        };
      }
    }

    // Calculate revenue attribution
    const revenue_tracked = membership_type === 'paid' ? (price_paid || 59) : 0;
    const attributed_revenue = {};

    if (Object.keys(attributionData).length > 0) {
      Object.entries(attributionData).forEach(([campaign, data]: [string, any]) => {
        attributed_revenue[campaign] = revenue_tracked * data.attribution_weight;
      });
    }

    // Record the conversion
    const { data: conversion, error } = await supabase
      .from('conversions')
      .insert({
        user_id: userId,
        skool_email,
        skool_name,
        skool_username,
        joined_at,
        membership_type,
        revenue_tracked,
        attributed_link_id: attributedLinkId,
        attribution_data: Object.keys(attributionData).length > 0 ? attributionData : null,
        confidence_score: confidenceScore,
        device_fingerprint,
        metadata: {
          price_paid,
          attributed_revenue,
          attribution_method: allumi_id ? 'direct' : (device_fingerprint ? 'fingerprint' : 'email')
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording conversion:', error);
      return NextResponse.json(
        { error: 'Failed to record conversion' },
        { status: 500 }
      );
    }

    // Update link conversion count if attributed
    if (attributedLinkId) {
      await supabase.rpc('increment_link_conversions', {
        link_id: attributedLinkId
      });
    }

    // Send notification if configured
    if (process.env.NOTIFICATION_WEBHOOK_URL && process.env.NOTIFICATION_WEBHOOK_URL !== 'placeholder') {
      fetch(process.env.NOTIFICATION_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'conversion',
          data: conversion,
          attribution: attributionData
        })
      }).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      conversion_id: conversion.id,
      attributed: !!attributedLinkId,
      confidence_score: confidenceScore,
      attribution: attributionData,
      revenue_attributed: attributed_revenue
    });

  } catch (error) {
    console.error('Conversion tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check conversion status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const username = searchParams.get('username');

    if (!email && !username) {
      return NextResponse.json(
        { error: 'Email or username required' },
        { status: 400 }
      );
    }

    const query = supabase
      .from('conversions')
      .select('*');

    if (email) {
      query.eq('skool_email', email);
    } else if (username) {
      query.eq('skool_username', username);
    }

    const { data, error } = await query.single();

    if (error) {
      return NextResponse.json(
        { exists: false },
        { status: 200 }
      );
    }

    return NextResponse.json({
      exists: true,
      conversion: data
    });

  } catch (error) {
    console.error('Conversion check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}