"use client"

import { useState, useEffect } from "react"
import { Hero } from "../_sections/hero"
import { FeaturesGrid } from "../_sections/features/features-grid"
import { TestimonialsGrid } from "../_sections/testimonials-grid"
import { Pricing } from "../_sections/pricing"
import { AccordionFaq } from "../_sections/accordion-faq"
import { EmailCaptureModal } from "../../components/email-capture-modal"

const scrollToPricing = () => {
  const pricingSection = document.getElementById("pricing-section")
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: "smooth" })
  }
}

// Attribution-focused landing page data
const heroData = {
  _analyticsKey: "attribution-hero",
  tagline: "Track What Actually Works™",
  customerSatisfactionBanner: {
    text: "Join 200+ Skool owners who finally know their ROI",
    avatars: {
      items: [
        {
          _id: "1",
          avatar: {
            url: "https://i.pravatar.cc/150?img=1",
            alt: "Creator 1",
            width: 40,
            height: 40,
            aspectRatio: 1,
            blurDataURL: "",
          },
        },
        {
          _id: "2",
          avatar: {
            url: "https://i.pravatar.cc/150?img=2",
            alt: "Creator 2",
            width: 40,
            height: 40,
            aspectRatio: 1,
            blurDataURL: "",
          },
        },
        {
          _id: "3",
          avatar: {
            url: "https://i.pravatar.cc/150?img=3",
            alt: "Creator 3",
            width: 40,
            height: 40,
            aspectRatio: 1,
            blurDataURL: "",
          },
        },
      ],
    },
  },
  title: "See What Actually Drives Paying Members in Your Skool Community",
  subtitle:
    "Attribution tracking that shows exactly which content, ads, and posts drive revenue - built specifically for Skool. Works with your existing Skool community. No migration needed - 5 minute setup.",
  actions: [
    {
      _id: "secondary-cta",
      href: "#",
      label: "See Demo Dashboard",
      sublabel: "(Real attribution data)",
      type: "secondary" as const,
      onClick: "demo",
    },
    {
      _id: "primary-cta",
      href: "#",
      label: "Get Attribution Beta Access",
      sublabel: "(Limited to first 100 communities)",
      type: "primary" as const,
      onClick: "beta",
    },
  ],
}

const featuresData = {
  _analyticsKey: "attribution-features",
  heading: {
    title: "Finally Know What's Working in Your Skool Community",
    subtitle: "Stop guessing. Start growing with data that Skool doesn't give you.",
    align: "center" as const,
  },
  featuresGridList: {
    items: [
      {
        _id: "attribution",
        _title: "Multi-Touch Attribution Dashboard",
        description:
          "Track every touchpoint from first click to paying member. See which YouTube videos, Instagram posts, podcast episodes, and ads actually drive revenue. Know your true CAC and LTV by source.",
        icon: { url: "/icons/chart.svg", alt: "Attribution Dashboard" },
      },
      {
        _id: "analytics",
        _title: "Revenue Analytics & Reports",
        description:
          "Detailed cohort analysis, retention by source, and lifetime value predictions. Export reports that prove ROI to stakeholders and potential buyers.",
        icon: { url: "/icons/analytics.svg", alt: "Analytics Reports" },
      },
      {
        _id: "zapier",
        _title: "Zapier Integration",
        description:
          "Connect to your existing Skool community in 2 minutes. Automatically sync new members, track their journey, and push data to your CRM or email tools.",
        icon: { url: "/icons/zapier.svg", alt: "Zapier Integration" },
      },
      {
        _id: "tracking",
        _title: "Universal Tracking Links",
        description:
          "Generate trackable links for any content. Works with YouTube descriptions, Instagram bios, podcast show notes, email signatures - anywhere you promote.",
        icon: { url: "/icons/link.svg", alt: "Tracking Links" },
      },
      {
        _id: "realtime",
        _title: "Real-Time Conversion Alerts",
        description:
          "Get instant notifications when content drives a conversion. Know immediately when a post goes viral and converts, so you can double down.",
        icon: { url: "/icons/bell.svg", alt: "Real-time Alerts" },
      },
      {
        _id: "api",
        _title: "API & Webhook Access",
        description:
          "Build custom integrations, push data to your data warehouse, or create automated workflows based on attribution insights.",
        icon: { url: "/icons/code.svg", alt: "API Access" },
      },
    ],
  },
  actions: [
    {
      _id: "features-cta",
      href: "#",
      label: "Start 30-Day Free Trial",
      type: "primary" as const,
      onClick: "trial",
    },
    {
      _id: "demo-cta",
      href: "#how-it-works",
      label: "See How It Works",
      type: "secondary" as const,
    },
  ],
}

const howItWorksData = {
  _analyticsKey: "how-it-works",
  heading: {
    title: "Set Up Attribution in 5 Minutes",
    subtitle: "No migration needed. Works with your existing Skool community.",
    align: "center" as const,
  },
  steps: [
    {
      _id: "step-1",
      number: "1",
      title: "Connect to Skool via Zapier",
      description: "2-minute setup. We'll walk you through connecting your Skool community to start tracking new members.",
      icon: { url: "/icons/connect.svg", alt: "Connect" },
    },
    {
      _id: "step-2",
      number: "2",
      title: "Add Tracking to Your Content Links",
      description: "Generate trackable links for your YouTube videos, social posts, ads, and anywhere else you promote.",
      icon: { url: "/icons/link.svg", alt: "Add Tracking" },
    },
    {
      _id: "step-3",
      number: "3",
      title: "See Attribution Data Flow In",
      description: "Watch in real-time as we track which content and channels drive your highest-value members.",
      icon: { url: "/icons/dashboard.svg", alt: "View Data" },
    },
  ],
}

const testimonialsData = {
  heading: {
    title: "Skool Owners Discovering What Actually Works",
    subtitle: "Real attribution insights from community owners who stopped guessing",
    align: "center" as const,
  },
  quotes: [
    {
      _id: "testimonial-1",
      quote:
        "Found out my 3-hour Instagram posts drove $0 in revenue while a 5-minute Reddit comment brought in $8,400. Completely changed my content strategy.",
      author: {
        _title: "Sarah Chen",
        role: "Skool Community Owner",
        company: { _title: "Design Masters (2,300 members)" },
        image: {
          url: "https://i.pravatar.cc/150?img=10",
          alt: "Sarah Chen",
        },
      },
    },
    {
      _id: "testimonial-2",
      quote:
        "Spent $5K on Facebook ads thinking they didn't work. Attribution showed they had a 90-day conversion cycle with 5x ROAS. Almost killed my best channel.",
      author: {
        _title: "Marcus Johnson",
        role: "Skool Community Owner",
        company: { _title: "Trader's Edge (1,200 members)" },
        image: {
          url: "https://i.pravatar.cc/150?img=11",
          alt: "Marcus Johnson",
        },
      },
    },
    {
      _id: "testimonial-3",
      quote:
        "YouTube drove 67% of revenue but I was posting daily on LinkedIn. One attribution report saved me 15 hours per week.",
      author: {
        _title: "Lisa Park",
        role: "Skool Community Owner",
        company: { _title: "Freelance Accelerator (800 members)" },
        image: {
          url: "https://i.pravatar.cc/150?img=12",
          alt: "Lisa Park",
        },
      },
    },
    {
      _id: "testimonial-4",
      quote:
        "Discovered one specific YouTube video format converts at 8x. Now I only make those videos. Revenue up 340% in 3 months.",
      author: {
        _title: "James Mitchell",
        role: "Coach",
        company: { _title: "Peak Performance Skool (500 members)" },
        image: {
          url: "https://i.pravatar.cc/150?img=13",
          alt: "James Mitchell",
        },
      },
    },
    {
      _id: "testimonial-5",
      quote:
        "Podcast interviews convert 10x better than solo episodes. Would have never known without attribution. This tool pays for itself daily.",
      author: {
        _title: "Anna Rodriguez",
        role: "Host",
        company: { _title: "Creator's Journey Skool (1,500 members)" },
        image: {
          url: "https://i.pravatar.cc/150?img=14",
          alt: "Anna Rodriguez",
        },
      },
    },
    {
      _id: "testimonial-6",
      quote:
        "10x cheaper than Hyros, built specifically for Skool. Finally attribution that community owners can actually afford.",
      author: {
        _title: "Tom Wilson",
        role: "Founder",
        company: { _title: "SaaS Growth Skool (3,000 members)" },
        image: {
          url: "https://i.pravatar.cc/150?img=15",
          alt: "Tom Wilson",
        },
      },
    },
  ],
}

const pricingData = {
  heading: {
    title: "Attribution That Costs 10x Less Than Enterprise Tools",
    subtitle: "Compare to Hyros at $999+/month. Built specifically for Skool communities.",
    align: "center" as const,
  },
  plans: {
    items: [
      {
        plan: {
          _id: "starter",
          _title: "Starter",
          price: "$49/month",
          billed: "Perfect for growing communities",
          isMostPopular: false,
          list: {
            items: [
              { _id: "starter-1", _title: "Up to 500 Skool members" },
              { _id: "starter-2", _title: "First-click attribution" },
              { _id: "starter-3", _title: "Track unlimited sources" },
              { _id: "starter-4", _title: "Basic revenue reports" },
              { _id: "starter-5", _title: "Zapier integration" },
              { _id: "starter-6", _title: "30-day data retention" },
              { _id: "starter-7", _title: "Email support" },
            ],
          },
          cta: {
            label: "Start Free Trial",
            href: "/start-trial",
          },
        },
      },
      {
        plan: {
          _id: "growth",
          _title: "Growth",
          price: "$79/month",
          billed: "For serious community builders",
          isMostPopular: true,
          badge: "MOST POPULAR",
          list: {
            items: [
              { _id: "growth-1", _title: "Unlimited Skool members" },
              { _id: "growth-2", _title: "Multi-touch attribution" },
              { _id: "growth-3", _title: "LTV & cohort analysis" },
              { _id: "growth-4", _title: "Custom conversion windows" },
              { _id: "growth-5", _title: "Advanced reports & exports" },
              { _id: "growth-6", _title: "90-day data retention" },
              { _id: "growth-7", _title: "Real-time alerts" },
              { _id: "growth-8", _title: "Priority support" },
            ],
          },
          cta: {
            label: "Start Free Trial",
            href: "/start-trial",
          },
        },
      },
      {
        plan: {
          _id: "scale",
          _title: "Scale",
          price: "$149/month",
          billed: "Enterprise features at startup prices",
          isMostPopular: false,
          list: {
            items: [
              { _id: "scale-1", _title: "Everything in Growth" },
              { _id: "scale-2", _title: "API & webhook access" },
              { _id: "scale-3", _title: "Custom attribution models" },
              { _id: "scale-4", _title: "Multiple Skool communities" },
              { _id: "scale-5", _title: "1-year data retention" },
              { _id: "scale-6", _title: "White-label reports" },
              { _id: "scale-7", _title: "Dedicated onboarding" },
              { _id: "scale-8", _title: "Phone & Slack support" },
            ],
          },
          cta: {
            label: "Contact Sales",
            href: "/contact-sales",
          },
          footer: "Compare to Hyros at $999+/month",
        },
      },
    ],
  },
}

const faqData = {
  layout: "accordion" as const,
  heading: {
    title: "Common Questions About Attribution for Skool",
    subtitle: "Everything you need to know about tracking what works in your community",
    align: "center" as const,
  },
  questions: {
    items: [
      {
        _id: "faq-1",
        _title: "How does it integrate with Skool?",
        answer:
          "Simple 2-minute Zapier connection. We automatically track when new members join your Skool community and match them to their attribution source. No code needed, no migration required. Your Skool community stays exactly where it is.",
      },
      {
        _id: "faq-2",
        _title: "How accurate is the attribution?",
        answer:
          "95%+ accuracy using first-party tracking cookies and UTM parameters. We track both first-click and multi-touch attribution, showing you the complete customer journey from discovery to purchase. Much more accurate than platform analytics that only show last-click.",
      },
      {
        _id: "faq-3",
        _title: "What's the setup process?",
        answer:
          "Three steps, five minutes total: 1) Connect your Skool via Zapier (2 min), 2) Add our tracking script to your landing pages (2 min), 3) Generate trackable links for your content (1 min). We provide video walkthroughs and offer free setup assistance.",
      },
      {
        _id: "faq-4",
        _title: "How is this different from Hyros?",
        answer:
          "Hyros costs $999+/month and is built for e-commerce with complex features you don't need. Allumi is built specifically for Skool communities at 10x less cost. Same attribution accuracy, simpler interface, Skool-specific features like member LTV tracking.",
      },
      {
        _id: "faq-5",
        _title: "Can I track historical data?",
        answer:
          "Yes, for the last 30 days. When you connect, we'll analyze your recent Skool members and match them to attribution sources where possible. Going forward, all new members are tracked in real-time with full attribution data.",
      },
      {
        _id: "faq-6",
        _title: "What if I run ads on multiple platforms?",
        answer:
          "Perfect - that's exactly what attribution is for. Track Facebook, Google, YouTube, TikTok, LinkedIn, and any other platform. See which platform, campaign, and even specific ad drives the most valuable members. Finally know your true ROAS.",
      },
      {
        _id: "faq-7",
        _title: "Do I need technical skills?",
        answer:
          "No coding required. If you can copy-paste and follow a 3-step video, you can set this up. We also offer free white-glove setup for Growth and Scale plans. Most users are tracking within 5 minutes.",
      },
      {
        _id: "faq-8",
        _title: "What about organic social media tracking?",
        answer:
          "Track any source - organic or paid. Generate unique links for Instagram bio, YouTube descriptions, podcast show notes, Twitter threads, Reddit comments. Finally see which organic content actually converts to paying members.",
      },
      {
        _id: "faq-9",
        _title: "Can I export the data?",
        answer:
          "Yes. Export to CSV, connect via API, or push to your data warehouse. Your attribution data is yours. Use it for reports, investor updates, or when selling your community (attribution data can 2-3x your exit multiple).",
      },
      {
        _id: "faq-10",
        _title: "What's your refund policy?",
        answer:
          "30-day money-back guarantee. If you don't discover at least one significant insight that changes how you market your community, we'll refund everything. Most users find $10K+ in optimization opportunities within the first week.",
      },
    ],
  },
}

const backstoryData = {
  _analyticsKey: "attribution-backstory",
  title: "Why I Built This",
  quote:
    "I burned $500K on marketing my Skool community without knowing what worked. Instagram ads? Facebook? YouTube? My podcast? No idea. Then I manually tracked 100 members - discovered YouTube drove 73% of revenue while Instagram (where I spent 80% of my time) drove 2%. That's when I realized: every Skool owner is flying blind, wasting thousands on the wrong channels. So I built Allumi - simple attribution tracking for Skool communities that costs 10x less than enterprise tools.",
  author: {
    name: "Jan Jegen",
    title: "Founder, Allumi",
    image: "/founder-jan-jegen.jpg",
  },
}

export default function AttributionPage() {
  const [emailCaptureOpen, setEmailCaptureOpen] = useState(false)
  const [emailCaptureType, setEmailCaptureType] = useState<"demo" | "trial" | "beta">("beta")

  useEffect(() => {
    if (window.location.hash === '#how-it-works') {
      setTimeout(() => {
        const howSection = document.getElementById('how-it-works');
        if (howSection) {
          howSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (window.location.hash === '#pricing') {
      setTimeout(() => {
        const pricingSection = document.getElementById('pricing-section');
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <>
      <EmailCaptureModal
        open={emailCaptureOpen}
        onOpenChange={setEmailCaptureOpen}
        title={emailCaptureType === "beta" ? "Get Attribution Beta Access" : "Start Your Free Trial"}
        description={emailCaptureType === "beta" 
          ? "Be among the first 100 Skool communities to get attribution tracking" 
          : "30-day free trial. No credit card required."}
      />
      <div>
        <Hero
          {...heroData}
          eventsKey="attribution-events"
          onActionClick={(action) => {
            if (action.onClick === "demo") {
              window.location.href = "/attribution-demo"
              return
            } else if (action.onClick === "beta") {
              setEmailCaptureType("beta")
              setEmailCaptureOpen(true)
            } else if (action.onClick === "trial") {
              setEmailCaptureType("trial")
              setEmailCaptureOpen(true)
            }
          }}
        />
      </div>
      
      <div data-section="features">
        <FeaturesGrid {...featuresData} eventsKey="attribution-events" 
          onActionClick={(action) => {
            if (action.onClick === "trial") {
              setEmailCaptureType("trial")
              setEmailCaptureOpen(true)
            }
          }}
        />
      </div>

      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{howItWorksData.heading.title}</h2>
            <p className="text-lg text-muted-foreground">{howItWorksData.heading.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorksData.steps.map((step, index) => (
              <div key={step._id} className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => {
                setEmailCaptureType("trial")
                setEmailCaptureOpen(true)
              }}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8 py-2"
            >
              Start Tracking Now
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-balance">{backstoryData.title}</h2>
            <div className="relative">
              <div className="absolute -top-4 -left-4 text-6xl text-muted-foreground/20 font-serif">"</div>
              <blockquote className="text-lg md:text-xl leading-relaxed text-muted-foreground mb-8 italic px-8">
                {backstoryData.quote}
              </blockquote>
              <div className="absolute -bottom-4 -right-4 text-6xl text-muted-foreground/20 font-serif">"</div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-12">
              <img
                src={backstoryData.author.image || "/placeholder.svg"}
                alt={backstoryData.author.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-left">
                <div className="font-semibold text-foreground">{backstoryData.author.name}</div>
                <div className="text-sm text-muted-foreground">{backstoryData.author.title}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsGrid {...testimonialsData} />
      
      <div id="pricing-section">
        <Pricing {...pricingData} />
      </div>
      
      <AccordionFaq {...faqData} eventsKey="attribution-events" />
    </>
  )
}