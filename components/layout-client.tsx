"use client"

import { useState, createContext, useContext } from "react"
import { Header } from "./header"
import { EmailPopup } from "./email-popup"
import { DemoEmailModal } from "./demo-email-modal"
import type { DarkLightImageFragment, HeaderFragment } from "@/lib/basehub/fragments"

// Create context for demo modal and popup states
export const DemoModalContext = createContext<{
  openDemoModal: () => void
  isAnyPopupOpen?: boolean
}>({
  openDemoModal: () => {},
  isAnyPopupOpen: false
})

export const useDemoModal = () => useContext(DemoModalContext)

export function ClientLayout({ 
  children,
  logo,
  header
}: { 
  children: React.ReactNode
  logo: DarkLightImageFragment
  header: HeaderFragment
}) {
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false)
  const [isDemoPopupOpen, setIsDemoPopupOpen] = useState(false)

  const openDemoModal = () => setIsDemoPopupOpen(true)
  const isAnyPopupOpen = isEmailPopupOpen || isDemoPopupOpen

  return (
    <DemoModalContext.Provider value={{ openDemoModal, isAnyPopupOpen }}>
      <EmailPopup 
        isOpen={isEmailPopupOpen} 
        onClose={() => setIsEmailPopupOpen(false)} 
      />
      <DemoEmailModal
        isOpen={isDemoPopupOpen}
        onClose={() => setIsDemoPopupOpen(false)}
      />
      <Header 
        logo={logo} 
        header={header} 
        onCtaClick={() => setIsEmailPopupOpen(true)}
      />
      {children}
    </DemoModalContext.Provider>
  )
}