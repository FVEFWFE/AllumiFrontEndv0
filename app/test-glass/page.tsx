"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const SimpleGlassOrb = dynamic(() => import("../../components/SimpleGlassOrb"), {
  ssr: false,
  loading: () => <div className="text-white">Loading Glass Effect...</div>
})

export default function TestGlassPage() {
  const [mounted, setMounted] = useState(false)
  const [showGlass, setShowGlass] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Glass Orb Effect Test Page</h1>
        
        <div className="mb-4 space-x-4">
          <button 
            onClick={() => setShowGlass(!showGlass)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {showGlass ? 'Hide' : 'Show'} Glass Effect
          </button>
        </div>

        <div className="relative bg-gray-900 rounded-lg p-8 h-[600px] overflow-hidden">
          <div className="text-white space-y-4">
            <p>This is a test page for the CSS glass orb effect.</p>
            <p>The glass orb should follow your mouse cursor.</p>
            <p>It appears as a glowing purple orb with glass-like effects.</p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-purple-600/20 p-4 rounded">
                <h3 className="font-bold mb-2">Test Area 1</h3>
                <p>Move your mouse here to test the glass effect.</p>
              </div>
              <div className="bg-blue-600/20 p-4 rounded">
                <h3 className="font-bold mb-2">Test Area 2</h3>
                <p>The lens should follow smoothly.</p>
              </div>
            </div>

            <div className="mt-8 p-4 border border-purple-500 rounded">
              <p>If you can see a purple glass lens following your cursor, the effect is working!</p>
            </div>
          </div>

          {/* Glass Orb Effect */}
          {mounted && showGlass && (
            <SimpleGlassOrb />
          )}
        </div>

        <div className="mt-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Debug Info:</h2>
          <ul className="space-y-2">
            <li>Mounted: {mounted ? '✅ Yes' : '❌ No'}</li>
            <li>Glass Enabled: {showGlass ? '✅ Yes' : '❌ No'}</li>
            <li>Component should render: {mounted && showGlass ? '✅ Yes' : '❌ No'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}