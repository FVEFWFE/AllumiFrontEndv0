"use client"

import type React from "react"
import { useState } from "react"
import { Play, Mail } from "lucide-react"
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

interface DemoEmailModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DemoEmailModal({ isOpen, onClose }: DemoEmailModalProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    // Here you would normally send the email to your backend
    // For now, we'll just simulate the submission
    try {
      // TODO: Send email to your backend/email service
      console.log("Demo requested for email:", email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubmitted(true)
      setTimeout(() => {
        onClose()
        setIsSubmitted(false)
        setEmail("")
      }, 3000)
    } catch (error) {
      console.error("Error submitting demo request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Watch 2-Minute Demo</DialogTitle>
          <DialogDescription className="text-lg">
            See how Allumi reveals the attribution data that drives real growth
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <h3 className="font-semibold">What You'll See:</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Live dashboard walkthrough</li>
                  <li>• Which content actually converts to paid</li>
                  <li>• First-click attribution Skool can't show</li>
                  <li>• Real ROI by traffic source</li>
                  <li>• Member journey visualization</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-email">
                  Enter your email to receive the demo video
                </Label>
                <Input
                  id="demo-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  We'll send you the demo video instantly. No spam, unsubscribe anytime.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting || !email}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Demo Video
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Demo Video Sent!</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check your inbox at <strong>{email}</strong> for the demo video.
            </p>
            <p className="text-sm text-gray-500">
              This window will close automatically...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}