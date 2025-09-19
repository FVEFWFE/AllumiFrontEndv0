"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

interface PortalProps {
  children: React.ReactNode
  rootId?: string
}

export function Portal({ children, rootId = "portal-root" }: PortalProps) {
  const [mounted, setMounted] = useState(false)
  const portalRootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Check if portal root exists, if not create it
    let portalRoot = document.getElementById(rootId)

    if (!portalRoot) {
      portalRoot = document.createElement("div")
      portalRoot.setAttribute("id", rootId)
      document.body.appendChild(portalRoot)
    }

    portalRootRef.current = portalRoot
    setMounted(true)

    return () => {
      // Clean up portal root if it's empty
      if (portalRoot && portalRoot.childNodes.length === 0) {
        portalRoot.remove()
      }
    }
  }, [rootId])

  if (!mounted || !portalRootRef.current) {
    return null
  }

  return createPortal(children, portalRootRef.current)
}