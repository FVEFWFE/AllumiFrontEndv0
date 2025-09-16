"use client"

import { useState } from "react"
import { Header } from "./header"
import { EmailPopup } from "./email-popup"
import TargetCursor from "./TargetCursor"
import type { DarkLightImageFragment, HeaderFragment } from "@/lib/basehub/fragments"

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

  return (
    <>
      <TargetCursor targetSelector=".cursor-target" spinDuration={2} hideDefaultCursor={true} />
      <EmailPopup 
        isOpen={isEmailPopupOpen} 
        onClose={() => setIsEmailPopupOpen(false)} 
      />
      <Header 
        logo={logo} 
        header={header} 
        onCtaClick={() => setIsEmailPopupOpen(true)}
      />
      {children}
    </>
  )
}