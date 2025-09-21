'use client';

import { useEffect, useState, useRef } from 'react';
import { trackError } from './posthog-provider';

declare global {
  interface Window {
    Whop: any;
  }
}

interface WhopCheckoutProps {
  planId?: string;
  email?: string;
  onComplete?: (data: any) => void;
  showBetaDiscount?: boolean;
}

export default function WhopCheckout({
  planId = 'plan_ufRzE7PHJgEXR',
  email,
  onComplete,
  showBetaDiscount = false
}: WhopCheckoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const initializationAttemptRef = useRef(0);

  useEffect(() => {
    let checkInterval: NodeJS.Timeout;
    let initTimeout: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 20;

    // Reset loading state when component mounts
    setIsLoading(true);

    // Increment initialization attempt counter to force fresh init
    initializationAttemptRef.current++;
    const currentAttempt = initializationAttemptRef.current;

    // Function to initialize Whop
    const initializeWhop = () => {
      if (!containerRef.current) {
        console.log('Container not ready yet...');
        return;
      }

      // Check if this is still the current attempt
      if (currentAttempt !== initializationAttemptRef.current) {
        clearInterval(checkInterval);
        return;
      }

      // Check if Whop loaded
      if (window.Whop && typeof window.Whop.init === 'function') {
        console.log('Whop SDK found, initializing...', { attempt: currentAttempt });

        // Force re-initialization by clearing ALL existing Whop elements
        const existingWhopElements = document.querySelectorAll('.whop-embed, iframe[src*="whop.com"], .whop-checkout-container iframe, iframe[title*="Whop"], iframe[id*="whop"]');
        console.log(`Clearing ${existingWhopElements.length} existing Whop elements`);
        existingWhopElements.forEach(el => {
          el.remove();
        });

        // Multiple initialization attempts with delays
        const tryInit = (retryCount = 0) => {
          if (currentAttempt !== initializationAttemptRef.current) return;

          console.log(`Calling Whop.init() - retry ${retryCount}`);

          // Force a fresh scan by temporarily hiding and showing the container
          if (containerRef.current) {
            const container = containerRef.current;

            // Call init multiple times to ensure it catches our element
            window.Whop.init();

            // If no iframe appears after a short delay, try again
            initTimeout = setTimeout(() => {
              const iframe = document.querySelector('iframe[src*="whop.com"]');
              if (!iframe && retryCount < 3 && currentAttempt === initializationAttemptRef.current) {
                console.log('No iframe found, retrying init...');
                tryInit(retryCount + 1);
              } else if (iframe) {
                console.log('✅ Whop iframe created successfully');
                setIsLoading(false);
              } else {
                console.log('⚠️ Failed to create iframe after retries');
                setIsLoading(false);
              }
            }, 500);
          }
        };

        // Start initialization
        tryInit();
        clearInterval(checkInterval);
      } else if (attempts < maxAttempts) {
        attempts++;
        // Only log every 5th attempt to reduce noise
        if (attempts % 5 === 0) {
          console.log(`Waiting for Whop SDK... attempt ${attempts}/${maxAttempts}`);
        }
      } else {
        // Only log error if we really failed and no iframe exists
        const iframe = document.querySelector('iframe[src*="whop.com"]');
        if (!iframe) {
          const error = new Error('Whop SDK failed to load after maximum attempts');
          console.error(error.message);
          trackError(error, {
            source: 'WhopCheckout',
            attempts,
            maxAttempts,
            level: 'error'
          });
        } else {
          console.log('Whop iframe exists despite timeout - initialization successful');
        }
        setIsLoading(false);
        clearInterval(checkInterval);
      }
    };

    // Load the script if not already loaded
    const existingScript = document.querySelector('script[src*="js.whop.com/static/checkout/loader.js"]');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://js.whop.com/static/checkout/loader.js';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('Whop script loaded');
        // Start checking for Whop availability
        checkInterval = setInterval(initializeWhop, 250);
      };

      script.onerror = () => {
        const error = new Error('Failed to load Whop script');
        console.error(error.message);
        trackError(error, {
          source: 'WhopCheckout',
          scriptSrc: script.src,
          level: 'error'
        });
        setIsLoading(false);
      };

      document.head.appendChild(script);
    } else {
      console.log('Whop script already exists, checking if SDK is ready...');

      // If window.Whop already exists, initialize immediately
      if (window.Whop && typeof window.Whop.init === 'function') {
        console.log('Whop SDK already loaded, initializing immediately');
        initializeWhop();
      } else {
        // Otherwise wait for it to become available
        console.log('Waiting for Whop SDK to become available...');
        checkInterval = setInterval(initializeWhop, 250);
      }
    }

    // Listen for checkout completion
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'whop_checkout_complete' && onComplete) {
        onComplete(event.data);
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup function
    return () => {
      window.removeEventListener('message', handleMessage);
      if (checkInterval) clearInterval(checkInterval);
      if (initTimeout) clearTimeout(initTimeout);

      // Clean up any Whop elements when component unmounts
      const whopElements = document.querySelectorAll('.whop-embed, iframe[src*="whop.com"], .whop-checkout-container iframe, iframe[title*="Whop"], iframe[id*="whop"]');
      whopElements.forEach(el => el.remove());

      // Mark that we're unmounting
      initializationAttemptRef.current++;
    };
  }, [onComplete]);

  return (
    <div className="whop-checkout-container">
      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">Loading checkout...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a few seconds</p>
        </div>
      )}

      {/* Whop checkout embed div */}
      <div
        key={`whop-checkout-${initializationAttemptRef.current}`}
        ref={containerRef}
        data-whop-checkout-plan-id={planId}
        data-whop-checkout-prefill-email={email}
        data-whop-checkout-discount-code={showBetaDiscount ? 'BETA' : undefined}
        data-whop-checkout-theme="dark"
        data-whop-checkout-button-text="Start Free Trial"
        className="min-h-[600px]"
        style={{ display: isLoading ? 'none' : 'block' }}
      />

      {showBetaDiscount && !isLoading && (
        <div className="mt-4 p-4 bg-green-900/20 border border-green-800 rounded-lg">
          <p className="text-sm text-green-200 font-semibold">
            🎉 Use promo code "BETA" for lifetime $20/month off
          </p>
          <p className="text-sm text-green-300">
            (only for first 10 members)
          </p>
        </div>
      )}
    </div>
  );
}