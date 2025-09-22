// Click Tracking Utilities
// Complete implementation for capturing and processing click events

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Extract UTM parameters from URL
export function extractUTMParams(url: URL) {
  const utm: any = {};
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  utmKeys.forEach(key => {
    const value = url.searchParams.get(key);
    if (value) {
      utm[key] = value;
    }
  });

  return utm;
}

// Parse user agent for device info
export function parseUserAgent(userAgent: string) {
  const device: any = {};

  // Detect device type
  if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
    device.device_type = /iPad/i.test(userAgent) ? 'tablet' : 'mobile';
  } else {
    device.device_type = 'desktop';
  }

  // Detect browser
  if (/Chrome/i.test(userAgent)) device.browser = 'Chrome';
  else if (/Safari/i.test(userAgent)) device.browser = 'Safari';
  else if (/Firefox/i.test(userAgent)) device.browser = 'Firefox';
  else if (/Edge/i.test(userAgent)) device.browser = 'Edge';
  else device.browser = 'Other';

  // Detect OS
  if (/Windows/i.test(userAgent)) device.os = 'Windows';
  else if (/Mac/i.test(userAgent)) device.os = 'MacOS';
  else if (/Linux/i.test(userAgent)) device.os = 'Linux';
  else if (/Android/i.test(userAgent)) device.os = 'Android';
  else if (/iOS|iPhone|iPad/i.test(userAgent)) device.os = 'iOS';
  else device.os = 'Other';

  return device;
}

// Generate server-side fingerprint
export function generateFingerprint(req: Request) {
  const headers = req.headers;
  const components = [
    headers.get('user-agent') || '',
    headers.get('accept-language') || '',
    headers.get('accept-encoding') || '',
    headers.get('accept') || '',
  ];

  return crypto
    .createHash('sha256')
    .update(components.join('|'))
    .digest('hex')
    .substring(0, 16);
}

// Get IP address from request
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const real = req.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (real) {
    return real;
  }

  return '0.0.0.0';
}

// Track click event
export async function trackClick(
  shortId: string,
  linkId: string,
  req: Request,
  destinationUrl: string
) {
  try {
    const url = new URL(req.url);
    const userAgent = req.headers.get('user-agent') || '';
    const referer = req.headers.get('referer') || '';

    // Extract tracking data
    const utm = extractUTMParams(new URL(destinationUrl));
    const deviceInfo = parseUserAgent(userAgent);
    const fingerprint = generateFingerprint(req);
    const ip = getClientIP(req);

    // Get cookie/session IDs if available
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => {
        const [key, value] = c.trim().split('=');
        return [key, value];
      })
    );

    const sessionId = cookies['allumi_session'] || crypto.randomUUID();
    const cookieId = cookies['allumi_id'] || crypto.randomUUID();

    // Extract email if present in URL
    const email = url.searchParams.get('email') || null;

    // Store click event
    const { data, error } = await supabase
      .from('clicks')
      .insert({
        link_id: linkId,
        short_id: shortId,
        identity_id: fingerprint,
        session_id: sessionId,
        cookie_id: cookieId,
        device_fingerprint: fingerprint,
        ip_address: ip,
        user_agent: userAgent,
        email: email,
        utm_source: utm.utm_source || null,
        utm_medium: utm.utm_medium || null,
        utm_campaign: utm.utm_campaign || null,
        utm_term: utm.utm_term || null,
        utm_content: utm.utm_content || null,
        referer: referer,
        device_type: deviceInfo.device_type,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        clicked_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error tracking click:', error);
      return null;
    }

    return {
      clickId: data?.[0]?.id,
      sessionId,
      cookieId,
      fingerprint
    };
  } catch (err) {
    console.error('Click tracking failed:', err);
    return null;
  }
}

// Get geolocation from IP (placeholder - would use real service)
export async function getGeolocation(ip: string) {
  // In production, use a service like MaxMind or IP-API
  // For now, return placeholder data
  return {
    country: 'US',
    city: 'Unknown'
  };
}

// Update click with geo data (async, non-blocking)
export async function enrichClickData(clickId: string, ip: string) {
  try {
    const geo = await getGeolocation(ip);

    await supabase
      .from('clicks')
      .update({
        country: geo.country,
        city: geo.city
      })
      .eq('id', clickId);
  } catch (err) {
    console.error('Failed to enrich click data:', err);
  }
}

// Calculate attribution for a conversion
export async function calculateAttribution(
  userEmail?: string,
  fingerprint?: string,
  sessionId?: string,
  cookieId?: string
) {
  try {
    // Look for matching clicks in order of confidence
    let attribution = null;
    let confidence = 0;
    let method = 'unknown';

    // 1. Try email match (highest confidence)
    if (userEmail) {
      const { data: emailClick } = await supabase
        .from('clicks')
        .select('*')
        .eq('email', userEmail)
        .order('clicked_at', { ascending: false })
        .limit(1)
        .single();

      if (emailClick) {
        attribution = emailClick;
        confidence = 95;
        method = 'email';
      }
    }

    // 2. Try cookie match
    if (!attribution && cookieId) {
      const { data: cookieClick } = await supabase
        .from('clicks')
        .select('*')
        .eq('cookie_id', cookieId)
        .order('clicked_at', { ascending: false })
        .limit(1)
        .single();

      if (cookieClick) {
        attribution = cookieClick;
        confidence = 90;
        method = 'cookie';
      }
    }

    // 3. Try session match
    if (!attribution && sessionId) {
      const { data: sessionClick } = await supabase
        .from('clicks')
        .select('*')
        .eq('session_id', sessionId)
        .order('clicked_at', { ascending: false })
        .limit(1)
        .single();

      if (sessionClick) {
        attribution = sessionClick;
        confidence = 85;
        method = 'session';
      }
    }

    // 4. Try fingerprint match
    if (!attribution && fingerprint) {
      const { data: fpClick } = await supabase
        .from('clicks')
        .select('*')
        .eq('device_fingerprint', fingerprint)
        .gte('clicked_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('clicked_at', { ascending: false })
        .limit(1)
        .single();

      if (fpClick) {
        attribution = fpClick;
        confidence = 75;
        method = 'fingerprint';
      }
    }

    return {
      click: attribution,
      confidence,
      method
    };
  } catch (err) {
    console.error('Attribution calculation failed:', err);
    return null;
  }
}