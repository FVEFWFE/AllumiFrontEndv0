import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  getFingerprint,
  enhancedAttributionResolution,
  AttributionSignals,
  matchIdentity,
  IdentitySignals,
  generateIdentityHash
} from '@/lib/fingerprint-server';

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

    // Generate server-side fingerprint
    const serverFingerprint = await getFingerprint(request);

    // Build attribution signals
    const attributionSignals: AttributionSignals = {
      directLinkId: allumi_id,
      deviceFingerprint: device_fingerprint || serverFingerprint,
      email: skool_email,
      ip: request.headers.get('x-forwarded-for')?.split(',')[0] ||
          request.headers.get('x-real-ip') ||
          'unknown',
      referrer: request.headers.get('referer'),
      timestamp: new Date(joined_at),
      cookieId: request.cookies?.get('_allumi_id')?.value,
      sessionId: request.cookies?.get('_allumi_session')?.value
    };

    // Get recent clicks for attribution
    const { data: recentClicks } = await supabase
      .from('clicks')
      .select('*, links(*)')
      .order('clicked_at', { ascending: false })
      .limit(50);

    // Use enhanced attribution resolution
    const attribution = await enhancedAttributionResolution(
      attributionSignals,
      recentClicks || []
    );

    let attributionData = {};
    let confidenceScore = attribution.confidence;
    let attributedLinkId = attribution.attributedClick?.link_id || null;
    let userId = attribution.attributedClick?.user_id || null;

    // Build attribution data from the matched click
    if (attribution.attributedClick) {
      const click = attribution.attributedClick;

      if (attribution.multiTouchAttribution) {
        // Use multi-touch attribution weights
        attributionData = {};
        for (const [campaign, weight] of Object.entries(attribution.multiTouchAttribution)) {
          const clickForCampaign = recentClicks?.find(c =>
            (c.campaign_name || c.utm_campaign || 'direct') === campaign
          );

          if (clickForCampaign) {
            attributionData[campaign] = {
              source: clickForCampaign.utm_source,
              medium: clickForCampaign.utm_medium,
              campaign: clickForCampaign.utm_campaign,
              clicked_at: clickForCampaign.clicked_at,
              attribution_weight: weight
            };
          }
        }
      } else {
        // Single-touch attribution
        attributionData = {
          [click.campaign_name || 'direct']: {
            source: click.utm_source,
            medium: click.utm_medium,
            campaign: click.utm_campaign,
            clicked_at: click.clicked_at,
            attribution_weight: 1.0
          }
        };
      }
    }

    // Enhanced identity matching for better accuracy
    if (!attributedLinkId && skool_email) {
      // Build identity signals
      const identitySignals: IdentitySignals = {
        email: skool_email,
        deviceFingerprint: device_fingerprint || serverFingerprint,
        ip: attributionSignals.ip,
        userAgent: request.headers.get('user-agent') || undefined,
        sessionId: attributionSignals.sessionId,
        userId: userId || undefined
      };

      // Try to match with existing identities
      const { data: existingIdentities } = await supabase
        .from('identities')
        .select('*')
        .or(`email.eq.${skool_email},device_fingerprint.eq.${identitySignals.deviceFingerprint}`);

      if (existingIdentities && existingIdentities.length > 0) {
        const match = await matchIdentity(identitySignals, existingIdentities);

        if (match.matched && match.confidence > confidenceScore) {
          // Get clicks for matched identity
          const { data: identityClicks } = await supabase
            .from('clicks')
            .select('*, links(*)')
            .eq('identity_id', match.matchedId)
            .order('clicked_at', { ascending: false })
            .limit(10);

          if (identityClicks && identityClicks.length > 0) {
            const identityAttribution = await enhancedAttributionResolution(
              attributionSignals,
              identityClicks
            );

            if (identityAttribution.confidence > confidenceScore) {
              attribution.attributedClick = identityAttribution.attributedClick;
              attribution.confidence = identityAttribution.confidence;
              attribution.method = 'identity_match';
              confidenceScore = identityAttribution.confidence;
              attributedLinkId = identityAttribution.attributedClick?.link_id || null;
              userId = identityAttribution.attributedClick?.user_id || null;
            }
          }
        }
      }

      // Store identity for future matching
      const identityHash = await generateIdentityHash(identitySignals);
      await supabase
        .from('identities')
        .upsert({
          id: identityHash,
          email: skool_email,
          device_fingerprint: identitySignals.deviceFingerprint,
          ip_address: identitySignals.ip,
          user_agent: identitySignals.userAgent,
          last_seen: new Date().toISOString(),
          metadata: {
            skool_name,
            skool_username,
            membership_type
          }
        });
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
          attribution_method: attribution.method,
          attribution_signals: {
            hasDirectLink: !!allumi_id,
            hasDeviceFingerprint: !!device_fingerprint,
            hasServerFingerprint: !!serverFingerprint,
            hasEmail: !!skool_email,
            hasSession: !!attributionSignals.sessionId,
            hasCookie: !!attributionSignals.cookieId
          }
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