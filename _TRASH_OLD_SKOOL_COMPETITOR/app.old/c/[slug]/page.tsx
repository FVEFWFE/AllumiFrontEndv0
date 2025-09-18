import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CommunityPage({ params }: PageProps) {
  const { slug } = await params;
  // Redirect to the feed page by default
  redirect(`/c/${slug}/feed`);
}