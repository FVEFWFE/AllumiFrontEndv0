"use client"

import { useState } from "react"
import { Hero } from "../_sections/hero"
import { Companies } from "../_sections/companies"
import { FeaturesGrid } from "../_sections/features/features-grid"
import { TestimonialsGrid } from "../_sections/testimonials-grid"
import { AccordionFaq } from "../_sections/accordion-faq"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle } from "lucide-react"

// Beta waitlist hero data
const heroData = {
  _analyticsKey: "allumi-beta-hero",
  tagline: "Illuminate Your Empire™ - Beta Access",
  customerSatisfactionBanner: {
    text: "Join 127+ early adopters building their empire",
    avatars: {
      items: [
        {
          _id: "1",
          avatar: {
            url: "https://i.pravatar.cc/150?img=1",
            alt: "Beta User 1",
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
            alt: "Beta User 2",
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
            alt: "Beta User 3",
            width: 40,
            height: 40,
            aspectRatio: 1,
            blurDataURL: "",
          },
        },
      ],
    },
  },
  title: "Be First to Stop Renting in Skool's Mall. Join the Beta.",
  subtitle:
    "Get exclusive early access to the only community platform with full attribution tracking. See exactly where every paying member comes from while saving 40% off Skool. Limited to 500 beta users.",
  customContent: true, // This will tell Hero component to use children instead of default buttons
}

const companiesData = {
  subtitle: "Early adopters already migrating from Skool and building their empire",
  companies: [
    { _title: "Beta Academy", url: "#", image: { url: "https://via.placeholder.com/150x50/10B981/FFFFFF?text=Beta+Academy" } },
    { _title: "Early Empire", url: "#", image: { url: "https://via.placeholder.com/150x50/10B981/FFFFFF?text=Early+Empire" } },
    { _title: "Pioneer Platform", url: "#", image: { url: "https://via.placeholder.com/150x50/10B981/FFFFFF?text=Pioneer+Platform" } },
    { _title: "First Movers", url: "#", image: { url: "https://via.placeholder.com/150x50/10B981/FFFFFF?text=First+Movers" } },
    { _title: "Beta Leaders", url: "#", image: { url: "https://via.placeholder.com/150x50/10B981/FFFFFF?text=Beta+Leaders" } },
  ],
}

const featuresData = {
  _analyticsKey: "allumi-beta-features",
  heading: {
    title: "Everything Skool Has, Plus What They'll Never Give You",
    subtitle: "Available in beta: Full feature parity with Skool + attribution tracking they can't offer.",
    align: "center" as const,
  },
  featuresGridList: {
    items: [
      {
        _id: "attribution",
        _title: "Attribution Dashboard™ (Beta Exclusive)",
        description:
          "Be among the first to see exactly which content, ads, and sources drive paying members. Track lifetime value by channel. Know your CAC and ROAS.",
        icon: { url: "/icons/chart.svg", alt: "Attribution Dashboard" },
      },
      {
        _id: "domain",
        _title: "Your Custom Domain (Available Now)",
        description:
          "yourdomain.com builds YOUR brand equity from day one. Beta users get priority domain setup and migration support.",
        icon: { url: "/icons/globe.svg", alt: "Custom Domain Setup" },
      },
      {
        _id: "courses",
        _title: "Full Course Platform (Live in Beta)",
        description:
          "Modules, lessons, drip content, progress tracking - everything you have in Skool, ready today.",
        icon: { url: "/icons/book.svg", alt: "Courses Dashboard" },
      },
      {
        _id: "community",
        _title: "Community Features (100% Complete)",
        description:
          "Real-time discussions, categories, comments - familiar interface, no competitor Discovery page.",
        icon: { url: "/icons/users.svg", alt: "Community Interface" },
      },
      {
        _id: "beta-pricing",
        _title: "Beta Pricing Lock (50% Off Forever)",
        description:
          "Join during beta and lock in 50% off regular pricing forever. $44/mo instead of $89. Save $540/year vs Skool.",
        icon: { url: "/icons/trophy.svg", alt: "Beta Pricing" },
      },
      {
        _id: "priority",
        _title: "Priority Support & Input",
        description: "Direct access to founders. Your feedback shapes the platform. White-glove migration included.",
        icon: { url: "/icons/calendar.svg", alt: "Priority Support" },
      },
    ],
  },
}

const testimonialsData = {
  heading: {
    title: "What Beta Users Are Saying",
    subtitle: "Real feedback from the first 100+ community owners who made the switch",
    align: "center" as const,
  },
  quotes: [
    {
      _id: "beta-testimonial-1",
      quote:
        "Got beta access last week. Attribution already showed me Facebook ads were worthless - all my revenue came from one YouTube video. Saved me $2K this month alone.",
      author: {
        _title: "Michael Chen",
        role: "Beta User #47",
        company: { _title: "Growth Academy" },
        image: {
          url: "https://i.pravatar.cc/150?img=10",
          alt: "Michael Chen",
        },
      },
    },
    {
      _id: "beta-testimonial-2",
      quote:
        "Migration took 48 hours. Everything transferred perfectly. My members love being on my domain instead of skool.com. Beta pricing makes this a no-brainer.",
      author: {
        _title: "Sarah Martinez",
        role: "Beta User #23",
        company: { _title: "Creator Collective" },
        image: {
          url: "https://i.pravatar.cc/150?img=11",
          alt: "Sarah Martinez",
        },
      },
    },
    {
      _id: "beta-testimonial-3",
      quote:
        "Being able to influence the product roadmap is huge. Requested a feature on Monday, had it by Friday. Try getting that from Skool.",
      author: {
        _title: "David Kim",
        role: "Beta User #89",
        company: { _title: "Code Masters" },
        image: {
          url: "https://i.pravatar.cc/150?img=12",
          alt: "David Kim",
        },
      },
    },
  ],
}

const betaBenefits = {
  heading: {
    title: "Beta Access Benefits",
    subtitle: "Limited to 500 founding members",
    align: "center" as const,
  },
  benefits: [
    {
      title: "50% Off Forever",
      description: "Lock in $44/mo instead of $89/mo for life. Never pay more, even as we add features.",
    },
    {
      title: "White-Glove Migration",
      description: "We personally migrate your entire Skool community in 48 hours. Zero downtime.",
    },
    {
      title: "Founder Access",
      description: "Direct Slack channel with founding team. Your input shapes the platform.",
    },
    {
      title: "Attribution First",
      description: "Be first to know exactly what drives revenue. Stop guessing, start growing.",
    },
    {
      title: "No Risk Trial",
      description: "Keep Skool active during beta. Export everything anytime. Full refund if not satisfied.",
    },
    {
      title: "Pioneer Badge",
      description: "Exclusive founding member status and benefits as we grow.",
    },
  ],
}

const faqData = {
  layout: "accordion" as const,
  heading: {
    title: "Beta Access Questions",
    subtitle: "Everything you need to know about joining the Allumi beta program",
    align: "center" as const,
  },
  questions: {
    items: [
      {
        _id: "beta-faq-1",
        _title: "How stable is the beta?",
        answer:
          "Very stable. We've been in private alpha for 3 months with 50 communities. Zero data loss, 99.9% uptime. All core features (courses, community, events) are production-ready. Beta mainly means you get early access to new features like advanced attribution.",
      },
      {
        _id: "beta-faq-2",
        _title: "Can I really lock in 50% off forever?",
        answer:
          "Yes. Beta users pay $44/mo forever (regular price will be $89/mo). This saves you $540/year vs our regular pricing and $660/year vs Skool. Price locked for life, even as we add features.",
      },
      {
        _id: "beta-faq-3",
        _title: "What if I'm not ready to leave Skool yet?",
        answer:
          "No problem. Keep both during beta. We'll help you run a pilot with a segment of members or duplicate your content. Most beta users fully migrate within 30 days after seeing the attribution data.",
      },
      {
        _id: "beta-faq-4",
        _title: "How many beta spots are left?",
        answer:
          "127 of 500 taken. We're accepting 10-15 per week to ensure quality migration support. Once we hit 500, beta closes and prices double.",
      },
      {
        _id: "beta-faq-5",
        _title: "Do I need technical skills?",
        answer:
          "Zero. If you can use Skool, you can use Allumi. Interface is intentionally similar. Plus, we handle all migration and setup. You just invite your members to the new domain.",
      },
      {
        _id: "beta-faq-6",
        _title: "What exactly is included in beta?",
        answer:
          "Everything: Full platform access, custom domain, unlimited members/courses, attribution dashboard, white-glove migration, priority support, founder access, and lifetime pricing. No hidden costs.",
      },
    ],
  },
}

// Email capture component
function EmailCaptureForm() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
          <p className="text-muted-foreground mb-4">
            We'll email you within 24 hours with your beta access details and migration timeline.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Position:</strong> #128 of 500 beta spots
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Enter your email for beta access"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 h-12 text-base"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="lg" 
            disabled={isLoading}
            className="h-12 px-8 text-base font-semibold bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? "Securing Spot..." : "Get Beta Access →"}
          </Button>
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            🔒 No credit card required • ⚡ Instant beta access • 💰 50% off locked forever
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>373 spots remaining</strong> • Applications reviewed within 24 hours
          </p>
        </div>
      </form>
    </div>
  )
}

export default function WaitlistPage() {
  return (
    <>
      <div>
        <Hero
          {...heroData}
          eventsKey="allumi-beta-events"
          children={<EmailCaptureForm />}
        />
      </div>
      
      <Companies {...companiesData} />
      
      {/* Beta Benefits Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{betaBenefits.heading.title}</h2>
            <p className="text-lg text-muted-foreground">{betaBenefits.heading.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {betaBenefits.benefits.map((benefit, index) => (
              <div key={index} className="bg-background rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div data-section="features">
        <FeaturesGrid {...featuresData} eventsKey="allumi-beta-events" />
      </div>

      {/* Urgency Section */}
      <section className="py-16 bg-green-50 dark:bg-green-950/10 border-y border-green-200 dark:border-green-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Beta Closing Soon: 127 of 500 Spots Taken
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Once we hit 500 beta users, prices double to $89/mo. Current beta members lock in $44/mo forever.
          </p>
          <div className="inline-flex items-center gap-8 text-sm text-muted-foreground">
            <span>✓ Accepting 10-15 per week</span>
            <span>✓ 373 spots remaining</span>
            <span>✓ Closes in ~25 weeks</span>
          </div>
        </div>
      </section>

      <TestimonialsGrid {...testimonialsData} />
      
      <AccordionFaq {...faqData} eventsKey="allumi-beta-events" />

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Own Your Empire?
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Join 127 community owners who stopped renting and started building.
              Get attribution Skool will never have. Save $660/year. Own your platform.
            </p>
            <EmailCaptureForm />
          </div>
        </div>
      </section>
    </>
  )
}