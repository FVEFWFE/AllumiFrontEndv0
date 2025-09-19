'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { ChevronRight, ChevronLeft, Sparkles, Link2, Target, Hash, Mail, Shuffle, Check, Copy, ExternalLink, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FormData {
  campaignName: string;
  destinationUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  recipientId: string;
}

interface Step {
  id: string;
  question: string;
  subtitle?: string;
  field: keyof FormData;
  type: 'text' | 'url' | 'select' | 'optional';
  placeholder: string;
  examples?: string[];
  icon: React.ReactNode;
  suggestions?: string[];
  helperText?: string;
  skipLabel?: string;
}

export default function CreateLink() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [showingOptional, setShowingOptional] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    campaignName: '',
    destinationUrl: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    recipientId: ''
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const steps: Step[] = [
    {
      id: 'campaign',
      question: "What would you like to call this campaign?",
      subtitle: "Give it a name you'll remember",
      field: 'campaignName',
      type: 'text',
      placeholder: 'e.g., YouTube Launch Video',
      examples: ['YouTube Launch Video', 'Instagram Story Q4', 'Email Newsletter #12'],
      icon: <Sparkles className="w-6 h-6" />,
      helperText: "Pro tip: Use a name that tells you exactly where this link will be used"
    },
    {
      id: 'destination',
      question: "Where should this link take people?",
      subtitle: "Usually your Skool community URL",
      field: 'destinationUrl',
      type: 'url',
      placeholder: 'https://www.skool.com/your-community',
      icon: <Link2 className="w-6 h-6" />,
      suggestions: ['https://www.skool.com/'],
      helperText: "This is where visitors will land after clicking your tracking link"
    },
    {
      id: 'source',
      question: "Where will you share this link?",
      subtitle: "Help us track where your members come from",
      field: 'utmSource',
      type: 'optional',
      placeholder: 'Select a platform or type your own',
      icon: <Target className="w-6 h-6" />,
      suggestions: ['youtube', 'instagram', 'twitter', 'tiktok', 'facebook', 'email', 'podcast'],
      skipLabel: "Skip UTM tracking",
      helperText: "Optional but recommended for better attribution"
    },
    {
      id: 'medium',
      question: "What type of content is this for?",
      subtitle: "The format of your content",
      field: 'utmMedium',
      type: 'optional',
      placeholder: 'Select content type or enter your own',
      icon: <Hash className="w-6 h-6" />,
      suggestions: ['video', 'post', 'story', 'reel', 'newsletter', 'bio-link', 'description'],
      skipLabel: "Skip this step",
      helperText: "Helps you compare performance across different content types"
    },
    {
      id: 'recipient',
      question: "Is this for a specific person or email campaign?",
      subtitle: "Track individual conversions (advanced)",
      field: 'recipientId',
      type: 'optional',
      placeholder: 'Enter email or ID (optional)',
      icon: <Mail className="w-6 h-6" />,
      skipLabel: "This is for everyone",
      helperText: "Leave blank for general use, or add an identifier for personalized tracking"
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    // Initialize input value when step changes
    setInputValue(formData[currentStepData.field] || '');
  }, [currentStep, currentStepData.field, formData]);

  const handleNext = () => {
    // Save current value
    const updatedData = { ...formData, [currentStepData.field]: inputValue };
    setFormData(updatedData);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setInputValue('');
    } else {
      // Submit form
      handleSubmit(updatedData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStepData.type === 'optional') {
      setInputValue('');
      handleNext();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    // Auto-advance for source/medium selections
    if (currentStepData.field === 'utmSource' || currentStepData.field === 'utmMedium') {
      setTimeout(() => {
        const updatedData = { ...formData, [currentStepData.field]: suggestion };
        setFormData(updatedData);
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
          setInputValue('');
        }
      }, 300);
    }
  };

  const generateRandomId = () => {
    const randomId = `user-${Math.random().toString(36).substring(2, 9)}`;
    setInputValue(randomId);
    toast.success('Generated random ID!');
  };

  const handleSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      // Only include UTM parameters if source was provided
      const requestData = {
        userId: session.user.id,
        campaignName: data.campaignName,
        destinationUrl: data.destinationUrl,
        ...(data.utmSource && {
          utmSource: data.utmSource,
          utmMedium: data.utmMedium,
          utmCampaign: data.utmCampaign || data.campaignName
        }),
        ...(data.recipientId && { recipientId: data.recipientId })
      };

      const response = await fetch('/api/links/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (result.success) {
        setCreatedLink(result.shortUrl);
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast.success('Link created successfully!');
      } else {
        toast.error('Failed to create link: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      toast.success('Link copied to clipboard!');
    }
  };

  const isCurrentStepValid = () => {
    if (currentStepData.type === 'optional') return true;
    if (currentStepData.type === 'url') {
      try {
        new URL(inputValue);
        return true;
      } catch {
        return false;
      }
    }
    return inputValue.trim().length > 0;
  };

  // Success view
  if (createdLink) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-card border border-border rounded-2xl shadow-xl p-8 text-center">
            {/* Success Animation */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Your link is ready! 🎉
              </h1>
              <p className="text-muted-foreground">
                Start sharing and watch the magic happen
              </p>
            </div>

            {/* Link Display */}
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between gap-2">
                <code className="text-accent font-mono text-sm break-all flex-1">
                  {createdLink}
                </code>
                <button
                  onClick={copyLink}
                  className="p-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition shrink-0"
                  title="Copy link"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="bg-muted/50 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold text-foreground mb-3">Campaign Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="text-foreground font-medium">{formData.campaignName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination:</span>
                  <span className="text-foreground font-medium truncate max-w-[300px]">
                    {formData.destinationUrl}
                  </span>
                </div>
                {formData.utmSource && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source:</span>
                    <span className="text-foreground font-medium">{formData.utmSource}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Next Steps
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">→</span>
                  <span>Share this link in your {formData.utmSource || 'content'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">→</span>
                  <span>Connect Zapier to track conversions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">→</span>
                  <span>Watch your dashboard for attribution insights</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setCreatedLink(null);
                  setFormData({
                    campaignName: '',
                    destinationUrl: '',
                    utmSource: '',
                    utmMedium: '',
                    utmCampaign: '',
                    recipientId: ''
                  });
                  setCurrentStep(0);
                  setInputValue('');
                }}
                className="px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition"
              >
                Create Another Link
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              ← Exit
            </button>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
          {/* Icon and Question */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-accent/10 text-accent rounded-xl mb-4">
              {currentStepData.icon}
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {currentStepData.question}
            </h1>
            {currentStepData.subtitle && (
              <p className="text-muted-foreground">
                {currentStepData.subtitle}
              </p>
            )}
          </div>

          {/* Input Field */}
          <div className="mb-6">
            {currentStepData.type === 'url' ? (
              <div className="relative">
                <input
                  type="url"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={currentStepData.placeholder}
                  className="w-full px-4 py-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition text-lg"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isCurrentStepValid()) {
                      handleNext();
                    }
                  }}
                />
                {currentStepData.suggestions && inputValue.length === 0 && (
                  <div className="absolute top-full mt-2 text-sm text-muted-foreground">
                    Hint: Start with <span className="text-accent">{currentStepData.suggestions[0]}</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={currentStepData.placeholder}
                  className="w-full px-4 py-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition text-lg"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isCurrentStepValid()) {
                      handleNext();
                    }
                  }}
                />

                {/* Recipient ID Generator */}
                {currentStepData.field === 'recipientId' && (
                  <button
                    type="button"
                    onClick={generateRandomId}
                    className="mt-3 text-sm text-accent hover:text-accent/80 transition flex items-center gap-2"
                  >
                    <Shuffle className="w-4 h-4" />
                    Generate random ID
                  </button>
                )}
              </div>
            )}

            {/* Helper Text */}
            {currentStepData.helperText && (
              <p className="mt-3 text-sm text-muted-foreground">
                💡 {currentStepData.helperText}
              </p>
            )}
          </div>

          {/* Suggestions */}
          {currentStepData.suggestions && currentStepData.field !== 'destinationUrl' && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">Popular choices:</p>
              <div className="flex flex-wrap gap-2">
                {currentStepData.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      inputValue === suggestion
                        ? 'bg-accent text-white border-accent'
                        : 'bg-muted/50 text-foreground border-border hover:border-accent/50'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          {currentStepData.examples && inputValue.length === 0 && (
            <div className="mb-6 p-4 bg-muted/30 rounded-xl">
              <p className="text-sm font-medium text-muted-foreground mb-2">Examples:</p>
              <ul className="space-y-1">
                {currentStepData.examples.map((example, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    • {example}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              {currentStepData.type === 'optional' && currentStepData.skipLabel && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
                >
                  {currentStepData.skipLabel}
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={!isCurrentStepValid() && currentStepData.type !== 'optional'}
                className="px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? (
                  loading ? 'Creating...' : 'Create Link'
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard Hint */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> to continue
        </div>
      </div>
    </div>
  );
}