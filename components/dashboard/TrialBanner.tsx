'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Clock, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface TrialBannerProps {
  className?: string;
}

export default function TrialBanner({ className = '' }: TrialBannerProps) {
  const [trialData, setTrialData] = useState<{
    daysRemaining: number;
    totalRevenue: number;
    isActive: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrialStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch user data from database
        const { data: userData } = await supabase
          .from('users')
          .select('trial_ends_at, subscription_status')
          .eq('id', user.id)
          .single();

        if (userData?.trial_ends_at) {
          const trialEnd = new Date(userData.trial_ends_at);
          const now = new Date();
          const daysRemaining = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

          // Fetch total revenue tracked (mock for now)
          const totalRevenue = Math.floor(Math.random() * 10000) + 1000;

          setTrialData({
            daysRemaining,
            totalRevenue,
            isActive: userData.subscription_status === 'trialing'
          });
        }
      } catch (error) {
        console.error('Error fetching trial status:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrialStatus();
  }, []);

  if (loading || !trialData?.isActive) return null;

  const urgencyColor = trialData.daysRemaining <= 3 ? 'red' :
                       trialData.daysRemaining <= 7 ? 'amber' :
                       'violet';

  const urgencyMessage = trialData.daysRemaining === 0 ? "Trial ends today!" :
                         trialData.daysRemaining === 1 ? "Last day of trial!" :
                         trialData.daysRemaining <= 3 ? `Only ${trialData.daysRemaining} days left!` :
                         `Day ${15 - trialData.daysRemaining} of 14`;

  return (
    <div className={`relative overflow-hidden rounded-lg border ${className}`}>
      {/* Background gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-${urgencyColor}-500/10 to-${urgencyColor}-600/10`} />

      <div className="relative px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Icon and status */}
            <div className={`flex items-center gap-2 text-${urgencyColor}-600 dark:text-${urgencyColor}-400`}>
              {trialData.daysRemaining <= 3 ? (
                <AlertCircle className="h-5 w-5 animate-pulse" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
              <span className="font-semibold">{urgencyMessage}</span>
            </div>

            {/* Revenue tracked */}
            {trialData.totalRevenue > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">
                  ${trialData.totalRevenue.toLocaleString()} tracked so far
                </span>
              </div>
            )}
          </div>

          {/* CTA button */}
          <div className="flex items-center gap-3">
            {trialData.daysRemaining <= 3 && (
              <span className="text-sm text-muted-foreground">
                Don't lose your attribution data!
              </span>
            )}
            <Button
              size="sm"
              className={`bg-${urgencyColor}-600 hover:bg-${urgencyColor}-700`}
              onClick={() => window.location.href = '/dashboard/billing'}
            >
              <Zap className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-${urgencyColor}-500 transition-all duration-500`}
            style={{ width: `${((14 - trialData.daysRemaining) / 14) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}