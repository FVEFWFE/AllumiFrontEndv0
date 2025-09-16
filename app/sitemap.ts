import { siteUrl } from "../lib/constants";
import { basehub } from "basehub";
import type { MetadataRoute } from "next";

export const revalidate = 1800; // 30 minutes - adjust as needed

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Temporarily return static sitemap to avoid basehub token error
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
