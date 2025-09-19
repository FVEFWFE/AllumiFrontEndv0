"use client"

import { useState, createContext, useContext } from "react"
import { usePathname } from "next/navigation"
import { Header } from "./header"
import { Footer } from "./footer"
import { EmailPopup } from "./email-popup"
import { DemoEmailModalSimple } from "./demo-email-modal-simple"
import { NewsletterMailerLite } from "@/app/_sections/newsletter/newsletter-mailerlite"
import type { DarkLightImageFragment, HeaderFragment } from "@/lib/basehub/fragments"

// Create context for demo modal and popup states
export const DemoModalContext = createContext<{
  openDemoModal: () => void
  openEmailPopup: () => void
  isAnyPopupOpen?: boolean
}>({
  openDemoModal: () => {},
  openEmailPopup: () => {},
  isAnyPopupOpen: false
})

export const useDemoModal = () => useContext(DemoModalContext)

export function ClientLayout({
  children,
  logo,
  header,
  footer
}: {
  children: React.ReactNode
  logo: DarkLightImageFragment
  header: HeaderFragment
  footer?: any
}) {
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false)
  const [isDemoPopupOpen, setIsDemoPopupOpen] = useState(false)
  const pathname = usePathname()

  const openDemoModal = () => setIsDemoPopupOpen(true)
  const openEmailPopup = () => setIsEmailPopupOpen(true)
  const isAnyPopupOpen = isEmailPopupOpen || isDemoPopupOpen

  // Don't show header, popups, or modals in dashboard pages
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <>
      <DemoModalContext.Provider value={{ openDemoModal, openEmailPopup, isAnyPopupOpen }}>
        {!isDashboard && (
          <>
            <Header
              logo={logo}
              header={header}
              onCtaClick={openEmailPopup}
            />
          </>
        )}
        {children}
        {!isDashboard && (
          <>
            <NewsletterMailerLite />
            {footer && <Footer footer={footer} logo={logo} />}
          </>
        )}
      </DemoModalContext.Provider>

      {/* Render popups outside of context provider to avoid nesting issues */}
      <EmailPopup
        isOpen={isEmailPopupOpen}
        onClose={() => setIsEmailPopupOpen(false)}
      />
      <DemoEmailModalSimple
        isOpen={isDemoPopupOpen}
        onClose={() => setIsDemoPopupOpen(false)}
      />
    </>
  )
}