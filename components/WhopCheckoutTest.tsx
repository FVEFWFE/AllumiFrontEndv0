'use client';

import { useEffect, useState, useRef } from 'react';
import { trackError } from './posthog-provider';

declare global {
  interface Window {
    Whop: any;
  }
}

interface WhopCheckoutTestProps {
  email?: string;
  onComplete?: (data: any) => void;
  showBetaDiscount?: boolean;
}

export default function WhopCheckoutTest({
  email,
  onComplete,
  showBetaDiscount = false
}: WhopCheckoutTestProps) {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [useTestMode, setUseTestMode] = useState(false);

  // TEST MODE: Use a test product/plan that accepts test cards
  // You need to create a separate test product in Whop that uses Stripe test keys
  const TEST_PLAN_ID = 'plan_test_xxxxx'; // Replace with your test plan ID
  const LIVE_PLAN_ID = 'plan_ufRzE7PHJgEXR';

  const planId = useTestMode ? TEST_PLAN_ID : LIVE_PLAN_ID;

  useEffect(() => {
    // Check if we're in development
    const isDevelopment = window.location.hostname === 'localhost' ||
                         window.location.hostname === '127.0.0.1';

    if (isDevelopment) {
      console.log('🧪 Development mode detected - Test cards available with test product');
    }

    let checkInterval: NodeJS.Timeout;
    setIsLoading(true);

    const initializeWhop = () => {
      if (!containerRef.current) return;

      if (window.Whop && typeof window.Whop.init === 'function') {
        console.log('Initializing Whop checkout...', {
          mode: useTestMode ? 'TEST' : 'LIVE',
          planId
        });

        // Clear existing elements
        const existingWhopElements = document.querySelectorAll('.whop-embed, iframe[src*="whop.com"]');
        existingWhopElements.forEach(el => el.remove());

        window.Whop.init();
        setIsLoading(false);
        clearInterval(checkInterval);
      }
    };

    // Load Whop script
    const existingScript = document.querySelector('script[src*="js.whop.com/static/checkout/loader.js"]');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://js.whop.com/static/checkout/loader.js';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        checkInterval = setInterval(initializeWhop, 250);
      };

      script.onerror = () => {
        console.error('Failed to load Whop script');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    } else {
      if (window.Whop && typeof window.Whop.init === 'function') {
        initializeWhop();
      } else {
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

    return () => {
      window.removeEventListener('message', handleMessage);
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [onComplete, useTestMode, planId]);

  return (
    <div className="whop-checkout-container">
      {/* Test Mode Toggle for Development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-yellow-200">Development Mode</h3>
            <button
              onClick={() => setUseTestMode(!useTestMode)}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                useTestMode
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-white'
              }`}
            >
              {useTestMode ? '🧪 TEST MODE' : '💳 LIVE MODE'}
            </button>
          </div>
          {useTestMode ? (
            <div className="text-xs text-yellow-300">
              <p>⚠️ TEST MODE: This requires a separate Whop product with Stripe test keys</p>
              <p>Test card: 4242 4242 4242 4242 (12/34, 123, 12345)</p>
            </div>
          ) : (
            <p className="text-xs text-gray-400">
              Using live checkout - real payments will be processed
            </p>
          )}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">Loading checkout...</p>
        </div>
      )}

      {/* Whop checkout embed */}
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
        </div>
      )}
    </div>
  );
}