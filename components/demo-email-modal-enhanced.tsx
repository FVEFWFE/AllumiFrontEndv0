"use client"

import type React from "react"
import { useState } from "react"
import { Play, Mail, User, Sparkles, ChevronRight, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { Portal } from "./portal"

interface DemoEmailModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DemoEmailModalEnhanced({ isOpen, onClose }: DemoEmailModalProps) {
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [skoolUrl, setSkoolUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSkoolOption, setShowSkoolOption] = useState(false)
  const [enrichmentData, setEnrichmentData] = useState<any>(null)

  const formatSkoolUrl = (url: string) => {
    if (!url) return ''
    if (!url.includes('skool.com')) {
      return `skool.com/@${url.replace('@', '')}`
    }
    return url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !firstName) return

    setIsSubmitting(true)

    try {
      // Send to capture API with enrichment
      const captureResponse = await fetch('/api/demo/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          skoolUrl: skoolUrl || null,
          source: 'demo',
          captureType: skoolUrl ? 'email_and_url' : 'email_only'
        })
      })

      if (captureResponse.ok) {
        const data = await captureResponse.json()
        if (data.enriched && data.data) {
          setEnrichmentData(data.data)
        }
      }

      // Track event
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('demo_requested', {
          has_skool_url: !!skoolUrl,
          source: 'modal'
        })
      }

      setIsSubmitted(true)

      // Redirect to demo after 2 seconds
      setTimeout(() => {
        window.location.href = '/attribution-demo'
      }, 2000)
    } catch (error) {
      console.error("Error submitting demo request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkoolUrlAdd = () => {
    setShowSkoolOption(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">See Allumi in Action</DialogTitle>
          <DialogDescription className="text-lg">
            Quick 2-minute walkthrough of your attribution dashboard
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="space-y-6">
            <div className="space-y-4">
              {/* Demo Features */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <h3 className="font-semibold">Demo Includes:</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Live dashboard: track revenue by source</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>How to create tracked links in seconds</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Real data: which content brings paying vs free members</span>
                  </li>
                </ul>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      required
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="demo-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="demo-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      required
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Optional Skool URL - Progressive Disclosure */}
                <AnimatePresence>
                  {!showSkoolOption ? (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handleSkoolUrlAdd}
                      className="w-full text-left group"
                    >
                      <div className="border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                Want insights specific to YOUR niche?
                              </span>
                              <p className="text-xs text-purple-600 dark:text-purple-400">
                                Click to add your Skool URL (takes 10 seconds)
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                        <p className="text-xs font-medium text-purple-800 dark:text-purple-200 mb-1">
                          🎯 Why add your URL? We'll show you:
                        </p>
                        <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-0.5 ml-3">
                          <li>• Revenue data from YOUR exact niche</li>
                          <li>• What's working for similar communities</li>
                          <li>• Conversion rates you can expect</li>
                        </ul>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="skoolUrl">
                          Your Skool Profile URL
                        </Label>
                        <a
                          href="https://www.skool.com/settings?t=profile"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Find my URL
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                      <Input
                        id="skoolUrl"
                        type="text"
                        placeholder="skool.com/@your-profile"
                        value={skoolUrl}
                        onChange={(e) => setSkoolUrl(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        onBlur={(e) => setSkoolUrl(formatSkoolUrl(e.target.value))}
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-muted-foreground">
                        Go to{" "}
                        <a
                          href="https://www.skool.com/settings?t=profile"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:no-underline text-purple-600 dark:text-purple-400"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Skool settings → Profile
                        </a>
                        {" "}and copy the URL field
                      </p>
                      {skoolUrl && (
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                          ✨ Perfect! Demo will include data from communities like yours
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting || !email || !firstName}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isSubmitting ? (
                  "Loading Demo..."
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Watch Demo Now
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Maybe Later
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              No credit card required • Instant access
            </p>
          </form>
        ) : (
          <div className="text-center space-y-4 py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto"
            >
              <Check className="w-8 h-8 text-green-600 dark:text-green-300" />
            </motion.div>
            <h3 className="text-xl font-semibold">Perfect! Loading Your Demo...</h3>
            {enrichmentData?.communityName ? (
              <p className="text-gray-600 dark:text-gray-400">
                Found <strong>{enrichmentData.communityName}</strong> with {enrichmentData.memberCount} members!
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Welcome <strong>{firstName}</strong>! Preparing your personalized demo...
              </p>
            )}
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}