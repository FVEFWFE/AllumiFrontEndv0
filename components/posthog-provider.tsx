"use client"

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { useEffect } from "react"

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "phx_164sLhconqdP3HzeRAkkYGhHuavf0ssCPedye1BxDkKOMKLH", {
    api_host: "/ingest", // Use reverse proxy to avoid ad blockers
    ui_host: "https://us.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    capture_pageleave: true,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug() // Enable debug mode in development
    }
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

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}