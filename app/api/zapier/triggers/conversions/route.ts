import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Zapier trigger for new conversions
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.substring(7);

    // Validate API key
    const { data: apiKeyData } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('key', apiKey)
      .eq('is_active', true)
      .single();

    if (!apiKeyData) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Get query parameters for filtering
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const since = url.searchParams.get('since'); // ISO timestamp

    // Build query
    let query = supabase
      .from('conversions')
      .select(`
        *,
        users!conversions_user_id_fkey (
          id,
          email,
          full_name,
          skool_member_id,
          skool_community
        ),
        clicks!conversions_attributed_click_id_fkey (
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
          utm_term,
          referer
        )
      `)
      .eq('user_id', apiKeyData.user_id)
      .order('converted_at', { ascending: false })
      .limit(limit);

    // Add date filter if provided
    if (since) {
      query = query.gte('converted_at', since);
    }

    const { data: conversions, error } = await query;

    if (error) {
      throw error;
    }

    // Format for Zapier
    const formattedConversions = conversions?.map(conversion => ({
      id: conversion.id,
      // User data
      user_email: conversion.users?.email,
      user_name: conversion.users?.full_name,
      skool_member_id: conversion.users?.skool_member_id,
      skool_community: conversion.users?.skool_community,

      // Conversion data
      conversion_type: conversion.conversion_type,
      revenue: conversion.revenue,
      currency: conversion.currency,
      converted_at: conversion.converted_at,

      // Attribution data
      attribution_method: conversion.attribution_method,
      confidence_score: conversion.confidence_score,
      first_touch_source: conversion.first_touch_source,
      last_touch_source: conversion.last_touch_source,
      attribution_window_days: conversion.attribution_window_days,

      // UTM data from click
      utm_source: conversion.clicks?.utm_source,
      utm_medium: conversion.clicks?.utm_medium,
      utm_campaign: conversion.clicks?.utm_campaign,
      utm_content: conversion.clicks?.utm_content,
      utm_term: conversion.clicks?.utm_term,
      referrer: conversion.clicks?.referer,

      // Metadata
      metadata: conversion.metadata,
      created_at: conversion.created_at
    })) || [];

    return NextResponse.json(formattedConversions);
  } catch (error) {
    console.error('Zapier conversions trigger error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversions' },
      { status: 500 }
    );
  }
}

// Webhook subscription endpoint for real-time triggers
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.substring(7);
    const { webhook_url, events } = await request.json();

    // Validate API key
    const { data: apiKeyData } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('key', apiKey)
      .eq('is_active', true)
      .single();

    if (!apiKeyData) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Store webhook subscription
    const { data: subscription, error } = await supabase
      .from('webhook_subscriptions')
      .insert({
        user_id: apiKeyData.user_id,
        webhook_url,
        events: events || ['conversion.created'],
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      subscription_id: subscription.id,
      webhook_url,
      events: subscription.events,
      message: 'Webhook subscription created successfully'
    });
  } catch (error) {
    console.error('Webhook subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create webhook subscription' },
      { status: 500 }
    );
  }
}