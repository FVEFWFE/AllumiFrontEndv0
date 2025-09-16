'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: '/api/posthog', // Use our reverse proxy
    capture_pageview: false, // We'll handle this manually
    capture_pageleave: true,
    cross_subdomain_cookie: true, // Enable cross-subdomain tracking
    persistence: 'localStorage+cookie', // Use both for better tracking
    cookie_domain: '.allumi.com', // Set cookie domain for cross-domain
    session_recording: {
      maskAllInputs: true, // Privacy first
      maskTextContent: false,
    },
    autocapture: {
      dom_event_allowlist: ['click', 'submit', 'change'], // Track important interactions
    },
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.opt_out_capturing() // Disable in development
      }
    },
  })
}

export function PostHogPageView(): JSX.Element {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url = window.location.origin + pathname
      const fullUrl = searchParams?.toString() 
        ? `${url}?${searchParams.toString()}`
        : url
        
      posthog.capture('$pageview', {
        $current_url: fullUrl,
        $pathname: pathname,
      })
    }
  }, [pathname, searchParams])

  return <></>
}

// Helper function to append PostHog session ID to cross-domain links
export function appendPostHogParams(url: string): string {
  if (typeof window === 'undefined' || !posthog) return url;
  
  try {
    const urlObj = new URL(url);
    // Only append to dexvolkov.com links
    if (urlObj.hostname.includes('dexvolkov.com')) {
      const sessionId = posthog.get_session_id();
      const distinctId = posthog.get_distinct_id();
      
      if (sessionId) {
        urlObj.searchParams.set('__posthog_session_id', sessionId);
      }
      if (distinctId) {
        urlObj.searchParams.set('__posthog_distinct_id', distinctId);
      }
      
      return urlObj.toString();
    }
  } catch (e) {
    // If URL parsing fails, return original
    console.error('Failed to append PostHog params:', e);
  }
  
  return url;
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check for PostHog params in URL on mount
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('__posthog_session_id');
      const distinctId = params.get('__posthog_distinct_id');
      
      if (sessionId && distinctId) {
        // Restore session from cross-domain navigation
        posthog.identify(distinctId);
        console.log('PostHog cross-domain session restored');
      }
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}