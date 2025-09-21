import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import BioPageClient from './BioPageClient';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: bioPage } = await supabase
    .from('bio_pages')
    .select('title, bio')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!bioPage) {
    return {
      title: 'Page Not Found - Allumi',
      description: 'The requested bio page could not be found.'
    };
  }

  return {
    title: `${bioPage.title || params.slug} - Allumi Bio`,
    description: bioPage.bio || `Check out ${bioPage.title || params.slug}'s links on Allumi`,
    openGraph: {
      title: bioPage.title || params.slug,
      description: bioPage.bio || `Check out ${bioPage.title || params.slug}'s links`,
      type: 'website',
      url: `https://allumi.to/bio/${params.slug}`
    },
    twitter: {
      card: 'summary',
      title: bioPage.title || params.slug,
      description: bioPage.bio || `Check out ${bioPage.title || params.slug}'s links`
    }
  };
}

export default async function BioPage({ params }: PageProps) {
  // Fetch bio page data
  const { data: bioPage, error: pageError } = await supabase
    .from('bio_pages')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!bioPage || pageError) {
    notFound();
  }

  // Fetch bio links
  const { data: bioLinks } = await supabase
    .from('bio_links')
    .select('*')
    .eq('page_id', bioPage.id)
    .eq('is_active', true)
    .order('position');

  return (
    <BioPageClient
      bioPage={bioPage}
      bioLinks={bioLinks || []}
    />
  );
}