"use client"

import { useEffect } from "react"

export function AutoScroll() {
  useEffect(() => {
    // Check if there's a hash in the URL when the page loads
    const hash = window.location.hash
    
    if (hash) {
      // Small delay to ensure the page is fully loaded
      setTimeout(() => {
        if (hash === "#features") {
          const featuresSection = document.querySelector('[data-section="features"]')
          if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: "smooth" })
          }
        } else if (hash === "#pricing-section") {
          const pricingSection = document.getElementById("pricing-section")
          if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: "smooth" })
          }
        }
      }, 100)
    }
  }, [])

  return null
}