import { NextRequest, NextResponse } from 'next/server';

interface DemoCaptureData {
  email: string;
  firstName: string;
  skoolUrl?: string | null;
  source: 'demo' | 'audit' | 'community' | 'trial';
  captureType: 'email_only' | 'email_and_url' | 'community_join';
}

export async function POST(request: NextRequest) {
  try {
    const data: DemoCaptureData = await request.json();

    // Validate required fields
    if (!data.email || !data.firstName) {
      return NextResponse.json(
        { error: 'Email and first name are required' },
        { status: 400 }
      );
    }

    // Clean up Skool URL if provided (ensure skool.com/@username format)
    let cleanSkoolUrl: string | undefined;
    if (data.skoolUrl) {
      cleanSkoolUrl = formatSkoolUrl(data.skoolUrl);
    }

    // Note: Attio CRM enrichment happens on the client side through MCP
    // PostHog tracking also happens on the client side
    // This endpoint just validates and formats the data

    return NextResponse.json({
      success: true,
      message: 'Information captured successfully',
      data: {
        email: data.email,
        firstName: data.firstName,
        skoolUrl: cleanSkoolUrl
      }
    });

  } catch (error) {
    console.error('Demo capture error:', error);
    return NextResponse.json(
      { error: 'Failed to capture information' },
      { status: 500 }
    );
  }
}

function formatSkoolUrl(url: string): string {
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