import { type NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  
  // Protected routes that require authentication
  const protectedPaths = [
    '/create-community',
    '/dashboard',
    '/community',
    '/c/',
    '/profile',
    '/settings',
    '/messages',
    '/notifications',
    '/claim-domain',
    '/affiliate-guide',
    '/attribution-demo',
    '/demo',
    '/sitemap-test',
    '/launch',
  ];

  // Check if current path needs protection
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath)
  );

  // If route needs protection, check authentication
  if (isProtectedRoute) {
    try {
      const supabase = createMiddlewareClient({ req: request, res });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect to login with return URL
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirectTo', path);
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      // If Supabase is not configured, redirect to login anyway for safety
      console.error('Auth check failed:', error);
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};