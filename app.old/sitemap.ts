import { siteUrl } from "../lib/constants";
import type { MetadataRoute } from "next";

export const revalidate = 1800; // 30 minutes

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Basic sitemap without BaseHub dependency
  // Add your actual pages here
  const routes = [
    '',
    '/pricing',
    '/features',
    '/blog',
    '/changelog',
    '/about',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
}