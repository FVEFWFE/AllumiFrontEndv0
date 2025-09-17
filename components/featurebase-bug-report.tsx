"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    Featurebase: any
  }
}

/**
 * Helper component for bug reporting with Featurebase
 * According to Featurebase docs, the feedback widget includes screenshot capability
 * for bug reports when users click "Take a screenshot" button
 */
export function openBugReport(additionalMetadata?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Gather debug information
    const debugInfo = {
      // Browser info
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      
      // Screen info
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio,
      
      // Page info
      url: window.location.href,
      referrer: document.referrer,
      title: document.title,
      
      // Time info
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      
      // Performance metrics (if available)
      ...(window.performance && {
        loadTime: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
        domReady: window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart,
      }),
      
      // Custom metadata passed in
      ...additionalMetadata
    }

    // Log debug info for development
    console.log("🐛 Bug report metadata:", debugInfo)
    
    // Open the feedback widget with bug board and metadata
    window.postMessage({
      target: 'FeaturebaseWidget',
      data: { 
        action: 'openFeedbackWidget',
        setBoard: 'bugs',
        metadata: debugInfo
      }
    }, '*')
  }
}

/**
 * React hook to add bug report keyboard shortcut
 * Press Ctrl/Cmd + Shift + B to open bug report
 */
export function useBugReportShortcut() {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + B
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'B') {
        e.preventDefault()
        console.log("🐛 Bug report shortcut triggered")
        openBugReport({ 
          triggeredBy: 'keyboard-shortcut',
          keyCombo: 'Ctrl/Cmd+Shift+B'
        })
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])
}

/**
 * Bug Report Button Component
 * Styled button that opens the bug report with enhanced metadata
 */
export function BugReportButton({ className = "" }: { className?: string }) {
  return (
    <button
      onClick={() => openBugReport({ triggeredBy: 'button-click' })}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors ${className}`}
      title="Report a bug (Ctrl+Shift+B)"
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      Report Bug
    </button>
  )
}

/**
 * Instructions for Featurebase bug report setup:
 * 
 * 1. In Featurebase Dashboard:
 *    - Create a board called "bugs" or "bug-reports"
 *    - Enable screenshot feature in board settings
 *    - Set up custom fields for metadata (optional)
 * 
 * 2. The feedback widget will automatically:
 *    - Show "Take a screenshot" button for bug reports
 *    - Allow users to annotate screenshots
 *    - Capture the metadata we send
 * 
 * 3. For better bug tracking, consider:
 *    - Setting up email notifications for new bug reports
 *    - Creating custom fields for severity, browser, etc.
 *    - Using webhooks to integrate with your issue tracker
 */