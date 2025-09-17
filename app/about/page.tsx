"use client"

import Image from "next/image"
import Link from "next/link"
import LaserFlow from "../../components/LaserFlow"
import "./about.css"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-4 max-w-6xl pt-16">
        {/* LaserFlow effect above the story box */}
        <div className="relative h-96 -mb-48 -mt-16 overflow-hidden">
          <div className="absolute left-1/2 -translate-x-1/2 w-[120%]">
            <LaserFlow 
              horizontalSizing={3.0}
              verticalSizing={5.0}
              wispDensity={1.8}
              wispSpeed={15}
              wispIntensity={5.3}
              flowSpeed={0.47}
              flowStrength={0.25}
              fogIntensity={0.45}
              fogScale={0.3}
              fogFallSpeed={0.6}
              decay={1.23}
              falloffStart={1.2}
            />
          </div>
        </div>
        
        {/* Story content in a box */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl shadow-xl p-8 lg:p-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">The Long Road to Attribution</h1>
            <p className="text-xl text-muted-foreground">
              Started tracking what converts at 14. Spent 15 years learning what actually drives revenue. Built Allumi to solve the problem that cost me $36,000.
            </p>
          </div>

          {/* Main Content - Full page */}
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <div className="space-y-6 pt-4">
              <p className="text-lg leading-relaxed">
                I've been obsessed with one question since 2009: "What actually makes people buy?"
              </p>

              <div className="relative">
                <Image 
                  src="/jan computer pic old.JPEG" 
                  alt="Young Jan at computer"
                  width={320}
                  height={240}
                  className="rounded shadow-xl object-cover float-right ml-6 mb-4 w-72"
                />
                <p className="text-lg leading-relaxed">
                  Back then, I was a teenager running affiliate campaigns, manually tracking every click in spreadsheets that crashed weekly. I thought I was sophisticated because I could see which ads generated clicks. I had no idea I was still flying blind.
                </p>
                <p className="text-lg leading-relaxed">
                  Fast forward to 2017. I'm in my parents' attic in the Netherlands, pitching social media services to dentists door-to-door. Built an agency from zero to six figures using what I called the "Meetup Pro hack" - a simple system that generated $100k in client revenue. But even then, my clients kept asking the same question: "Which posts actually drive patients?"
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
              width={320}
              height={240}
              className="rounded shadow-xl object-cover float-left mr-6 mb-4 w-72"
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
              src="/founder-jan-jegen2.jpg"
              alt="Jan Jegen"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
            <div className="font-semibold text-lg flex items-center gap-2">
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
                  width="16"
                  height="16"
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
            </div>
            <div className="text-muted-foreground">Founder, Allumi</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-6 lg:mt-8 text-center">
            <Link
              href="/#pricing-section"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Your 14-Day Free Trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}