import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateAttribution, generateFingerprint } from '@/lib/click-tracking';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify Zapier webhook signature (optional but recommended)
function verifyZapierSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return signature === expectedSignature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // Member data from Skool
      email,
      name,
      skool_member_id,
      skool_community_name,
      joined_date,
      subscription_status,
      subscription_plan,
      monthly_revenue,

      // Attribution data (if available from Zapier)
      referrer_url,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,

      // Additional metadata
      custom_fields,
      tags,

      // Zapier webhook authentication
      api_key
    } = body;

    // Verify API key
    const validApiKey = process.env.ZAPIER_WEBHOOK_API_KEY || 'default-zapier-key';
    if (api_key !== validApiKey) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Check if member already exists
    const { data: existingMember } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    let userId: string;

    if (existingMember) {
      userId = existingMember.id;

      // Update existing member
      await supabase
        .from('users')
        .update({
          full_name: name,
          skool_member_id,
          skool_community: skool_community_name,
        subscription_status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    } else {
      // Create new user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email,
          full_name: name,
          skool_member_id,
          skool_community: skool_community_name,
          subscription_status,
          created_at: joined_date || new Date().toISOString()
        })
        .select()
        .single();

      if (userError || !newUser) {
        throw new Error('Failed to create user');
      }

      userId = newUser.id;
    }

    // Calculate attribution if we have tracking data
    const fingerprint = generateFingerprint(request);
    const cookieId = request.cookies.get('allumi_id')?.value;
    const sessionId = request.cookies.get('allumi_session')?.value;

    const attribution = await calculateAttribution(
      email,
      fingerprint,
      sessionId,
      cookieId
    );

    // Record conversion with attribution
    const { data: conversion, error: conversionError } = await supabase
      .from('conversions')
      .insert({
        user_id: userId,
        attributed_link_id: attribution?.click?.link_id || null,
        attributed_click_id: attribution?.click?.id || null,
        attribution_method: attribution?.method || 'zapier_import',
        confidence_score: attribution?.confidence || 50, // Lower confidence for imports
        conversion_type: subscription_status === 'paid' ? 'paid' : 'trial',
        revenue: monthly_revenue || 0,
        currency: 'USD',

        // UTM tracking from Zapier
        first_touch_source: utm_source || attribution?.click?.utm_source || 'zapier',
        last_touch_source: utm_source || attribution?.click?.utm_source || 'zapier',

        // Additional metadata
        device_fingerprint: fingerprint,
        metadata: {
          skool_member_id,
          skool_community_name,
          subscription_plan,
          imported_via: 'zapier',
          import_timestamp: new Date().toISOString(),
          custom_fields: custom_fields || {},
          tags: tags || []
        },

        converted_at: joined_date || new Date().toISOString()
      })
      .select()
      .single();

    if (conversionError) {
      console.error('Conversion recording error:', conversionError);
    }

    // Update campaign metrics if we have UTM data
    if (utm_campaign) {
      const today = new Date().toISOString().split('T')[0];

      const { data: existing } = await supabase
        .from('campaign_metrics')
        .select('*')
        .eq('campaign_name', utm_campaign)
        .eq('period_start', today)
        .single();

      if (existing) {
        await supabase
          .from('campaign_metrics')
          .update({
            conversions: existing.conversions + 1,
            revenue: existing.revenue + (monthly_revenue || 0),
            attributed_conversions: existing.attributed_conversions + (attribution ? 1 : 0),
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('campaign_metrics')
          .insert({
            campaign_name: utm_campaign,
            conversions: 1,
            revenue: monthly_revenue || 0,
            attributed_conversions: attribution ? 1 : 0,
            period_start: today,
            period_end: today
          });
      }
    }

    // Store in attribution paths for journey tracking
    if (attribution?.click) {
      await supabase
        .from('attribution_paths')
        .insert({
          conversion_id: conversion?.id,
          user_id: userId,
          touchpoints: [{
            source: utm_source || 'zapier',
            medium: utm_medium || 'import',
            campaign: utm_campaign || 'skool_sync',
            timestamp: new Date().toISOString()
          }],
          total_touchpoints: 1,
          journey_duration_hours: 0,
          channels: [utm_source || 'zapier'],
          dominant_channel: utm_source || 'zapier',
          overall_confidence: attribution.confidence || 50,
          journey_started_at: joined_date || new Date().toISOString(),
          journey_ended_at: new Date().toISOString()
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Member imported successfully',
      data: {
        user_id: userId,
        conversion_id: conversion?.id,
        attribution: {
          method: attribution?.method || 'zapier_import',
          confidence: attribution?.confidence || 50,
          source: utm_source || 'zapier'
        }
      }
    });
  } catch (error) {
    console.error('Zapier webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process member import' },
      { status: 500 }
    );
  }
}

// GET endpoint for Zapier to test the webhook
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ready',
    message: 'Zapier webhook endpoint is active',
    version: '1.0.0',
    accepts: {
      email: 'required',
      name: 'required',
      skool_member_id: 'optional',
      skool_community_name: 'optional',
      joined_date: 'optional',
      subscription_status: 'optional',
      monthly_revenue: 'optional',
      utm_source: 'optional',
      utm_medium: 'optional',
      utm_campaign: 'optional',
      api_key: 'required'
    }
  });
}