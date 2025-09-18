'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, Link, BarChart3, CheckCircle2, ArrowRight, 
  Copy, ExternalLink, Sparkles, Target, TrendingUp 
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const steps = [
    {
      title: "Welcome to Allumi! 🎉",
      description: "Let's get you set up in 3 simple steps",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="font-semibold mb-3">What Allumi does for you:</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Target className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Track Attribution</p>
                  <p className="text-sm text-muted-foreground">See which content drives paying members</p>
                </div>
              </div>
              <div className="flex items-start">
                <TrendingUp className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Measure ROI</p>
                  <p className="text-sm text-muted-foreground">Know exactly what's working and what's not</p>
                </div>
              </div>
              <div className="flex items-start">
                <Sparkles className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Optimize Growth</p>
                  <p className="text-sm text-muted-foreground">Double down on your best channels</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Most users see their first insights within 24 hours
          </p>
        </div>
      ),
      action: "Get Started",
      icon: <Sparkles className="h-8 w-8 text-purple-600" />
    },
    {
      title: "Create Your First Tracking Link",
      description: "Track where your members come from",
      content: (
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm font-medium mb-3">Your first tracking link is ready:</p>
            <div className="flex items-center justify-between bg-gray-50 rounded p-3">
              <code className="text-sm">https://allumi.to/start</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText('https://allumi.to/start');
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This link redirects to your Skool community and tracks the source
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Try it out:</p>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Copy the link above</li>
              <li>2. Share it in your next post or bio</li>
              <li>3. Watch the clicks roll in on your dashboard</li>
            </ol>
          </div>
        </div>
      ),
      action: "Create More Links",
      icon: <Link className="h-8 w-8 text-purple-600" />
    },
    {
      title: "Connect Zapier for Full Attribution",
      description: "See which clicks become paying members",
      content: (
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm font-medium mb-3">Connect in 2 minutes:</p>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start">
                <Badge className="mr-2 mt-0.5">1</Badge>
                <div>
                  <p className="font-medium">Copy your Webhook URL</p>
                  <div className="flex items-center mt-1 bg-gray-50 rounded p-2">
                    <code className="text-xs flex-1">https://allumi.to/api/webhooks/zapier?key=abc123</code>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </li>
              <li className="flex items-start">
                <Badge className="mr-2 mt-0.5">2</Badge>
                <div>
                  <p className="font-medium">Open our Zapier template</p>
                  <Button variant="outline" size="sm" className="mt-1">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open Zapier Template
                  </Button>
                </div>
              </li>
              <li className="flex items-start">
                <Badge className="mr-2 mt-0.5">3</Badge>
                <p className="font-medium">Paste the webhook URL and activate</p>
              </li>
            </ol>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-green-900 mb-1">Why this matters:</p>
            <p className="text-sm text-green-700">
              This connection lets you see which specific content pieces and ads 
              convert visitors into paying members, not just free signups.
            </p>
          </div>
        </div>
      ),
      action: "I'll Set This Up Later",
      secondaryAction: "Open Zapier",
      icon: <Zap className="h-8 w-8 text-purple-600" />
    },
    {
      title: "You're All Set! 🚀",
      description: "Your attribution tracking is live",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <p className="font-semibold text-lg mb-2">Setup Complete!</p>
            <p className="text-sm text-muted-foreground">
              You're now tracking attribution for your Skool community
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-sm">What happens next:</h4>
            <div className="text-sm space-y-2 text-muted-foreground">
              <p>✓ Share your tracking links in content and ads</p>
              <p>✓ Watch real-time clicks on your dashboard</p>
              <p>✓ See which content drives paying members (via Zapier)</p>
              <p>✓ Optimize based on actual ROI data</p>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
            <p className="text-sm font-medium text-yellow-900 mb-1">Pro tip:</p>
            <p className="text-sm text-yellow-700">
              Create unique tracking links for each piece of content to see 
              exactly what drives the most valuable members.
            </p>
          </div>
        </div>
      ),
      action: "Go to Dashboard",
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
            {currentStep > 0 && (
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                Skip to Dashboard
              </Button>
            )}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">{step.icon}</div>
            <CardTitle className="text-2xl">{step.title}</CardTitle>
            <CardDescription className="text-base">{step.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="pt-2">
            {step.content}
            
            <div className="flex gap-3 mt-8">
              {step.secondaryAction && (
                <Button variant="outline" className="flex-1">
                  {step.secondaryAction}
                </Button>
              )}
              <Button onClick={handleNext} className="flex-1">
                {step.action}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help? Contact us at support@allumi.com or use the chat widget
        </p>
      </div>
    </div>
  );
}