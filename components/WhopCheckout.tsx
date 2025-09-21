'use client';

import { useEffect, useState, useRef } from 'react';

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

  useEffect(() => {
    let checkInterval: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 20;

    // Function to initialize Whop
    const initializeWhop = () => {
      if (!containerRef.current) return;

      // Check if Whop loaded
      if (window.Whop && typeof window.Whop.init === 'function') {
        console.log('Initializing Whop checkout...');

        // Force re-initialization by clearing any existing Whop elements first
        const existingWhopElements = document.querySelectorAll('.whop-embed, iframe[src*="whop.com"]');
        existingWhopElements.forEach(el => el.remove());

        // Call init to scan for our data attributes
        window.Whop.init();
        setIsLoading(false);
        clearInterval(checkInterval);
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(`Waiting for Whop... attempt ${attempts}`);
      } else {
        console.error('Whop failed to load after maximum attempts');
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
        console.error('Failed to load Whop script');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    } else {
      console.log('Whop script already exists, attempting to reinitialize...');
      // Script already exists, start checking immediately
      checkInterval = setInterval(initializeWhop, 250);
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

      // Clean up any Whop elements when component unmounts
      const whopElements = containerRef.current?.querySelectorAll('.whop-embed, iframe');
      whopElements?.forEach(el => el.remove());
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