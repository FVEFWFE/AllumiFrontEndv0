'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Youtube,
  Instagram,
  Mail,
  DollarSign,
  TrendingUp,
  Copy,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import DemoModeDashboard from '@/components/dashboard/DemoModeDashboard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Step {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

// Persona options for customization
const personas = [
  { id: 'youtube', label: 'YouTube Creator', icon: Youtube, color: 'red' },
  { id: 'instagram', label: 'Instagram/TikTok', icon: Instagram, color: 'purple' },
  { id: 'email', label: 'Newsletter/Blog', icon: Mail, color: 'blue' },
  { id: 'ads', label: 'Paid Ads', icon: DollarSign, color: 'green' },
];

export default function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState('');
  const [linkName, setLinkName] = useState('');
  const [skoolUrl, setSkoolUrl] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle automatic authentication from Whop webhook
  useEffect(() => {
    async function handleAuth() {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      if (accessToken && refreshToken) {
        // Set the session with tokens from webhook
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (!error) {
          setIsAuthenticated(true);
          // Clean up URL
          window.history.replaceState({}, document.title, '/welcome');
        } else {
          console.error('Error setting session:', error);
        }
      }

      // Check if already authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
      }
    }

    handleAuth();
  }, [searchParams]);

  // Complete onboarding and redirect
  const completeOnboarding = async () => {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.4 }
    });

    toast.success("Welcome to Allumi! Let's track your first conversion!");

    setTimeout(() => {
      router.push('/dashboard/links/create');
    }, 2000);
  };

  const steps: Step[] = [
    {
      id: 'welcome',
      title: 'Welcome to Allumi! 🎉',
      description: "Your 14-day trial is active. Let's set up your attribution tracking in under 2 minutes.",
      component: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">{"Here's what you'll get:"}</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Track every Skool member back to their source</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>See exactly which content drives revenue</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>85% attribution accuracy (vs 20% with native tracking)</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
            <p className="text-sm">
              <strong>💡 Pro tip:</strong> Most creators see their first tracked conversion within 24 hours!
            </p>
          </div>

          {isAuthenticated && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <p className="text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <strong>Account created!</strong> {"You're logged in via Whop authentication."}
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'persona',
      title: 'Where Do You Create Content?',
      description: 'This helps us optimize your tracking setup',
      component: (
        <div className="grid grid-cols-2 gap-4">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <button
                key={persona.id}
                onClick={() => setSelectedPersona(persona.id)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedPersona === persona.id
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-8 h-8 mb-3 text-${persona.color}-500`} />
                <p className="font-medium">{persona.label}</p>
              </button>
            );
          })}
        </div>
      )
    },
    {
      id: 'skool',
      title: 'Connect Your Skool Community',
      description: 'Paste your Skool community URL to start tracking',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Skool Community URL</label>
            <input
              type="url"
              value={skoolUrl}
              onChange={(e) => setSkoolUrl(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-background"
              placeholder="https://www.skool.com/@your-community"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Example: https://www.skool.com/@sam-ovens-consulting
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm">
              <strong>How it works:</strong> We'll give you special tracking links that redirect to your Skool page while capturing attribution data.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'demo',
      title: 'See Your Future Dashboard! 🚀',
      description: 'This is what your dashboard will look like with real data',
      component: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">{"You're all set!"}</h3>
            <p className="text-muted-foreground">
              Below is a preview of your dashboard with sample data. Your real metrics will start flowing in as soon as you create your first tracking link!
            </p>
          </div>

          <div className="-mx-8 -mb-8 max-h-[400px] overflow-y-auto border rounded-lg">
            <DemoModeDashboard />
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);

      // Celebrate milestone moments
      if (currentStep === 1) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    } else {
      completeOnboarding();
    }
  };

  const canProceed = () => {
    switch (currentStepData.id) {
      case 'persona':
        return selectedPersona;
      case 'skool':
        return skoolUrl && skoolUrl.includes('skool.com');
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/favicon.png"
              alt="Allumi Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <h1 className="text-3xl font-bold">Allumi Onboarding</h1>
          </div>
          <p className="text-muted-foreground">
            14-day trial started • Full access unlocked • Cancel anytime
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    index <= currentStep
                      ? 'bg-violet-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      index < currentStep
                        ? 'bg-violet-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold mb-2">{currentStepData.title}</h2>
            <p className="text-muted-foreground mb-6">
              {currentStepData.description}
            </p>

            <div className="mb-8">{currentStepData.component}</div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className={`px-4 py-2 text-sm ${
                  currentStep === 0
                    ? 'invisible'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  canProceed()
                    ? 'bg-violet-500 text-white hover:bg-violet-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <Zap className="w-5 h-5" />
                    Start Tracking Revenue
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Trust badges */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Join 500+ Skool creators tracking $2M+ in attributed revenue</p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Trial Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}