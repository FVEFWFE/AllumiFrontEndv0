'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp, Clock, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import confetti from 'canvas-confetti';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TrialUrgencyModal() {
  const [showModal, setShowModal] = useState(false);
  const [urgencyData, setUrgencyData] = useState<{
    daysRemaining: number;
    revenue: number;
    membersTracked: number;
    conversionRate: number;
  } | null>(null);

  useEffect(() => {
    async function checkUrgency() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check trial status
        const { data: userData } = await supabase
          .from('users')
          .select('trial_ends_at, subscription_status, created_at')
          .eq('id', user.id)
          .single();

        if (!userData || userData.subscription_status !== 'trialing') return;

        const trialEnd = new Date(userData.trial_ends_at);
        const now = new Date();
        const daysRemaining = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

        // Calculate time since signup
        const signupDate = new Date(userData.created_at);
        const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24));

        // Fetch stats (mock for now)
        const revenue = Math.floor(Math.random() * 15000) + 5000;
        const membersTracked = Math.floor(Math.random() * 200) + 50;
        const conversionRate = Math.random() * 20 + 10;

        setUrgencyData({
          daysRemaining,
          revenue,
          membersTracked,
          conversionRate
        });

        // Show modal at strategic times
        const shouldShowModal =
          (daysRemaining === 7 && localStorage.getItem('shown_day7') !== 'true') ||
          (daysRemaining === 3 && localStorage.getItem('shown_day3') !== 'true') ||
          (daysRemaining === 1 && localStorage.getItem('shown_day1') !== 'true') ||
          (daysSinceSignup === 3 && localStorage.getItem('shown_milestone3') !== 'true' && revenue > 1000);

        if (shouldShowModal) {
          setTimeout(() => setShowModal(true), 5000); // Show after 5 seconds

          // Mark as shown
          if (daysRemaining === 7) localStorage.setItem('shown_day7', 'true');
          if (daysRemaining === 3) localStorage.setItem('shown_day3', 'true');
          if (daysRemaining === 1) localStorage.setItem('shown_day1', 'true');
          if (daysSinceSignup === 3) localStorage.setItem('shown_milestone3', 'true');
        }
      } catch (error) {
        console.error('Error checking trial urgency:', error);
      }
    }

    checkUrgency();
  }, []);

  if (!urgencyData || !showModal) return null;

  const handleUpgrade = () => {
    // Celebrate the decision
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    window.location.href = '/dashboard/billing';
  };

  const urgencyColor = urgencyData.daysRemaining <= 3 ? 'red' : 'amber';

  const title = urgencyData.daysRemaining === 1
    ? "🚨 Last Day of Your Trial!"
    : urgencyData.daysRemaining === 3
    ? "⏰ Only 3 Days Left!"
    : urgencyData.daysRemaining === 7
    ? "📊 You're Crushing It!"
    : "🎯 Milestone Reached!";

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {urgencyData.daysRemaining <= 3 && (
              <AlertTriangle className={`h-5 w-5 text-${urgencyColor}-500 animate-pulse`} />
            )}
            {title}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 pt-4">
              {/* Stats showcase */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    ${urgencyData.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Revenue Tracked</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {urgencyData.membersTracked}
                  </p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {urgencyData.conversionRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Conversion</p>
                </div>
              </div>

              {/* Urgency message */}
              <div className="space-y-2">
                {urgencyData.daysRemaining <= 3 ? (
                  <p className="text-sm">
                    <strong>Don't lose your attribution data!</strong> You've tracked
                    ${urgencyData.revenue.toLocaleString()} in revenue. Upgrade now to keep
                    all your data and continue growing.
                  </p>
                ) : (
                  <p className="text-sm">
                    You've already tracked <strong>${urgencyData.revenue.toLocaleString()}</strong> in
                    revenue! At this rate, Allumi will pay for itself
                    <strong> {Math.ceil(urgencyData.revenue / 79)}x over</strong> this month.
                  </p>
                )}
              </div>

              {/* What you'll lose */}
              {urgencyData.daysRemaining <= 3 && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                    If you don't upgrade, you'll lose:
                  </p>
                  <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                    <li>• All {urgencyData.membersTracked} member attributions</li>
                    <li>• ${urgencyData.revenue.toLocaleString()} in tracked revenue</li>
                    <li>• Your conversion analytics & insights</li>
                    <li>• Access to your tracking links</li>
                  </ul>
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleUpgrade}
                  className={`flex-1 bg-${urgencyColor}-600 hover:bg-${urgencyColor}-700`}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Upgrade Now - Keep Your Data
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                  className="px-4"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Trust badge */}
              <p className="text-xs text-center text-muted-foreground">
                Join 500+ Skool creators tracking their revenue • Cancel anytime during trial
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}