"use client"

import { useState } from "react"
import { Hero } from "./_sections/hero"
import { Companies } from "./_sections/companies"
import { FeaturesGrid } from "./_sections/features/features-grid"
import { TestimonialsGrid } from "./_sections/testimonials-grid"
import { Pricing } from "./_sections/pricing"
import { AccordionFaq } from "./_sections/accordion-faq"
import { EmailPopup } from "../components/email-popup"
import { AutoScroll } from "../components/auto-scroll"
import TrueFocusPairs from "../components/TrueFocusPairs"
import SpotlightCard from "../components/SpotlightCard"
import TextType from "../components/TextType"
import HeroTargetCursor from "../components/HeroTargetCursor"
import Image from "next/image"
import { useDemoModal } from "../components/layout-client"

// Reusable Skool logo component
const SkoolLogo = () => (
  <a 
    href="https://www.skool.com/signup?ref=12a546aba01846d987f5ccee20d61c76"
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: "inline-block", margin: "0 1px" }}
    className="hover:opacity-80 transition-opacity"
  >
    <Image 
      src="/skool.png" 
      alt="Skool" 
      width={70} 
      height={24} 
      className="inline h-[1em] w-auto"
      style={{ display: "inline", verticalAlign: "baseline", position: "relative", top: "0.5px" }}
    />
  </a>
)

const scrollToPricing = () => {
  const pricingSection = document.getElementById("pricing-section")
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: "smooth" })
  }
}

const heroData = {
  _analyticsKey: "allumi-hero",
  tagline: (
    <>
      Attribution for <SkoolLogo /> Communities
    </>
  ),
  customerSatisfactionBanner: {
    text: "Join 50 beta users tracking what drives revenue",
    avatars: {
      items: [],
    },
  },
  title: {
    line1: (
      <>
        Get{" "}
        <Image 
          src="/skool.png" 
          alt="Skool" 
          width={70} 
          height={24} 
          className="inline h-[1.2em] w-auto"
          style={{ display: "inline", verticalAlign: "baseline", position: "relative", top: "0.5px" }}
        />{" "}
        Members Who Pay and Stay - FASTER...
      </>
    ),
    line2: "Without Burning Time/Cash on Dead Channels"
  },
  subtitle:
    "Half your marketing is working. Too bad you don't know which half. Track what drives members who pay and stay.",
  actions: [
    {
      _id: "secondary-cta",
      href: "#",
      label: "Watch 2-Min Demo",
      sublabel: "",
      type: "secondary" as const,
      onClick: "demo",
    },
    {
      _id: "primary-cta",
      href: "#",
      label: "Start Free 14-Day Trial",
      sublabel: "",
      type: "primary" as const,
      onClick: "signup",
    },
  ],
}

const companiesData = {
  subtitle: (
    <>
      Trusted by <SkoolLogo /> community owners who track what works
    </>
  ),
  companies: [],
}

const featuresData = {
  _analyticsKey: "allumi-features",
  heading: {
    title: (
      <TrueFocusPairs 
        firstPair="Stop Guessing"
        secondPair="Start Growing"
        blurAmount={8}
        borderColor="#10b981"
        glowColor="rgba(16, 185, 129, 0.6)"
        animationDuration={0.5}
        pauseBetweenAnimations={1.5}
      />
    ),
    subtitle: (
      <>
        See exactly what drives revenue in your{" "}
        <Image 
          src="/skool.png" 
          alt="Skool" 
          width={70} 
          height={24} 
          className="inline h-[1em] w-auto"
          style={{ display: "inline", verticalAlign: "baseline", position: "relative", top: "0.5px" }}
        />{" "}
        community with simple setup and powerful insights.
      </>
    ),
    align: "center" as const,
  },
  featuresGridList: {
    items: [
      {
        _id: "attribution",
        _title: "See What Drives Revenue",
        description:
          "Track which content, ads, and sources drive paying members. See conversion rates, LTV by channel, and which sources bring buyers vs browsers.",
        icon: "chart-line",
      },
      {
        _id: "stop-waste",
        _title: "Stop Burning Money on What Doesn't Work",
        description: "Finally see which content/ads bring members who pay and stay vs freeloaders who never convert. Cut the waste, scale the winners.",
        icon: "flame",
      },
      {
        _id: "quick-setup",
        _title: "5 Minutes to Attribution (Not 5 Days)",
        description:
          (
            <>
              Connect Zapier, paste template, see data flowing. No developers, no complexity, no excuses. Easier than creating a <SkoolLogo /> course.
            </>
          ),
        icon: "clock",
      },
      {
        _id: "hidden-revenue",
        _title: "Find Your Hidden Revenue Source",
        description: "Discover that one content/ad type driving 40% of revenue you didn't know about. Track members who stay 6+ months vs 2-week churners.",
        icon: "search",
      },
      {
        _id: "profitable-ads",
        _title: "Launch Profitable Ads Tomorrow",
        description: "Know exactly which content/ads convert at 35%+. Turn organic winners into paid scaling machines. Stop guessing, start growing.",
        icon: "rocket",
      },
      {
        _id: "real-time-alerts",
        _title: "Know the Moment Something Works (Real-Time Alerts)",
        description: "Get notified instantly when a new source starts converting at 30%+. Never miss a scaling opportunity or let a winning campaign run out of budget.",
        icon: "bell",
      },
    ],
  },
  actions: [
    {
      _id: "features-cta",
      href: "#pricing-section",
      label: "Start Tracking Revenue",
      type: "primary" as const,
    },
    {
      _id: "demo-cta",
      href: "#",
      label: "Watch Demo",
      type: "secondary" as const,
      onClick: "demo",
    },
  ],
}

const testimonialsData = {
  heading: {
    title: "What Community Builders Say About Attribution Tracking",
    subtitle: (
      <>
        Real feedback from <SkoolLogo /> community owners who discovered what drives revenue
      </>
    ),
    align: "center" as const,
  },
  quotes: [
    {
      _id: "testimonial-1",
      quote:
        "Spent 18 months grinding organic. Attribution showed one Reddit style converted at 40%. Put $2K/month ads behind it. Went from $5K → $25K MRR in 60 days.",
      author: {
        _title: "Marcus Thompson",
        role: "Community Owner",
        company: { _title: "Growth Accelerated" },
        image: null,
      },
    },
    {
      _id: "testimonial-2",
      quote:
        "Posted motivational content for 2 YEARS. Attribution revealed technical tutorials converted 8x better. Complete game-changer.",
      author: {
        _title: "Emily Rodriguez",
        role: "Community Owner",
        company: { _title: "Content Pivot Success" },
        image: null,
      },
    },
    {
      _id: "testimonial-3",
      quote:
        "I was spending $4K/month on Instagram ads with terrible ROI. Attribution showed YouTube drove 90% of my revenue. Saved $48K/year by focusing on what actually works.",
      author: {
        _title: "Michael Anderson",
        role: "Community Owner",
        company: { _title: "Scale Smart" },
        image: null,
      },
    },
  ],
}

const pricingData = {
  heading: {
    title: "Simple Attribution Pricing",
    subtitle: "Track what drives revenue without breaking the bank. Hyros costs $379+/month for similar tracking.",
    align: "center" as const,
  },
  plans: {
    items: [
      {
        plan: {
          _id: "professional",
          _title: "Professional",
          price: "$79/month",
          billed: "Everything you need to track attribution",
          isMostPopular: true,
          badge: "MOST POPULAR",
          list: {
            items: [
              { _id: "prof-1", _title: "Unlimited members tracked" },
              { _id: "prof-2", _title: "Full attribution dashboard" },
              { _id: "prof-3", _title: "First-click & last-click attribution" },
              { _id: "prof-4", _title: "Source → Revenue tracking" },
              { _id: "prof-5", _title: "LTV by channel" },
              { _id: "prof-6", _title: "Conversion quality metrics (who pays vs freeloads)" },
              { _id: "prof-7", _title: "Free-to-paid conversion tracking" },
              { _id: "prof-8", _title: "Churn detection (payment-based)" },
              { _id: "prof-9", _title: "Zapier integration setup" },
              { _id: "prof-10", _title: "CSV exports" },
              { _id: "prof-11", _title: "Chat support" },
            ],
          },
          comparison: "Compare: Hyros charges $379/month minimum",
          cta: {
            label: "Start 14-Day Free Trial",
            href: "/start-trial",
          },
        },
      },
      {
        plan: {
          _id: "scale",
          _title: "Scale",
          price: "$149/month",
          billed: "For advanced attribution needs",
          isMostPopular: false,
          list: {
            items: [
              { _id: "scale-1", _title: "Everything in Professional, plus:" },
              { _id: "scale-2", _title: "Multi-touch attribution" },
              { _id: "scale-3", _title: "API access (pull data anywhere)" },
              { _id: "scale-4", _title: 'Custom alerts ("CAC exceeds $100")' },
              { _id: "scale-5", _title: "Cohort analysis" },
              { _id: "scale-6", _title: "Predictive scoring" },
              { _id: "scale-7", _title: "Chrome extension (accurate member tracking)" },
              { _id: "scale-8", _title: "Priority support (2-hour response)" },
              { _id: "scale-9", _title: "Custom onboarding call" },
            ],
          },
          comparison: "Still $230/month less than Hyros",
          cta: {
            label: "Start 14-Day Free Trial",
            href: "/start-trial-scale",
          },
        },
      },
    ],
  },
  betaSpecial: {
    title: "Beta Special",
    highlight: "🔥 First 20 customers: Lock in $49/month forever (Professional tier)",
  },
}

const calloutData = {
  _analyticsKey: "allumi-callout",
  title: "Illuminate Your Empire.",
  subtitle: (
    <>
      Track what drives revenue in your <SkoolLogo /> community. See which content brings members who pay and stay.
    </>
  ),
  actions: [
    {
      _id: "final-cta",
      href: "/join-beta",
      label: "Start Free 14-Day Trial",
      type: "primary" as const,
    },
    {
      _id: "demo-cta",
      href: "#",
      label: "Watch Demo",
      type: "secondary" as const,
      onClick: "demo",
    },
  ],
}

const faqData = {
  layout: "accordion" as const,
  heading: {
    title: "Attribution Tracking Questions",
    subtitle: (
      <>
        Get answers about tracking what drives revenue in your <SkoolLogo /> community.
      </>
    ),
    align: "center" as const,
  },
  questions: {
    items: [
      {
        _id: "faq-1",
        _title: (
          <>
            How does attribution tracking work with <SkoolLogo />?
          </>
        ),
        answer:
          (
            <>
              We track member signups and revenue to match them to their original source (YouTube video, Instagram post, podcast episode, etc.) and track their lifetime value. We also support Zapier for easy integration.
            </>
          ),
      },
      {
        _id: "faq-2",
        _title: "How accurate is the attribution matching?",
        answer:
          "Our attribution accuracy is 90-99.99% depending on your setup. We use first-party cookies, UTM parameters, and referrer data to match members to sources. Much more accurate than Google Analytics for revenue tracking.",
      },
      {
        _id: "faq-3",
        _title: "What if I'm already using Hyros?",
        answer:
          (
            <>
              Hyros is great but costs $379+/month and requires complex setup. We're built specifically for <SkoolLogo /> communities at $79/month with 2-minute setup. Many users switch to save $3,600/year while getting more valuable insights into what traffic sources get you the highest-quality lowest-churning <SkoolLogo /> members... down to the exact ad ID or piece of content they found you through.
            </>
          ),
      },
      {
        _id: "faq-4",
        _title: (
          <>
            Does this work with free <SkoolLogo /> communities?
          </>
        ),
        answer:
          "Yes! We track free-to-paid conversions, so you can see which content drives members who eventually upgrade to paid tiers or purchase your products.",
      },
      {
        _id: "faq-5",
        _title: "How is this different from Google Analytics?",
        answer:
          "Google Analytics shows website visits. We show revenue attribution. You'll see which specific YouTube video drove $3,400 in member revenue, not just that YouTube sent traffic.",
      },
      {
        _id: "faq-6",
        _title: "Can I track historical data?",
        answer:
          "We can track going forward from setup. For historical analysis, we can help you import past member data if you have source information in spreadsheets or other tools.",
      },
      {
        _id: "faq-7",
        _title: "What sources can you track?",
        answer:
          (
            <>
              Everything - YouTube videos, Instagram posts, podcast episodes, blog articles, email campaigns, paid ads, referrals, and more. If it drives traffic to your <SkoolLogo /> community, we can track it.
            </>
          ),
      },
      {
        _id: "faq-8",
        _title: "How quickly will I see results?",
        answer:
          "Most users discover their first major insight within 48 hours. Common discoveries: one content type converts 5x better, Instagram drives $0 while YouTube drives thousands, or specific topics drive higher LTV members.",
      },
      {
        _id: "faq-9",
        _title: "What's the setup process?",
        answer:
          "2-minute connection. We provide step-by-step instructions and will do it for you if you need help. No coding or complex integrations required.",
      },
      {
        _id: "faq-10",
        _title: (
          <>
            Is Allumi an official <SkoolLogo /> plugin or third-party?
          </>
        ),
        answer: (
          <>
            We're a third-party attribution tracking tool built specifically for <SkoolLogo /> communities. Skool is a registered trademark of Skool Inc. We simply provide better tracking and analytics for <SkoolLogo /> community owners who want to understand what drives revenue.
          </>
        ),
      },
    ],
  },
}

const contextSection = {
  _analyticsKey: "organic-hamster-wheel",
  heading: {
    title: "The Organic Hamster Wheel vs Attribution Intelligence",
    subtitle: "Stop spinning your wheels. Start scaling what works.",
    align: "center" as const,
  },
  problem: {
    title: "The Organic Hamster Wheel (Problem):",
    subtitle: "Without attribution, you're forced to:",
    points: [
      "Post daily on 5 platforms hoping something sticks",
      "Spend 40 hours/week on content that might work",
      'Stay small because ads are "too risky"',
    ],
  },
  solution: {
    title: "With Attribution (Solution):",
    points: [
      "Find your one winning content type",
      "Put ads behind ONLY what works",
      "Skip the 2-year organic grind",
      "Scale from $5K to $50K MRR in months",
    ],
  },
}

const whyIBuiltThisData = {
  _analyticsKey: "why-i-built-this",
  heading: {
    title: "Why I Built This",
    subtitle: (
      <>
        The story behind attribution for <SkoolLogo /> communities
      </>
    ),
    align: "center" as const,
  },
  story: {
    quote:
      "After tracking attribution manually for multiple Skool clients, I discovered a pattern: 90% were wasting money on channels that drove zero paying members. One client was spending $3K/month on Instagram that drove $0 revenue, while their Reddit comments drove $8,400. That's when I knew this tool needed to exist.",
    author: {
      name: "Jan Jegen",
      role: "Founder, Allumi",
      image: "/founder-jan-jegen2smaller.png",
    },
  },
}

export default function HomePage() {
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false)
  const { openDemoModal, isAnyPopupOpen } = useDemoModal()

  return (
    <>
      {!isAnyPopupOpen && !isEmailPopupOpen && (
        <div className="hidden sm:block">
          <HeroTargetCursor 
            targetSelector=".cursor-target, .callout-cursor-target"
            spinDuration={2}
          />
        </div>
      )}
      <AutoScroll />
      <EmailPopup 
        isOpen={isEmailPopupOpen} 
        onClose={() => setIsEmailPopupOpen(false)} 
      />
      <Hero
        {...heroData}
        eventsKey="allumi-events"
        onActionClick={(action) => {
          if (action.onClick === "demo") {
            openDemoModal()
            return
          } else if (action.onClick === "signup") {
            setIsEmailPopupOpen(true)
          }
        }}
      />
      <Companies {...companiesData} />
      <div data-section="features">
        <FeaturesGrid {...featuresData} eventsKey="allumi-events" onActionClick={(action) => {
          if (action?.onClick === "demo") {
            openDemoModal()
          } else {
            setIsEmailPopupOpen(true)
          }
        }} />
      </div>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{contextSection.heading.title}</h2>
            <p className="text-lg text-muted-foreground">{contextSection.heading.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Problem Side */}
            <SpotlightCard 
              className="bg-red-50 dark:bg-red-950/20 p-8 rounded-lg border border-red-200 dark:border-red-800"
              spotlightColor="rgba(239, 68, 68, 0.15)"
            >
              <h3 className="text-2xl font-bold mb-2 text-red-700 dark:text-red-400">{contextSection.problem.title}</h3>
              <p className="text-red-600 dark:text-red-300 mb-6">{contextSection.problem.subtitle}</p>
              <ul className="space-y-3">
                {contextSection.problem.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">❌</span>
                    <span className="text-red-700 dark:text-red-300">{point}</span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>

            {/* Solution Side */}
            <SpotlightCard 
              className="bg-emerald-50 dark:bg-emerald-950/20 p-8 rounded-lg border border-emerald-200 dark:border-emerald-800"
              spotlightColor="rgba(16, 185, 129, 0.15)"
            >
              <h3 className="text-2xl font-bold mb-6 text-emerald-700 dark:text-emerald-400">
                {contextSection.solution.title}
              </h3>
              <ul className="space-y-3">
                {contextSection.solution.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-emerald-500 mt-1">✅</span>
                    <span className="text-emerald-700 dark:text-emerald-300">{point}</span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </div>
        </div>
      </section>

      <TestimonialsGrid {...testimonialsData} />

      {/* Why I Built This Section */}
      <section className="py-32 md:py-40 bg-background relative overflow-hidden">
        {/* Background Image with Opacity */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/founder-jan-jegen2.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: 0.08
          }}
        />
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{whyIBuiltThisData.heading.title}</h2>
            <p className="text-lg text-muted-foreground">{whyIBuiltThisData.heading.subtitle}</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-background/95 backdrop-blur-sm p-8 rounded-lg border">
              <blockquote className="text-xl font-medium mb-6 text-center">
                "{whyIBuiltThisData.story.quote}"
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                {whyIBuiltThisData.story.author.image && (
                  <Image
                    src={whyIBuiltThisData.story.author.image}
                    alt={whyIBuiltThisData.story.author.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                    key={Date.now()} // Force refresh
                  />
                )}
                <div className="text-left">
                  <div className="font-semibold flex items-center gap-1.5">
                    {whyIBuiltThisData.story.author.name}
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
                  <div className="text-sm text-muted-foreground">{whyIBuiltThisData.story.author.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="pricing-section">
        <Pricing {...pricingData} onCtaClick={() => setIsEmailPopupOpen(true)} />
      </div>

      <section className="callout-section py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{calloutData.title}</h2>
            <p className="text-lg text-muted-foreground mb-8">{calloutData.subtitle}</p>
            <p className="text-sm text-muted-foreground mb-8">🔥 First 20 beta users: Lock in $49/month forever</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {calloutData.actions.map((action) => (
                <button
                  key={action._id}
                  onClick={(e) => {
                    e.preventDefault()
                    if (action.onClick === "demo") {
                      openDemoModal()
                    } else {
                      setIsEmailPopupOpen(true)
                    }
                  }}
                  className={`callout-cursor-target px-8 py-4 rounded-lg font-semibold transition-colors ${
                    action.type === "primary"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AccordionFaq {...faqData} eventsKey="allumi-events" />
    </>
  )
}
