import type React from "react"
import "../basehub.config"
import "../styles/globals.css"
import { Geist, Geist_Mono } from "next/font/google"
import { basehub } from "basehub"
import { Toolbar } from "basehub/next-toolbar"
import { Providers } from "./providers"
import { footerFragment, headerFragment } from "../lib/basehub/fragments"
import { NewsletterMailerLite } from "./_sections/newsletter/newsletter-mailerlite"
import { themeFragment } from "../context/basehub-theme-provider"
import { PlaygroundSetupModal } from "../components/playground-notification"
import { Footer } from "@/components/footer"
import { FeaturebaseWidgets } from "@/components/featurebase-widgets"
import { PHProvider, PostHogPageview } from "@/components/posthog-provider"
import { ClientLayout } from "@/components/layout-client"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  fallback: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Fira Sans",
    "Droid Sans",
    "Helvetica Neue",
    "sans-serif",
  ],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  fallback: ["monaco", "monospace"],
})

export const dynamic = "force-static"
export const revalidate = 30

const envs: Record<string, { isValid: boolean; name: string; label: string }> = {}
const _vercel_url_env_name = "VERCEL_URL"
const isMainV0 = process.env[_vercel_url_env_name]?.startsWith("preview-marketing-website-kzmm0bsl7yb9no8k62xm")

let allValid = true
const subscribeEnv = ({
  name,
  label,
  value,
}: {
  name: string
  label: string
  value: string | undefined
}) => {
  const isValid = !!value
  if (!isValid) {
    allValid = false
  }
  envs[name] = {
    isValid,
    name,
    label,
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [
    {
      site: { footer, settings, header },
    },
  ] = await Promise.all([
    basehub().query({
      site: {
        settings: {
          theme: themeFragment,
          logo: {
            dark: {
              url: true,
              alt: true,
              width: true,
              height: true,
              aspectRatio: true,
              blurDataURL: true,
            },
            light: {
              url: true,
              alt: true,
              width: true,
              height: true,
              aspectRatio: true,
              blurDataURL: true,
            },
          },
          showUseTemplate: true,
        },
        header: headerFragment,
        footer: footerFragment,
      },
    }),
  ])

  let playgroundNotification = null

  subscribeEnv({
    name: "BASEHUB_TOKEN",
    label: "BaseHub Read Token",
    value: process.env.BASEHUB_TOKEN,
  })

  if (!isMainV0 && !allValid && process.env.NODE_ENV !== "production") {
    const playgroundData = await basehub().query({
      _sys: {
        playgroundInfo: {
          expiresAt: true,
          editUrl: true,
          claimUrl: true,
        },
      },
    })

    if (playgroundData._sys.playgroundInfo) {
      playgroundNotification = <PlaygroundSetupModal playgroundInfo={playgroundData._sys.playgroundInfo} envs={envs} />
    }
  }

  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`min-h-svh max-w-[100vw] bg-[--surface-primary] text-[--text-primary] dark:bg-[--dark-surface-primary] dark:text-[--dark-text-primary] ${geistMono.variable} ${geist.variable} font-sans`}
      >
        <PHProvider>
          <Providers theme={settings.theme}>
            <PostHogPageview />
            <FeaturebaseWidgets />
            <ClientLayout logo={settings.logo} header={header}>
              <main>{children}</main>
              <NewsletterMailerLite />
              {/* Footer */}
              <Footer footer={footer} logo={settings.logo} />
            </ClientLayout>
          </Providers>
        </PHProvider>
      </body>
    </html>
  )
}

export const metadata = {
  generator: "v0.dev",
}
