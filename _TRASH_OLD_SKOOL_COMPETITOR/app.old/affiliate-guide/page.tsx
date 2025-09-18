"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Download, TrendingUp, DollarSign, Users, BarChart3, Clock, Zap, BookOpen, Target } from "lucide-react"

export default function AffiliateGuidePage() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-transparent to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 opacity-50" />
        
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left Column - Content */}
              <div>
                {/* Trust Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-950/50 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-300">
                  <TrendingUp className="h-4 w-4" />
                  Case Study: $15,276 Last Month
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
                  How I Went From{" "}
                  <span className="text-red-600">Flying Blind</span> to{" "}
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    $15K/Month
                  </span>{" "}
                  With Attribution
                </h1>

                <p className="mb-8 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  The exact blueprint I used to build a $15,276/month community empire on Allumi - including my 
                  <strong> attribution dashboard screenshots</strong> showing which content drives 73% of my revenue 
                  (hint: it's not what you think).
                </p>

                {/* Bullet Points */}
                <ul className="mb-8 space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>My "3-Source System" that generates 500+ members/month on autopilot</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>The $2,847 "hidden revenue stream" 91% of community owners miss</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Why I switched from Skool (and saved $1,188/year while 3x'ing growth)</span>
                  </li>
                </ul>

                {/* Form */}
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="h-12"
                        disabled={isLoading}
                      />
                      <Input
                        type="email"
                        placeholder="Best email for the guide"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12"
                        disabled={isLoading}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={isLoading}
                      className="h-12 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-base"
                    >
                      {isLoading ? (
                        "Sending Your Guide..."
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          Get The Free Case Study →
                        </>
                      )}
                    </Button>
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                      🔒 Your email is safe. Unsubscribe anytime. No spam, ever.
                    </p>
                  </form>
                ) : (
                  <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Check your email, {firstName}!
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          I just sent the case study to <strong>{email}</strong>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Also sending you my weekly revenue reports showing live attribution data.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Proof */}
                <div className="mt-8 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <img
                        key={i}
                        src={`https://i.pravatar.cc/40?img=${i + 20}`}
                        alt={`Reader ${i}`}
                        className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-900"
                      />
                    ))}
                  </div>
                  <span>Join 2,847+ community builders reading this</span>
                </div>
              </div>

              {/* Right Column - Visual Proof */}
              <div className="relative">
                {/* Mock Dashboard Screenshot */}
                <div className="relative rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
                  {/* Browser Chrome */}
                  <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-gray-500">app.allumi.com/dashboard</span>
                    </div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-6 space-y-4">
                    {/* Revenue Card */}
                    <div className="rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</span>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">$15,276</div>
                      <div className="text-sm text-green-600 dark:text-green-400">+42% from last month</div>
                    </div>

                    {/* Attribution Bars */}
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Revenue by Source</div>
                      
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-400">YouTube (1 video)</span>
                            <span className="font-medium">$11,156</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                            <div className="h-2 rounded-full bg-green-600" style={{ width: "73%" }} />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Email Newsletter</span>
                            <span className="font-medium">$2,441</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                            <div className="h-2 rounded-full bg-blue-600" style={{ width: "16%" }} />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Organic Search</span>
                            <span className="font-medium">$1,679</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                            <div className="h-2 rounded-full bg-purple-600" style={{ width: "11%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">487</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">$31</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Avg. LTV</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">89%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Retention</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 rounded-lg bg-yellow-100 dark:bg-yellow-950/50 border border-yellow-300 dark:border-yellow-800 px-4 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      Live Dashboard
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                What's Inside The Case Study
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                27 pages of screenshots, data, and step-by-step breakdowns
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: BarChart3,
                  title: "The Attribution Goldmine",
                  description: "See my actual dashboard showing how ONE YouTube video drives $11,156/mo (while Instagram drives $0)"
                },
                {
                  icon: Target,
                  title: "The 3-Source System",
                  description: "My exact content strategy that predictably generates 500+ members/month without paid ads"
                },
                {
                  icon: DollarSign,
                  title: "Hidden Revenue Stream",
                  description: "The $2,847/mo backend offer that 91% of community owners don't know exists"
                },
                {
                  icon: Users,
                  title: "Migration Playbook",
                  description: "How I moved 312 members from Skool in 48 hours with 97% retention rate"
                },
                {
                  icon: Clock,
                  title: "4-Hour Work Week",
                  description: "My automation stack that runs the community with just 4 hours/week of work"
                },
                {
                  icon: BookOpen,
                  title: "Bonus: Email Templates",
                  description: "5 highest-converting emails including the one that made $4,200 in 24 hours"
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950/50">
                      <item.icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100 mb-12">
              What Readers Are Saying
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  quote: "I was flying blind spending $2K/mo on Instagram. Attribution showed it drove $0. Cut it, doubled down on YouTube, now at $8K MRR.",
                  author: "Michael C.",
                  role: "Fitness Community Owner",
                  rating: 5
                },
                {
                  quote: "Finally see my data like e-commerce stores do. Discovered my email list drives 3x more LTV than social. Game changer.",
                  author: "Sarah M.",
                  role: "Course Creator, 450 Members",
                  rating: 5
                },
                {
                  quote: "48-hour migration, 97% retention. Members love being on my domain instead of skool.com/mygroup. Look way more professional.",
                  author: "David L.",
                  role: "Consultant, $12K MRR",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={index} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
                  <div className="mb-3 flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/40?img=${index + 30}`}
                      alt={testimonial.author}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {testimonial.author}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Author Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950/50 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Who's Behind This?
              </h2>
            </div>

            <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src="https://i.pravatar.cc/150?img=20"
                  alt="Jan Jegen"
                  className="h-24 w-24 rounded-full shrink-0"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Hey, I'm Jan Jegen 👋
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    I built a $15K/month community after burning $36,000 on Instagram ads that drove exactly $0 in revenue. 
                    The game changed when I switched to Allumi and could finally see attribution data.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Now I help community owners escape the "Skool trap" and build real businesses with data-driven growth. 
                    This case study shows exactly how I did it - including screenshots most "gurus" would never share.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>🚀 Founded Allumi</span>
                    <span>📊 500+ communities migrated</span>
                    <span>💰 $7.2M collective MRR tracked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100 mb-12">
              Common Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "Is this really free?",
                  a: "Yes, 100% free. No hidden upsells. I make money when you succeed with Allumi, not from selling PDFs."
                },
                {
                  q: "Do I need to be an Allumi user?",
                  a: "No. The strategies work on any platform. But you'll see why attribution data changes everything."
                },
                {
                  q: "How long is the case study?",
                  a: "27 pages with screenshots, charts, and templates. Takes about 20 minutes to read, lifetime to master."
                },
                {
                  q: "Will this work for my niche?",
                  a: "Yes. I show examples from fitness, business, creative, and technical communities all using the same system."
                }
              ].map((faq, index) => (
                <div key={index} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Ready to Build Your $15K/Month Community?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Get the exact blueprint that took me from $0 to $15,276/month. 
              Free case study. No fluff. Just data and screenshots.
            </p>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="h-12"
                    disabled={isLoading}
                  />
                  <Input
                    type="email"
                    placeholder="Best email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isLoading}
                  className="h-12 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-base"
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Get The $15K/Month Blueprint →
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Join 2,847+ community builders. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-6 max-w-md mx-auto">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Check your inbox!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Case study sent to <strong>{email}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}