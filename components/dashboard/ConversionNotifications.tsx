'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, DollarSign, TrendingUp, X, Sparkles } from 'lucide-react';

interface Conversion {
  id: string;
  skool_email: string;
  skool_name?: string;
  membership_type: 'free' | 'paid';
  revenue_tracked: number;
  confidence_score: number;
  attribution_data?: any;
  metadata?: {
    attribution_method: string;
  };
}

interface Notification {
  id: string;
  conversion: Conversion;
  timestamp: Date;
  shown: boolean;
}

export default function ConversionNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connectSSE = () => {
      eventSource = new EventSource('/api/conversions/stream');

      eventSource.onopen = () => {
        setConnected(true);
        console.log('🔗 Connected to conversion stream');
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        setConnected(false);

        // Reconnect after 5 seconds
        setTimeout(() => {
          if (eventSource) {
            eventSource.close();
          }
          connectSSE();
        }, 5000);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'conversion') {
            // Add new conversion notification
            const notification: Notification = {
              id: data.data.id,
              conversion: data.data,
              timestamp: new Date(data.timestamp),
              shown: false
            };

            setNotifications(prev => [notification, ...prev].slice(0, 5)); // Keep only 5 latest

            // Auto-hide after 10 seconds
            setTimeout(() => {
              setNotifications(prev =>
                prev.map(n => n.id === notification.id ? { ...n, shown: true } : n)
              );
            }, 10000);
          }
        } catch (error) {
          console.error('Failed to parse SSE data:', error);
        }
      };
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatRevenue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getAttributionIcon = (method?: string) => {
    switch (method) {
      case 'direct': return '🔗';
      case 'fingerprint': return '🎯';
      case 'email': return '📧';
      default: return '✨';
    }
  };

  // Only show notifications that aren't hidden
  const visibleNotifications = notifications.filter(n => !n.shown);

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleNotifications.map((notification) => (
        <Card
          key={notification.id}
          className="animate-in slide-in-from-top shadow-lg border-accent/50 bg-card/95 backdrop-blur"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="mt-1">
                  {notification.conversion.membership_type === 'paid' ? (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-500" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">
                      New {notification.conversion.membership_type} member!
                    </p>
                    <span className="text-lg">
                      {getAttributionIcon(notification.conversion.metadata?.attribution_method)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {notification.conversion.skool_name || notification.conversion.skool_email}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {notification.conversion.revenue_tracked > 0 && (
                      <Badge variant="default" className="text-xs">
                        {formatRevenue(notification.conversion.revenue_tracked)}
                      </Badge>
                    )}

                    <Badge variant="outline" className="text-xs">
                      {notification.conversion.confidence_score}% confidence
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => dismissNotification(notification.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Connection status indicator */}
      <div className="flex justify-end">
        <Badge
          variant={connected ? "default" : "secondary"}
          className="text-xs"
        >
          <Bell className="w-3 h-3 mr-1" />
          {connected ? 'Live' : 'Reconnecting...'}
        </Badge>
      </div>
    </div>
  );
}