"use client"

import { useEffect } from "react"
import Script from "next/script"

export default function TestFeaturebasePage() {
  useEffect(() => {
    // Method 1: Direct window initialization
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.FeaturebaseWidget = window.FeaturebaseWidget || {};
      // @ts-ignore
      window.FeaturebaseWidget.organize = "allumi";
      
      console.log("Featurebase configured with organize:", window.FeaturebaseWidget?.organize);
    }
  }, [])

  // Method 2: Script-based initialization
  const handleScriptLoad = () => {
    console.log("Featurebase script loaded");
    // @ts-ignore
    if (window.FeaturebaseWidget) {
      console.log("FeaturebaseWidget available:", window.FeaturebaseWidget);
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Featurebase Widget Test Page</h1>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Testing Different Integration Methods</h2>
          
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Method 1: Data Attributes (Changelog)</h3>
            <button 
              data-featurebase-changelog
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Open Changelog (data-featurebase-changelog)
            </button>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Method 2: Data Attributes (Feedback Board)</h3>
            <button 
              data-featurebase-feedback-board
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Open Feedback Board (data-featurebase-feedback-board)
            </button>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Method 3: PostMessage API (WORKING METHOD)</h3>
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.postMessage({
                    target: 'FeaturebaseWidget',
                    data: { 
                      action: 'openFeedbackWidget',
                      setBoard: 'feedback',
                    }
                  }, '*')
                  console.log("Opened feedback via PostMessage API");
                }
              }}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mr-4"
            >
              Open Feedback (PostMessage)
            </button>
            
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.postMessage({
                    target: 'FeaturebaseWidget',
                    data: { 
                      action: 'openFeedbackWidget',
                      setBoard: 'feature-requests',
                    }
                  }, '*')
                  console.log("Opened feature requests via PostMessage API");
                }
              }}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Open Feature Requests (PostMessage)
            </button>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Method 4: Direct Widget Trigger</h3>
            <button 
              onClick={() => {
                // @ts-ignore
                if (window.FeaturebaseWidget && window.FeaturebaseWidget.open) {
                  // @ts-ignore
                  window.FeaturebaseWidget.open("changelog");
                } else {
                  console.error("FeaturebaseWidget.open not available");
                }
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 mr-4"
            >
              Widget Open Changelog
            </button>
            
            <button 
              onClick={() => {
                // @ts-ignore
                if (window.FeaturebaseWidget && window.FeaturebaseWidget.open) {
                  // @ts-ignore
                  window.FeaturebaseWidget.open("feedback");
                } else {
                  console.error("FeaturebaseWidget.open not available");
                }
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Widget Open Feedback
            </button>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Method 5: Class-based Triggers</h3>
            <button 
              className="featurebase-changelog px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 mr-4"
            >
              Changelog (class="featurebase-changelog")
            </button>
            
            <button 
              className="featurebase-feedback px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              Feedback (class="featurebase-feedback")
            </button>
          </div>

          <div className="border rounded-lg p-4 space-y-4 bg-yellow-50 dark:bg-yellow-900/20">
            <h3 className="font-semibold">Console Output</h3>
            <p className="text-sm">Check the browser console for debugging information</p>
            <button 
              onClick={() => {
                console.log("=== Featurebase Debug Info ===");
                // @ts-ignore
                console.log("window.Featurebase:", window.Featurebase);
                // @ts-ignore
                console.log("window.FeaturebaseWidget:", window.FeaturebaseWidget);
                // @ts-ignore
                console.log("window.FeaturebaseWidgetAPI:", window.FeaturebaseWidgetAPI);
                console.log("All window properties with 'feature':");
                Object.keys(window).filter(key => key.toLowerCase().includes('feature')).forEach(key => {
                  console.log(`  ${key}:`, window[key]);
                });
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Log Featurebase Status
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">Setup Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>This page tests multiple ways to trigger Featurebase widgets</li>
            <li>The script should load automatically via the layout</li>
            <li>Check the console for any errors or debug output</li>
            <li>Try each button to see which method works</li>
            <li>The working method can then be applied to the footer</li>
          </ol>
        </div>
      </div>

      {/* Alternative script loading method */}
      <Script
        src="https://do.featurebase.app/js/sdk.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        id="featurebase-sdk"
      />
      
      {/* Initialize after script loads */}
      <Script
        id="featurebase-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.FeaturebaseWidget = window.FeaturebaseWidget || {};
            window.FeaturebaseWidget.organize = "allumi";
            console.log("Featurebase initialized via inline script");
          `
        }}
      />
    </div>
  )
}