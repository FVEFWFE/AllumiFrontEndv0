import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import BioPageClient from './BioPageClient';

// Reserved routes that should not be treated as bio pages
const RESERVED_ROUTES = [
  'dashboard',
  'sign-in',
  'sign-up',
  'auth',
  'api',
  'admin',
  'login',
  'logout',
  'register',
  'settings',
  'profile',
  'about',
  'contact',
  'privacy',
  'terms',
  'help',
  'support',
  'docs',
  'blog',
  'test-allumi',
  '_next',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  // Add any other routes that exist in your app
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Check if this is a reserved route
  if (RESERVED_ROUTES.includes(slug.toLowerCase())) {
    return {};
  }

  const { data: bioPage } = await supabase
    .from('bio_pages')
    .select('title, bio, slug')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!bioPage) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: `${bioPage.title} | Allumi`,
    description: bioPage.bio || `Check out ${bioPage.title}'s links`,
    openGraph: {
      title: bioPage.title,
      description: bioPage.bio || `Check out ${bioPage.title}'s links`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${bioPage.slug}`,
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: bioPage.title,
      description: bioPage.bio || `Check out ${bioPage.title}'s links`,
    },
  };
}

export default async function BioPage({ params }: PageProps) {
  const { slug } = await params;

  // Check if this is a reserved route - if so, return 404
  if (RESERVED_ROUTES.includes(slug.toLowerCase())) {
    notFound();
  }

  // Fetch bio page data
  const { data: bioPage, error } = await supabase
    .from('bio_pages')
    .select(`
      *,
      bio_links (
        *
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  // If page doesn't exist or is inactive, show 404
  if (error || !bioPage) {
    notFound();
  }

  // Sort links by position
  const sortedLinks = bioPage.bio_links
    ?.filter((link: any) => link.is_active)
    ?.sort((a: any, b: any) => a.position - b.position) || [];

  // Track page view (non-blocking)
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/bio/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'view',
      pageId: bioPage.id,
    }),
  }).catch(() => {}); // Ignore errors

  return (
    <BioPageClient
      bioPage={bioPage}
      links={sortedLinks}
    />
  );
}