'use client';

import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, ExternalLink, Copy, Check, Zap, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface FingerprintSetupGuideProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function FingerprintSetupGuide({ onComplete, onSkip }: FingerprintSetupGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [showManualSetup, setShowManualSetup] = useState(false);

  const steps = [
    {
      title: "Boost Your Attribution to 99.5% Accuracy",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-accent/20 to-accent/10 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-3">Why FingerprintJS?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5"></div>
                <div>
                  <strong>Cross-device tracking:</strong> Track users even when they switch from phone to laptop
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5"></div>
                <div>
                  <strong>99.5% accuracy:</strong> Identify visitors even in incognito mode
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5"></div>
                <div>
                  <strong>10,000 free API calls/month:</strong> Enough for most creators
                </div>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">
            Setting up FingerprintJS takes just 2 minutes and dramatically improves your attribution accuracy.
          </p>
        </div>
      ),
      actions: (
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
          >
            Skip for now
          </button>
          <button
            onClick={() => setCurrentStep(1)}
            className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition flex items-center gap-2"
          >
            Get Free API Key
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      title: "Step 1: Open FingerprintJS Signup",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            We'll open FingerprintJS in a new tab. Look for the "Continue with Google" button for the fastest setup.
          </p>
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img
              src="/docs/screenshots/fingerprint_step1_signup_page.png"
              alt="FingerprintJS Signup Page"
              className="w-full"
            />
          </div>
          <a
            href="https://dashboard.fingerprint.com/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:underline"
          >
            Open FingerprintJS Signup
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ),
      actions: (
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(0)}
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition"
          >
            I've opened it
          </button>
        </div>
      )
    },
    {
      title: "Step 2: Sign in with Google (Fastest)",
      content: (
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Quick tip:</p>
            <p className="text-sm text-muted-foreground">
              Using Google sign-in skips email verification and gets you started immediately!
            </p>
          </div>
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img
              src="/docs/screenshots/fingerprint_step2_google_accounts.png"
              alt="Google Sign-in"
              className="w-full"
            />
          </div>
          <button
            onClick={() => setShowManualSetup(!showManualSetup)}
            className="text-sm text-accent hover:underline"
          >
            {showManualSetup ? 'Hide' : 'Show'} manual email signup option
          </button>
          {showManualSetup && (
            <div className="p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
              <p className="font-medium mb-2">Manual signup:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Enter your email and create a password</li>
                <li>Check your email for verification link</li>
                <li>Click the link to verify</li>
                <li>Return to dashboard</li>
              </ol>
            </div>
          )}
        </div>
      ),
      actions: (
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(1)}
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition"
          >
            I've signed in
          </button>
        </div>
      )
    },
    {
      title: "Step 3: Quick Setup",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            When asked about your use case:
          </p>
          <div className="space-y-3">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium">Problem to solve:</p>
              <p className="text-accent mt-1">Select "Personalization"</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium">Server region:</p>
              <p className="text-accent mt-1">Select "North America - Virginia"</p>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img
              src="/docs/screenshots/fingerprint_step5_onboarding_problem.png"
              alt="Onboarding Setup"
              className="w-full"
            />
          </div>
        </div>
      ),
      actions: (
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(2)}
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStep(4)}
            className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition"
          >
            Continue
          </button>
        </div>
      )
    },
    {
      title: "Step 4: Find Your API Key",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Click "API Keys" in the left sidebar, then copy your Public API Key:
          </p>
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img
              src="/docs/screenshots/fingerprint_step7_api_keys_page.png"
              alt="API Keys Page"
              className="w-full"
            />
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <p className="text-sm font-medium text-accent mb-2">
              Your API key will look like this:
            </p>
            <code className="text-xs text-muted-foreground">
              AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
            </code>
          </div>
        </div>
      ),
      actions: (
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(3)}
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStep(5)}
            className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition"
          >
            I've copied it
          </button>
        </div>
      )
    },
    {
      title: "Step 5: Paste Your API Key",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Paste your FingerprintJS API key below to enable 99.5% accurate tracking:
          </p>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              FingerprintJS Public API Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your API key here"
              className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
              autoFocus
            />
          </div>
          {apiKey && (
            <div className="flex items-center gap-2 text-green-500">
              <Check className="w-5 h-5" />
              <span className="text-sm">API key detected!</span>
            </div>
          )}
        </div>
      ),
      actions: (
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(4)}
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
          >
            Back
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
          >
            Skip for now
          </button>
          <button
            onClick={() => {
              if (apiKey) {
                // Save API key to localStorage or settings
                localStorage.setItem('fingerprint_api_key', apiKey);
                toast.success('FingerprintJS API key saved!');
                onComplete();
              } else {
                toast.error('Please enter your API key');
              }
            }}
            disabled={!apiKey}
            className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save & Continue
          </button>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-4">
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-muted">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {currentStepData.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Setup step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={onSkip}
              className="p-2 hover:bg-muted rounded-lg transition"
              title="Skip setup"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {currentStepData.content}
          </div>

          {/* Actions */}
          <div className="px-8 pb-8">
            {currentStepData.actions}
          </div>
        </div>
      </div>
    </div>
  );
}