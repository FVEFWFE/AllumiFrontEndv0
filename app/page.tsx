"use client"

import { useState } from "react"
import { Hero } from "./_sections/hero"
import { FeaturesGrid } from "./_sections/features/features-grid"
import { TestimonialsGrid } from "./_sections/testimonials-grid"
import { Pricing } from "./_sections/pricing"
import { AccordionFaq } from "./_sections/accordion-faq"
import { DemoModal } from "../components/demo-modal"
import { EmailCaptureModal } from "../components/email-capture-modal"

const scrollToPricing = () => {
  const pricingSection = document.getElementById("pricing-section")
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: "smooth" })
  }
}

// Mock data for Allumi landing page
const heroData = {
  _analyticsKey: "allumi-hero",
  tagline: "Illuminate Your Empire™",
  customerSatisfactionBanner: {
    text: "Join 500+ community builders who own their empire",
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
  title: "Stop Renting in Skool's Mall. Build Your Own Empire.",
  subtitle:
    "Everything Skool has, plus see exactly where every paying member came from - for half the price. Track any source - posts, ads, podcasts, YouTube. First-click attribution included. While saving $120-$480+/year vs Skool.",
  actions: [
    {
      _id: "secondary-cta",
      href: "#",
      label: "Watch 2-Min Demo",
      sublabel: "(See what Skool hides from you)",
      type: "secondary" as const,
      onClick: "demo", // Added demo action
    },
    {
      _id: "primary-cta",
      href: "#pricing-section",
      label: "Start Free 14-Day Trial",
      sublabel: "(No credit card required)",
      type: "primary" as const,
      onClick: "scroll", // Added scroll action
    },
  ],
}

const featuresData = {
  _analyticsKey: "allumi-features",
  heading: {
    title: "Everything Skool Has, Plus What They'll Never Give You",
    subtitle: "We didn't just match Skool's features - we kept everything you love and added what they won't.",
    align: "center" as const,
  },
  featuresGridList: {
    items: [
      {
        _id: "attribution",
        _title: "Member Attribution Dashboard",
        description:
          "Our secret weapon. See exactly which content, ads, and sources drive paying members. Track lifetime value by channel. Know your CAC and ROAS. Skool shows total revenue - we show what created it.",
        icon: { url: "/icons/chart.svg", alt: "Attribution Dashboard" },
      },
      {
        _id: "domain",
        _title: "Your Custom Domain",
        description:
          "yourdomain.com builds YOUR brand equity, not Skool's. Every ad dollar strengthens your authority.",
        icon: { url: "/icons/globe.svg", alt: "Custom Domain Setup" },
      },
      {
        _id: "courses",
        _title: "Courses & Classroom",
        description:
          "Modules, lessons, drip content, progress tracking - identical to Skool's system you already know.",
        icon: { url: "/icons/book.svg", alt: "Courses Dashboard" },
      },
      {
        _id: "community",
        _title: "Community & Discussions",
        description:
          "Real-time discussions, categories, comments - same interface, but no Discovery page showing competitors.",
        icon: { url: "/icons/users.svg", alt: "Community Interface" },
      },
      {
        _id: "events",
        _title: "Events & Calendar",
        description:
          "Timezone support, RSVP, livestream integration - all happening on YOUR domain, building YOUR authority.",
        icon: { url: "/icons/calendar.svg", alt: "Events Calendar" },
      },
      {
        _id: "gamification",
        _title: "Gamification (9 Levels)",
        description: "Points, levels, leaderboards - same system, but tied to your brand equity, not theirs.",
        icon: { url: "/icons/trophy.svg", alt: "Gamification System" },
      },
    ],
  },
  actions: [
    {
      _id: "features-cta",
      href: "/migrate-now",
      label: "Migrate Everything in 48 Hours",
      type: "primary" as const,
    },
    {
      _id: "create-new-cta",
      href: "/create-community",
      label: "Create a New Community",
      type: "secondary" as const,
    },
  ],
}

const testimonialsData = {
  heading: {
    title: "What Community Builders Say About Making the Switch",
    subtitle: "Real feedback from community owners who chose ownership over renting",
    align: "center" as const,
  },
  quotes: [
    {
      _id: "testimonial-1",
      quote:
        "I was worried about losing Skool's features. Turns out Allumi has everything - courses, community, gamification - PLUS I can finally see what drives revenue. Saving $600/year is just a bonus.",
      author: {
        _title: "Sarah Chen",
        role: "Community Owner",
        company: { _title: "The Smooth Switcher" },
        image: {
          url: "https://i.pravatar.cc/150?img=10",
          alt: "Sarah Chen",
        },
      },
    },
    {
      _id: "testimonial-2",
      quote:
        "Thought cheaper meant fewer features. Wrong. Same course builder, same discussions, same events. But with attribution showing my YouTube drives 10x more than Instagram. Game changer.",
      author: {
        _title: "Marcus Rodriguez",
        role: "Community Owner",
        company: { _title: "The Feature Skeptic" },
        image: {
          url: "https://i.pravatar.cc/150?img=11",
          alt: "Marcus Rodriguez",
        },
      },
    },
    {
      _id: "testimonial-3",
      quote:
        "Run 500+ members with courses, events, and heavy gamification. Everything transferred perfectly. Now I see which course modules drive upgrades. Why doesn't Skool show this?",
      author: {
        _title: "Jennifer Park",
        role: "Community Owner",
        company: { _title: "The Power User" },
        image: {
          url: "https://i.pravatar.cc/150?img=12",
          alt: "Jennifer Park",
        },
      },
    },
    {
      _id: "testimonial-4",
      quote:
        "The Discovery page was killing me. Members would join, browse other communities, and leave. Now they focus on MY content. Revenue up 40% since switching.",
      author: {
        _title: "David Kim",
        role: "Coach",
        company: { _title: "Focus Academy" },
        image: {
          url: "https://i.pravatar.cc/150?img=13",
          alt: "David Kim",
        },
      },
    },
    {
      _id: "testimonial-5",
      quote:
        "Attribution dashboard shows my podcast drives 3x more lifetime value than social media. This data alone pays for the platform. Wish I'd switched sooner.",
      author: {
        _title: "Lisa Thompson",
        role: "Host",
        company: { _title: "Revenue Insights Podcast" },
        image: {
          url: "https://i.pravatar.cc/150?img=14",
          alt: "Lisa Thompson",
        },
      },
    },
    {
      _id: "testimonial-6",
      quote:
        "Same gamification system, same course structure, same everything - but members aren't distracted by competitors. Engagement up 60% since migration.",
      author: {
        _title: "Alex Johnson",
        role: "Founder",
        company: { _title: "Engagement Masters" },
        image: {
          url: "https://i.pravatar.cc/150?img=15",
          alt: "Alex Johnson",
        },
      },
    },
  ],
}

const pricingData = {
  heading: {
    title: "More Features, Less Cost, Your Domain",
    subtitle: "Attribution intelligence Skool doesn't have. Save $120-$480/year. Own your platform.",
    align: "center" as const,
  },
  plans: {
    items: [
      {
        plan: {
          _id: "skool-comparison",
          _title: "Skool",
          price: "$99/month",
          billed: "What you're paying now",
          isMostPopular: false,
          list: {
            items: [
              { _id: "skool-1", _title: "Community & courses" },
              { _id: "skool-2", _title: "Stuck on skool.com/you" },
              { _id: "skool-3", _title: "No attribution tracking" },
              { _id: "skool-4", _title: "Discovery shows competitors" },
              { _id: "skool-5", _title: "2.9% transaction fees" },
              { _id: "skool-6", _title: "Building their $3B valuation" },
            ],
          },
          cta: {
            label: "❌ Stay Dependent",
            href: "#",
            disabled: true,
          },
        },
      },
      {
        plan: {
          _id: "allumi-starter",
          _title: "Allumi Starter",
          price: "$59/month",
          billed: "Save $480/year vs Skool's $99",
          isMostPopular: false,
          list: {
            items: [
              { _id: "starter-1", _title: "Full community & discussions" },
              { _id: "starter-2", _title: "Your custom domain included" },
              { _id: "starter-3", _title: "Private community (no Discovery)" },
              { _id: "starter-4", _title: "Up to 250 members" },
              { _id: "starter-5", _title: "3 complete courses" },
              { _id: "starter-6", _title: "Basic attribution tracking" },
              { _id: "starter-7", _title: "YouTube/Vimeo integration" },
              { _id: "starter-8", _title: "Gamification (3 levels)" },
              { _id: "starter-9", _title: "Events & calendar" },
              { _id: "starter-10", _title: "Member directory" },
              { _id: "starter-11", _title: "Mobile responsive" },
              { _id: "starter-12", _title: "Email support" },
            ],
          },
          cta: {
            label: "Start Small",
            href: "/start-small",
          },
        },
      },
      {
        plan: {
          _id: "allumi-professional",
          _title: "Allumi Professional",
          price: "$89/month",
          billed: "Save $120/year + get everything",
          isMostPopular: true,
          badge: "BEST VALUE",
          list: {
            items: [
              { _id: "pro-1", _title: "Full Attribution Suite™ (multi-touch, LTV)" },
              { _id: "pro-2", _title: "Unlimited members, courses, storage" },
              { _id: "pro-3", _title: "Complete Gamification (all 9 levels)" },
              { _id: "pro-4", _title: "Native video hosting (saves $59/mo)" },
              { _id: "pro-5", _title: "Full white-label branding" },
              { _id: "pro-6", _title: "Zapier + webhooks + API access" },
              { _id: "pro-7", _title: "Advanced analytics & cohort reports" },
              { _id: "pro-8", _title: "Direct Stripe integration (you own payments)" },
              { _id: "pro-9", _title: "Priority 48-hour migration" },
              { _id: "pro-10", _title: "Live chat + phone support" },
              { _id: "pro-11", _title: "5 team seats included" },
            ],
          },
          cta: {
            label: "→ Get Started",
            href: "/get-started",
          },
          footer: "Still $120/year less than Skool",
        },
      },
    ],
  },
}

const calloutData = {
  _analyticsKey: "allumi-callout",
  title: "Stop Paying More for Less",
  subtitle:
    "Every day on Skool, your members browse to cheaper alternatives while you pay $99/month to build their empire, not yours.",
  actions: [
    {
      _id: "final-cta",
      href: "/graduate-now",
      label: "Graduate to Ownership",
      type: "primary" as const,
    },
    {
      _id: "demo-cta",
      href: "/watch-demo",
      label: "Watch Migration Demo",
      type: "secondary" as const,
    },
  ],
}

const faqData = {
  layout: "accordion" as const,
  heading: {
    title: "Everything You Need to Know",
    subtitle:
      "Get answers to common questions about switching from Skool to Allumi and building your own community empire.",
    align: "center" as const,
  },
  questions: {
    items: [
      {
        _id: "faq-1",
        _title: "Do you really have ALL Skool's features?",
        answer:
          "Yes. Courses (modules, lessons, drip content), Community (discussions, categories, real-time), Events (calendar, RSVP), Gamification (9 levels, points, leaderboards), Chat, Mobile apps, Video hosting - it's all here. Plus attribution they can't offer.",
      },
      {
        _id: "faq-why-attribution",
        _title: "Why is attribution such a big deal?",
        answer:
          "I burned $500K on marketing without knowing what worked. Most community owners face the same problem - spending thousands on ads but only seeing total revenue, not source. Attribution changes everything. When you see that one YouTube video drives 47 members worth $8,400 LTV, you stop guessing and start growing.",
      },
      {
        _id: "faq-guarantee",
        _title: "What's your guarantee if I'm not satisfied?",
        answer:
          "We have the industry's only \"Better Than Skool Guarantee\": Try Allumi risk-free for 30 days. If you don't find at least one significant revenue insight from our attribution dashboard, we'll not only refund your money - we'll pay for your next month of Skool. Plus, you keep your Skool account active during the trial, so there's zero disruption risk. You can also export everything (members, content, data) at any time. We're that confident you'll discover game-changing insights in your attribution data. Our 500+ migrated communities found an average of $10K in optimization opportunities within 30 days.",
      },
      {
        _id: "faq-2",
        _title: "Will my members notice a difference?",
        answer:
          "Only positive ones. Same familiar interface, but on your professional domain. No Discovery page distracting them. Most members get excited about the upgrade.",
      },
      {
        _id: "faq-3",
        _title: "How can you offer more for less?",
        answer:
          "Skool built on 2019 infrastructure with expensive Discovery overhead. We built lean in 2025. Modern tech costs less. We pass savings to you while adding features they won't.",
      },
      {
        _id: "faq-4",
        _title: "What about migration?",
        answer:
          "48-hour white-glove service. We migrate all members, content, discussions, points, events - everything. 98% member retention through transfer. Interface so similar, members won't need training.",
      },
      {
        _id: "faq-5",
        _title: "Why does everyone say Skool is becoming MLM central?",
        answer:
          'Search "Skool MLM" on Reddit. Screenshots everywhere: "pyramid scheme platform," "everyone selling how to sell communities." Your legitimate business gets lumped with "Make $10K in 30 days!" scams. Your expertise deserves better than guilty by association.',
      },
      {
        _id: "faq-6",
        _title: "How does Discovery actually hurt my business?",
        answer:
          "You spend $500 acquiring a member through ads. They browse Discovery, find a cheaper alternative, and leave. You literally paid $500 to create a competitor's customer. Worse, your successful students see other communities and think \"I could do that.\" You're running a free incubator for competition while paying $99/month for the privilege.",
      },
      {
        _id: "faq-7",
        _title: "Why can't I scale past $5-10K MRR?",
        answer:
          "You're stuck in the organic hamster wheel. Without attribution, you can't run profitable paid ads. You create 100 pieces of content hoping 5 work. With attribution, you'd find those 5 winners, create 20 variations, spend $5K scaling them, and grow exponentially. Organic-only takes 18 months. Attribution-powered paid ads take 3-6 months.",
      },
      {
        _id: "faq-8",
        _title: "I spent $3K on Facebook ads but can't tell if they worked",
        answer:
          "This is attribution blindness. You might have gotten 100 new members while running Facebook ads, but 80 actually came from your organic YouTube. Without attribution, you think Facebook works, scale to $10K, lose money, and give up on paid ads forever.",
      },
      {
        _id: "faq-9",
        _title: "What's this about not being able to sell my community?",
        answer:
          'Communities without attribution sell for 1-2x revenue. Buyers ask "What drives growth?" You say "content and community." They see risk. Communities WITH attribution and custom domains sell for 4-6x. You show 18 months of data: "YouTube drives 67%, LinkedIn 23%." They see a predictable machine.',
      },
      {
        _id: "faq-10",
        _title: "How does not having my own domain hurt me?",
        answer:
          "skool.com/you = amateur. YourDomain.com = professional. Close rate doubles. Price tolerance increases 2.3x. Exit multiple jumps from 2x to 4x. Corporate clients won't send employees to generic platform URLs. You're sending $5K clients to what looks like a hobby.",
      },
      {
        _id: "faq-11",
        _title: "How is Skool keeping me dependent?",
        answer:
          "They hide attribution so you can't optimize. They force Discovery so you need their traffic. They keep you on their domain so you can't build equity. They show your members competitors so you can't raise prices. You're not their customer - you're their product.",
      },
      {
        _id: "faq-12",
        _title: "How fast until I see ROI on switching?",
        answer:
          "24 hours to first attribution insight. 48 hours to complete migration. Day 3: identify first waste to cut. Week 1: reallocate budget to winners. Day 30: average $10K in found opportunities. Month 2: growing 40% faster. Plus you save $120-$480/year immediately.",
      },
    ],
  },
}

const backstoryData = {
  _analyticsKey: "allumi-backstory",
  title: "Why I Built This",
  quote:
    "I built a $15K MRR community on Skool while burning $3,000/month on Instagram ads. One day, I finally tracked my attribution manually - Instagram drove $0 in revenue. YouTube drove $8,400. I'd wasted $36,000 that year alone. Then I watched three of my top members start competing communities they found through Skool's Discovery page. I was paying $99/month to train my competition while flying blind on what actually worked. That's when I realized: Skool profits by keeping us dependent and in the dark. So I built Allumi - the only platform with full attribution tracking, your own domain, and no competitor browsing. All for $120-$480 less per year than Skool.",
  author: {
    name: "Jan Jegen",
    title: "Founder, Allumi",
    image: "/founder-jan-jegen.jpg",
  },
}

const contextSection = {
  _analyticsKey: "why-attribution",
  heading: {
    title: "See What Actually Gets You Paying Members",
    subtitle: "You're already losing money - even without running ads",
    align: "center" as const,
  },
  points: [
    {
      title: "You're Creating The Wrong Content",
      description:
        "Sarah posted motivational content for 2 YEARS. Attribution revealed technical tutorials converted 8x better. Two years wasted because she couldn't see what worked.",
    },
    {
      title: "Every Post Is Worth $0 or $10,000",
      description: "That Reddit comment that brought 5 members? Worth $6,000 in lifetime revenue. That Instagram post you spent 3 hours on? Worth $0. But you have no idea which is which.",
    },
    {
      title: "Stop Wasting Months on Dead Channels",
      description:
        "You're grinding on Instagram, LinkedIn, YouTube, Twitter... What if 90% of your paying members come from ONE channel? Most creators waste 6-12 months before randomly discovering what works. Attribution shows you on day one.",
    },
    {
      title: "Your Successful Posts Are Gold - But You Can't Replicate Them",
      description:
        "You got 10 members last month. Great! But from where? That viral Twitter thread? Your YouTube tutorial? A random Reddit comment? Without attribution, you're shooting in the dark.",
    },
  ],
}

export default function HomePage() {
  const [emailCaptureOpen, setEmailCaptureOpen] = useState(false)
  const [emailCaptureType, setEmailCaptureType] = useState<"demo" | "trial">("demo")

  return (
    <>
      <EmailCaptureModal
        open={emailCaptureOpen}
        onOpenChange={setEmailCaptureOpen}
        title="Get Early Access to Open Beta"
        description="Open beta is about to start. Be first to get access!"
      />
      <DemoModal>
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
              }
            }}
          />
        </div>
      </DemoModal>
      <div data-section="features">
        <FeaturesGrid {...featuresData} eventsKey="allumi-events" />
      </div>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{contextSection.heading.title}</h2>
            <p className="text-lg text-muted-foreground">{contextSection.heading.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {contextSection.points.map((point, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-semibold mb-4">{point.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
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
      <AccordionFaq {...faqData} eventsKey="allumi-events" />
    </>
  )
}
