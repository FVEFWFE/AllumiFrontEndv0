"use client"

import { useState, useEffect } from "react"
import { X, Sparkles, Gift, ArrowRight } from "lucide-react"
import Image from "next/image"
import { trackEvent, identifyUser } from "./posthog-provider"
import { motion, AnimatePresence } from "framer-motion"

interface EmailPopupEnhancedProps {
  isOpen: boolean
  onClose: () => void
  groupId?: string
  customTitle?: string
  customDescription?: string
  enableProgressiveCapture?: boolean
  actionType?: 'demo' | 'trial' | 'audit'
}

const MAILERLITE_API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMzAyNzNhZTg1MzI2MGU3ZjM2YmE5MGIzZDcxZWEwOTVhODUxN2RjMmJkYmQ0ZDIxNzA2NWJjOGZjZDg5M2UxNDg3ZTUyZDg0M2NiNTZmZGIiLCJpYXQiOjE3NTgwNDYxMTUuMDE5MTU4LCJuYmYiOjE3NTgwNDYxMTUuMDE5MTYyLCJleHAiOjQ5MTM3MTk3MTUuMDExNTc4LCJzdWIiOiIxNzUxMDI4Iiwic2NvcGVzIjpbXX0.is0ny9DWls5mcOz2DCoS7r43R5HZcDQfqOwYLKiPgcqCK9zOmuKI0k8v8cMXmop3zRcOxYlFkRtPLLGk3V-lxUWKJlEUn54rjECBAZ5228DmK6MNnyI61izBbnMHrIFk08S1UHM1FQVHTu4Br3XdzUGVikvLeJMfl7YNgSluQQyfzQZB_ziljC6tMy2fT6GueRISFKr7vf0qMl3Ddy2dN5LgglfaqAV0NRbMV3djLncEZ6IOvS98DTLW8ZNfpp74PJw4nd2fNpnF1aQ2G6wMJ_xzh0bmVqi43QNovIVM1pdyJwohOLpObW2d7xiz7FveYLkF75oAWkmpjVdb3hjX4VMCNbhvlOmCzJQFU96ksaiYmvV3NDfqpEPBo354CgT1kwXVGcEqNktG1BmrjLxa790mS6Eg3P7oPbsDOdoZ8jr-oK2oahpc4AVvi9BRBgT0DoSOB3STPzc6egqIrCQpayB5WUPyqO8H3hxYWrLc-5SqrdrT22HVdFyMTru1UoMl4xz6G2ZPiyO771ZJqBc3sQWqjXw-WDNbF1ioMs6Uo7PfPY7vQ8S8jMy3zXdIcbSxgTeftoqUnV1sKt5X1MXFB_VXMplEqjpdF81tsTXWsgiXd3-WakIZuqwqyQapp3FMB4erpy3RjKRUcdiOgBbCn9KwEWedXXylFZpaxhmBbmg"
const DEFAULT_GROUP_ID = "165723410007065963"

export function EmailPopupEnhanced({
  isOpen,
  onClose,
  groupId = DEFAULT_GROUP_ID,
  customTitle,
  customDescription,
  enableProgressiveCapture = true,
  actionType = 'trial'
}: EmailPopupEnhancedProps) {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [skoolUrl, setSkoolUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
  const [step, setStep] = useState<'email' | 'optional'>('email')
  const [showSkoolField, setShowSkoolField] = useState(false)
  const [enrichmentData, setEnrichmentData] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
      // Reset state when closed
      setStep('email')
      setShowSkoolField(false)
      setEnrichmentData(null)
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const formatSkoolUrl = (url: string) => {
    if (!url) return ''
    if (!url.includes('skool.com')) {
      return `skool.com/@${url.replace('@', '')}`
    }
    return url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // If progressive capture is enabled and we're on step 1
    if (enableProgressiveCapture && step === 'email' && email && firstName) {
      setStep('optional')
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      // First, send to MailerLite
      const mailerResponse = await fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          email: email,
          fields: {
            name: firstName,
            skool_url: skoolUrl || null
          },
          groups: [groupId]
        }),
      })

      // Then, capture in our system with enrichment
      if (skoolUrl || enableProgressiveCapture) {
        const captureResponse = await fetch('/api/demo/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            firstName,
            skoolUrl: skoolUrl || null,
            source: actionType,
            captureType: skoolUrl ? 'email_and_url' : 'email_only'
          })
        })

        if (captureResponse.ok) {
          const data = await captureResponse.json()
          if (data.enriched && data.data) {
            setEnrichmentData(data.data)
          }
        }
      }

      if (mailerResponse.ok) {
        // Track successful email capture
        trackEvent('email_captured_progressive', {
          source: 'popup',
          action_type: actionType,
          page: window.location.pathname,
          has_skool_url: !!skoolUrl,
          custom_title: customTitle,
          group_id: groupId
        });

        // Identify user
        identifyUser(email, {
          email,
          first_name: firstName,
          skool_url: skoolUrl || undefined
        });

        // Show personalized success message
        let successMessage = "Welcome to Allumi! "
        if (enrichmentData?.communityName) {
          successMessage += `We found ${enrichmentData.communityName} with ${enrichmentData.memberCount} members. `
        }
        successMessage += "Check your email for next steps."

        setMessage({ type: "success", text: successMessage })

        // Navigate based on action type
        setTimeout(() => {
          onClose()
          setMessage(null)

          if (actionType === 'demo') {
            window.location.href = '/attribution-demo'
          } else if (actionType === 'trial') {
            window.location.href = '/signup'
          }
        }, 3000)
      } else {
        const errorData = await mailerResponse.json()
        if (mailerResponse.status === 409) {
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

  const getTitle = () => {
    if (customTitle) return customTitle
    switch (actionType) {
      case 'demo': return "See Allumi in Action"
      case 'audit': return "Get Your Free Growth Audit"
      default: return "Start Your 14-Day Free Trial"
    }
  }

  const getDescription = () => {
    if (customDescription) return customDescription
    switch (actionType) {
      case 'demo': return "Watch how creators track $50k+ revenue sources"
      case 'audit': return "Discover hidden revenue opportunities in your community"
      default: return "See exactly what drives paying members to your Skool community"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-[95vw] sm:max-w-md bg-background border border-[--border] dark:border-[--dark-border] rounded-xl shadow-2xl"
      >
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
              {getTitle()}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {getDescription()}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {step === 'email' ? (
                <motion.div
                  key="email-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      required
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-[--border] dark:border-[--dark-border] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm sm:text-base"
                    />
                  </div>
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
                </motion.div>
              ) : (
                <motion.div
                  key="optional-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                      🎁 Optional: Add your Skool URL
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-500">
                      Get personalized insights for your specific niche
                    </p>
                  </div>

                  {!showSkoolField ? (
                    <button
                      type="button"
                      onClick={() => setShowSkoolField(true)}
                      className="w-full text-left"
                    >
                      <div className="border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-lg p-3 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Add Skool URL for personalization</span>
                          <Sparkles className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                    </button>
                  ) : (
                    <input
                      type="text"
                      value={skoolUrl}
                      onChange={(e) => setSkoolUrl(e.target.value)}
                      onBlur={(e) => setSkoolUrl(formatSkoolUrl(e.target.value))}
                      placeholder="skool.com/@your-profile (optional)"
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-[--border] dark:border-[--dark-border] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm sm:text-base"
                    />
                  )}

                  {enrichmentData && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3"
                    >
                      <p className="text-sm text-green-700 dark:text-green-400">
                        ✅ Found: {enrichmentData.communityName} ({enrichmentData.memberCount} members)
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                }`}
              >
                {message.text}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 sm:py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base flex items-center justify-center"
            >
              {isLoading ? (
                "Processing..."
              ) : step === 'email' && enableProgressiveCapture ? (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Get Instant Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>

            {step === 'optional' && (
              <button
                type="submit"
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip and continue →
              </button>
            )}
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
                <span>
                  {actionType === 'demo' ? '2-minute personalized demo' : 'Instant automatic installation'}
                </span>
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
      </motion.div>
    </div>
  )
}