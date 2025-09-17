"use client"

import { useEffect } from "react"
import Script from "next/script"

declare global {
  interface Window {
    Featurebase: any
  }
}

export function FeaturebaseWidget() {
  useEffect(() => {
    // Initialize the widgets after SDK loads
    const initializeWidget = () => {
      if (typeof window !== 'undefined' && window.Featurebase) {
        const isDark = document.documentElement.classList.contains('dark');
        
        // Initialize Feedback Widget
        try {
          const feedbackConfig = {
            organization: "allumi",
            theme: isDark ? "dark" : "light",
            placement: "right", // Shows floating feedback button on the right
            defaultBoard: "feedback",
            locale: "en",
          };
          
          window.Featurebase("initialize_feedback_widget", feedbackConfig);
          console.log("✅ Featurebase feedback widget initialized");
        } catch (error) {
          console.error("❌ Error initializing feedback widget:", error);
        }
        
        // Initialize Messenger Widget with correct appId
        try {
          const messengerConfig = {
            appId: "68c9a9ad20458b998ba07744", // Your Featurebase app ID
            theme: isDark ? "dark" : "light",
            language: "en",
            // hideDefaultLauncher: true // Uncomment if you want to hide the default launcher button
          };
          
          window.Featurebase("boot", messengerConfig);
          console.log("✅ Featurebase Messenger initialized with appId:", messengerConfig.appId);
        } catch (error) {
          console.error("❌ Error initializing Messenger:", error);
        }
      }
    };

    // Listen for theme changes to update widget themes
    const handleThemeChange = () => {
      if (typeof window !== 'undefined' && window.Featurebase) {
        const isDark = document.documentElement.classList.contains('dark');
        
        // Update Feedback Widget theme
        window.Featurebase("initialize_feedback_widget", {
          organization: "allumi",
          theme: isDark ? "dark" : "light",
          placement: "right",
          defaultBoard: "feedback",
          locale: "en",
        });
        
        // Update Messenger theme
        window.Featurebase('setTheme', isDark ? 'dark' : 'light');
      }
    };

    // Initialize on mount with multiple attempts
    let attempts = 0;
    const maxAttempts = 10;
    
    const tryInitialize = () => {
      attempts++;
      
      if (window.Featurebase && typeof window.Featurebase === 'function') {
        initializeWidget();
        handleThemeChange();
      } else if (attempts < maxAttempts) {
        setTimeout(tryInitialize, 500);
      } else {
        console.error("❌ Failed to initialize Featurebase after", maxAttempts, "attempts");
      }
    };
    
    // Start initialization attempts
    setTimeout(tryInitialize, 500);

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Add click outside functionality
    const handleClickOutside = (event: MouseEvent) => {
      // Check if Featurebase widget is open
      const featurebaseWidget = document.querySelector('[data-featurebase-widget]');
      const featurebaseIframe = document.querySelector('iframe[src*="featurebase"]');
      const featurebaseContainer = document.querySelector('.featurebase-widget-container');
      
      // Try multiple selectors as Featurebase might use different class names
      const widgetElements = [
        featurebaseWidget,
        featurebaseIframe,
        featurebaseContainer,
        document.querySelector('[class*="featurebase"]'),
        document.querySelector('[id*="featurebase"]')
      ].filter(Boolean);
      
      if (widgetElements.length > 0) {
        const clickedInsideWidget = widgetElements.some(element => 
          element && element.contains(event.target as Node)
        );
        
        // Also check if clicked on the feedback button itself
        const clickedFeedbackButton = (event.target as HTMLElement).hasAttribute('data-featurebase-feedback');
        
        if (!clickedInsideWidget && !clickedFeedbackButton) {
          console.log("🎯 Clicked outside Featurebase widget, closing...");
          
          // Send close message to Featurebase
          window.postMessage({
            target: 'FeaturebaseWidget',
            data: { 
              action: 'closeFeedbackWidget'
            }
          }, '*');
          
          // Alternative method: try to click any close button
          const closeButton = document.querySelector('[aria-label="Close"]') as HTMLElement;
          if (closeButton) {
            closeButton.click();
          }
        }
      }
    };
    
    // Add click listener with a delay to avoid conflicts with widget opening
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true);
      console.log("📍 Click outside listener added for Featurebase widget");
    }, 2000);
    
    // Add global debug helper
    (window as any).debugFeaturebase = () => {
      console.log("=== FEATUREBASE DEBUG INFO ===");
      console.log("window.Featurebase:", window.Featurebase);
      console.log("typeof window.Featurebase:", typeof window.Featurebase);
      console.log("window.Featurebase.q:", window.Featurebase?.q);
      console.log("All window properties with 'feature':");
      Object.keys(window).filter(key => key.toLowerCase().includes('feature')).forEach(key => {
        console.log(`  ${key}:`, (window as any)[key]);
      });
      console.log("SDK script in DOM:", document.getElementById('featurebase-sdk'));
      console.log("All scripts:", Array.from(document.scripts).map(s => s.src || s.id));
    };
    
    console.log("💡 Debug helper added. Type 'debugFeaturebase()' in console for more info");

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <>
      {/* Featurebase SDK */}
      <Script
        id="featurebase-sdk-inline"
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
  );
}

// Helper function to open the widget programmatically
export function openFeaturebaseWidget(boardName?: string) {
  if (typeof window !== 'undefined') {
    window.postMessage({
      target: 'FeaturebaseWidget',
      data: { 
        action: 'openFeedbackWidget',
        setBoard: boardName || 'feedback',
      }
    }, '*');
  }
}

// Helper function to open the messenger
export function openFeaturebaseMessenger(initialMessage?: string) {
  if (typeof window !== 'undefined' && window.Featurebase) {
    if (initialMessage) {
      window.Featurebase('showNewMessage', initialMessage);
    } else {
      window.Featurebase('show', 'messages');
    }
  }
}