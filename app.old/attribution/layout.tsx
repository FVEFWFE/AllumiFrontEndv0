import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Attribution Tracking for Skool Communities | Allumi",
  description: "See exactly which content, ads, and posts drive revenue in your Skool community. Simple attribution tracking that costs 10x less than enterprise tools. 5-minute setup, no migration needed.",
  keywords: "Skool attribution, community analytics, member tracking, ROI tracking, Skool analytics, community attribution, conversion tracking",
  openGraph: {
    title: "See What Actually Drives Paying Members in Your Skool Community",
    description: "Attribution tracking built specifically for Skool. Track which content and ads drive revenue. 10x cheaper than Hyros. 5-minute setup.",
    type: "website",
    url: "https://allumi.io/attribution",
    images: [
      {
        url: "/og-attribution.png",
        width: 1200,
        height: 630,
        alt: "Allumi Attribution Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Attribution Tracking for Skool Communities",
    description: "Finally know what drives paying members. 10x cheaper than enterprise tools.",
    images: ["/og-attribution.png"],
  },
  alternates: {
    canonical: "https://allumi.io/attribution",
  },
}

export default function AttributionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}