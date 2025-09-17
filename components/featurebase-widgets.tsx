"use client"

import { useEffect } from "react"
import Script from "next/script"

declare global {
  interface Window {
    Featurebase: any
  }
}

export function FeaturebaseWidgets() {
  useEffect(() => {
    const win = window as any

    // Initialize Featurebase if it doesn't exist
    if (typeof win.Featurebase !== "function") {
      win.Featurebase = function () {
        (win.Featurebase.q = win.Featurebase.q || []).push(arguments)
      }
    }

    // Initialize feedback widget with correct placement
    win.Featurebase("initialize_feedback_widget", {
      organization: "allumi",
      placement: "bottom-right",
      fullScreen: false,
      defaultBoard: "feedback",
      theme: "light"
    })

    // Listen for theme changes to update widget themes
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains('dark')
      const theme = isDark ? 'dark' : 'light'
      
      // Update feedback widget theme
      win.Featurebase("initialize_feedback_widget", {
        organization: "allumi",
        placement: "bottom-right",
        fullScreen: false,
        defaultBoard: "feedback",
        theme: theme
      })
    }

    // Initial theme check
    handleThemeChange()

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          handleThemeChange()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <Script
        id="featurebase-sdk"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !(function(e,t){var a="featurebase-sdk";function n(){if(!t.getElementById(a)){var e=t.createElement("script");(e.id=a),(e.src="https://do.featurebase.app/js/sdk.js"),t.getElementsByTagName("script")[0].parentNode.insertBefore(e,t.getElementsByTagName("script")[0])}};"function"!=typeof e.Featurebase&&(e.Featurebase=function(){(e.Featurebase.q=e.Featurebase.q||[]).push(arguments)}),"complete"===t.readyState||"interactive"===t.readyState?n():t.addEventListener("DOMContentLoaded",n)})(window,document);
          `,
        }}
      />
    </>
  )
}

// Helper function to open feedback widget
export function openFeedbackWidget(board?: string) {
  if (typeof window !== 'undefined') {
    window.postMessage({
      target: 'FeaturebaseWidget',
      data: { 
        action: 'openFeedbackWidget',
        setBoard: board,
      }
    })
  }
}