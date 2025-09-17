"use client"

import Image from "next/image"
import Link from "next/link"
import LaserFlow from "../../components/LaserFlow"
import { useRef, useState, useEffect } from "react"
import { EmailPopup } from "@/components/email-popup"
import "./about.css"

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false)
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 })
  const [scrollOffset, setScrollOffset] = useState(0)

  useEffect(() => {
    setMounted(true)
    
    // Add global mouse move handler for the reveal effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY + window.scrollY })
    }
    
    const handleScroll = () => {
      setScrollOffset(window.scrollY)
    }
    
    const handleMouseLeave = () => {
      setMousePos({ x: -9999, y: -9999 })
    }
    
    // Add event listeners to window for global effect
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <EmailPopup 
        isOpen={isEmailPopupOpen} 
        onClose={() => setIsEmailPopupOpen(false)}
      />
      
      <div className="min-h-screen bg-background pb-16 relative">
        {/* Scrolling background with hover reveal effect */}
        {mounted && (
          <div className="hover-reveal-container">
            {/* Dark mode background */}
            <div
              className="hover-reveal-bg dark:block hidden"
              style={{
                backgroundImage: 'url(/allumialpha.png)',
                opacity: 0.3,
                mixBlendMode: 'lighten',
                maskImage: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 100px, rgba(255,255,255,0.7) 200px, rgba(255,255,255,0.4) 350px, rgba(255,255,255,0.15) 500px, rgba(255,255,255,0) 700px)`,
                WebkitMaskImage: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 100px, rgba(255,255,255,0.7) 200px, rgba(255,255,255,0.4) 350px, rgba(255,255,255,0.15) 500px, rgba(255,255,255,0) 700px)`,
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat'
              } as React.CSSProperties}
            />
            {/* Light mode background */}
            <div
              className="hover-reveal-bg dark:hidden block"
              style={{
                backgroundImage: 'url(/lightbackgroundaboutus.png)',
                opacity: 0.6,
                mixBlendMode: 'multiply',
                maskImage: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 100px, rgba(255,255,255,0.7) 200px, rgba(255,255,255,0.4) 350px, rgba(255,255,255,0.15) 500px, rgba(255,255,255,0) 700px)`,
                WebkitMaskImage: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 100px, rgba(255,255,255,0.7) 200px, rgba(255,255,255,0.4) 350px, rgba(255,255,255,0.15) 500px, rgba(255,255,255,0) 700px)`,
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat'
              } as React.CSSProperties}
            />
          </div>
        )}
        <div className="relative pt-16">
          {/* LaserFlow effect above the story box - centered */}
          <div className="relative h-[500px] -mb-64 -mt-16 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full">
                <LaserFlow 
                  horizontalSizing={0.85}
                  verticalSizing={2.3}
                  wispDensity={1.1}
                  wispSpeed={15}
                  wispIntensity={5}
                  flowSpeed={0.28}
                  flowStrength={0.25}
                  fogIntensity={0.45}
                  fogScale={0.3}
                  fogFallSpeed={0.6}
                  decay={1.1}
                  falloffStart={1.2}
                  color="#CF9EFF"
                  horizontalBeamOffset={0}
                  verticalBeamOffset={0}
                />
              </div>
            </div>
          </div>
          
          {/* Story content in a box with matching laser flow stroke */}
          <div className="container mx-auto px-4 max-w-6xl">
        <div className="story-box relative z-10 dark:bg-black bg-white border-2 rounded-xl overflow-hidden" style={{ borderColor: '#CF9EFF' }}>
          {/* Demo container dots effect inside the box */}
          <div className="demo-container-dots" />
          
          {/* Fade overlay to smoothly fade dots away */}
          <div className="absolute inset-0 z-[1]" style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 20%, var(--tw-gradient-stops))'
          }} >
            <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-transparent dark:via-black/50 dark:to-black bg-gradient-to-b from-transparent via-white/50 to-white" />
          </div>
          
          
          <div className="relative z-10 p-8 lg:p-12">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white text-gray-900">The Long Road to Attribution</h1>
            <p className="text-xl text-muted-foreground">
              Started tracking what converts at 14. Spent 15 years learning what actually drives revenue. Built Allumi to solve the problem that cost me $36,000.
            </p>
          </div>

          {/* Main Content - Full page */}
          <div className="prose prose-lg dark:prose-invert mx-auto dark:text-white text-gray-900">
            <div className="space-y-6 pt-2">
              <p className="text-lg leading-relaxed">
                I've been obsessed with one question since 2009: "What actually makes people buy?"
              </p>

              <div className="relative">
                <Image 
                  src="/jan computer pic old.JPEG" 
                  alt="Young Jan at computer"
                  width={800}
                  height={600}
                  quality={100}
                  priority
                  className="rounded shadow-xl object-cover float-right ml-6 mb-4 w-72"
                />
                <p className="text-lg leading-relaxed">
                  Back then, I was a teenager running affiliate campaigns, manually tracking every click in spreadsheets that crashed weekly. I thought I was sophisticated because I could see which ads generated clicks. I had no idea I was still flying blind.
                </p>
                <p className="text-lg leading-relaxed">
                  Fast forward to 2017. I'm operating from my parents' attic in the Netherlands, heading out each day to pitch social media services to dentists door-to-door. Built an agency from zero to six figures using what I called the "Meetup Pro hack" - a simple system that generated $100k in client revenue. But even then, my clients kept asking the same question: "Which posts actually drive patients?"
                </p>
              </div>

          <p className="text-lg leading-relaxed font-semibold">
            I couldn't answer. Really couldn't.
          </p>

          <p className="text-lg leading-relaxed">
            By 2019, I'd moved to Bangkok, grown the agency, and was managing significant ad spend for clients. That's when I discovered my own $36,000 mistake. I'd been pumping $3K/month into Instagram ads for a client. Beautiful creative. Great engagement. Zero revenue.
          </p>

          <p className="text-lg leading-relaxed">
            Meanwhile, their boring Reddit comments - the ones we almost ignored - had quietly generated $8,400 in actual paying customers.
          </p>

          <p className="text-lg leading-relaxed font-semibold text-primary">
            That moment changed everything.
          </p>

          <p className="text-lg leading-relaxed">
            I started manually tracking attribution for every client. Built elaborate spreadsheets. Spent 10+ hours per month per client just maintaining the data. One corrupted file lost three months of insights at 2am. Another client's sheet became so complex it took 5 minutes just to load.
          </p>

          <div className="relative">
            <Image 
              src="/jan newer.JPEG" 
              alt="Jan Jegen"
              width={400}
              height={300}
              quality={100}
              priority
              className="rounded shadow-xl object-cover float-left mr-6 mb-4 w-80 h-60"
            />
            <p className="text-lg leading-relaxed">
              But the patterns were undeniable. Every single client was wasting 70-90% of their marketing spend on channels that drove traffic but zero revenue. One was celebrating 10,000 Instagram followers while their email list of 200 people drove 95% of sales. Another spent two years creating daily YouTube videos when their highest-converting content was forum posts.
            </p>
            <p className="text-lg leading-relaxed font-semibold">
              The problem was blindness to what actually converts.
            </p>
            <p className="text-lg leading-relaxed">
              When Skool launched and I saw communities struggling with the same attribution blindness, I knew exactly what needed to exist. Simple, clear attribution tracking that shows what drives paying members. Something you could set up in five minutes and understand instantly.
            </p>
          </div>

          <p className="text-lg leading-relaxed">
            I built Allumi because I've lived this problem for 15 years. From tracking affiliate campaigns in my childhood bedroom to managing multiple six-figure client accounts from Thailand. Every step taught me the same lesson: You can only scale what you can see.
          </p>

          <p className="text-lg leading-relaxed">
            Today, I run Allumi from between Thailand and Japan - living proof that when you know what converts, you can build the freedom lifestyle every community owner dreams of. Working 20 focused hours instead of 60 scattered ones. Investing in channels that convert instead of guessing everywhere.
          </p>

              <p className="text-lg leading-relaxed">
                That client who was wasting $3K/month on Instagram? They're now at $25K MRR, spending 80% less on ads, working half the hours. All because they can finally see what converts.
              </p>

              <p className="text-2xl font-bold text-center mt-8">
                Your attribution clarity is five minutes away.
              </p>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-8 lg:mt-12 flex items-center justify-center gap-4">
            <Image
              src="/founder-jan-jegen2smaller.png"
              alt="Jan Jegen"
              width={64}
              height={64}
              quality={100}
              priority
              className="rounded-full object-cover w-16 h-16"
            />
            <div>
            <div className="font-semibold text-lg flex items-center gap-1.5">
              Jan Jegen
              <a 
                href="https://instagram.com/JanJegen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Jan Jegen on Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a 
                href="https://x.com/jan_jegen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Jan Jegen on X (Twitter)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
            <div className="text-muted-foreground">Founder, Allumi</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-6 lg:mt-8 text-center">
            <button
              onClick={() => setIsEmailPopupOpen(true)}
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Your 14-Day Free Trial
            </button>
          </div>
          </div>
        </div>
        </div>
      </div>
    </div>
    </>
  )
}