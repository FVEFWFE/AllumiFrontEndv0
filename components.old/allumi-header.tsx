'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { EmailCaptureModal } from './email-capture-modal';

export function AllumiHeader() {
  const [user, setUser] = useState<any>(null);
  const [emailCaptureOpen, setEmailCaptureOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    // If we're on waitlist page, redirect to homepage with hash
    if (pathname === '/waitlist' || pathname === '/waitlist-thank-you') {
      router.push('/#features');
      return;
    }
    const featuresSection = document.querySelector('[data-section="features"]');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    // If we're on waitlist page, redirect to homepage with hash
    if (pathname === '/waitlist' || pathname === '/waitlist-thank-you') {
      router.push('/#pricing');
      return;
    }
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Don't show header on certain pages
  const hideHeaderPages = ['/dashboard', '/c/', '/create-community'];
  const shouldHideHeader = hideHeaderPages.some(page => pathname.startsWith(page));
  
  if (shouldHideHeader) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-8">
          <img src="/allumi.png" alt="Allumi" className="h-10 w-auto brightness-0 invert" />
        </Link>

        {/* Nav Links - Only show when not logged in */}
        {!user && (
          <nav className="hidden md:flex items-center gap-6 flex-1">
            <button
              onClick={scrollToFeatures}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Features
            </button>
            <button
              onClick={scrollToPricing}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </button>
          </nav>
        )}

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <button
                onClick={() => setEmailCaptureOpen(true)}
                className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Start Free Trial
              </button>
            </>
          )}
        </div>
      </div>
      <EmailCaptureModal
        open={emailCaptureOpen}
        onOpenChange={setEmailCaptureOpen}
        title="Get Early Access to Open Beta"
        description="Open beta is about to start. Be first to get access!"
      />
    </header>
  );
}