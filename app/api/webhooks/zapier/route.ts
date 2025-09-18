import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Time decay attribution calculation
function calculateTimeDecayAttribution(touches: any[], conversionDate: Date) {
  const halfLife = 7; // days
  const total = touches.reduce((sum, touch) => {
    const daysSinceTouch = (conversionDate.getTime() - new Date(touch.clicked_at).getTime()) / (1000 * 60 * 60 * 24);
    const weight = Math.pow(0.5, daysSinceTouch / halfLife);
    return sum + weight;
  }, 0);
  
  return touches.map(touch => {
    const daysSinceTouch = (conversionDate.getTime() - new Date(touch.clicked_at).getTime()) / (1000 * 60 * 60 * 24);
    const weight = Math.pow(0.5, daysSinceTouch / halfLife);
    return {
      ...touch,
      attributionCredit: (weight / total) * 100
    };
  });
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook authenticity (optional but recommended)
    const headersList = headers();
    const zapierAuth = headersList.get('x-zapier-auth');
    
    if (process.env.ZAPIER_WEBHOOK_SECRET && zapierAuth !== process.env.ZAPIER_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      email,
      name,
      skoolGroupUrl,
      joinedAt,
      userId, // The Allumi user ID who owns this Skool group
      membershipLevel,
      referralSource
    } = body;

    if (!email || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: email and userId' },
        { status: 400 }
      );
    }

    const conversionDate = joinedAt ? new Date(joinedAt) : new Date();
    const lookbackWindow = 30; // days

    // Step 1: Find identity based on email or recent clicks
    let identityId = null;
    
    // First try exact email match
    const { data: emailIdentity } = await supabase
      .from('identities')
      .select('*')
      .contains('emails', [email])
      .single();

    if (emailIdentity) {
      identityId = emailIdentity.id;
    } else {
      // Try to find by recent activity pattern
      const lookbackDate = new Date(conversionDate.getTime() - (lookbackWindow * 24 * 60 * 60 * 1000));
      
      const { data: recentClicks } = await supabase
        .from('clicks')
        .select('*')
        .eq('user_id', userId)
        .gte('clicked_at', lookbackDate.toISOString())
        .lte('clicked_at', conversionDate.toISOString())
        .order('clicked_at', { ascending: false })
        .limit(1);

      if (recentClicks && recentClicks.length > 0) {
        identityId = recentClicks[0].identity_id;
        
        // Update identity with email
        if (identityId) {
          await supabase
            .from('identities')
            .update({
              emails: supabase.sql`array_append(emails, ${email})`,
              last_seen: conversionDate.toISOString()
            })
            .eq('id', identityId);
        }
      }
    }

    // If no identity found, create a new one
    if (!identityId) {
      const { data: newIdentity } = await supabase
        .from('identities')
        .insert({
          emails: [email],
          created_at: conversionDate.toISOString(),
          last_seen: conversionDate.toISOString()
        })
        .select()
        .single();
      
      identityId = newIdentity?.id;
    }

    // Step 2: Find all touchpoints for this identity
    let touchpoints = [];
    if (identityId) {
      const { data: clicks } = await supabase
        .from('clicks')
        .select('*')
        .eq('identity_id', identityId)
        .eq('user_id', userId)
        .gte('clicked_at', new Date(conversionDate.getTime() - (lookbackWindow * 24 * 60 * 60 * 1000)).toISOString())
        .lte('clicked_at', conversionDate.toISOString())
        .order('clicked_at', { ascending: true });

      touchpoints = clicks || [];
    }

    // Step 3: Calculate attribution
    let attributionData = {};
    let confidenceScore = 0;

    if (touchpoints.length > 0) {
      const attributedTouches = calculateTimeDecayAttribution(touchpoints, conversionDate);
      
      // Group by campaign
      attributionData = attributedTouches.reduce((acc, touch) => {
        const key = touch.campaign_name || 'Direct';
        if (!acc[key]) {
          acc[key] = {
            credit: 0,
            touches: 0,
            firstTouch: touch.clicked_at,
            lastTouch: touch.clicked_at
          };
        }
        acc[key].credit += touch.attributionCredit;
        acc[key].touches += 1;
        acc[key].lastTouch = touch.clicked_at;
        return acc;
      }, {} as any);

      confidenceScore = Math.min(95, touchpoints.length * 20);
    } else {
      // No touchpoints found - mark as unattributed
      attributionData = { 'Unattributed': { credit: 100, touches: 0 } };
      confidenceScore = 0;
    }

    // Step 4: Store conversion
    const { data: conversion, error: conversionError } = await supabase
      .from('conversions')
      .insert({
        identity_id: identityId,
        user_id: userId,
        skool_email: email,
        skool_name: name,
        skool_group: skoolGroupUrl,
        membership_level: membershipLevel,
        referral_source: referralSource,
        joined_at: conversionDate.toISOString(),
        attribution_model: 'time_decay',
        attribution_data: attributionData,
        confidence_score: confidenceScore,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (conversionError) {
      console.error('Error storing conversion:', conversionError);
      return NextResponse.json(
        { error: 'Failed to store conversion' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      conversion: conversion,
      attribution: attributionData,
      confidence: confidenceScore,
      touchpoints: touchpoints.length
    });

  } catch (error) {
    console.error('Zapier webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}