import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export class APIError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleAPIError(error: unknown) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }

  // Report to Sentry in production
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error);
  }

  // Handle known API errors
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        statusCode: error.statusCode,
        timestamp: new Date().toISOString()
      },
      { status: error.statusCode }
    );
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as any;

    // Map common Supabase error codes
    const statusMap: Record<string, number> = {
      'PGRST204': 404, // Not found
      'PGRST301': 409, // Conflict
      'PGRST116': 400, // Bad request
      '23505': 409, // Unique violation
      '23503': 400, // Foreign key violation
      '23502': 400, // Not null violation
      '42501': 403, // Insufficient privilege
      '42P01': 500, // Undefined table
      'PGRST000': 500, // Internal server error
    };

    const statusCode = statusMap[supabaseError.code] || 500;
    const message = supabaseError.message || 'Database operation failed';

    return NextResponse.json(
      {
        error: message,
        code: supabaseError.code,
        statusCode,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }

  // Handle validation errors
  if (error instanceof TypeError || error instanceof SyntaxError) {
    return NextResponse.json(
      {
        error: 'Invalid request data',
        details: error.message,
        statusCode: 400,
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    );
  }

  // Handle generic errors
  const genericError = error instanceof Error ? error : new Error('Unknown error occurred');

  return NextResponse.json(
    {
      error: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : genericError.message,
      statusCode: 500,
      timestamp: new Date().toISOString()
    },
    { status: 500 }
  );
}

// Wrapper for async API routes
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleAPIError(error);
    }
  }) as T;
}

// Validation helpers
export function validateRequired(data: any, fields: string[]) {
  const missing = fields.filter(field => !data[field]);

  if (missing.length > 0) {
    throw new APIError(
      `Missing required fields: ${missing.join(', ')}`,
      400
    );
  }
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new APIError('Invalid email format', 400);
  }
}

export function validateUrl(url: string) {
  try {
    new URL(url);
  } catch {
    throw new APIError('Invalid URL format', 400);
  }
}

// Rate limiting helper (for specific endpoints)
const endpointLimits = new Map<string, { count: number; resetTime: number }>();

export function checkEndpointRateLimit(
  endpoint: string,
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const key = `${endpoint}:${identifier}`;
  const now = Date.now();
  const limit = endpointLimits.get(key);

  if (!limit || limit.resetTime < now) {
    endpointLimits.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }

  if (limit.count >= maxRequests) {
    throw new APIError(
      `Rate limit exceeded. Try again in ${Math.ceil((limit.resetTime - now) / 1000)} seconds`,
      429
    );
  }

  limit.count++;
  return true;
}