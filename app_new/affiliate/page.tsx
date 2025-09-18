"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/components/posthog-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { EmailPopup } from "@/components/email-popup"
import { openFeaturebaseMessenger } from "@/components/featurebase-widget"
import { ArrowRight, TrendingUp, DollarSign, Calculator } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AffiliatePage() {
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false)

  return (
    <div className="min-h-screen pt-[--header-height]">
      <EmailPopup 
        isOpen={isEmailPopupOpen} 
        onClose={() => setIsEmailPopupOpen(false)}
        customTitle="Join Our Beta Affiliate Program"
        customDescription="Start earning 40% recurring commissions today!"
      />

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              🎯 Beta Program Now Open - Limited Spots Available
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight md:leading-tight">
              Turn 5 Sales/Month Into $35,000+ Yearly Recurring Income
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Partner with Allumi and watch your monthly income grow exponentially. Just 5 referrals per month creates a powerful revenue snowball that builds into substantial yearly earnings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => {
                  trackEvent('affiliate_application', { source: 'hero_cta', page_section: 'hero' });
                  if (typeof window !== 'undefined' && window.Featurebase) {
                    window.Featurebase('showNewMessage', 'Hi! I would like to join the Allumi beta affiliate program.');
                  }
                }}
                className="group"
              >
                Become an Affiliate
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Calculator className="mr-2 w-4 h-4" />
                See Your Income Potential
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">40%</div>
              <div className="text-lg font-semibold mb-1">Recurring Commission</div>
              <div className="text-sm text-muted-foreground">$12,500+ potential yearly</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">Lifetime</div>
              <div className="text-lg font-semibold mb-1">Commission Duration</div>
              <div className="text-sm text-muted-foreground">As long as they stay subscribed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">180 Days</div>
              <div className="text-lg font-semibold mb-1">Cookie Duration</div>
              <div className="text-sm text-muted-foreground">Extended tracking window</div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Allumi Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What is Allumi?</h2>
              <p className="text-lg text-muted-foreground">
                The attribution tracking tool every Skool community needs
              </p>
            </div>
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <p className="text-lg leading-relaxed">
                Allumi provides attribution tracking specifically for Skool communities. While Skool shows total revenue, it doesn't reveal which content, ads, or sources actually drive paying members. Allumi fills this critical gap with a simple 5-minute Zapier setup, showing community owners exactly what converts visitors into customers who pay and stay. At $79/month, Allumi helps community owners cut wasted ad spend, scale confidently with data, and escape the organic content hamster wheel.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Compound Growth Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Power of Compound Recurring Revenue</h2>
              <p className="text-lg text-muted-foreground">
                See how just a few sales per month transforms into life-changing income
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="text-2xl font-bold mb-6">Start Small, Think Big</h3>
                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="font-semibold mb-2">Month 1-3: 5 referrals/month</div>
                    <div className="text-sm text-muted-foreground">
                      Month 3: 15 customers × $79 × 40% = <span className="text-primary font-bold">$474/mo</span>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="font-semibold mb-2">Month 4-6: 5 referrals/month</div>
                    <div className="text-sm text-muted-foreground">
                      Month 6: 30 customers × $79 × 40% = <span className="text-primary font-bold">$948/mo</span>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="font-semibold mb-2">Month 7-12: 5 referrals/month</div>
                    <div className="text-sm text-muted-foreground">
                      Month 12: 60 customers × $79 × 40% = <span className="text-primary font-bold">$1,896/mo</span>
                    </div>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6">Your Year 1 Income Projection</h3>
                <Card className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timeline</TableHead>
                        <TableHead className="text-right">Monthly</TableHead>
                        <TableHead className="text-right">Total Earned</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Month 3</TableCell>
                        <TableCell className="text-right">$474</TableCell>
                        <TableCell className="text-right">$948</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Month 6</TableCell>
                        <TableCell className="text-right">$948</TableCell>
                        <TableCell className="text-right">$3,792</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Month 9</TableCell>
                        <TableCell className="text-right">$1,422</TableCell>
                        <TableCell className="text-right">$8,532</TableCell>
                      </TableRow>
                      <TableRow className="font-bold bg-primary/10">
                        <TableCell>Month 12</TableCell>
                        <TableCell className="text-right text-primary">$1,896</TableCell>
                        <TableCell className="text-right text-primary">$15,660</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm font-semibold">Year 1 Total: $15,660</p>
                  <p className="text-sm">Year 2 Projected: $22,752 (if you stopped selling!)</p>
                  <p className="text-sm text-primary font-bold">Year 2 with continued growth: $35,000+</p>
                </div>
              </div>
            </div>

            <Card className="mt-12 p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <h3 className="text-2xl font-bold mb-6 text-center">🚀 Just 5 Sales Per Month Becomes:</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Monthly Income Growth:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>Month 6: <span className="font-bold">$948/month</span></li>
                    <li>Month 12: <span className="font-bold">$1,896/month</span></li>
                    <li>Month 18: <span className="font-bold">$2,844/month</span></li>
                    <li>Month 24: <span className="font-bold text-primary">$3,792/month</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Yearly Income Progression:</h4>
                  <ul className="space-y-2 text-sm">
                    <li><span className="font-bold">Year 1:</span> $15,660 total earned</li>
                    <li><span className="font-bold">Year 2:</span> $35,000+ (with same 5/month pace)</li>
                    <li><span className="font-bold text-primary">Year 3:</span> $45,000+ (that's a full-time salary!)</li>
                  </ul>
                </div>
              </div>
              <p className="text-center mt-6 text-sm text-muted-foreground">
                No need to keep selling to the same customers – they pay you every single month automatically!
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Perfect for Skool Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect for Skool Community Owners</h2>
              <p className="text-lg text-muted-foreground">
                Tap into the massive and growing Skool ecosystem
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Why Allumi Matters for Skool</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Allumi shows Skool community owners exactly which content and ads drive paying members (not just traffic). While Skool shows total revenue, it doesn't reveal what created it. Allumi fills this gap with simple attribution tracking.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span className="text-sm">100,000+ active Skool communities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span className="text-sm">Every single one needs better engagement tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span className="text-sm">Built specifically for Skool's unique needs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span className="text-sm">Community owners already invest in growth tools</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Where to Share Allumi with Skoolers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li><span className="font-semibold">Your Own Community:</span> Share with members who run communities</li>
                    <li><span className="font-semibold">Skool Games:</span> Connect with ambitious community builders</li>
                    <li><span className="font-semibold">Skool Facebook Groups:</span> Thousands of owners seeking solutions</li>
                    <li><span className="font-semibold">Community Forums:</span> Where Skoolers gather to share tips</li>
                    <li><span className="font-semibold">Your Network:</span> Other course creators using Skool</li>
                    <li><span className="font-semibold">Social Media:</span> Tweet threads, LinkedIn posts about growth</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="p-6 bg-primary/10 border-primary/20">
              <div className="space-y-4">
                <p className="font-semibold">
                  💡 Pro Tip: Start by sharing Allumi with 5 Skool community owners you already know. Their success stories become your social proof for reaching more Skoolers.
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Beta Advantage:</span> Be among the first affiliates to establish yourself as the go-to Allumi expert in the Skool ecosystem. Early movers in affiliate programs often become the top earners.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Income Calculator Section */}
      <section id="calculator" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Commission Calculator</h2>
              <p className="text-lg text-muted-foreground">
                See Your Monthly & Yearly Potential
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-lg">Conservative Growth</CardTitle>
                  <CardDescription>2 sales/month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div>Month 6: <span className="font-bold">$316/month</span></div>
                    <div className="text-muted-foreground">= $3,792/year run rate</div>
                  </div>
                  <div className="text-sm">
                    <div>Month 12: <span className="font-bold">$695/month</span></div>
                    <div className="text-muted-foreground">= $8,340/year run rate</div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="text-sm">Year 1 Total: ~$5,200</div>
                    <div className="text-sm font-bold text-primary">Year 2 Projected: ~$13,000</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 border-primary/50">
                <CardHeader>
                  <CardTitle className="text-lg">Moderate Growth</CardTitle>
                  <CardDescription>3 sales/month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div>Month 6: <span className="font-bold">$474/month</span></div>
                    <div className="text-muted-foreground">= $5,688/year run rate</div>
                  </div>
                  <div className="text-sm">
                    <div>Month 12: <span className="font-bold">$1,043/month</span></div>
                    <div className="text-muted-foreground">= $12,516/year run rate</div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="text-sm">Year 1 Total: ~$8,540</div>
                    <div className="text-sm font-bold text-primary">Year 2 Projected: ~$21,000</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Aggressive Growth</CardTitle>
                  <CardDescription>5 sales/month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div>Month 6: <span className="font-bold">$790/month</span></div>
                    <div className="text-muted-foreground">= $9,480/year run rate</div>
                  </div>
                  <div className="text-sm">
                    <div>Month 12: <span className="font-bold">$1,738/month</span></div>
                    <div className="text-muted-foreground">= $20,856/year run rate</div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="text-sm">Year 1 Total: ~$14,200</div>
                    <div className="text-sm font-bold text-primary">Year 2 Projected: ~$35,000</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              *Calculations assume strong customer retention
            </p>
          </div>
        </div>
      </section>

      {/* Why Compound Commissions Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Compound Commissions Change Everything</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-xl">Traditional Affiliate Programs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">✗</span>
                      <span>One-time payments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">✗</span>
                      <span>Need constant new sales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">✗</span>
                      <span>Income stops when you stop promoting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">✗</span>
                      <span>No long-term wealth building</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="p-6 border-primary bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="text-xl">Allumi's Compound Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span><strong>Set It & Forget It:</strong> Customers from January still pay you in December</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span><strong>True Passive Income:</strong> Your past efforts keep paying dividends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span><strong>Exponential Growth:</strong> Each month builds on the last</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span><strong>Financial Freedom:</strong> 50 customers = $1,580/month forever</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <h3 className="text-2xl font-bold mb-6 text-center">The Math That Matters</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Part-Time Income:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>16 customers = $500/month = <strong>$6,000/year</strong></li>
                    <li>25 customers = $790/month = <strong>$9,480/year</strong></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Replace Your Job:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>32 customers = $1,000/month = <strong>$12,000/year</strong></li>
                    <li>50 customers = $1,580/month = <strong>$18,960/year</strong></li>
                    <li>63 customers = $2,000/month = <strong>$24,000/year</strong></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Financial Independence:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>100 customers = $3,160/month = <strong>$37,920/year</strong></li>
                    <li>150 customers = $4,740/month = <strong>$56,880/year</strong></li>
                  </ul>
                </div>
              </div>
              
              <p className="text-center mt-6 text-sm font-semibold text-primary">
                Remember: These are TOTAL customers needed, not monthly sales!
              </p>
            </Card>

            <Card className="mt-8 p-6 bg-background border-2 border-primary">
              <div className="text-center">
                <h4 className="text-xl font-bold mb-4">50 Total Sales Over Time Equals:</h4>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">$1,580/month</div>
                    <div className="text-sm text-muted-foreground">forever</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">$18,960/year</div>
                    <div className="text-sm text-muted-foreground">passive income</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">$94,800</div>
                    <div className="text-sm text-muted-foreground">over 5 years</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">A reliable income stream that grows while you sleep</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">
                Start earning in four simple steps
              </p>
            </div>

            <div className="space-y-12">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Sign Up</h3>
                  <p className="text-lg text-muted-foreground">
                    Get approved and receive your unique referral link within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Make 2-3 Sales Per Month</h3>
                  <p className="text-lg text-muted-foreground">
                    Share with your audience. Just 2-3 conversions monthly creates momentum.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Watch It Compound</h3>
                  <p className="text-lg text-muted-foreground">
                    Your monthly income grows automatically as customers stick around.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Achieve Financial Goals</h3>
                  <p className="text-lg text-muted-foreground">
                    Many affiliates cover their mortgage within 12 months.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about our affiliate program
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-background rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  What's the average customer lifetime value?
                </AccordionTrigger>
                <AccordionContent>
                  Our customers typically stay 18+ months, meaning each referral is worth $570+ to you over their lifetime.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-background rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  Do commissions really last forever?
                </AccordionTrigger>
                <AccordionContent>
                  Yes! As long as your referral remains a customer, you earn 40% every single month.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-background rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  What if I can only make 1-2 sales per month?
                </AccordionTrigger>
                <AccordionContent>
                  Even 1 sale per month becomes substantial over time:
                  <ul className="mt-3 space-y-1 text-sm">
                    <li>• Month 12: $379/month</li>
                    <li>• Yearly income: $4,560</li>
                    <li>• By Month 24: $758/month ($9,096/year)</li>
                  </ul>
                  That's nearly $10k/year from just 24 total sales!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-background rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  What if Skool shuts this down?
                </AccordionTrigger>
                <AccordionContent>
                  Allumi uses Skool's official Zapier integration, which is fully supported by the platform. We're built on their approved API, ensuring long-term stability.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-background rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  Can I see real-time stats?
                </AccordionTrigger>
                <AccordionContent>
                  Yes! Track everything in your dashboard: lifetime value, MRR, churn, and projected earnings. You'll have full visibility into your growing income stream.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-background rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  How and when do I get paid?
                </AccordionTrigger>
                <AccordionContent>
                  Commissions are paid monthly via Stripe on the 15th of each month for the previous month's earnings. There's no minimum payout threshold - you get paid regardless of the amount earned.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="bg-background rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  What marketing materials are provided?
                </AccordionTrigger>
                <AccordionContent>
                  We provide banners, email templates, social media content, case studies, and detailed product information. You'll also get access to our affiliate resource center with best practices and promotional strategies.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="bg-background rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  Can I refer myself or my own community?
                </AccordionTrigger>
                <AccordionContent>
                  No, self-referrals are not permitted. However, if you genuinely use Allumi for your own community and want to promote it to others, that's perfectly fine and encouraged.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="apply" className="py-24 bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-700 dark:to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-white">
              Ready to Build Your $20,000+ Annual Revenue Stream?
            </h2>
            <p className="text-xl mb-6 text-white/90">
              Join our exclusive beta affiliate program and be one of the first to tap into the massive Skool community market. With over 100,000 Skool communities and growing, the opportunity is enormous.
            </p>
            <p className="text-lg mb-8 text-white/80">
              Start with just 2-3 Skool community referrals this month. By this time next year, you could be earning $12,000-$20,000+ annually on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                onClick={() => {
                  if (typeof window !== 'undefined' && window.Featurebase) {
                    window.Featurebase('showNewMessage', 'Hi! I would like to join the Allumi beta affiliate program.');
                  }
                }}
                className="group"
              >
                Apply for Beta Access Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
                onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Calculator className="mr-2 w-4 h-4" />
                Calculate Your Income Potential
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">
              Limited beta spots available.
            </p>
            <div className="mt-8 p-6 bg-white/10 rounded-lg">
              <p className="text-sm font-semibold">
                PS: As a beta affiliate, you have the unique opportunity to establish yourself early in the Skool ecosystem. The compound effect of recurring commissions means every referral you make today keeps paying you month after month. Your first referral today could be the start of significant passive income.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}