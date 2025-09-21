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
import { FeaturebaseWidget } from "@/components/featurebase-widget"
import { PHProvider, PostHogPageview } from "@/components/posthog-provider"
import { ClientLayout } from "@/components/layout-client"
import { Toaster } from 'react-hot-toast'

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

// Disable Basehub in development if no valid token
const BASEHUB_ENABLED = process.env.BASEHUB_TOKEN && !process.env.BASEHUB_TOKEN.startsWith('bshb_pk_')

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
  let footer, settings, header;
  
  try {
    // Skip Basehub query if using public/demo token to avoid auth errors
    if (!BASEHUB_ENABLED) {
      throw new Error('Using fallback data - Basehub disabled for public token');
    }
    
    const [
      {
        site: { footer: f, settings: s, header: h },
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
    footer = f;
    settings = s;
    header = h;
  } catch (error) {
    // Fallback data when basehub is unavailable - this is expected with public token
    // Only log if not the expected fallback
    if (BASEHUB_ENABLED) {
      console.warn('Basehub unavailable, using fallback data');
    }
    settings = {
      theme: { 
        _id: 'default',
        accent: 'purple' as const,
        grayScale: 'gray' as const
      },
      logo: {
        dark: { url: '/allumi.png', alt: 'Allumi', width: 120, height: 40, aspectRatio: 3, blurDataURL: '' },
        light: { url: '/allumiblack.png', alt: 'Allumi', width: 120, height: 40, aspectRatio: 3, blurDataURL: '' },
      },
      showUseTemplate: false,
    };
    header = {
      navbar: { 
        items: [
          { _id: 'features', _title: 'Features', href: '#features', sublinks: { items: [] } },
          { _id: 'pricing', _title: 'Pricing', href: '#pricing-section', sublinks: { items: [] } },
          { _id: 'about', _title: 'About', href: '/about', sublinks: { items: [] } }
        ] 
      },
      rightCtas: { items: [{ _id: '1', label: 'Get Started Today', href: '#', type: 'primary' }] },
    };
    footer = { links: [], socials: [] };
  }

  let playgroundNotification = null

  subscribeEnv({
    name: "BASEHUB_TOKEN",
    label: "BaseHub Read Token",
    value: process.env.BASEHUB_TOKEN,
  })

  if (!isMainV0 && !allValid && process.env.NODE_ENV !== "production") {
    try {
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
    } catch (error) {
      console.error('Basehub playground error:', error);
      // Continue without playground notification
    }
  }

  return (
    <html suppressHydrationWarning lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script src="https://cdn.whop.com/embed/v1.js" async></script>
      </head>
      <body
        suppressHydrationWarning
        className={`min-h-svh overflow-x-hidden bg-background text-foreground ${geistMono.variable} ${geist.variable} font-sans`}
      >
        <PHProvider>
          <Providers theme={settings.theme}>
            <PostHogPageview />
            <FeaturebaseWidget />
            <ClientLayout logo={settings.logo} header={header} footer={footer}>
              <main>{children}</main>
            </ClientLayout>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                },
              }}
            />
          </Providers>
        </PHProvider>
      </body>
    </html>
  )
}

export const metadata = {
  title: "Allumi - Illuminate Your Empire",
  generator: "v0.dev",
}
