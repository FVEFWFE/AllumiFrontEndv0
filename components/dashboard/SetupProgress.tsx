'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  Circle,
  AlertCircle,
  Link2,
  Zap,
  Key,
  TestTube,
  ArrowRight,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SetupStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  action: () => void;
  actionLabel: string;
  helpText?: string;
}

export default function SetupProgress() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [setupStatus, setSetupStatus] = useState({
    hasLinks: false,
    hasZapier: false,
    hasFingerprint: false,
    hasConversions: false,
    isComplete: false
  });

  useEffect(() => {
    checkSetupStatus();

    // Check if user has dismissed the setup guide
    const dismissed = localStorage.getItem('setup_guide_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const checkSetupStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Check for links
      const { data: links } = await supabase
        .from('links')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);

      // Check for profile settings (API keys)
      const { data: profile } = await supabase
        .from('profiles')
        .select('fingerprint_api_key')
        .eq('id', session.user.id)
        .single();

      // Check for conversions
      const { data: conversions } = await supabase
        .from('conversions')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);

      const hasLinks = links && links.length > 0;
      const hasFingerprint = profile?.fingerprint_api_key ? true : false;
      const hasConversions = conversions && conversions.length > 0;

      // For now, we can't easily check if Zapier is connected without a test webhook
      const hasZapier = hasConversions; // If they have conversions, Zapier must be working

      const isComplete = hasLinks && hasZapier && hasFingerprint;

      setSetupStatus({
        hasLinks,
        hasZapier,
        hasFingerprint,
        hasConversions,
        isComplete
      });

      // Auto-dismiss if everything is complete
      if (isComplete) {
        setTimeout(() => setIsDismissed(true), 5000);
      }
    } catch (error) {
      console.error('Error checking setup status:', error);
    }
  };

  const steps: SetupStep[] = [
    {
      id: 'create-link',
      title: '1. Create Your First Link',
      description: 'Create a tracking link for your content',
      status: setupStatus.hasLinks ? 'completed' : 'current',
      action: () => router.push('/dashboard/links/create'),
      actionLabel: 'Create Link',
      helpText: 'Use unique links in your YouTube videos, Instagram posts, etc.'
    },
    {
      id: 'connect-zapier',
      title: '2. Connect Zapier to Skool',
      description: 'Automate member tracking with Zapier',
      status: setupStatus.hasZapier ? 'completed' : (setupStatus.hasLinks ? 'current' : 'pending'),
      action: () => router.push('/dashboard/settings'),
      actionLabel: 'Get Webhook URL',
      helpText: 'Copy your webhook URL and set up a Zap to send new Skool members to Allumi'
    },
    {
      id: 'add-fingerprint',
      title: '3. Add FingerprintJS (Optional)',
      description: 'Improve tracking accuracy to 99.5%',
      status: setupStatus.hasFingerprint ? 'completed' : 'pending',
      action: () => router.push('/dashboard/settings'),
      actionLabel: 'Add API Key',
      helpText: 'Get a free API key from fingerprintjs.com for better device tracking'
    },
    {
      id: 'test-tracking',
      title: '4. Test Your Setup',
      description: 'Verify everything is working',
      status: setupStatus.hasConversions ? 'completed' : 'pending',
      action: () => {
        // Open test instructions modal or guide
        alert('Test by clicking your own link and joining your Skool community with a test account');
      },
      actionLabel: 'Test Setup',
      helpText: 'Click your link, join with a test account, and check if the conversion appears'
    }
  ];

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  if (isDismissed || setupStatus.isComplete) {
    // Show minimal indicator
    if (!setupStatus.isComplete) {
      return (
        <button
          onClick={() => setIsDismissed(false)}
          className="fixed bottom-4 left-4 z-40 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          Setup Incomplete ({completedSteps}/4)
        </button>
      );
    }
    return null;
  }

  return (
    <div className="bg-card border-2 border-accent/20 rounded-lg mb-6 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Getting Started with Allumi
              </h3>
              <p className="text-sm text-muted-foreground">
                Complete these steps to start tracking attribution
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-accent/10 rounded-lg transition"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setIsDismissed(true);
                localStorage.setItem('setup_guide_dismissed', 'true');
              }}
              className="p-2 hover:bg-accent/10 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{completedSteps} of {steps.length} completed</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 bg-background/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      {isExpanded && (
        <div className="p-4">
          <div className="space-y-3">
            {steps.map((step, index) => {
              const Icon = step.status === 'completed' ? CheckCircle : Circle;
              const isCurrentStep = step.status === 'current';

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                    isCurrentStep
                      ? 'bg-accent/5 border border-accent/20'
                      : step.status === 'completed'
                      ? 'opacity-60'
                      : 'opacity-40'
                  }`}
                >
                  <div className="mt-1">
                    <Icon
                      className={`w-5 h-5 ${
                        step.status === 'completed'
                          ? 'text-green-500'
                          : isCurrentStep
                          ? 'text-accent'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          isCurrentStep ? 'text-foreground' : 'text-foreground/80'
                        }`}>
                          {step.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {step.description}
                        </p>
                        {step.helpText && isCurrentStep && (
                          <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                            💡 {step.helpText}
                          </p>
                        )}
                      </div>
                      {step.status !== 'completed' && (
                        <button
                          onClick={step.action}
                          disabled={step.status === 'pending' && !setupStatus.hasLinks}
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition flex items-center gap-1 ${
                            isCurrentStep
                              ? 'bg-accent text-white hover:bg-accent/90'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed'
                          }`}
                        >
                          {step.actionLabel}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Tips */}
          {completedSteps === 0 && (
            <div className="mt-4 p-4 bg-accent/5 rounded-lg border border-accent/10">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <TestTube className="w-4 h-4 text-accent" />
                Pro Tip: Start with a Test
              </h4>
              <p className="text-xs text-muted-foreground">
                Create a test link first and click it yourself to see how tracking works.
                Then set up Zapier with a test Skool account to verify the full flow.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}