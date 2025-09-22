import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Generate API key for Zapier integration
function generateApiKey(userId: string): string {
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(16).toString('hex');
  return `ak_${userId.substring(0, 8)}_${timestamp}_${random}`;
}

// Test authentication endpoint for Zapier
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.substring(7);

    // Validate API key in database
    const { data: apiKeyData } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .eq('is_active', true)
      .single();

    if (!apiKeyData) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Get user details
    const { data: user } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('id', apiKeyData.user_id)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update last used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', apiKeyData.id);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name
      },
      api_key: {
        id: apiKeyData.id,
        name: apiKeyData.name,
        created_at: apiKeyData.created_at
      }
    });
  } catch (error) {
    console.error('Zapier auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Create new API key for Zapier integration
export async function POST(request: NextRequest) {
  try {
    const { email, password, key_name } = await request.json();

    // Authenticate user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const userId = authData.user.id;
    const apiKey = generateApiKey(userId);

    // Store API key
    const { data: newKey, error: keyError } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        key: apiKey,
        name: key_name || 'Zapier Integration',
        permissions: ['read', 'write'],
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (keyError) {
      throw keyError;
    }

    return NextResponse.json({
      success: true,
      api_key: apiKey,
      key_id: newKey.id,
      message: 'API key created successfully. Save this key securely as it won\'t be shown again.'
    });
  } catch (error) {
    console.error('API key creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

// Revoke API key
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.substring(7);

    // Deactivate API key
    const { error } = await supabase
      .from('api_keys')
      .update({
        is_active: false,
        revoked_at: new Date().toISOString()
      })
      .eq('key', apiKey);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'API key revoked successfully'
    });
  } catch (error) {
    console.error('API key revocation error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}