"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, DollarSign, Users, TrendingUp, Gift, Zap, Heart, CheckCircle2, HelpCircle } from "lucide-react"
import { EmailPopup } from "@/components/email-popup"
import { openFeaturebaseMessenger } from "@/components/featurebase-widget"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function AffiliateProgramPage() {
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background pt-[--header-height]">
      <EmailPopup 
        isOpen={isEmailPopupOpen} 
        onClose={() => setIsEmailPopupOpen(false)}
        customTitle="Join Our Affiliate Program"
        customDescription="Start earning 40% recurring commissions today!"
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Gift className="w-4 h-4" />
              Affiliate Program
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Earn 40% Recurring Commissions
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Partner with Allumi and help Skool community owners transform their engagement while earning generous monthly recurring revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => openFeaturebaseMessenger('Hi! I would like to join the Allumi affiliate program.')}
                className="group"
              >
                Become an Affiliate
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">40%</div>
              <div className="text-muted-foreground">Recurring Commission</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">Forever</div>
              <div className="text-muted-foreground">No Time Limits</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">180 Days</div>
              <div className="text-muted-foreground">Cookie Duration</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Commission Structure</h2>
              <p className="text-lg text-muted-foreground">
                Earn recurring commissions for every customer you refer
              </p>
            </div>
            
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-primary" />
                    Your Earnings
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>40% of every monthly payment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Commissions for the customer lifetime</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Monthly payouts via Stripe</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-background rounded-lg p-6">
                  <h4 className="font-semibold mb-3">Example Earnings:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>5 referrals × $99/mo × 40%</span>
                      <span className="font-bold">$148.50/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>10 referrals × $99/mo × 40%</span>
                      <span className="font-bold">$297/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>25 referrals × $99/mo × 40%</span>
                      <span className="font-bold text-primary">$742.50/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Partner with Allumi?</h2>
              <p className="text-lg text-muted-foreground">
                Join a program designed for your success
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">High Conversion Rate</h3>
                  <p className="text-sm text-muted-foreground">
                    Our product solves real problems for Skool communities, making it easy to convert referrals.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Marketing Resources</h3>
                  <p className="text-sm text-muted-foreground">
                    Access banners, email templates, and content to help you promote effectively.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Dedicated Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Get help from our affiliate team to maximize your earnings potential.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">No Minimum Payout</h3>
                  <p className="text-sm text-muted-foreground">
                    Get paid monthly regardless of the amount you've earned.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-6 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Product You Can Trust</h3>
                  <p className="text-sm text-muted-foreground">
                    Promote a tool that genuinely helps communities thrive and grow.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="p-6 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Gift className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Bonus Opportunities</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn extra bonuses during special promotions and campaigns.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">
                Start earning in three simple steps
              </p>
            </div>
            
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                  <p className="text-muted-foreground">
                    Apply to join our affiliate program. We'll review your application and get you set up with your unique referral link.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Share</h3>
                  <p className="text-muted-foreground">
                    Promote Allumi to your audience using your referral link. Share on social media, your website, or directly with Skool community owners.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Earn</h3>
                  <p className="text-muted-foreground">
                    Get 40% recurring commission for every customer you refer. Track your earnings in real-time and get paid monthly.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about our affiliate program
              </p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-background rounded-lg px-6">
                <AccordionTrigger>
                  <span className="flex items-center gap-2 text-left">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    Who can become an Allumi affiliate?
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  Anyone with an audience interested in Skool communities can join. This includes content creators, consultants, course creators, community managers, and Skool enthusiasts.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-background rounded-lg px-6">
                <AccordionTrigger>
                  <span className="flex items-center gap-2 text-left">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    How and when do I get paid?
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  Commissions are paid out monthly via Stripe. You'll receive payments on the 1st of each month for the previous month's earnings. There's no minimum payout threshold.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-background rounded-lg px-6">
                <AccordionTrigger>
                  <span className="flex items-center gap-2 text-left">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    How long do I earn commissions for?
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  You earn 40% recurring commissions for as long as your referred customer remains subscribed to Allumi. There are no time limits or commission decreases.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-background rounded-lg px-6">
                <AccordionTrigger>
                  <span className="flex items-center gap-2 text-left">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    What marketing materials are provided?
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  We provide email templates, social media graphics, banner ads, and content snippets. You'll also get access to product demos and case studies to help with conversions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-background rounded-lg px-6">
                <AccordionTrigger>
                  <span className="flex items-center gap-2 text-left">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    Can I refer myself or my own community?
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  Yes! You can use Allumi for your own Skool community and still earn affiliate commissions on other referrals you make.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-background rounded-lg px-6">
                <AccordionTrigger>
                  <span className="flex items-center gap-2 text-left">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    Is there a dashboard to track my referrals?
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  Yes, you'll have access to a real-time dashboard where you can track clicks, conversions, earnings, and payment history. You'll also receive monthly reports via email.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our affiliate program today and start earning 40% recurring commissions on every referral.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => openFeaturebaseMessenger('Hi! I would like to apply for the Allumi affiliate program.')}
                  className="group"
                >
                  Apply Now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => openFeaturebaseMessenger('Hi! I have questions about the affiliate program.')}
                >
                  Contact Support
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Questions? Email us at affiliates@allumi.io
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}