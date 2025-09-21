'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import WhopCheckout from './WhopCheckout';

interface GetStartedPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GetStartedPopup({ isOpen, onClose }: GetStartedPopupProps) {
  const [email, setEmail] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Track email capture (optional - add your analytics here)
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('email_captured', {
        email,
        source: 'embedded_checkout_popup'
      });
    }

    // Save email to session for later use
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('checkout_email', email);
    }

    // Show embedded checkout
    setShowCheckout(true);
  };

  const handleCheckoutComplete = async (data: any) => {
    console.log('Checkout completed:', data);
    setCheckoutComplete(true);

    // Track conversion
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('trial_started', {
        email,
        plan_id: data.planId,
        checkout_session: data.checkoutSession
      });
    }

    // Store checkout data for onboarding
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkout_complete', 'true');
      localStorage.setItem('user_email', email);
    }

    // Redirect after success message
    setTimeout(() => {
      window.location.href = '/welcome';
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Only close if clicking the backdrop, not the modal content
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {!showCheckout && !checkoutComplete && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Start Your 14-Day Free Trial
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                See exactly what drives revenue in your Skool community
              </p>

              {/* Beta pricing callout */}
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm font-bold text-yellow-900 dark:text-yellow-200 mb-1">
                  🔥 Limited Beta Founder Pricing - Only 7 spots left!
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Lock in $59/month forever (regular price $79/month)
                </p>
              </div>

              <form
                onSubmit={handleEmailSubmit}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Continue to Secure Checkout →
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ✓ No credit card required for trial
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ✓ Cancel anytime, no questions asked
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ✓ 2-minute setup with Zapier
                </p>
              </div>
            </>
          )}

          {showCheckout && !checkoutComplete && (
            <>
              <div className="mb-6">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
                >
                  ← Back
                </button>
                <h2 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
                  Complete Your Registration
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Secure checkout powered by Whop
                </p>
              </div>

              <WhopCheckout
                planId="plan_ufRzE7PHJgEXR"
                email={email}
                onComplete={handleCheckoutComplete}
                showBetaDiscount={true}
              />
            </>
          )}

          {checkoutComplete && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                Welcome to Allumi!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                You've locked in beta founder pricing forever!
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Check your email for login instructions...
              </p>
              <div className="mt-6 animate-pulse">
                <div className="inline-flex items-center gap-2 text-primary">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redirecting to your dashboard...
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}