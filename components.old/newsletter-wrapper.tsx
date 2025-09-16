'use client';

import { usePathname } from 'next/navigation';
import { Newsletter } from '@/app/_sections/newsletter';

export function NewsletterWrapper({ newsletter }: { newsletter: any }) {
  const pathname = usePathname();
  
  // Don't show newsletter on waitlist thank you page
  if (pathname === '/waitlist-thank-you') {
    return null;
  }
  
  return <Newsletter newsletter={newsletter} />;
}