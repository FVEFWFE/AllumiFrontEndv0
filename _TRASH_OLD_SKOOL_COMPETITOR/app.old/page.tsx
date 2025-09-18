"use client"

import { useState, useEffect } from "react"
import { Hero } from "./_sections/hero"
import { FeaturesGrid } from "./_sections/features/features-grid"
import { TestimonialsGrid } from "./_sections/testimonials-grid"
import { Pricing } from "./_sections/pricing"
import { AccordionFaq } from "./_sections/accordion-faq"
import { EmailCaptureModal } from "../components/email-capture-modal"
import { TrackedButtonLink } from "../components/tracked-button"

const scrollToPricing = () => {
  const pricingSection = document.getElementById("pricing-section")
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: "smooth" })
  }
}

// Mock data for Allumi landing page
const heroData = {
  _analyticsKey: "allumi-hero",
  tagline: "Attribution for Skool Communities",
  customerSatisfactionBanner: {
    text: "Join 50 Beta Users - Lock in Founder Pricing",
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
  title: "Get More High-Quality, Low-Churn Members FASTER",
  subtitle:
    "Half your marketing is working. Too bad you don't know which half. Track what drives members who pay and stay.",
  actions: [
    {
      _id: "secondary-cta",
      href: "#",
      label: "Watch 2-Min Demo",
      sublabel: "",
      type: "secondary" as const,
      onClick: "waitlist", // Trigger waitlist modal
    },
    {
      _id: "primary-cta",
      href: "#",
      label: "Start Free 14-Day Trial",
      sublabel: "",
      type: "primary" as const,
      onClick: "waitlist", // Trigger waitlist modal
    },
  ],
}

const featuresData = {
  _analyticsKey: "allumi-features",
  heading: {
    title: "Track What Actually Drives Revenue",
    subtitle: "Stop guessing. Start knowing. Scale with confidence.",
    align: "center" as const,
  },
  featuresGridList: {
    items: [
      {
        _id: "attribution",
        _title: "See What Drives Revenue",
        description:
          "Track which content, ads, and sources drive paying members. See conversion rates, LTV by channel, and which sources bring buyers vs browsers.",
        icon: { url: "/icons/chart.svg", alt: "Attribution Dashboard" },
      },
      {
        _id: "setup",
        _title: "Simple Setup",
        description:
          "Connect via Zapier in 5 minutes",
        icon: { url: "/icons/globe.svg", alt: "Simple Setup" },
      },
      {
        _id: "quality",
        _title: "Quality Metrics",
        description:
          "See which sources bring members who stay 6 months vs 2 weeks",
        icon: { url: "/icons/users.svg", alt: "Quality Metrics" },
      },
      {
        _id: "scale",
        _title: "Scale With Confidence",
        description:
          "Know exactly which content to put paid ads behind",
        icon: { url: "/icons/trophy.svg", alt: "Scale With Confidence" },
      },
    ],
  },
  actions: [
    {
      _id: "features-cta",
      href: "#",
      label: "Start Free 14-Day Trial",
      type: "primary" as const,
      onClick: "waitlist",
    },
  ],
}

const testimonialsData = {
  heading: {
    title: "Community Owners Who Stopped Guessing",
    subtitle: "Real results from Skool community owners using attribution",
    align: "center" as const,
  },
  quotes: [
    {
      _id: "testimonial-1",
      quote:
        "Spent 18 months grinding organic. Attribution showed one Reddit style converted at 40%. Put $2K/month ads behind it. Went from $5K → $25K MRR in 60 days.",
      author: {
        _title: "Marcus R.",
        role: "Community Owner",
        company: { _title: "" },
        image: {
          url: "https://i.pravatar.cc/150?img=10",
          alt: "Marcus R.",
        },
      },
    },
    {
      _id: "testimonial-2",
      quote:
        "Posted motivational content for 2 YEARS. Attribution revealed technical tutorials converted 8x better. Complete game-changer.",
      author: {
        _title: "Sarah C.",
        role: "Community Owner",
        company: { _title: "" },
        image: {
          url: "https://i.pravatar.cc/150?img=11",
          alt: "Sarah C.",
        },
      },
    },
    {
      _id: "testimonial-3",
      quote:
        "Found my YouTube drove $8,400, Instagram drove $0. Was spending $3K/month on Instagram. Saved $36K/year.",
      author: {
        _title: "Your Name",
        role: "Community Owner",
        company: { _title: "" },
        image: {
          url: "https://i.pravatar.cc/150?img=12",
          alt: "Your Name",
        },
      },
    },
  ],
}

const pricingData = {
  heading: {
    title: "Simple, Transparent Pricing",
    subtitle: "Hyros costs $999+/month for similar tracking",
    align: "center" as const,
  },
  plans: {
    items: [
      {
        plan: {
          _id: "starter",
          _title: "Starter",
          price: "$49/month",
          billed: "",
          isMostPopular: false,
          list: {
            items: [
              { _id: "starter-1", _title: "Up to 500 members" },
              { _id: "starter-2", _title: "Basic attribution (first-click)" },
              { _id: "starter-3", _title: "Email support" },
            ],
          },
          cta: {
            label: "Get Started",
            href: "#",
            onClick: "waitlist",
          },
        },
      },
      {
        plan: {
          _id: "growth",
          _title: "Growth",
          price: "$79/month",
          billed: "",
          isMostPopular: true,
          badge: "MOST POPULAR",
          list: {
            items: [
              { _id: "growth-1", _title: "Unlimited members" },
              { _id: "growth-2", _title: "Full attribution suite" },
              { _id: "growth-3", _title: "Conversion quality metrics" },
              { _id: "growth-4", _title: "Chat support" },
            ],
          },
          cta: {
            label: "Get Started",
            href: "#",
            onClick: "waitlist",
          },
        },
      },
      {
        plan: {
          _id: "scale",
          _title: "Scale",
          price: "$149/month",
          billed: "",
          isMostPopular: false,
          list: {
            items: [
              { _id: "scale-1", _title: "Everything in Growth" },
              { _id: "scale-2", _title: "Multi-touch attribution" },
              { _id: "scale-3", _title: "API access" },
              { _id: "scale-4", _title: "White-label reports" },
            ],
          },
          cta: {
            label: "Get Started",
            href: "#",
            onClick: "waitlist",
          },
        },
      },
    ],
  },
}

const calloutData = {
  _analyticsKey: "allumi-callout",
  title: "You can't optimize what you can't measure",
  subtitle:
    "See what drives revenue today.",
  actions: [
    {
      _id: "final-cta",
      href: "#",
      label: "Join 50 Beta Users - Lock in Founder Pricing",
      type: "primary" as const,
      onClick: "waitlist",
    },
  ],
}

const faqData = {
  layout: "accordion" as const,
  heading: {
    title: "Frequently Asked Questions",
    subtitle:
      "Learn how attribution tracking can transform your Skool community",
    align: "center" as const,
  },
  questions: {
    items: [
      {
        _id: "faq-1",
        _title: "How does attribution work with Skool?",
        answer:
          "Connect Allumi to your Skool community via Zapier in 5 minutes. We track where each member came from and their lifetime value, giving you insights Skool doesn't provide.",
      },
      {
        _id: "faq-2",
        _title: "What metrics can I track?",
        answer:
          "Track conversion rates by source, lifetime value by channel, member quality metrics (retention, engagement), and which content drives paying members vs free browsers.",
      },
      {
        _id: "faq-3",
        _title: "How quickly will I see results?",
        answer:
          "Most community owners discover game-changing insights within 24 hours. Like finding that one Reddit post style converts at 40% while Instagram converts at 0%.",
      },
      {
        _id: "faq-4",
        _title: "Is there a free trial?",
        answer:
          "Yes, we offer a 14-day free trial. No credit card required. See exactly what drives your revenue before you pay.",
      },
    ],
  },
}

const backstoryData = {
  _analyticsKey: "allumi-backstory",
  title: "First 20 users get 50% off forever",
  quote:
    "",
  author: {
    name: "",
    title: "",
    image: "",
  },
}

const contextSection = {
  _analyticsKey: "why-attribution",
  heading: {
    title: "Why Attribution Is Your Competitive Edge",
    subtitle: "Stop the organic hamster wheel. Start scaling with confidence.",
    align: "center" as const,
  },
  points: [
    {
      title: "The Organic Hamster Wheel (Problem)",
      description:
        "Without attribution, you're forced to: Post daily on 5 platforms hoping something sticks. Spend 40 hours/week on content that might work. Stay small because ads are 'too risky'.",
    },
    {
      title: "With Attribution (Solution)",
      description: "Find your one winning content type. Put ads behind ONLY what works. Skip the 2-year organic grind. Scale from $5K to $50K MRR in months.",
    },
  ],
}

export default function HomePage() {
  const [emailCaptureOpen, setEmailCaptureOpen] = useState(false)
  const [emailCaptureType, setEmailCaptureType] = useState<"demo" | "trial">("demo")

  useEffect(() => {
    // Handle hash navigation when coming from other pages
    if (window.location.hash === '#features') {
      setTimeout(() => {
        const featuresSection = document.querySelector('[data-section="features"]');
        if (featuresSection) {
          featuresSection.scrollIntoView({ behavior: 'smooth' });
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
        title="Get Early Access to Open Beta"
        description="Open beta is about to start. Be first to get access!"
      />
      <div>
        <Hero
          {...heroData}
          eventsKey="allumi-events"
          onActionClick={(action) => {
            if (action.onClick === "demo") {
              setEmailCaptureType("demo")
              setEmailCaptureOpen(true)
              return
            } else if (action.onClick === "scroll") {
              setEmailCaptureType("trial")
              setEmailCaptureOpen(true)
            } else if (action.onClick === "waitlist") {
              setEmailCaptureType("waitlist")
              setEmailCaptureOpen(true)
            }
          }}
        />
      </div>
      <div data-section="features">
        <FeaturesGrid {...featuresData} eventsKey="allumi-events" />
      </div>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{contextSection.heading.title}</h2>
            <p className="text-lg text-muted-foreground">{contextSection.heading.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4 text-red-700 dark:text-red-400">{contextSection.points[0].title}</h3>
              <p className="text-muted-foreground leading-relaxed">{contextSection.points[0].description}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">{contextSection.points[1].title}</h3>
              <p className="text-muted-foreground leading-relaxed">{contextSection.points[1].description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-purple-600/10 to-blue-600/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-balance">{backstoryData.title}</h2>
            <p className="text-lg text-muted-foreground">Join 50 Beta Users getting attribution insights that transform their communities</p>
            <div className="mt-8">
              <TrackedButtonLink
                analyticsKey="allumi-events"
                className="inline-flex px-8 py-3"
                href="#"
                intent="primary"
                name="final_cta"
                onClick={() => {
                  setEmailCaptureOpen(true)
                }}
              >
                Lock in Founder Pricing
              </TrackedButtonLink>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsGrid {...testimonialsData} />
      <div id="pricing-section">
        <Pricing {...pricingData} />
      </div>
      <AccordionFaq {...faqData} eventsKey="allumi-events" />
    </>
  )
}
