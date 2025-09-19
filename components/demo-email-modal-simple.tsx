"use client"

import type React from "react"
import { useState } from "react"
import { Play, Check, HelpCircle, Mail, User, Link } from "lucide-react"
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
import { processDemoCapture, formatSkoolUrl } from "@/lib/demo-capture"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

  const isValidSkoolUrl = skoolUrl && formatSkoolUrl(skoolUrl).startsWith('skool.com/@')

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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="ml-auto"
                          onClick={(e) => {
                            e.preventDefault()
                            setShowUrlHelp(!showUrlHelp)
                          }}
                        >
                          <HelpCircle className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="space-y-2">
                          <p className="text-xs">Find your profile URL:</p>
                          <Image
                            src="/profileurl.png"
                            alt="Where to find Skool URL"
                            width={250}
                            height={125}
                            className="rounded border"
                          />
                          <a
                            href="https://www.skool.com/settings?t=profile"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-600 hover:underline block"
                          >
                            Open Skool Settings →
                          </a>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                {skoolUrl && !isValidSkoolUrl && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    Please enter your profile URL (e.g., skool.com/@username)
                  </p>
                )}
                {isValidSkoolUrl && (
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
                disabled={isSubmitting || !email || !firstName || !skoolUrl || !isValidSkoolUrl}
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