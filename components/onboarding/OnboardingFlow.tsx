'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, Check, ExternalLink, Copy, Zap, Link2, BarChart3, Settings, Fingerprint } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import FingerprintSetupGuide from './FingerprintSetupGuide';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: () => void;
  actionLabel?: string;
  completed?: boolean;
}

export default function OnboardingFlow({ onComplete }: { onComplete?: () => void }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showFingerprintSetup, setShowFingerprintSetup] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Allumi! 🎉',
      description: 'Let\'s get you set up in just 3 minutes. We\'ll help you track which content drives paying members to your Skool community.',
      icon: <Zap className="w-8 h-8 text-accent" />,
      actionLabel: 'Get Started',
      action: () => setCurrentStep(1)
    },
    {
      id: 'create-link',
      title: 'Step 1: Create Your First Tracking Link',
      description: 'Click the button below to create a tracking link for your Skool community. You\'ll use these links in your content to track attribution.',
      icon: <Link2 className="w-8 h-8 text-accent" />,
      actionLabel: 'Create Tracking Link',
      action: () => router.push('/dashboard/links/create')
    },
    {
      id: 'setup-zapier',
      title: 'Step 2: Connect Zapier to Skool',
      description: 'We\'ll track when someone joins your Skool through Zapier. Copy your webhook URL from Settings and paste it into Zapier.',
      icon: <Zap className="w-8 h-8 text-accent" />,
      actionLabel: 'Go to Settings',
      action: () => router.push('/dashboard/settings')
    },
    {
      id: 'fingerprint-key',
      title: 'Step 3: Supercharge Your Attribution (Optional)',
      description: 'Add FingerprintJS for 99.5% accurate tracking across devices. Track users from Instagram on phone → laptop purchase!',
      icon: <Fingerprint className="w-8 h-8 text-accent" />,
      actionLabel: 'Setup FingerprintJS',
      action: () => setShowFingerprintSetup(true)
    },
    {
      id: 'view-dashboard',
      title: 'You\'re All Set! 🚀',
      description: 'Start using your tracking links in YouTube descriptions, Instagram bios, and Twitter posts. Watch your attribution data flow in!',
      icon: <BarChart3 className="w-8 h-8 text-accent" />,
      actionLabel: 'View Dashboard',
      action: () => {
        setShowOnboarding(false);
        onComplete?.();
      }
    }
  ];

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboarding_completed', 'true');
    onComplete?.();
  };

  useEffect(() => {
    const completed = localStorage.getItem('onboarding_completed');
    if (completed) {
      setShowOnboarding(false);
    }
  }, []);

  if (!showOnboarding) {
    return null;
  }

  const currentStepData = steps[currentStep];

  // Handle FingerprintJS setup completion
  const handleFingerprintComplete = () => {
    setShowFingerprintSetup(false);
    handleStepComplete('fingerprint-key');
    toast.success('FingerprintJS setup complete! Attribution accuracy boosted to 99.5%');
  };

  const handleFingerprintSkip = () => {
    setShowFingerprintSetup(false);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Show FingerprintJS setup guide if requested
  if (showFingerprintSetup) {
    return (
      <FingerprintSetupGuide
        onComplete={handleFingerprintComplete}
        onSkip={handleFingerprintSkip}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-muted">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-xl">
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {currentStepData.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-lg text-foreground/80 mb-8">
              {currentStepData.description}
            </p>

            {/* Step-specific content */}
            {currentStep === 1 && (
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2">Quick Tip:</h3>
                <p className="text-sm text-muted-foreground">
                  Name your campaigns clearly like "YouTube-Video-Title" or "Instagram-Story-Date" to easily track performance.
                </p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 mb-6">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Zapier Setup Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Create a new Zap in Zapier</li>
                    <li>Choose "Skool" as your trigger app</li>
                    <li>Select "New Member Joined" as the trigger</li>
                    <li>Add a Webhook action and paste your Allumi webhook URL</li>
                    <li>Map the email, name, and joined date fields</li>
                    <li>Turn on your Zap!</li>
                  </ol>
                </div>
                <a
                  href="https://zapier.com/apps/skool/integrations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:underline"
                >
                  Open Zapier
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-accent" />
                    Why Add FingerprintJS?
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Cross-device tracking:</strong> User clicks on phone, buys on laptop? We track it!
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">99.5% accuracy:</strong> Works even in incognito mode
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Free tier:</strong> 10,000 API calls/month included
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Quick setup:</strong> Takes 2 minutes with Google sign-in. We'll walk you through every step!
                  </p>
                </div>
              </div>
            )}

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      index <= currentStep
                        ? 'bg-accent text-white'
                        : 'bg-muted text-muted-foreground'
                    } ${completedSteps.has(step.id) ? 'ring-2 ring-accent ring-offset-2' : ''}`}
                  >
                    {completedSteps.has(step.id) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all ${
                        index < currentStep ? 'bg-accent' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
                >
                  Back
                </button>
              )}
              <div className="ml-auto flex items-center gap-3">
                {currentStep < steps.length - 1 && (
                  <button
                    onClick={handleSkip}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
                  >
                    Skip Tutorial
                  </button>
                )}
                {currentStepData.action && (
                  <button
                    onClick={() => {
                      currentStepData.action?.();
                      handleStepComplete(currentStepData.id);
                    }}
                    className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition flex items-center gap-2"
                  >
                    {currentStepData.actionLabel}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}