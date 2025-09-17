"use client"

import type React from "react"

import { useState } from "react"
import { Play } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DemoModalProps {
  children: React.ReactNode
}

export function DemoModal({ children }: DemoModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] h-[90vh] sm:h-[80vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold">See What Skool Hides From You</DialogTitle>
          <DialogDescription className="text-base sm:text-lg">
            Watch how Allumi reveals the attribution data that Skool keeps secret
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 p-4 sm:p-6 pt-4">
          <div className="relative w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-dashed border-purple-200 dark:border-purple-700 flex flex-col items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto">
                <Play className="w-8 h-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">Demo Video Coming Soon</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
                This is where your 2-minute demo video will showcase Allumi's attribution dashboard and how it reveals
                member sources that Skool hides.
              </p>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                <p>• See exactly which posts drive paying members</p>
                <p>• Track ROI by campaign and content type</p>
                <p>• First-click attribution Skool can't provide</p>
                <p>• Real member journey visualization</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 pt-0 flex justify-center">
          <Button onClick={() => setIsOpen(false)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-8 text-sm sm:text-base">
            Start Free Trial - See This Live
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
