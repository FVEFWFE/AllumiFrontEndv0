import crypto from 'crypto';

export async function getFingerprint(request: any): Promise<string> {
  try {
    const headers = request.headers || {};
    const ip = headers['x-forwarded-for']?.split(',')[0] ||
               headers['x-real-ip'] ||
               request.socket?.remoteAddress ||
               'unknown';

    const userAgent = headers['user-agent'] || 'unknown';
    const acceptLanguage = headers['accept-language'] || 'unknown';
    const acceptEncoding = headers['accept-encoding'] || 'unknown';
    const accept = headers['accept'] || 'unknown';

    const fingerprintData = {
      ip: ip.trim(),
      userAgent,
      acceptLanguage,
      acceptEncoding,
      accept,
      timestamp: Math.floor(Date.now() / (1000 * 60 * 60))
    };

    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(fingerprintData))
      .digest('hex');

    return `srv_${hash.substring(0, 16)}`;
  } catch (error) {
    console.error('Error generating server fingerprint:', error);
    return `srv_fallback_${Date.now()}`;
  }
}

export async function generateIdentityHash(data: {
  email?: string;
  ip?: string;
  userAgent?: string;
  deviceFingerprint?: string;
}): Promise<string> {
  const components = [
    data.email?.toLowerCase() || '',
    data.ip || '',
    data.userAgent || '',
    data.deviceFingerprint || ''
  ].filter(Boolean).join('::');

  if (!components) {
    return `id_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  const hash = crypto
    .createHash('sha256')
    .update(components)
    .digest('hex');

  return `id_${hash.substring(0, 20)}`;
}

export interface IdentitySignals {
  email?: string;
  phone?: string;
  deviceFingerprint?: string;
  ip?: string;
  userAgent?: string;
  cookies?: Record<string, string>;
  localStorage?: Record<string, string>;
  sessionId?: string;
  userId?: string;
}

export async function matchIdentity(
  signals: IdentitySignals,
  existingIdentities: IdentitySignals[]
): Promise<{ matched: boolean; confidence: number; matchedId?: string }> {
  let bestMatch = { matched: false, confidence: 0, matchedId: undefined as string | undefined };

  for (const identity of existingIdentities) {
    let score = 0;
    let totalWeight = 0;

    if (signals.email && identity.email) {
      const emailMatch = signals.email.toLowerCase() === identity.email.toLowerCase();
      score += emailMatch ? 30 : 0;
      totalWeight += 30;
    }

    if (signals.phone && identity.phone) {
      const phoneMatch = normalizePhone(signals.phone) === normalizePhone(identity.phone);
      score += phoneMatch ? 25 : 0;
      totalWeight += 25;
    }

    if (signals.deviceFingerprint && identity.deviceFingerprint) {
      const fpMatch = signals.deviceFingerprint === identity.deviceFingerprint;
      score += fpMatch ? 20 : 0;
      totalWeight += 20;
    }

    if (signals.ip && identity.ip) {
      const ipMatch = signals.ip === identity.ip;
      score += ipMatch ? 10 : 0;
      totalWeight += 10;
    }

    if (signals.userAgent && identity.userAgent) {
      const uaMatch = signals.userAgent === identity.userAgent;
      score += uaMatch ? 5 : 0;
      totalWeight += 5;
    }

    if (signals.userId && identity.userId) {
      const userMatch = signals.userId === identity.userId;
      score += userMatch ? 40 : 0;
      totalWeight += 40;
    }

    if (signals.sessionId && identity.sessionId) {
      const sessionMatch = signals.sessionId === identity.sessionId;
      score += sessionMatch ? 15 : 0;
      totalWeight += 15;
    }

    const confidence = totalWeight > 0 ? (score / totalWeight) * 100 : 0;

    if (confidence > bestMatch.confidence) {
      bestMatch = {
        matched: confidence >= 50,
        confidence: Math.round(confidence),
        matchedId: (identity as any).id
      };
    }
  }

  return bestMatch;
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '').replace(/^1/, '');
}

export interface AttributionSignals {
  directLinkId?: string;
  deviceFingerprint?: string;
  email?: string;
  ip?: string;
  referrer?: string;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  sessionId?: string;
  userId?: string;
  cookieId?: string;
  timestamp?: Date;
}

export async function calculateAttributionConfidence(
  signals: AttributionSignals,
  clickData: any
): Promise<number> {
  let confidence = 0;

  if (signals.directLinkId && clickData.short_id === signals.directLinkId) {
    confidence = 95;
  }

  else if (signals.userId && clickData.user_id === signals.userId) {
    confidence = 90;
  }

  else if (signals.sessionId && clickData.session_id === signals.sessionId) {
    confidence = 85;
  }

  else if (signals.cookieId && clickData.cookie_id === signals.cookieId) {
    confidence = 80;
  }

  else if (signals.deviceFingerprint && clickData.device_fingerprint === signals.deviceFingerprint) {
    const timeDiff = signals.timestamp && clickData.clicked_at ?
      Math.abs(new Date(signals.timestamp).getTime() - new Date(clickData.clicked_at).getTime()) :
      Infinity;

    const daysSince = timeDiff / (1000 * 60 * 60 * 24);

    if (daysSince < 1) confidence = 75;
    else if (daysSince < 7) confidence = 70;
    else if (daysSince < 30) confidence = 65;
    else confidence = 60;
  }

  else if (signals.email && clickData.email === signals.email) {
    confidence = 70;
  }

  else if (signals.ip && clickData.ip_address === signals.ip) {
    const timeDiff = signals.timestamp && clickData.clicked_at ?
      Math.abs(new Date(signals.timestamp).getTime() - new Date(clickData.clicked_at).getTime()) :
      Infinity;

    const hoursSince = timeDiff / (1000 * 60 * 60);

    if (hoursSince < 1) confidence = 65;
    else if (hoursSince < 24) confidence = 55;
    else confidence = 45;
  }

  else if (signals.utmParams && matchesUTMParams(signals.utmParams, clickData)) {
    confidence = 50;
  }

  else {
    confidence = 30;
  }

  return Math.min(100, Math.max(0, confidence));
}

function matchesUTMParams(
  params: AttributionSignals['utmParams'],
  clickData: any
): boolean {
  if (!params) return false;

  let matches = 0;
  let total = 0;

  if (params.source !== undefined) {
    total++;
    if (params.source === clickData.utm_source) matches++;
  }

  if (params.medium !== undefined) {
    total++;
    if (params.medium === clickData.utm_medium) matches++;
  }

  if (params.campaign !== undefined) {
    total++;
    if (params.campaign === clickData.utm_campaign) matches++;
  }

  return total > 0 && matches === total;
}

export async function enhancedAttributionResolution(
  conversionSignals: AttributionSignals,
  recentClicks: any[]
): Promise<{
  attributedClick: any | null;
  confidence: number;
  method: string;
  multiTouchAttribution?: Record<string, number>;
}> {
  if (!recentClicks || recentClicks.length === 0) {
    return { attributedClick: null, confidence: 0, method: 'none' };
  }

  let bestAttribution = {
    attributedClick: null as any,
    confidence: 0,
    method: 'none'
  };

  for (const click of recentClicks) {
    const confidence = await calculateAttributionConfidence(conversionSignals, click);

    if (confidence > bestAttribution.confidence) {
      bestAttribution = {
        attributedClick: click,
        confidence,
        method: getAttributionMethod(conversionSignals, click, confidence)
      };
    }
  }

  if (bestAttribution.confidence >= 50 && recentClicks.length > 1) {
    const multiTouch = await calculateMultiTouchAttribution(
      conversionSignals,
      recentClicks,
      bestAttribution.attributedClick
    );

    return {
      ...bestAttribution,
      multiTouchAttribution: multiTouch
    };
  }

  return bestAttribution;
}

function getAttributionMethod(
  signals: AttributionSignals,
  clickData: any,
  confidence: number
): string {
  if (signals.directLinkId && clickData.short_id === signals.directLinkId) {
    return 'direct_link';
  }
  if (signals.userId && clickData.user_id === signals.userId) {
    return 'user_id';
  }
  if (signals.sessionId && clickData.session_id === signals.sessionId) {
    return 'session';
  }
  if (signals.cookieId && clickData.cookie_id === signals.cookieId) {
    return 'cookie';
  }
  if (signals.deviceFingerprint && clickData.device_fingerprint === signals.deviceFingerprint) {
    return 'device_fingerprint';
  }
  if (signals.email && clickData.email === signals.email) {
    return 'email_match';
  }
  if (signals.ip && clickData.ip_address === signals.ip) {
    return 'ip_match';
  }
  if (confidence >= 50) {
    return 'probabilistic';
  }
  return 'unattributed';
}

async function calculateMultiTouchAttribution(
  signals: AttributionSignals,
  allClicks: any[],
  primaryClick: any
): Promise<Record<string, number>> {
  const attribution: Record<string, number> = {};
  const now = signals.timestamp ? new Date(signals.timestamp).getTime() : Date.now();

  let totalWeight = 0;

  for (const click of allClicks) {
    const clickTime = new Date(click.clicked_at).getTime();
    const daysSince = (now - clickTime) / (1000 * 60 * 60 * 24);

    const timeDecayWeight = Math.exp(-daysSince / 7);

    const positionWeight = click === primaryClick ? 1.5 :
                          click === allClicks[0] ? 1.2 :
                          click === allClicks[allClicks.length - 1] ? 1.1 :
                          1.0;

    const weight = timeDecayWeight * positionWeight;

    const campaignKey = click.campaign_name || click.utm_campaign || 'direct';
    attribution[campaignKey] = (attribution[campaignKey] || 0) + weight;
    totalWeight += weight;
  }

  for (const key in attribution) {
    attribution[key] = attribution[key] / totalWeight;
  }

  return attribution;
}