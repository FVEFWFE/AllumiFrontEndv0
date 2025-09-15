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

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}