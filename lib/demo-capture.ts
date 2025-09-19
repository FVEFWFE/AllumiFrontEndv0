// Demo capture utilities for Attio CRM enrichment and PostHog tracking

export interface DemoCaptureData {
  email: string;
  firstName: string;
  skoolUrl?: string | null;
  source: 'demo' | 'audit' | 'community' | 'trial';
  captureType: 'email_only' | 'email_and_url' | 'community_join';
}

export interface AttioCompanyData {
  name: string;
  skoolHandle?: string;
  skoolProfileUrl?: string;
  totalOwnedPaidMembers?: number;
  ownedPaidGroups?: string[];
  estimatedMRR?: number;
}

export interface AttioPersonData {
  email: string;
  firstName: string;
  source: string;
  captureType: string;
  skoolUrl?: string;
  leadScore?: number;
}

// Validate that Skool URL doesn't contain an email address
export function validateSkoolUrl(url: string): { isValid: boolean; error?: string } {
  if (!url) return { isValid: false, error: 'Please enter your Skool profile URL' };

  // Check if it looks like an email was entered
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '').replace('skool.com/@', '');

  if (emailPattern.test(cleanUrl) || cleanUrl.includes('@gmail.com') || cleanUrl.includes('@yahoo.com') || cleanUrl.includes('@hotmail.com') || cleanUrl.includes('@outlook.com')) {
    return {
      isValid: false,
      error: 'Whoops! Looks like you entered your email instead of your Skool profile link'
    };
  }

  // Check if it's formatted correctly
  const formatted = formatSkoolUrl(url);
  if (!formatted || !formatted.startsWith('skool.com/@')) {
    return {
      isValid: false,
      error: 'Please enter a valid Skool profile URL (e.g., skool.com/@username)'
    };
  }

  return { isValid: true };
}

// Format Skool URL to standard format: skool.com/@username
export function formatSkoolUrl(url: string): string {
  if (!url) return '';

  // Remove any whitespace
  url = url.trim();

  // Remove protocol if present (https://, http://, www.)
  url = url.replace(/^(https?:\/\/)?(www\.)?/, '');

  // If already in correct format, return as is
  if (url.startsWith('skool.com/@')) {
    // Remove any query parameters or hash
    return url.split(/[?#]/)[0];
  }

  // Extract username from various formats
  let username = url;

  // If it contains skool.com but not in correct format
  if (url.includes('skool.com')) {
    // Try to extract username after @
    const match = url.match(/@([^/?#]+)/);
    if (match) {
      username = match[1];
    } else {
      // No @ found, return empty
      return '';
    }
  } else {
    // Just username provided (with or without @)
    username = username.replace(/^@/, '');
  }

  // Remove any trailing slashes or query params from username
  username = username.split(/[/?#]/)[0];

  // Return in correct format: skool.com/@username
  return username ? `skool.com/@${username}` : '';
}

// Extract username from Skool URL
export function extractSkoolUsername(url: string): string | null {
  const formatted = formatSkoolUrl(url);
  if (!formatted) return null;

  const match = formatted.match(/@([^/?#]+)/);
  return match ? match[1] : null;
}

// Calculate lead quality score
export function calculateLeadScore(data: DemoCaptureData): number {
  let score = 0;

  // Base score for providing email
  score += 30;

  // Additional score for first name
  score += 20;

  // Bonus for Skool URL
  if (data.skoolUrl) {
    score += 30;
  }

  // Source-based scoring
  switch(data.source) {
    case 'demo':
      score += 20;
      break;
    case 'trial':
      score += 15;
      break;
    case 'audit':
      score += 10;
      break;
    case 'community':
      score += 5;
      break;
  }

  return Math.min(100, score);
}

// Track demo request in PostHog
export function trackDemoRequest(data: DemoCaptureData & { formattedSkoolUrl?: string }) {
  if (typeof window !== 'undefined' && (window as any).posthog) {
    const posthog = (window as any).posthog;

    // Identify the user
    posthog.identify(data.email, {
      email: data.email,
      firstName: data.firstName,
      skoolUrl: data.formattedSkoolUrl,
      source: data.source,
      captureType: data.captureType
    });

    // Track the demo request event
    posthog.capture('demo_requested', {
      email: data.email,
      firstName: data.firstName,
      has_skool_url: !!data.formattedSkoolUrl,
      skool_url: data.formattedSkoolUrl,
      skool_username: data.formattedSkoolUrl ? extractSkoolUsername(data.formattedSkoolUrl) : null,
      source: data.source,
      capture_type: data.captureType,
      lead_score: calculateLeadScore(data),
      timestamp: new Date().toISOString()
    });
  }
}

// Process demo capture (main function to call from components)
export async function processDemoCapture(data: DemoCaptureData): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}> {
  try {
    // Format Skool URL if provided
    const formattedSkoolUrl = data.skoolUrl ? formatSkoolUrl(data.skoolUrl) : undefined;
    const skoolUsername = formattedSkoolUrl ? extractSkoolUsername(formattedSkoolUrl) : null;

    // Track in PostHog first (client-side)
    trackDemoRequest({
      ...data,
      formattedSkoolUrl
    });

    // Send to capture API
    const response = await fetch('/api/demo/capture-with-attio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        skoolUrl: formattedSkoolUrl
      })
    });

    if (!response.ok) {
      throw new Error('Failed to capture demo request');
    }

    const result = await response.json();

    // Log for debugging
    console.log('Demo capture processed:', {
      email: data.email,
      firstName: data.firstName,
      skoolUrl: formattedSkoolUrl,
      skoolUsername,
      leadScore: calculateLeadScore(data)
    });

    return {
      success: true,
      message: 'Demo request captured successfully',
      data: {
        ...result.data,
        skoolUsername,
        leadScore: calculateLeadScore(data)
      }
    };
  } catch (error) {
    console.error('Error processing demo capture:', error);
    return {
      success: false,
      message: 'Failed to process demo request',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}