'use client';

import { useState } from 'react';
import {
  Key,
  Copy,
  CheckCircle,
  Circle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  AlertCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Step {
  id: number;
  title: string;
  description: string;
  image?: string;
  action?: () => void;
  actionLabel?: string;
  highlight?: string;
}

export default function FingerprintSetupWizard({ onApiKeyReady }: { onApiKeyReady?: (key: string) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWizard, setShowWizard] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const steps: Step[] = [
    {
      id: 1,
      title: 'Why FingerprintJS? (Optional but Powerful)',
      description: 'FingerprintJS increases your attribution accuracy from ~70% to 99.5% by creating unique device fingerprints. This means you\'ll know exactly which content drives conversions, even when users clear cookies!',
      highlight: '🎯 Track users across incognito mode, different browsers, and cleared cookies'
    },
    {
      id: 2,
      title: 'Open FingerprintJS Signup',
      description: 'Click the button below to open the signup page in a new tab. We\'ll guide you through every step!',
      action: () => window.open('https://dashboard.fingerprint.com/signup', '_blank'),
      actionLabel: 'Open FingerprintJS Signup',
      image: '/fingerprint-screenshots/step1-signup.png'
    },
    {
      id: 3,
      title: 'Click "Continue with Google"',
      description: 'This is the fastest way! Just click the "Continue with Google" button to skip all the form filling.',
      image: '/fingerprint-screenshots/step2-google.png',
      highlight: 'No forms to fill out - just one click!'
    },
    {
      id: 4,
      title: 'Select Your Google Account',
      description: 'Choose your Google account and complete any 2FA if prompted. Click "Continue" when you see the permissions page.',
      image: '/fingerprint-screenshots/step3-account.png'
    },
    {
      id: 5,
      title: 'Quick Setup - Choose "Personalization"',
      description: 'When asked what problem you\'re solving, select "Personalization". For region, choose "North America - Virginia". Then click "Done".',
      image: '/fingerprint-screenshots/step4-personalization.png',
      highlight: 'Select: Personalization → Virginia → Done'
    },
    {
      id: 6,
      title: 'Navigate to API Keys',
      description: 'You\'ll land on the "Get Started" page. Click "API Keys" in the left sidebar to see your key.',
      image: '/fingerprint-screenshots/step5-navigate.png'
    },
    {
      id: 7,
      title: 'Copy Your Public API Key',
      description: 'Your API key is already created! Click the "Copy" button next to your Public API Key.',
      image: '/fingerprint-screenshots/step6-copy.png',
      highlight: 'Look for the key starting with letters/numbers like "0L4CfzMF..."'
    },
    {
      id: 8,
      title: 'Paste Your API Key Here',
      description: 'Paste your API key below and we\'ll save it to your settings. That\'s it!',
      action: () => {
        if (apiKey && onApiKeyReady) {
          onApiKeyReady(apiKey);
          toast.success('FingerprintJS API key saved! Your tracking accuracy is now 99.5%! 🎯');
          setShowWizard(false);
        } else {
          toast.error('Please paste your API key first');
        }
      },
      actionLabel: 'Save API Key'
    }
  ];

  const currentStepData = steps[currentStep];

  if (!showWizard) {
    return (
      <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-foreground">
                Boost Attribution Accuracy to 99.5%
              </h3>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full text-xs font-medium">
                Optional
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              FingerprintJS creates unique device fingerprints that work even when users clear cookies or use incognito mode.
              This means you'll never lose track of which content drives conversions!
            </p>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Free tier: 10,000 API calls/month</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs text-muted-foreground">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs text-muted-foreground">2 minute setup</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowWizard(true)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Start Quick Setup
              </button>
              <span className="text-xs text-muted-foreground">
                Takes less than 2 minutes with Google sign-in
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-2 border-purple-500/20 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-500" />
            FingerprintJS Setup (Step {currentStep + 1} of {steps.length})
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Get your free API key in 2 minutes
          </p>
        </div>
        <button
          onClick={() => {
            setShowWizard(false);
            setCurrentStep(0);
          }}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-1 ${
                index <= currentStep ? 'text-purple-500' : 'text-muted-foreground'
              }`}
            >
              {index <= currentStep ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Circle className="w-3 h-3" />
              )}
            </div>
          ))}
        </div>
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-medium text-foreground mb-2">
            {currentStepData.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {currentStepData.description}
          </p>
          {currentStepData.highlight && (
            <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-sm text-foreground font-medium">
                {currentStepData.highlight}
              </p>
            </div>
          )}
        </div>

        {/* Image placeholder */}
        {currentStepData.image && (
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              [Screenshot: {currentStepData.image}]
            </p>
          </div>
        )}

        {/* API Key Input for last step */}
        {currentStep === steps.length - 1 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">
                Paste your FingerprintJS Public API Key:
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="e.g., 0L4CfzMFN0S7Z9rfgjZ8"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        {currentStepData.action && (
          <button
            onClick={currentStepData.action}
            className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center justify-center gap-2 font-medium"
          >
            {currentStepData.actionLabel}
            {currentStep === 1 && <ExternalLink className="w-4 h-4" />}
            {currentStep === steps.length - 1 && <CheckCircle className="w-4 h-4" />}
          </button>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              currentStep === 0
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep < steps.length - 1 && !currentStepData.action && (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Skip Option */}
        {currentStep === 0 && (
          <button
            onClick={() => setShowWizard(false)}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-2"
          >
            Skip for now (you can always add this later)
          </button>
        )}
      </div>
    </div>
  );
}