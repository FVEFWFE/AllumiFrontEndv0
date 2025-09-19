"use client"

import { useState } from "react"

export default function TestPopup() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="p-10">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open Popup
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            console.log("Backdrop clicked", e.target, e.currentTarget)
            if (e.target === e.currentTarget) {
              setIsOpen(false)
            }
          }}
        >
          <div
            className="bg-white p-6 rounded-lg"
            onClick={(e) => {
              console.log("Modal clicked", e.target)
              e.stopPropagation()
            }}
          >
            <h2 className="text-xl mb-4">Test Popup</h2>
            <input
              type="email"
              placeholder="Click me"
              className="border p-2 w-full"
              onClick={(e) => {
                console.log("Input clicked", e.target)
                e.stopPropagation()
              }}
            />
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}