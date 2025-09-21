"use client"

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { useEffect } from "react"

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    ui_host: "https://us.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    capture_pageleave: true,
    // Enable error tracking
    autocapture: {
      dom_event_allowlist: ['click', 'submit', 'change'],
      element_allowlist: ['button', 'input', 'select', 'textarea', 'a', 'form']
    },
    capture_performance: true,
    session_recording: {
      recordCrossOriginIframes: false,
      maskAllInputs: false,
      maskTextSelector: '[data-sensitive]'
    },
    // Capture console errors automatically
    capture_console_log_errors: true,
    // Capture unhandled promise rejections
    capture_unhandled_rejections: true
  })
}

export function PostHogPageview(): JSX.Element {
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""

  useEffect(() => {
    if (pathname && typeof window !== "undefined") {
      let url = window.origin + pathname
      if (window.location.search) {
        url = url + window.location.search
      }
      posthog.capture("$pageview", {
        $current_url: url,
      })
    }
  }, [pathname])

  return <></>
}

export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, {
      email: properties?.email,
      name: properties?.name,
      signup_date: new Date().toISOString(),
      plan: 'trial',
      ...properties
    });
  }
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
}

export function trackRevenue(amount: number, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.capture('$revenue', {
      revenue: amount,
      currency: 'USD',
      ...properties
    });
  }
}

export function trackError(error: Error | string, context?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    const errorDetails = {
      $exception_type: error instanceof Error ? error.name : 'Error',
      $exception_message: error instanceof Error ? error.message : error,
      $exception_stack_trace: error instanceof Error ? error.stack : undefined,
      $exception_source: context?.source || 'manual',
      $exception_level: context?.level || 'error',
      ...context
    };

    posthog.capture('$exception', errorDetails);
  }
}

// Setup global error handlers
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  // Track unhandled errors
  window.addEventListener('error', (event) => {
    trackError(new Error(event.message), {
      source: 'window.onerror',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      level: 'error'
    });
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    trackError(new Error(event.reason?.message || event.reason || 'Unhandled Promise Rejection'), {
      source: 'unhandledrejection',
      promise: true,
      level: 'error'
    });
  });
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}