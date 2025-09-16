'use client';

import { useState, useEffect } from 'react';
import { 
  Play, DollarSign, Target, TrendingUp, Users, CheckCircle,
  Youtube, Twitter, Mail, Globe, Instagram, Facebook, Linkedin,
  ArrowRight, Clock, Zap, Shield, Award, BarChart3, 
  Sparkles, AlertCircle, X, ChevronRight, Rocket,
  Calendar, MessageCircle, BookOpen, Brain, LineChart
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DemoSalesPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 23, minutes: 59, seconds: 59 });
  const [spotsLeft, setSpotsLeft] = useState(13);
  const [showVideo, setShowVideo] = useState(false);
  const [monthlyRevenue, setMonthlyRevenue] = useState('5000');
  const [conversionRate, setConversionRate] = useState('2.5');
  
  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate savings
  const calculateSavings = () => {
    const revenue = parseFloat(monthlyRevenue) || 0;
    const rate = parseFloat(conversionRate) || 0;
    const improvedRate = rate * 1.47; // 47% improvement with attribution
    const additionalRevenue = revenue * (improvedRate / rate - 1);
    const yearlyAdditional = additionalRevenue * 12;
    const skoolCost = 99 * 12;
    const allumiCost = 497; // Lifetime deal
    const totalSavings = yearlyAdditional + (skoolCost - allumiCost);
    
    return {
      additionalMonthly: additionalRevenue,
      additionalYearly: yearlyAdditional,
      savingsVsSkool: skoolCost - allumiCost,
      totalBenefit: totalSavings,
      roi: (totalSavings / allumiCost * 100).toFixed(0)
    };
  };

  const savings = calculateSavings();

  // Testimonials
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Course Creator',
      avatar: 'https://picsum.photos/seed/sarah/100/100',
      content: 'Finally I can see which YouTube videos actually bring paying members! Increased my revenue by 62% in 2 months.',
      revenue: '+$3,400/mo',
      source: 'YouTube optimization'
    },
    {
      name: 'Mike Rodriguez',
      role: 'SaaS Founder',
      avatar: 'https://picsum.photos/seed/mike/100/100',
      content: 'The attribution tracking paid for itself in the first week. Found out email converts 5x better than social.',
      revenue: '+$8,200/mo',
      source: 'Email focus'
    },
    {
      name: 'Emily Johnson',
      role: 'Community Builder',
      avatar: 'https://picsum.photos/seed/emily/100/100',
      content: 'Stopped wasting $500/mo on Facebook ads that weren\'t converting. Twitter was my goldmine all along!',
      revenue: 'Saved $6,000/yr',
      source: 'Cut waste'
    }
  ];

  // Feature comparison
  const features = [
    { feature: 'See revenue by source', allumi: true, skool: false },
    { feature: 'UTM tracking built-in', allumi: true, skool: false },
    { feature: 'Member LTV analytics', allumi: true, skool: false },
    { feature: 'Custom domain included', allumi: true, skool: false },
    { feature: 'Attribution dashboard', allumi: true, skool: false },
    { feature: 'Community features', allumi: true, skool: true },
    { feature: 'Course hosting', allumi: true, skool: true },
    { feature: 'Member management', allumi: true, skool: true },
    { feature: 'Price', allumi: '$497 lifetime', skool: '$99/month forever' },
    { feature: '5-year cost', allumi: '$497 total', skool: '$5,940 total' },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 text-center sticky top-0 z-50">
        <div className="flex items-center justify-center gap-4 text-sm font-medium">
          <span>⚡ LIFETIME DEAL ENDS IN:</span>
          <div className="flex items-center gap-2">
            <div className="bg-black/20 px-2 py-1 rounded">
              <span className="font-bold">{timeLeft.days.toString().padStart(2, '0')}</span>
              <span className="text-xs ml-1">DAYS</span>
            </div>
            <div className="bg-black/20 px-2 py-1 rounded">
              <span className="font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span className="text-xs ml-1">HRS</span>
            </div>
            <div className="bg-black/20 px-2 py-1 rounded">
              <span className="font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span className="text-xs ml-1">MIN</span>
            </div>
            <div className="bg-black/20 px-2 py-1 rounded">
              <span className="font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              <span className="text-xs ml-1">SEC</span>
            </div>
          </div>
          <span>Only {spotsLeft} spots left!</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="bg-emerald-600 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Attribution-First Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            See <span className="text-emerald-400">Exactly</span> Which Channels
            <br />Drive Your Community Revenue
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            While Skool users guess where members come from, Allumi shows you <strong>exactly</strong> which 
            YouTube videos, tweets, and emails bring paying customers. Plus save $5,443 over 5 years.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button 
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6"
              onClick={() => setShowVideo(true)}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch 2-Min Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6"
              asChild
            >
              <Link href="#lifetime-deal">
                Get Lifetime Access
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>No monthly fees ever</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>30-day money back</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Setup in 5 minutes</span>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {showVideo && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setShowVideo(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-20 h-20 text-emerald-400 mb-4 mx-auto" />
                  <p className="text-white text-xl">Demo Video Placeholder</p>
                  <p className="text-gray-400 mt-2">Shows attribution dashboard in action</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Problem/Solution Section */}
      <section className="px-6 py-20 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Problem */}
            <div>
              <Badge className="bg-red-600 mb-4">The Problem</Badge>
              <h2 className="text-3xl font-bold text-white mb-4">
                You're Flying Blind Without Attribution
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Wasting money on channels that don't convert</p>
                    <p className="text-sm text-gray-400">You might be spending 80% of your time on Instagram when YouTube drives 80% of revenue</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Can't scale what's working</p>
                    <p className="text-sm text-gray-400">Without data, you can't double down on your best channels</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Losing money to Skool's monthly fees</p>
                    <p className="text-sm text-gray-400">$99/month forever = $5,940 over 5 years</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div>
              <Badge className="bg-emerald-600 mb-4">The Solution</Badge>
              <h2 className="text-3xl font-bold text-white mb-4">
                Attribution That Pays for Itself
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">See exactly where revenue comes from</p>
                    <p className="text-sm text-gray-400">Track every dollar back to the specific video, tweet, or email</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">47% average revenue increase</p>
                    <p className="text-sm text-gray-400">Our users see massive gains by focusing on what works</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">One-time payment, lifetime access</p>
                    <p className="text-sm text-gray-400">$497 once vs $5,940 to Skool over 5 years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-purple-600 mb-4">Interactive Calculator</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Calculate Your ROI with Attribution
            </h2>
            <p className="text-xl text-gray-300">
              See how much more you could make with proper tracking
            </p>
          </div>

          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <Label htmlFor="revenue" className="text-white mb-2">
                    Your Current Monthly Revenue
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="revenue"
                      type="number"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white text-lg"
                      placeholder="5000"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="conversion" className="text-white mb-2">
                    Current Conversion Rate (%)
                  </Label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="conversion"
                      type="number"
                      step="0.1"
                      value={conversionRate}
                      onChange={(e) => setConversionRate(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white text-lg"
                      placeholder="2.5"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-emerald-600/10 border border-emerald-600/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Projected Results with Allumi</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Additional Monthly Revenue</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      +${savings.additionalMonthly.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Additional Yearly Revenue</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      +${savings.additionalYearly.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">ROI on Lifetime Deal</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      {savings.roi}%
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-center text-white">
                    <strong>Total First Year Benefit:</strong>
                    <span className="text-3xl font-bold text-emerald-400 ml-2">
                      ${savings.totalBenefit.toLocaleString()}
                    </span>
                  </p>
                  <p className="text-center text-sm text-gray-400 mt-2">
                    (Additional revenue + savings vs Skool)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="px-6 py-20 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-blue-600 mb-4">Platform Features</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything Skool Has + Attribution
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <div className="p-3 bg-emerald-600/20 rounded-lg w-fit mb-4">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <CardTitle className="text-white">Attribution Dashboard</CardTitle>
                <CardDescription>Our #1 differentiator</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span>Revenue by source (YouTube, Twitter, Email)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span>Member LTV by acquisition channel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span>UTM tracking automatically included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span>ROI calculator for each channel</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <div className="p-3 bg-purple-600/20 rounded-lg w-fit mb-4">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Community Features</CardTitle>
                <CardDescription>Everything you need</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span>Discussion feed & posts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span>Direct messaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span>Events & calendar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span>Leaderboards & gamification</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <div className="p-3 bg-blue-600/20 rounded-lg w-fit mb-4">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Course Platform</CardTitle>
                <CardDescription>Sell your knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span>Video lessons with transcripts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span>Progress tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span>Drip content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span>Certificates of completion</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Table */}
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-white text-center">Allumi vs Skool Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400">Feature</th>
                      <th className="text-center py-3 px-4">
                        <span className="text-emerald-400 font-semibold">Allumi</span>
                      </th>
                      <th className="text-center py-3 px-4">
                        <span className="text-gray-400">Skool</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="py-3 px-4 text-white">{item.feature}</td>
                        <td className="text-center py-3 px-4">
                          {typeof item.allumi === 'boolean' ? (
                            item.allumi ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-600 mx-auto" />
                            )
                          ) : (
                            <span className="text-emerald-400 font-semibold">{item.allumi}</span>
                          )}
                        </td>
                        <td className="text-center py-3 px-4">
                          {typeof item.skool === 'boolean' ? (
                            item.skool ? (
                              <CheckCircle className="w-5 h-5 text-gray-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-600 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-400">{item.skool}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-yellow-600 mb-4">Social Proof</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Community Owners Love Attribution
            </h2>
            <p className="text-xl text-gray-300">
              See how attribution transformed their revenue
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <Badge className="bg-emerald-600">{testimonial.revenue}</Badge>
                    <span className="text-sm text-gray-400">{testimonial.source}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lifetime Deal Section */}
      <section id="lifetime-deal" className="px-6 py-20 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-emerald-600 bg-gray-900/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-600 text-white px-6 py-1 transform rotate-12 translate-x-6 translate-y-3">
              <span className="text-xs font-bold">LIMITED TIME</span>
            </div>
            
            <CardHeader className="text-center pb-4">
              <Badge className="bg-emerald-600 mb-4 mx-auto">
                <Rocket className="w-3 h-3 mr-1" />
                Founder's Lifetime Deal
              </Badge>
              <CardTitle className="text-4xl text-white">
                Get Lifetime Access for One Payment
              </CardTitle>
              <CardDescription className="text-lg">
                No monthly fees. Ever. Save $5,443 vs Skool.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Pricing */}
              <div className="text-center py-8 border-y border-gray-800">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="text-3xl text-gray-500 line-through">$2,997</span>
                  <Badge className="bg-red-600">83% OFF</Badge>
                </div>
                <div className="text-6xl font-bold text-white mb-2">$497</div>
                <p className="text-gray-400">One-time payment • Lifetime access</p>
                <p className="text-sm text-emerald-400 mt-2">Only {spotsLeft} spots remaining at this price</p>
              </div>

              {/* What's Included */}
              <div>
                <h3 className="font-semibold text-white mb-4">Everything Included:</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <span className="text-sm text-gray-300">Full attribution dashboard</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <span className="text-sm text-gray-300">Unlimited communities</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <span className="text-sm text-gray-300">Unlimited members</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <span className="text-sm text-gray-300">Custom domain included</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <span className="text-sm text-gray-300">All future updates</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <span className="text-sm text-gray-300">Priority support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <span className="text-sm text-gray-300">30-day money back guarantee</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <span className="text-sm text-gray-300">Free migration from Skool</span>
                  </div>
                </div>
              </div>

              {/* Bonuses */}
              <div className="bg-emerald-600/10 border border-emerald-600/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3">🎁 Limited-Time Bonuses:</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Attribution Mastery Course</span>
                    <Badge className="bg-gray-700">$297 value</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">1-on-1 Setup Call</span>
                    <Badge className="bg-gray-700">$197 value</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">100 Email Templates</span>
                    <Badge className="bg-gray-700">$97 value</Badge>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-emerald-600/30">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Total Bonus Value:</span>
                    <span className="font-bold text-emerald-400">$591</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                  asChild
                >
                  <Link href="/signup">
                    Get Lifetime Access Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">🔒 Secure checkout powered by Stripe</p>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <span>✓ SSL Encrypted</span>
                    <span>✓ 30-Day Guarantee</span>
                    <span>✓ Instant Access</span>
                  </div>
                </div>
              </div>

              {/* Urgency Reminder */}
              <Alert className="bg-red-900/20 border-red-600/50">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  <strong>Warning:</strong> This lifetime deal expires in {timeLeft.days} days {timeLeft.hours} hours. 
                  After that, it's $89/month forever. Lock in your lifetime access now.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-white">
                  How is this different from Skool?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Allumi has everything Skool has PLUS attribution tracking. You can see exactly which YouTube videos, 
                  tweets, or emails bring paying members. Skool has no attribution features at all. Plus, we're a one-time 
                  payment instead of $99/month forever.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-white">
                  Is this really a lifetime deal?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Yes! Pay once, use forever. No hidden fees, no upsells, no monthly charges. This includes all future 
                  updates and features we add. The only reason we can offer this is we're in early launch phase.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-white">
                  Can I migrate from Skool?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Absolutely! We'll help you migrate your members, content, and courses for free. The whole process 
                  takes less than 48 hours. Most users save enough in 5 months to cover the lifetime deal cost.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-white">
                  What if I'm not happy?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  We offer a 30-day money-back guarantee. If you're not seeing value from the attribution tracking 
                  or any other features, just email us and we'll refund you 100%. No questions asked.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 bg-gradient-to-t from-emerald-900/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stop Guessing. Start Growing.
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join smart community owners who know exactly where their revenue comes from.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button 
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6"
              asChild
            >
              <Link href="/signup">
                Get Lifetime Access - $497
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          <p className="text-sm text-gray-400">
            Only {spotsLeft} lifetime deals remaining • Price goes to $89/month after
          </p>
        </div>
      </section>
    </div>
  );
}