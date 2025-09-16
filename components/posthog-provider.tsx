"use client"

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { useEffect } from "react"

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_PROJECT_API_KEY", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    capture_pageleave: true,
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