import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, password, skoolGroupUrl } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Create user profile with 30-day trial
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        skool_group_url: skoolGroupUrl,
        subscription_status: 'trial',
        subscription_plan: 'beta',
        trial_ends_at: trialEndsAt.toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (userError) {
      // Rollback auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    // Generate API key for the user
    const apiKey = `ak_${nanoid(32)}`;
    await supabase
      .from('api_keys')
      .insert({
        user_id: authData.user.id,
        key_hash: apiKey, // In production, hash this
        name: 'Default Key',
        is_active: true
      });

    // Sign in the user
    const { data: session, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      return NextResponse.json(
        { error: 'Account created but sign in failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: userData,
      session: session.session,
      apiKey
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}