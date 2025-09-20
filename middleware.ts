import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting (consider Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: {
    '/api/conversions/track': 10, // 10 conversions per minute
    '/api/links/create': 20, // 20 links per minute
    '/api/webhooks': 50, // 50 webhook calls per minute
    '/api/demo/capture': 5, // 5 demo requests per minute
    default: 100 // 100 requests per minute for other endpoints
  }
};

function getRateLimit(pathname: string): number {
  for (const [path, limit] of Object.entries(RATE_LIMIT_CONFIG.maxRequests)) {
    if (pathname.startsWith(path)) {
      return limit as number;
    }
  }
  return RATE_LIMIT_CONFIG.maxRequests.default;
}

function rateLimiter(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
             request.headers.get('x-real-ip') ||
             'unknown';

  const pathname = request.nextUrl.pathname;
  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const limit = getRateLimit(pathname);

  // Clean up old entries
  for (const [k, v] of rateLimitMap.entries()) {
    if (v.resetTime < now) {
      rateLimitMap.delete(k);
    }
  }

  const rateLimit = rateLimitMap.get(key);

  if (!rateLimit) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs
    });
    return true;
  }

  if (rateLimit.resetTime < now) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs
    });
    return true;
  }

  if (rateLimit.count >= limit) {
    return false;
  }

  rateLimit.count++;
  return true;
}

export function middleware(request: NextRequest) {
  // Skip rate limiting for static files and Next.js internals
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next();
  }

  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const allowed = rateLimiter(request);

    if (!allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Please slow down and try again later'
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(getRateLimit(request.nextUrl.pathname)),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Date.now() + RATE_LIMIT_CONFIG.windowMs)
          }
        }
      );
    }
  }

  // Add security headers
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match dynamic routes
    '/l/:path*',
    // Exclude static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};