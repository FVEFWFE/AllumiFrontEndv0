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
        const isMobile = window.innerWidth < 768; // Check if mobile (tailwind md: breakpoint)
        
        // Initialize Feedback Widget (desktop only)
        if (!isMobile) {
          try {
            const feedbackConfig = {
              organization: "allumi",
              theme: isDark ? "dark" : "light",
              placement: "right", // Shows floating feedback button on the right
              defaultBoard: "feedback",
              locale: "en",
            };
            
            window.Featurebase("initialize_feedback_widget", feedbackConfig);
            console.log("✅ Featurebase feedback widget initialized (desktop only)");
          } catch (error) {
            console.error("❌ Error initializing feedback widget:", error);
          }
        } else {
          console.log("📱 Skipping feedback widget on mobile");
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
        const isMobile = window.innerWidth < 768;
        
        // Update Feedback Widget theme (desktop only)
        if (!isMobile) {
          window.Featurebase("initialize_feedback_widget", {
            organization: "allumi",
            theme: isDark ? "dark" : "light",
            placement: "right",
            defaultBoard: "feedback",
            locale: "en",
          });
        }
        
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
        
        // Add CSS to hide feedback widget when messenger is open and ensure proper z-index
        const style = document.createElement('style');
        style.textContent = `
          /* Hide feedback widget when messenger iframe is present */
          body:has(iframe#featurebase-messenger-iframe) .fb-feedback-widget-feedback-button-container,
          body:has(iframe[src*="featurebase"][src*="messenger"]) .fb-feedback-widget-feedback-button-container {
            display: none !important;
          }

          /* Ensure feedback widget is always on top with full opacity */
          .fb-feedback-widget-feedback-button-container {
            z-index: 999999 !important;
            opacity: 1 !important;
          }

          /* Ensure messenger iframe is also properly visible */
          iframe[src*="featurebase"] {
            z-index: 999998 !important;
            opacity: 1 !important;
          }
        `;
        document.head.appendChild(style);
        
        // Also use MutationObserver as fallback for browsers that don't support :has()
        const messengerObserver = new MutationObserver(() => {
          const messengerIframe = document.querySelector('iframe#featurebase-messenger-iframe, iframe[src*="featurebase"][src*="messenger"]');
          const feedbackWidget = document.querySelector('.fb-feedback-widget-feedback-button-container') as HTMLElement;
          
          if (feedbackWidget) {
            if (messengerIframe) {
              feedbackWidget.style.display = 'none';
            } else {
              feedbackWidget.style.display = '';
            }
          }
        });
        
        messengerObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        // Clean up observer on unmount
        (window as any).__featurebaseMessengerObserver = messengerObserver;
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
    
    // Handle window resize to show/hide widget based on screen size
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && window.Featurebase) {
        // Hide feedback widget on mobile
        window.postMessage({
          target: 'FeaturebaseWidget',
          data: { 
            action: 'closeFeedbackWidget'
          }
        }, '*');
      } else if (!isMobile) {
        // Reinitialize on desktop
        initializeWidget();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
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
          
          // Alternative method: try to click Featurebase's close button specifically
          // Only target close buttons within Featurebase widget frames
          const featurebaseFrames = document.querySelectorAll('iframe[src*="featurebase"], iframe[title*="Featurebase"]');
          featurebaseFrames.forEach(frame => {
            try {
              const closeButton = frame.contentDocument?.querySelector('[aria-label="Close"]') as HTMLElement;
              if (closeButton) {
                closeButton.click();
              }
            } catch (e) {
              // Cross-origin frame, can't access
            }
          });
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
      window.removeEventListener('resize', handleResize);
      // Disconnect messenger observer if it exists
      if ((window as any).__featurebaseMessengerObserver) {
        (window as any).__featurebaseMessengerObserver.disconnect();
      }
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