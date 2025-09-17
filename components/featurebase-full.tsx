"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

declare global {
  interface Window {
    Featurebase: any
  }
}

interface FeaturebaseUser {
  email?: string
  name?: string
  userId?: string
  profilePicture?: string
  customFields?: Record<string, any>
}

interface FeaturebaseFullProps {
  user?: FeaturebaseUser | null
  organizationId?: string
}

export function FeaturebaseFull({ user, organizationId = "allumi" }: FeaturebaseFullProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize Featurebase after SDK loads
    const initializeFeaturebase = () => {
      if (typeof window !== 'undefined' && window.Featurebase && !isInitialized) {
        const isDark = document.documentElement.classList.contains('dark')
        
        // 1. Initialize Messenger (always shown, but with different features for logged in/out)
        try {
          const messengerConfig: any = {
            appId: organizationId, // Organization ID
            theme: isDark ? "dark" : "light",
            language: "en",
          }
          
          // Add user data if logged in
          if (user) {
            messengerConfig.email = user.email
            messengerConfig.userId = user.userId
            messengerConfig.name = user.name
            // Add any custom fields
            if (user.customFields) {
              Object.assign(messengerConfig, user.customFields)
            }
          }
          
          window.Featurebase("boot", messengerConfig)
          console.log("✅ Featurebase Messenger initialized", user ? "with user" : "without user")
        } catch (error) {
          console.error("❌ Error initializing Messenger:", error)
        }
        
        // 2. Initialize Feedback Widget (only if user is logged in)
        if (user) {
          try {
            const feedbackConfig = {
              organization: organizationId,
              theme: isDark ? "dark" : "light",
              placement: "right", // Floating button on right
              defaultBoard: "feedback", // Default board - can be "feedback", "bug-reports", "feature-requests"
              locale: "en",
              email: user.email,
              userId: user.userId,
              // Optional: Add metadata for bug reports
              metadata: {
                userAgent: navigator.userAgent,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                url: window.location.href,
                timestamp: new Date().toISOString(),
                ...(user.customFields || {})
              }
            }
            
            window.Featurebase("initialize_feedback_widget", feedbackConfig, (err, callback) => {
              if (err) {
                console.error("❌ Feedback Widget error:", err)
              } else if (callback?.action === 'widgetReady') {
                console.log("✅ Featurebase Feedback Widget ready")
              } else if (callback?.action === 'feedbackSubmitted') {
                console.log("📝 Feedback submitted:", callback.post)
              }
            })
          } catch (error) {
            console.error("❌ Error initializing Feedback Widget:", error)
          }
        }
        
        // 3. Identify user for SDK authentication (if logged in)
        if (user) {
          try {
            window.Featurebase("identify", {
              organization: organizationId,
              email: user.email,
              name: user.name,
              userId: user.userId,
              profilePicture: user.profilePicture,
              customFields: user.customFields,
            }, (err: any) => {
              if (err) {
                console.error("❌ Featurebase identify error:", err)
              } else {
                console.log("✅ User identified in Featurebase")
              }
            })
          } catch (error) {
            console.error("❌ Error identifying user:", error)
          }
        }
        
        setIsInitialized(true)
      }
    }

    // Listen for theme changes
    const handleThemeChange = () => {
      if (typeof window !== 'undefined' && window.Featurebase && isInitialized) {
        const isDark = document.documentElement.classList.contains('dark')
        
        // Update Messenger theme
        window.Featurebase("boot", {
          appId: organizationId,
          theme: isDark ? "dark" : "light",
        })
        
        // Update Feedback Widget theme if user is logged in
        if (user) {
          window.Featurebase("initialize_feedback_widget", {
            organization: organizationId,
            theme: isDark ? "dark" : "light",
            placement: "right",
            defaultBoard: "feedback",
            locale: "en",
          })
        }
      }
    }

    // Try to initialize with retries
    let attempts = 0
    const maxAttempts = 10
    
    const tryInitialize = () => {
      attempts++
      
      if (window.Featurebase && typeof window.Featurebase === 'function') {
        initializeFeaturebase()
      } else if (attempts < maxAttempts) {
        setTimeout(tryInitialize, 500)
      } else {
        console.error("❌ Failed to initialize Featurebase after", maxAttempts, "attempts")
      }
    }
    
    // Start initialization
    setTimeout(tryInitialize, 500)

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
    
    // Click outside handler for feedback widget
    const handleClickOutside = (event: MouseEvent) => {
      const featurebaseElements = [
        document.querySelector('[data-featurebase-widget]'),
        document.querySelector('iframe[src*="featurebase"]'),
        document.querySelector('[class*="featurebase"]'),
        document.querySelector('[id*="featurebase"]')
      ].filter(Boolean)
      
      if (featurebaseElements.length > 0) {
        const clickedInsideWidget = featurebaseElements.some(element => 
          element && element.contains(event.target as Node)
        )
        
        const clickedFeedbackButton = (event.target as HTMLElement).hasAttribute('data-featurebase-feedback')
        
        if (!clickedInsideWidget && !clickedFeedbackButton) {
          window.postMessage({
            target: 'FeaturebaseWidget',
            data: { action: 'closeFeedbackWidget' }
          }, '*')
        }
      }
    }
    
    // Add click listener for closing feedback widget
    if (user) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside, true)
      }, 2000)
    }

    return () => {
      observer.disconnect()
      if (user) {
        document.removeEventListener('click', handleClickOutside, true)
      }
    }
  }, [user, organizationId, isInitialized])

  return (
    <>
      {/* Featurebase SDK */}
      <Script
        id="featurebase-sdk-full"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !(function(e,t){
              const a="featurebase-sdk";
              function n(){
                if(!t.getElementById(a)){
                  var e=t.createElement("script");
                  e.id=a;
                  e.src="https://do.featurebase.app/js/sdk.js";
                  e.onerror = function() {
                    console.error("❌ Failed to load Featurebase SDK");
                  };
                  t.getElementsByTagName("script")[0].parentNode.insertBefore(e,t.getElementsByTagName("script")[0]);
                }
              }
              if("function"!=typeof e.Featurebase){
                e.Featurebase=function(){
                  (e.Featurebase.q=e.Featurebase.q||[]).push(arguments);
                };
              }
              if("complete"===t.readyState||"interactive"===t.readyState){
                n();
              } else {
                t.addEventListener("DOMContentLoaded",n);
              }
            })(window,document);
          `,
        }}
      />
    </>
  )
}

// Helper function to open feedback widget programmatically (only for logged-in users)
export function openFeaturebaseFeedback(boardName?: string) {
  if (typeof window !== 'undefined') {
    window.postMessage({
      target: 'FeaturebaseWidget',
      data: { 
        action: 'openFeedbackWidget',
        setBoard: boardName || 'feedback',
      }
    }, '*')
  }
}

// Helper function to open messenger programmatically
export function openFeaturebaseMessenger() {
  if (typeof window !== 'undefined' && window.Featurebase) {
    window.Featurebase('show')
  }
}

// Helper function to hide messenger
export function hideFeaturebaseMessenger() {
  if (typeof window !== 'undefined' && window.Featurebase) {
    window.Featurebase('hide')
  }
}