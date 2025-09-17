"use client"

import Script from "next/script"

export function FeaturebaseWidgets() {
  return (
    <>
      {/* Featurebase Script - Simple Integration */}
      <Script
        src="https://do.featurebase.app/js/sdk.js"
        strategy="lazyOnload"
        id="featurebase-sdk"
        onLoad={() => {
          console.log("Featurebase SDK loaded");
          // Initialize the widget after script loads
          if (typeof window !== 'undefined' && (window as any).Featurebase) {
            (window as any).Featurebase("identify", {
              organization: "allumi"
            });
            console.log("Featurebase initialized with organization: allumi");
          }
        }}
      />
      
      {/* Alternative inline script initialization */}
      <Script
        id="featurebase-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.FeaturebaseSettings = {
              organization: "allumi"
            };
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