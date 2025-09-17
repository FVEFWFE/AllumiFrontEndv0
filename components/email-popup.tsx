"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Image from "next/image"

interface EmailPopupProps {
  isOpen: boolean
  onClose: () => void
  groupId?: string
  customTitle?: string
  customDescription?: string
}

const MAILERLITE_API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMzAyNzNhZTg1MzI2MGU3ZjM2YmE5MGIzZDcxZWEwOTVhODUxN2RjMmJkYmQ0ZDIxNzA2NWJjOGZjZDg5M2UxNDg3ZTUyZDg0M2NiNTZmZGIiLCJpYXQiOjE3NTgwNDYxMTUuMDE5MTU4LCJuYmYiOjE3NTgwNDYxMTUuMDE5MTYyLCJleHAiOjQ5MTM3MTk3MTUuMDExNTc4LCJzdWIiOiIxNzUxMDI4Iiwic2NvcGVzIjpbXX0.is0ny9DWls5mcOz2DCoS7r43R5HZcDQfqOwYLKiPgcqCK9zOmuKI0k8v8cMXmop3zRcOxYlFkRtPLLGk3V-lxUWKJlEUn54rjECBAZ5228DmK6MNnyI61izBbnMHrIFk08S1UHM1FQVHTu4Br3XdzUGVikvLeJMfl7YNgSluQQyfzQZB_ziljC6tMy2fT6GueRISFKr7vf0qMl3Ddy2dN5LgglfaqAV0NRbMV3djLncEZ6IOvS98DTLW8ZNfpp74PJw4nd2fNpnF1aQ2G6wMJ_xzh0bmVqi43QNovIVM1pdyJwohOLpObW2d7xiz7FveYLkF75oAWkmpjVdb3hjX4VMCNbhvlOmCzJQFU96ksaiYmvV3NDfqpEPBo354CgT1kwXVGcEqNktG1BmrjLxa790mS6Eg3P7oPbsDOdoZ8jr-oK2oahpc4AVvi9BRBgT0DoSOB3STPzc6egqIrCQpayB5WUPyqO8H3hxYWrLc-5SqrdrT22HVdFyMTru1UoMl4xz6G2ZPiyO771ZJqBc3sQWqjXw-WDNbF1ioMs6Uo7PfPY7vQ8S8jMy3zXdIcbSxgTeftoqUnV1sKt5X1MXFB_VXMplEqjpdF81tsTXWsgiXd3-WakIZuqwqyQapp3FMB4erpy3RjKRUcdiOgBbCn9KwEWedXXylFZpaxhmBbmg"
const DEFAULT_GROUP_ID = "165723410007065963"

export function EmailPopup({ 
  isOpen, 
  onClose, 
  groupId = DEFAULT_GROUP_ID,
  customTitle,
  customDescription
}: EmailPopupProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          email: email,
          groups: [groupId]
        }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Welcome to Allumi! Check your email for next steps." })
        setEmail("")
        setTimeout(() => {
          onClose()
          setMessage(null)
        }, 3000)
      } else {
        const errorData = await response.json()
        if (response.status === 409) {
          setMessage({ type: "error", text: "You're already subscribed! Check your email." })
        } else {
          setMessage({ type: "error", text: errorData.message || "Something went wrong. Please try again." })
        }
      }
    } catch (error) {
      setMessage({ type: "error", text: "Connection error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={(e) => {
        // Only close if clicking the backdrop (not the modal content)
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-[95vw] sm:max-w-md bg-background border border-[--border] dark:border-[--dark-border] rounded-xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image 
              src="/allumiblack.png" 
              alt="Allumi" 
              width={120} 
              height={40} 
              priority 
              className="h-8 w-auto dark:hidden" 
            />
            <Image 
              src="/allumi.png" 
              alt="Allumi" 
              width={120} 
              height={40} 
              priority 
              className="hidden h-8 w-auto dark:block" 
            />
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {customTitle || "Start Your 14-Day Free Trial"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {customDescription || "See exactly what drives paying members to your Skool community"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-[--border] dark:border-[--dark-border] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm sm:text-base"
              />
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.type === "success" 
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 sm:py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              {isLoading ? "Processing..." : "Get Instant Access"}
            </button>
          </form>

          {/* Features */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[--border] dark:border-[--dark-border]">
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Instant automatic installation</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Track unlimited traffic sources</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}