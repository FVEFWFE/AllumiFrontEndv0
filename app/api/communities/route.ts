import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { createClient } from '@supabase/supabase-js';

// GET /api/communities - List communities for a user
export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const authResult = await requireAuth(req);
  
  if ('error' in authResult) {
    return authResult;
  }

  const { user } = authResult;

  try {
    // Get communities where user is a member
    const { data: memberships, error } = await supabase
      .from('memberships')
      .select(`
        id,
        role,
        status,
        joined_at,
        community:communities(
          id,
          slug,
          name,
          description,
          logo_url,
          member_count,
          subscription_price,
          lifetime_price,
          is_public
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (error) {
      throw error;
    }

    // Format response
    const communities = memberships?.map(m => ({
      ...m.community,
      membership: {
        id: m.id,
        role: m.role,
        joined_at: m.joined_at,
      },
    })) || [];

    return NextResponse.json({ communities });
  } catch (error: any) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch communities' },
      { status: 500 }
    );
  }
}

// POST /api/communities - Create a new community
export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const authResult = await requireAuth(req);
  
  if ('error' in authResult) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const {
      name,
      slug,
      description,
      subscription_price = 99,
      lifetime_price = 497,
      is_public = true,
      features = {},
      settings = {},
    } = await req.json();

    // Validate slug is unique
    const { data: existing } = await supabase
      .from('communities')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Community slug already exists' },
        { status: 400 }
      );
    }

    // Create community
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .insert({
        name,
        slug,
        description,
        owner_id: user.id,
        subscription_price,
        lifetime_price,
        is_public,
        features: {
          attribution_tracking: true,
          custom_domain: true,
          unlimited_members: true,
          unlimited_courses: true,
          analytics_dashboard: true,
          ...features,
        },
        settings: {
          allow_member_invites: true,
          require_approval: false,
          show_member_list: true,
          ...settings,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (communityError) {
      throw communityError;
    }

    // Create owner membership
    const { error: membershipError } = await supabase
      .from('memberships')
      .insert({
        user_id: user.id,
        community_id: community.id,
        role: 'owner',
        status: 'active',
        joined_at: new Date().toISOString(),
      });

    if (membershipError) {
      // Rollback community creation
      await supabase
        .from('communities')
        .delete()
        .eq('id', community.id);
      
      throw membershipError;
    }

    // Track community creation event
    await supabase.from('attribution_events').insert({
      community_id: community.id,
      user_id: user.id,
      event_type: 'community_created',
      metadata: {
        community_name: name,
        community_slug: slug,
      },
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ 
      community,
      message: 'Community created successfully' 
    });
  } catch (error: any) {
    console.error('Error creating community:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create community' },
      { status: 500 }
    );
  }
}

// PATCH /api/communities - Update a community
export async function PATCH(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if ('error' in authResult) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const {
      id,
      name,
      description,
      subscription_price,
      lifetime_price,
      is_public,
      features,
      settings,
      logo_url,
      cover_image,
    } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Community ID required' },
        { status: 400 }
      );
    }

    // Check if user is owner/admin
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('community_id', id)
      .single();

    if (!membership || (membership.role !== 'owner' && membership.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (subscription_price !== undefined) updates.subscription_price = subscription_price;
    if (lifetime_price !== undefined) updates.lifetime_price = lifetime_price;
    if (is_public !== undefined) updates.is_public = is_public;
    if (features !== undefined) updates.features = features;
    if (settings !== undefined) updates.settings = settings;
    if (logo_url !== undefined) updates.logo_url = logo_url;
    if (cover_image !== undefined) updates.cover_image = cover_image;

    // Update community
    const { data: community, error } = await supabase
      .from('communities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      community,
      message: 'Community updated successfully' 
    });
  } catch (error: any) {
    console.error('Error updating community:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update community' },
      { status: 500 }
    );
  }
}

// DELETE /api/communities - Delete a community
export async function DELETE(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if ('error' in authResult) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Community ID required' },
        { status: 400 }
      );
    }

    // Check if user is owner
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('community_id', id)
      .single();

    if (!membership || membership.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only community owner can delete' },
        { status: 403 }
      );
    }

    // Soft delete (mark as deleted)
    const { error } = await supabase
      .from('communities')
      .update({ 
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      message: 'Community deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting community:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete community' },
      { status: 500 }
    );
  }
}