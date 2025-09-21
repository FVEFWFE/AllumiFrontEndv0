'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import Image from 'next/image';
import WhopCheckout from './WhopCheckout';

interface GetStartedPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GetStartedPopup({ isOpen, onClose }: GetStartedPopupProps) {
  const [email, setEmail] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [checkoutKey, setCheckoutKey] = useState(0);

  // Check for saved email and reset state when popup opens/closes
  useEffect(() => {
    if (isOpen) {
      // Increment key to force WhopCheckout to remount
      setCheckoutKey(prev => prev + 1);

      // Check if user has previously entered email
      const savedEmail = sessionStorage.getItem('checkout_email');
      if (savedEmail) {
        setEmail(savedEmail);
        // Skip directly to checkout if they've already opted in
        setShowCheckout(true);
      }
    } else {
      // Don't clear email from storage, just reset local state
      setShowCheckout(false);
      setCheckoutComplete(false);
    }
  }, [isOpen]);

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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Only close if clicking the backdrop, not the modal content
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-black text-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-zinc-700"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-50 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-4 sm:p-6 md:p-8 pt-12 sm:pt-8">
          {!showCheckout && !checkoutComplete && (
            <>
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <Image
                  src="/allumi.png"
                  alt="Allumi"
                  width={140}
                  height={50}
                  priority
                  className="h-10 w-auto"
                />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-white">
                Start Your 14-Day Free Trial
              </h2>
              <p className="text-gray-300 mb-8 text-center">
                See exactly what drives paying members to your Skool community
              </p>

              {/* Beta pricing callout */}
              <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-xs sm:text-sm font-bold text-yellow-300 mb-1">
                  🔥 Use promo code "BETA" for lifetime $20/month off
                </p>
                <p className="text-xs sm:text-sm text-yellow-200/90">
                  Only for first 10 members - 7 spots left!
                </p>
              </div>

              <form
                onSubmit={handleEmailSubmit}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="mb-6">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    placeholder="Enter your email"
                    className="w-full px-4 py-4 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400 text-base"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-base"
                >
                  Get Instant Access
                </button>
              </form>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">No credit card required</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">Instant automatic installation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">Track unlimited traffic sources</span>
                </div>
              </div>
            </>
          )}

          {showCheckout && !checkoutComplete && (
            <>
              <div className="mb-4 sm:mb-6">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 mb-2"
                >
                  ← Back
                </button>
                {/* Logo for mobile */}
                <div className="flex justify-center mb-4 sm:hidden">
                  <Image
                    src="/allumi.png"
                    alt="Allumi"
                    width={120}
                    height={40}
                    priority
                    className="h-8 w-auto"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mt-2 text-white">
                  Complete Your Registration
                </h2>
                <p className="text-sm sm:text-base text-gray-300 mt-1 sm:mt-2">
                  Secure checkout powered by Whop
                </p>
              </div>

              <WhopCheckout
                key={checkoutKey}
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