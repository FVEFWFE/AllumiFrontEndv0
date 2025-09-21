'use client';

import { useEffect, useRef, useState } from 'react';

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
  const checkoutRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Whop script if not already loaded
    if (!document.querySelector('script[src*="whop.com/embed"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.whop.com/embed/v1.js';
      script.async = true;
      script.onload = () => initializeCheckout();
      document.head.appendChild(script);
    } else {
      initializeCheckout();
    }

    function initializeCheckout() {
      if (typeof window !== 'undefined' && window.Whop && checkoutRef.current) {
        try {
          // Clear any existing checkout
          checkoutRef.current.innerHTML = '';

          // Create checkout configuration
          const checkoutConfig = {
            planId: planId,
            checkoutTheme: 'dark', // Match site theme
            accentColor: 'blue',
            hidePrice: false,
            skipRedirect: true,
            checkoutOnComplete: (data: any) => {
              console.log('Checkout completed:', data);
              if (onComplete) {
                onComplete(data);
              }
            }
          };

          // Add email if provided
          if (email) {
            (checkoutConfig as any).prefillEmail = email;
          }

          // Add discount for beta users
          if (showBetaDiscount) {
            (checkoutConfig as any).discount = 'BETA10';
          }

          // Initialize embedded checkout
          window.Whop.checkout(checkoutConfig);
          setIsLoading(false);
        } catch (err) {
          console.error('Checkout initialization error:', err);
          setError('Failed to load checkout. Please refresh and try again.');
          setIsLoading(false);
        }
      }
    }

    // Retry initialization after a delay if Whop not ready
    const timer = setTimeout(() => {
      if (window.Whop) {
        initializeCheckout();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [planId, email, onComplete, showBetaDiscount]);

  return (
    <div className="whop-checkout-container">
      {isLoading && (
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div
        ref={checkoutRef}
        id="whop-checkout"
        className="w-full max-w-md mx-auto"
        style={{ minHeight: '500px', display: isLoading ? 'none' : 'block' }}
      />

      {showBetaDiscount && !isLoading && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200 font-semibold">
            🎉 Beta founder pricing applied!
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            You save $20/month forever (Regular price: $79/month)
          </p>
        </div>
      )}
    </div>
  );
}