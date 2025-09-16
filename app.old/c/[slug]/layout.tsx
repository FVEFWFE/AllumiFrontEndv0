import CommunityLayoutClient from './layout-client';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function CommunityLayout({
  children,
  params,
}: LayoutProps) {
  const { slug } = await params;
  
  return <CommunityLayoutClient slug={slug}>{children}</CommunityLayoutClient>;
}