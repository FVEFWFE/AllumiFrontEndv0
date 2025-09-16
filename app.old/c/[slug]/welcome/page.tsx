'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, ArrowRight, Sparkles, TrendingUp, 
  Users, BookOpen, Calendar, MessageCircle, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

// Onboarding steps
const onboardingSteps = [
  {
    id: 'profile',
    title: 'Complete Your Profile',
    description: 'Add your bio and interests',
    icon: Users,
    href: '/settings/profile',
  },
  {
    id: 'intro',
    title: 'Watch Welcome Video',
    description: '2-minute community overview',
    icon: BookOpen,
    href: '#',
  },
  {
    id: 'post',
    title: 'Introduce Yourself',
    description: 'Say hello to the community',
    icon: MessageCircle,
    href: '/c/growth-lab/feed',
  },
  {
    id: 'event',
    title: 'Join Your First Event',
    description: 'Weekly live session this Thursday',
    icon: Calendar,
    href: '/c/growth-lab/events',
  },
  {
    id: 'app',
    title: 'Download Mobile App',
    description: 'Stay connected on the go',
    icon: Download,
    href: '#',
  },
];

export default function WelcomePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  
  // Mock data - would come from API/auth
  const userData = {
    name: 'John',
    email: 'john@example.com',
    plan: 'Monthly',
  };
  
  const communityData = {
    name: 'Growth Lab',
    logo: 'https://i.pravatar.cc/150?img=20',
  };

  // Fire confetti on mount
  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#10B981', '#A78BFA', '#FCD34D'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#10B981', '#A78BFA', '#FCD34D'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          router.push(`/c/${params.slug}/feed`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [params.slug, router]);

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const progress = (completedSteps.length / onboardingSteps.length) * 100;

  return (
    <div className="min-h-screen bg-black">
      <div className="relative">
        {/* Success Animation Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-purple-900/20" />
        
        <div className="relative mx-auto max-w-4xl px-6 py-16">
          {/* Success Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <CheckCircle className="h-24 w-24 text-emerald-500" />
                <Sparkles className="absolute -right-2 -top-2 h-8 w-8 text-yellow-500 animate-pulse" />
              </div>
            </div>
            
            <h1 className="mb-4 text-4xl font-bold text-white">
              Welcome to {communityData.name}, {userData.name}! 🎉
            </h1>
            
            <p className="mb-2 text-xl text-gray-300">
              Your payment was successful and your account is now active.
            </p>
            
            <p className="text-sm text-gray-500">
              Receipt sent to {userData.email}
            </p>
          </div>

          {/* Attribution Dashboard Callout */}
          <Card className="mb-8 border-emerald-500/50 bg-gradient-to-r from-emerald-900/20 to-purple-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-emerald-600/20 p-3">
                  <TrendingUp className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-white">
                    Your Attribution Dashboard is Ready! 
                  </h3>
                  <p className="text-sm text-gray-300">
                    Start tracking where your revenue comes from. See which content, ads, and sources drive the most value.
                    This is what sets Allumi apart from Skool.
                  </p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Start Guide */}
          <Card className="mb-8 border-gray-800 bg-gray-900/50">
            <CardContent className="p-6">
              <h2 className="mb-6 text-2xl font-bold text-white">
                Quick Start Guide
              </h2>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Setup Progress</span>
                  <span className="text-emerald-500">{completedSteps.length}/{onboardingSteps.length} completed</span>
                </div>
                <Progress value={progress} className="h-2 bg-gray-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </Progress>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {onboardingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = completedSteps.includes(step.id);
                  
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-center gap-4 rounded-lg border p-4 transition-all",
                        isCompleted
                          ? "border-emerald-500/50 bg-emerald-900/20"
                          : "border-gray-800 bg-gray-800/50 hover:bg-gray-800"
                      )}
                    >
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full",
                        isCompleted
                          ? "bg-emerald-600"
                          : "bg-gray-700"
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : (
                          <Icon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{step.title}</h4>
                        <p className="text-sm text-gray-400">{step.description}</p>
                      </div>
                      
                      {!isCompleted && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStepComplete(step.id)}
                          className="text-emerald-500 hover:bg-emerald-900/20"
                        >
                          Start
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-emerald-500">2,847</div>
                <div className="text-sm text-gray-400">Community Members</div>
              </CardContent>
            </Card>
            <Card className="border-gray-800 bg-gray-900/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-500">342</div>
                <div className="text-sm text-gray-400">Online Now</div>
              </CardContent>
            </Card>
            <Card className="border-gray-800 bg-gray-900/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-500">12</div>
                <div className="text-sm text-gray-400">Events This Week</div>
              </CardContent>
            </Card>
          </div>

          {/* Auto-redirect Notice */}
          <div className="text-center">
            <p className="mb-4 text-sm text-gray-500">
              Redirecting to community in {redirectCountdown} seconds...
            </p>
            <Button
              onClick={() => router.push(`/c/${params.slug}/feed`)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Go to Community Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}