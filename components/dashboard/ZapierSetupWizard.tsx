'use client';

import { useState } from 'react';
import {
  Zap,
  Copy,
  CheckCircle,
  Circle,
  ArrowRight,
  ExternalLink,
  Play,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Step {
  id: number;
  title: string;
  description: string;
  action: string;
  completed: boolean;
}

export default function ZapierSetupWizard({ webhookUrl }: { webhookUrl: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: 'Open Zapier in New Tab',
      description: 'We\'ll open Zapier for you. Sign up or log in.',
      action: 'https://zapier.com/sign-up',
      completed: false
    },
    {
      id: 2,
      title: 'Click "Create Zap"',
      description: 'Find the orange "Create Zap" button in the top left',
      action: 'create',
      completed: false
    },
    {
      id: 3,
      title: 'Choose Skool as Trigger',
      description: 'Search "Skool" and select "New Member Joins Group"',
      action: 'trigger',
      completed: false
    },
    {
      id: 4,
      title: 'Connect Your Skool',
      description: 'Enter your Skool API key when prompted',
      action: 'connect',
      completed: false
    },
    {
      id: 5,
      title: 'Add Webhooks Action',
      description: 'Click + then search "Webhooks" and select "POST"',
      action: 'webhook',
      completed: false
    },
    {
      id: 6,
      title: 'Paste This URL',
      description: 'Copy our webhook URL and paste it in Zapier',
      action: 'paste',
      completed: false
    },
    {
      id: 7,
      title: 'Map the Data',
      description: 'We\'ll show you exactly which fields to select',
      action: 'map',
      completed: false
    },
    {
      id: 8,
      title: 'Test & Publish',
      description: 'Click test, then publish your Zap!',
      action: 'publish',
      completed: false
    }
  ]);

  const [copied, setCopied] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success('Webhook URL copied! Now paste it in Zapier');
    setTimeout(() => setCopied(false), 3000);
  };

  const markComplete = (stepId: number) => {
    setSteps(steps.map(s =>
      s.id === stepId ? { ...s, completed: true } : s
    ));
    if (stepId < 8) {
      setCurrentStep(stepId + 1);
    }
  };

  const openZapier = () => {
    window.open('https://zapier.com/sign-up', '_blank');
    setTimeout(() => markComplete(1), 2000);
  };

  const fieldMapping = {
    'email': 'Email (from Skool)',
    'name': 'Name (from Skool)',
    'joined_at': 'Joined At (from Skool)',
    'member_id': 'Member ID (from Skool)',
    'group_id': 'Group ID (from Skool)',
    'group_name': 'Group Name (from Skool)',
    'plan': 'Membership Level (from Skool)',
    'revenue': 'Payment Amount (from Skool)',
    'referrer': 'Leave empty',
    'metadata': 'Leave empty'
  };

  return (
    <div className="bg-gradient-to-br from-accent/5 to-accent/10 border-2 border-accent/20 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Easy Zapier Setup (5 minutes)
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Follow these steps exactly - we\'ll guide you through everything
          </p>
        </div>
        <button
          onClick={() => setShowVideo(!showVideo)}
          className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Watch Video
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {steps.filter(s => s.completed).length} of {steps.length} steps completed
        </p>
      </div>

      {/* Video Tutorial */}
      {showVideo && (
        <div className="mb-6 aspect-video bg-black/10 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Video tutorial coming soon!</p>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-4 rounded-lg border transition-all ${
              step.id === currentStep
                ? 'bg-accent/10 border-accent shadow-sm'
                : step.completed
                ? 'bg-green-500/5 border-green-500/20'
                : 'bg-background border-border opacity-60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {step.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : step.id === currentStep ? (
                  <div className="w-5 h-5 rounded-full bg-accent animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">
                  Step {step.id}: {step.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {step.description}
                </p>

                {/* Step-specific content */}
                {step.id === currentStep && (
                  <>
                    {step.id === 1 && (
                      <button
                        onClick={openZapier}
                        className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition flex items-center gap-2"
                      >
                        Open Zapier
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}

                    {step.id === 2 && (
                      <div>
                        <img
                          src="/zapier-create-button.png"
                          alt="Create Zap button"
                          className="rounded-lg border border-border mb-3 max-w-md"
                        />
                        <button
                          onClick={() => markComplete(2)}
                          className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90"
                        >
                          I found it!
                        </button>
                      </div>
                    )}

                    {step.id === 3 && (
                      <div className="space-y-3">
                        <div className="p-3 bg-background rounded-lg border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Search for:</p>
                          <p className="font-mono text-accent">Skool</p>
                        </div>
                        <div className="p-3 bg-background rounded-lg border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Select trigger:</p>
                          <p className="font-mono text-accent">New Member Joins Group</p>
                        </div>
                        <button
                          onClick={() => markComplete(3)}
                          className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90"
                        >
                          Done
                        </button>
                      </div>
                    )}

                    {step.id === 4 && (
                      <div className="space-y-3">
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <p className="text-sm text-foreground flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                            You\'ll find your Skool API key in your Skool group settings under "Plugins"
                          </p>
                        </div>
                        <button
                          onClick={() => markComplete(4)}
                          className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90"
                        >
                          Connected
                        </button>
                      </div>
                    )}

                    {step.id === 5 && (
                      <div className="space-y-3">
                        <div className="p-3 bg-background rounded-lg border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Click the + button, then search:</p>
                          <p className="font-mono text-accent">Webhooks by Zapier</p>
                        </div>
                        <div className="p-3 bg-background rounded-lg border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Select action:</p>
                          <p className="font-mono text-accent">Custom Request (POST)</p>
                        </div>
                        <button
                          onClick={() => markComplete(5)}
                          className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90"
                        >
                          Added
                        </button>
                      </div>
                    )}

                    {step.id === 6 && (
                      <div className="space-y-3">
                        <div className="p-3 bg-background rounded-lg border-2 border-accent">
                          <p className="text-xs text-muted-foreground mb-2">Your Webhook URL:</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-xs text-accent break-all">
                              {webhookUrl}
                            </code>
                            <button
                              onClick={copyWebhook}
                              className={`px-3 py-1.5 rounded transition flex items-center gap-1 text-sm ${
                                copied
                                  ? 'bg-green-500 text-white'
                                  : 'bg-accent text-accent-foreground hover:opacity-90'
                              }`}
                            >
                              {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copied ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => markComplete(6)}
                          className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90"
                        >
                          Pasted in Zapier
                        </button>
                      </div>
                    )}

                    {step.id === 7 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-foreground">
                          Map these exact fields:
                        </p>
                        <div className="space-y-2">
                          {Object.entries(fieldMapping).map(([field, source]) => (
                            <div key={field} className="flex items-center gap-2 p-2 bg-background rounded border border-border">
                              <span className="text-xs font-mono text-accent w-24">{field}:</span>
                              <span className="text-xs text-muted-foreground">{source}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => markComplete(7)}
                          className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90"
                        >
                          Fields Mapped
                        </button>
                      </div>
                    )}

                    {step.id === 8 && (
                      <div className="space-y-3">
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-green-500" />
                            Almost done!
                          </h5>
                          <ol className="text-sm text-muted-foreground space-y-1">
                            <li>1. Click "Test" in Zapier</li>
                            <li>2. If successful, click "Publish"</li>
                            <li>3. Turn your Zap ON</li>
                          </ol>
                        </div>
                        <button
                          onClick={() => {
                            markComplete(8);
                            toast.success('🎉 Zapier setup complete! New members will now be tracked automatically.');
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:opacity-90"
                        >
                          I Published My Zap!
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {step.id !== currentStep && !step.completed && (
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className="text-xs text-muted-foreground hover:text-accent"
                >
                  Jump here
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/10">
        <p className="text-sm text-muted-foreground">
          <strong>Need help?</strong> Email us at support@allumi.com or watch the video guide above.
          Most users complete this in under 5 minutes!
        </p>
      </div>
    </div>
  );
}