'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Play, Mail, User, ArrowRight, CheckCircle2,
  TrendingUp, Target, BarChart3, Sparkles,
  Gift, Zap
} from 'lucide-react';

export default function DemoGatePage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [skoolUrl, setSkoolUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [error, setError] = useState('');
  const [showSkoolField, setShowSkoolField] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Save to database/CRM
      const response = await fetch('/api/demo/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          skoolUrl: skoolUrl || null,
          source: 'demo',
          captureType: 'email_only'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save information');
      }

      // Show demo
      setShowDemo(true);

      // Track conversion
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('demo_accessed', {
          email,
          hasSkoolUrl: !!skoolUrl,
          source: 'demo_gate'
        });
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSkoolUrl = (url: string) => {
    if (!url) return '';
    if (!url.includes('skool.com')) {
      return `skool.com/@${url.replace('@', '')}`;
    }
    return url;
  };

  if (showDemo) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to Your Demo, {firstName}!
            </h1>
            <p className="text-muted-foreground">
              {skoolUrl ? `Personalized for ${skoolUrl}` : 'See how attribution works for your community'}
            </p>
          </div>

          {/* Embed the attribution demo here */}
          <iframe
            src="/attribution-demo"
            className="w-full h-[800px] rounded-xl shadow-2xl"
            title="Attribution Demo"
          />

          <div className="mt-8 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600"
              onClick={() => window.location.href = '/signup'}
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center py-12">
      <div className="w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Value Props Above Form */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="px-3 py-1">
                <Zap className="h-3 w-3 mr-1" />
                2 min demo
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Gift className="h-3 w-3 mr-1" />
                Personalized insights
              </Badge>
            </div>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4">
                <div className="relative">
                  <Play className="h-16 w-16 text-purple-600" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2m</span>
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl">See Allumi in Action</CardTitle>
              <CardDescription className="text-base">
                Watch how creators track $50k+ revenue sources
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Benefits List */}
              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <p className="font-medium text-sm mb-3 text-purple-900">You'll discover:</p>
                <div className="space-y-2">
                  <div className="flex items-start text-sm">
                    <TrendingUp className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                    <span className="text-purple-700">Which content drives 80% of revenue</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <Target className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                    <span className="text-purple-700">Hidden channels bringing buyers vs browsers</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <BarChart3 className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                    <span className="text-purple-700">Your actual ROI by source (not vanity metrics)</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Required Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="pl-10"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Optional Skool URL Field */}
                  <AnimatePresence>
                    {!showSkoolField ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <button
                          type="button"
                          onClick={() => setShowSkoolField(true)}
                          className="w-full text-left"
                        >
                          <div className="border-2 border-dashed border-purple-200 rounded-lg p-3 hover:border-purple-400 hover:bg-purple-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-purple-700">
                                  🎁 Add your Skool URL for personalized insights
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  See examples from YOUR niche (optional)
                                </p>
                              </div>
                              <Sparkles className="h-4 w-4 text-purple-600" />
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Label htmlFor="skoolUrl">
                          Skool Profile URL
                          <span className="text-muted-foreground text-xs ml-1">(optional)</span>
                        </Label>
                        <Input
                          id="skoolUrl"
                          type="text"
                          placeholder="skool.com/@your-profile"
                          value={skoolUrl}
                          onChange={(e) => setSkoolUrl(e.target.value)}
                          onBlur={(e) => setSkoolUrl(formatSkoolUrl(e.target.value))}
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-green-600 mt-1">
                          ✨ Great! You'll see insights specific to your niche
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Loading demo...</>
                  ) : (
                    <>
                      Watch Demo
                      <Play className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  No credit card required • 30-day free trial
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Social Proof Below */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Join 127+ Skool creators tracking $2.3M+ in revenue
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}