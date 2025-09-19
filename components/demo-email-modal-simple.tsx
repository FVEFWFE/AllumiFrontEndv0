"use client"

import type React from "react"
import { useState } from "react"
import { Play, Check, Mail, User, Link } from "lucide-react"
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
import { motion } from "framer-motion"
import { processDemoCapture, formatSkoolUrl, validateSkoolUrl } from "@/lib/demo-capture"
import Image from "next/image"

interface DemoEmailModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DemoEmailModalSimple({ isOpen, onClose }: DemoEmailModalProps) {
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [skoolUrl, setSkoolUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showUrlHelp, setShowUrlHelp] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !firstName || !skoolUrl) return

    setIsSubmitting(true)

    try {
      const result = await processDemoCapture({
        email,
        firstName,
        skoolUrl,
        source: 'demo',
        captureType: 'email_and_url'
      });

      if (result.success) {
        setIsSubmitted(true)
        setTimeout(() => {
          window.location.href = '/attribution-demo'
        }, 2000)
      }
    } catch (error) {
      console.error("Error submitting demo request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const skoolValidation = skoolUrl ? validateSkoolUrl(skoolUrl) : { isValid: false }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">See Allumi in Action</DialogTitle>
          <DialogDescription className="text-base">
            Get personalized insights for YOUR Skool community
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Benefits - Compact */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                What You'll See:
              </p>
              <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <Check className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                  Revenue by source for communities like yours
                </li>
                <li className="flex items-start">
                  <Check className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                  Which content converts to paid members
                </li>
                <li className="flex items-start">
                  <Check className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                  Real data from your exact niche
                </li>
              </ul>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <Label htmlFor="firstName" className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="demo-email" className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="demo-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Skool Profile URL */}
              <div>
                <Label htmlFor="skoolUrl" className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                  Skool Profile URL
                  {/* Question mark with instant hover */}
                  <div className="relative group">
                    <svg
                      className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {/* Hover tooltip with image - no delay */}
                    <div className="absolute left-0 top-6 z-50 hidden group-hover:block w-80 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
                      <p className="text-xs font-semibold mb-2">Where to find your Skool profile URL:</p>
                      <Image
                        src="/profileurl.png"
                        alt="Where to find your Skool profile URL"
                        width={300}
                        height={150}
                        className="w-full h-auto rounded border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </Label>
                <div className="relative">
                  <Link className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="skoolUrl"
                    type="text"
                    placeholder="skool.com/@your-profile"
                    value={skoolUrl}
                    onChange={(e) => setSkoolUrl(e.target.value)}
                    onBlur={(e) => setSkoolUrl(formatSkoolUrl(e.target.value))}
                    required
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Help link - always visible */}
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <a
                    href="https://www.skool.com/settings?t=profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
                  >
                    Click here to grab your Skool profile URL
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                {/* Visual guide */}
                {showUrlHelp && (
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Image
                      src="/profileurl.png"
                      alt="Where to find your Skool profile URL"
                      width={350}
                      height={175}
                      className="w-full h-auto rounded border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                )}

                {skoolUrl && !skoolValidation.isValid && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    {skoolValidation.error || 'Please enter your profile URL (e.g., skool.com/@username)'}
                  </p>
                )}
                {skoolValidation.isValid && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ Perfect! We'll show data from communities like yours
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting || !email || !firstName || !skoolUrl || !skoolValidation.isValid}
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
            <p className="text-gray-600 dark:text-gray-400">
              Welcome <strong>{firstName}</strong>! Preparing your personalized insights...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}