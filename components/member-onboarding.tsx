'use client';

import { useState, useEffect } from 'react';
import { 
  Play, MessageCircle, Smartphone, X, Check, ChevronRight,
  Trophy, Sparkles, HelpCircle, Download, QrCode, ArrowRight,
  CheckCircle, Circle, ChevronDown, ChevronUp, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingStep {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  completed: boolean;
  skipped?: boolean;
  points: number;
}

interface MemberOnboardingProps {
  onComplete?: () => void;
  onDismiss?: () => void;
  communityName?: string;
  isVisible?: boolean;
}

export function MemberOnboarding({ 
  onComplete, 
  onDismiss,
  communityName = 'our community',
  isVisible = true
}: MemberOnboardingProps) {
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'video',
      title: 'Watch 60 sec intro video',
      shortTitle: 'Watch intro',
      description: 'Learn the basics',
      icon: <Play className="w-5 h-5" />,
      action: 'Start Watching',
      completed: false,
      points: 3
    },
    {
      id: 'comment',
      title: 'Leave your first comment',
      shortTitle: 'Comment',
      description: 'Introduce yourself',
      icon: <MessageCircle className="w-5 h-5" />,
      action: 'Find a Post',
      completed: false,
      points: 5
    },
    {
      id: 'app',
      title: 'Download the mobile app',
      shortTitle: 'Get app',
      description: 'Stay connected on-the-go',
      icon: <Smartphone className="w-5 h-5" />,
      action: 'Download Now',
      completed: false,
      points: 2
    }
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;
  const allComplete = steps.every(s => s.completed || s.skipped);

  useEffect(() => {
    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem('onboarding-progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setSteps(parsed.steps || steps);
        setTotalPoints(parsed.points || 0);
      } catch (e) {
        console.error('Failed to load onboarding progress');
      }
    }
  }, []);

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem('onboarding-progress', JSON.stringify({
      steps,
      points: totalPoints
    }));
  }, [steps, totalPoints]);

  useEffect(() => {
    if (allComplete && !showCelebration) {
      celebrate();
    }
  }, [allComplete]);

  const celebrate = () => {
    setShowCelebration(true);
    
    // Fire confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Award bonus points
    setTotalPoints(prev => prev + 5);

    // Call onComplete callback
    if (onComplete) {
      setTimeout(onComplete, 3000);
    }
  };

  const completeStep = (stepId: string) => {
    setSteps(prev => prev.map(step => {
      if (step.id === stepId && !step.completed) {
        setTotalPoints(current => current + step.points);
        return { ...step, completed: true };
      }
      return step;
    }));

    // Auto-advance to next step
    const nextIncompleteIndex = steps.findIndex((s, i) => 
      i > currentStep && !s.completed && !s.skipped
    );
    if (nextIncompleteIndex !== -1) {
      setCurrentStep(nextIncompleteIndex);
    }
  };

  const skipStep = (stepId: string) => {
    setSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return { ...step, skipped: true };
      }
      return step;
    }));
  };

  const handleVideoWatch = () => {
    setShowVideoModal(true);
    // Simulate video progress
    const interval = setInterval(() => {
      setVideoProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeStep('video');
          setShowVideoModal(false);
          return 100;
        }
        return prev + 2;
      });
    }, 20);
  };

  const handleCommentGuide = () => {
    // Scroll to feed
    const feedElement = document.querySelector('[data-feed]');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Show guide tooltip
      setTimeout(() => {
        alert('Click on any post that interests you and leave a thoughtful comment!');
      }, 1000);
    }
    
    // Mock completion for demo
    setTimeout(() => {
      completeStep('comment');
    }, 2000);
  };

  const handleAppDownload = () => {
    setShowAppModal(true);
  };

  if (!isVisible || (allComplete && !showCelebration)) {
    return null;
  }

  return (
    <>
      {/* Main Onboarding Bar */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-zinc-800 backdrop-blur-sm">
        <div className="px-6 py-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {showCelebration ? '🎉 Welcome aboard!' : '🎯 Getting Started'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {showCelebration 
                    ? `You're all set up and ready to explore ${communityName}!`
                    : 'Complete these steps to unlock your full experience'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Points earned */}
              {totalPoints > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-medium text-yellow-500">
                    {totalPoints} XP
                  </span>
                </div>
              )}

              {/* Progress */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">
                  {completedCount}/{steps.length} Complete
                </span>
                <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Expand/Collapse */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 text-zinc-400 hover:text-white transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Close */}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="p-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Steps */}
          {isExpanded && !showCelebration && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`relative p-4 rounded-lg border transition-all ${
                    step.completed 
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : step.skipped
                      ? 'bg-zinc-800/50 border-zinc-700 opacity-50'
                      : index === currentStep
                      ? 'bg-zinc-800 border-emerald-500/50 ring-1 ring-emerald-500/20'
                      : 'bg-zinc-800/50 border-zinc-700'
                  }`}
                >
                  {/* Step number */}
                  <div className="absolute -top-2 -left-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.completed 
                        ? 'bg-emerald-500 text-black'
                        : 'bg-zinc-700 text-zinc-400'
                    }`}>
                      {step.completed ? <Check className="w-3 h-3" /> : index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      step.completed 
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-zinc-700 text-zinc-400'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium text-sm ${
                        step.completed ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {step.description}
                      </p>
                      
                      {/* Points badge */}
                      <div className="mt-2 inline-flex items-center gap-1 text-xs text-zinc-500">
                        <Sparkles className="w-3 h-3" />
                        +{step.points} XP
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  {!step.completed && !step.skipped && (
                    <button
                      onClick={() => {
                        if (step.id === 'video') handleVideoWatch();
                        else if (step.id === 'comment') handleCommentGuide();
                        else if (step.id === 'app') handleAppDownload();
                      }}
                      className="mt-3 w-full px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      {step.action}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}

                  {/* Completed indicator */}
                  {step.completed && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle className="w-3 h-3" />
                      Completed!
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Celebration message */}
          {showCelebration && (
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-semibold text-white">
                  All steps complete! +5 bonus XP
                </span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setShowCelebration(false);
                    if (onDismiss) onDismiss();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  Explore Community
                </button>
                <button
                  onClick={() => setShowCelebration(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl shadow-2xl max-w-3xl w-full">
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Welcome to {communityName}!
                </h3>
                <button
                  onClick={() => {
                    setShowVideoModal(false);
                    setVideoProgress(0);
                  }}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Video placeholder */}
              <div className="aspect-video bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                <Play className="w-16 h-16 text-zinc-600" />
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                  <span>0:{Math.floor(videoProgress * 0.6).toString().padStart(2, '0')}</span>
                  <span>1:00</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-100"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setVideoProgress(100);
                    completeStep('video');
                    setShowVideoModal(false);
                  }}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Skip to end
                </button>
                <button
                  onClick={() => {
                    completeStep('video');
                    setShowVideoModal(false);
                    setVideoProgress(0);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  Mark as Watched
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* App Download Modal */}
      {showAppModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  📱 Download Allumi App
                </h3>
                <button
                  onClick={() => setShowAppModal(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-zinc-800 rounded-lg flex items-center justify-center mb-3">
                  <QrCode className="w-20 h-20 text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-400">Scan with your phone</p>
              </div>

              {/* Download buttons */}
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download for iOS
                </button>
                <button className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download for Android
                </button>
              </div>

              {/* Send link */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Or send link to your phone:
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  />
                  <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                    Send
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  onClick={() => {
                    skipStep('app');
                    setShowAppModal(false);
                  }}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Skip this step
                </button>
                <button
                  onClick={() => {
                    completeStep('app');
                    setShowAppModal(false);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}