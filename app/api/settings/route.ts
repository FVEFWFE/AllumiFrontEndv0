import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.substring(7);

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error('Error fetching settings:', settingsError);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    if (!settings) {
      const newApiKey = `ak_live_${crypto.randomBytes(32).toString('hex')}`;
      const webhookSecret = `whsec_${crypto.randomBytes(24).toString('hex')}`;

      const { data: newSettings, error: createError } = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          api_key: newApiKey,
          webhook_secret: webhookSecret,
          notifications: {
            emailAlerts: true,
            weeklyReports: true,
            trialReminders: true,
            newConversions: false
          }
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating settings:', createError);
        return NextResponse.json({ error: 'Failed to create settings' }, { status: 500 });
      }

      return NextResponse.json({ settings: newSettings });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.substring(7);

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { notifications, regenerateApiKey } = body;

    let updateData: any = {};

    if (notifications) {
      updateData.notifications = notifications;
    }

    if (regenerateApiKey) {
      updateData.api_key = `ak_live_${crypto.randomBytes(32).toString('hex')}`;
    }

    updateData.updated_at = new Date().toISOString();

    const { data: updatedSettings, error: updateError } = await supabase
      .from('user_settings')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating settings:', updateError);
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      message: regenerateApiKey ? 'API key regenerated successfully' : 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}