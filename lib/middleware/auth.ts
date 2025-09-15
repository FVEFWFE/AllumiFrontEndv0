import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function createSupabaseServerClient(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  return { supabase, response };
}

export async function validateSession(supabase: any) {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return { user: null, error: error || new Error('No session found') };
  }

  return { user: session.user, error: null };
}

export async function requireAuth(req: NextRequest) {
  const { supabase, response } = await createSupabaseServerClient(req);
  const { user, error } = await validateSession(supabase);

  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return { user, supabase, response };
}

export async function requireCommunityMembership(
  req: NextRequest,
  communitySlug: string
) {
  const authResult = await requireAuth(req);
  
  if ('error' in authResult) {
    return authResult;
  }

  const { user, supabase } = authResult;

  // Check if user is a member of the community
  const { data: membership, error } = await supabase
    .from('memberships')
    .select(`
      id,
      role,
      status,
      community:communities(
        id,
        slug,
        name
      )
    `)
    .eq('user_id', user.id)
    .eq('community.slug', communitySlug)
    .eq('status', 'active')
    .single();

  if (error || !membership) {
    return NextResponse.json(
      { error: 'Not a member of this community' },
      { status: 403 }
    );
  }

  return { user, membership, supabase, response: authResult.response };
}

export async function requireCommunityOwner(
  req: NextRequest,
  communitySlug: string
) {
  const membershipResult = await requireCommunityMembership(req, communitySlug);
  
  if ('error' in membershipResult) {
    return membershipResult;
  }

  const { membership } = membershipResult;

  if (membership.role !== 'owner' && membership.role !== 'admin') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }

  return membershipResult;
}