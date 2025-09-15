"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function WaitlistThankYouPage() {
  useEffect(() => {
    // Track conversion if you have analytics
    if (typeof window !== 'undefined') {
      // You can add analytics tracking here
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-2xl mx-auto text-center px-4 py-16">
        <div className="mb-8 flex justify-center">
          <CheckCircle className="h-20 w-20 text-emerald-500" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          You're on the list!
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          We'll notify you as soon as open beta starts.
        </p>
        
        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-3">What happens next:</h2>
          <ul className="text-left space-y-2 text-muted-foreground">
            <li>✓ You'll receive a confirmation email within 5 minutes</li>
            <li>✓ You'll be first to get access when open beta starts</li>
            <li>✓ Early beta users get lifetime pricing locked in</li>
            <li>✓ Save $600/year compared to Skool</li>
          </ul>
        </div>
        
        <div className="pt-8">
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}