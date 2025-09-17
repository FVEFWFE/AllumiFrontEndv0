"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

declare global {
  interface Window {
    Featurebase: any
  }
}

export default function TestFeaturebasePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  useEffect(() => {
    // Initialize Featurebase when component mounts
    const initFeaturebase = () => {
      const win = window as any
      
      if (typeof win.Featurebase !== "function") {
        win.Featurebase = function () {
          (win.Featurebase.q = win.Featurebase.q || []).push(arguments)
        }
      }

      // Initialize feedback widget
      win.Featurebase("initialize_feedback_widget", {
        organization: "allumi",
        placement: "right",
        theme: "light",
      })

      setIsLoaded(true)
      console.log("Featurebase initialized")
    }

    // Check if Featurebase is already available
    if (window.Featurebase) {
      initFeaturebase()
    } else {
      // Wait for script to load
      const checkInterval = setInterval(() => {
        if (window.Featurebase) {
          clearInterval(checkInterval)
          initFeaturebase()
        }
      }, 100)

      return () => clearInterval(checkInterval)
    }
  }, [])

  const handleOpenFeedback = () => {
    console.log("Opening feedback widget...")
    if (window.Featurebase) {
      // Try different methods to open the widget
      window.Featurebase("open")
      
      // Also try posting a message
      window.postMessage({
        target: 'FeaturebaseWidget',
        data: { 
          action: 'openFeedbackWidget'
        }
      }, '*')
      
      setFeedbackOpen(true)
    } else {
      console.error("Featurebase not loaded yet")
    }
  }

  const handleOpenWithBoard = (board: string) => {
    console.log(`Opening feedback widget with board: ${board}`)
    if (window.Featurebase) {
      window.Featurebase("open", {
        board: board
      })
      
      // Also try posting a message
      window.postMessage({
        target: 'FeaturebaseWidget',
        data: { 
          action: 'openFeedbackWidget',
          setBoard: board
        }
      }, '*')
    }
  }

  return (
    <>
      <Script
        id="featurebase-sdk"
        strategy="afterInteractive"
        src="https://do.featurebase.app/js/sdk.js"
        onLoad={() => {
          console.log("Featurebase SDK loaded")
        }}
      />
      
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Featurebase Test Page</h1>
          
          <div className="space-y-4 mb-8">
            <div className="p-4 border rounded">
              <p className="mb-2">Status: {isLoaded ? '✅ Loaded' : '⏳ Loading...'}</p>
              <p>Feedback Widget Open: {feedbackOpen ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Buttons</h2>
            
            <button
              onClick={handleOpenFeedback}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Open Feedback Widget (General)
            </button>
            
            <button
              onClick={() => handleOpenWithBoard("feature-requests")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 ml-4"
            >
              Feature Request
            </button>
            
            <button
              onClick={() => handleOpenWithBoard("bug-reports")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 ml-4"
            >
              Bug Report
            </button>
            
            <button
              data-featurebase-feedback
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 ml-4"
            >
              Native Feedback Button (data-featurebase-feedback)
            </button>
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Alternative Integration Test</h2>
            <p className="text-sm text-muted-foreground">Testing with iframe embed:</p>
            
            <div className="border rounded p-4">
              <iframe 
                src="https://allumi.featurebase.app/embed/feedback"
                width="100%"
                height="600"
                frameBorder="0"
                className="rounded"
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Console Output</h3>
            <p className="text-sm text-muted-foreground">
              Open browser console to see debug messages
            </p>
          </div>
        </div>
      </div>
    </>
  )
}