'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Zap,
  Key,
  Webhook,
  TestTube
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'connected' | 'not_connected' | 'error' | 'checking';
  actionUrl?: string;
  actionLabel?: string;
  details?: string;
}

export default function IntegrationStatus() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkIntegrations();
  }, []);

  const checkIntegrations = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Check FingerprintJS status
      const { data: profile } = await supabase
        .from('profiles')
        .select('fingerprint_api_key, webhook_secret')
        .eq('id', session.user.id)
        .single();

      // Check if they have any conversions (indicates Zapier is working)
      const { data: conversions } = await supabase
        .from('conversions')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);

      // Check if they have any links
      const { data: links } = await supabase
        .from('links')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);

      const integrationsList: Integration[] = [
        {
          id: 'tracking-links',
          name: 'Tracking Links',
          description: links && links.length > 0
            ? `${links.length}+ active links`
            : 'Create your first tracking link',
          icon: Zap,
          status: links && links.length > 0 ? 'connected' : 'not_connected',
          actionUrl: links && links.length > 0 ? '/dashboard/links' : '/dashboard/links/create',
          actionLabel: links && links.length > 0 ? 'Manage Links' : 'Create First Link',
          details: links && links.length > 0
            ? 'Tracking active'
            : 'No links created yet'
        },
        {
          id: 'zapier',
          name: 'Zapier → Skool',
          description: conversions && conversions.length > 0
            ? 'Receiving member data'
            : 'Connect your Skool community',
          icon: Webhook,
          status: conversions && conversions.length > 0 ? 'connected' : 'not_connected',
          actionUrl: '/dashboard/settings',
          actionLabel: conversions && conversions.length > 0 ? 'View Settings' : 'Get Webhook URL',
          details: conversions && conversions.length > 0
            ? `${conversions.length}+ conversions tracked`
            : 'Waiting for first conversion'
        },
        {
          id: 'fingerprint',
          name: 'FingerprintJS',
          description: profile?.fingerprint_api_key
            ? '99.5% accuracy enabled'
            : 'Improve tracking accuracy',
          icon: Key,
          status: profile?.fingerprint_api_key ? 'connected' : 'not_connected',
          actionUrl: '/dashboard/settings',
          actionLabel: profile?.fingerprint_api_key ? 'Update Key' : 'Add API Key',
          details: profile?.fingerprint_api_key
            ? 'Device fingerprinting active'
            : 'Optional but recommended'
        }
      ];

      setIntegrations(integrationsList);
      setLoading(false);
    } catch (error) {
      console.error('Error checking integrations:', error);
      setLoading(false);
    }
  };

  const testIntegration = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    // Update status to checking
    setIntegrations(prev => prev.map(i =>
      i.id === integrationId ? { ...i, status: 'checking' } : i
    ));

    try {
      if (integrationId === 'zapier') {
        // Test webhook endpoint
        const response = await fetch('/api/webhooks/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: true })
        });

        if (response.ok) {
          toast.success('Webhook is working! Send a test from Zapier to verify.');
        } else {
          toast.error('Webhook test failed. Check your settings.');
        }
      } else if (integrationId === 'fingerprint') {
        // Test FingerprintJS API key
        const { data: profile } = await supabase
          .from('profiles')
          .select('fingerprint_api_key')
          .single();

        if (profile?.fingerprint_api_key) {
          toast.success('FingerprintJS API key is configured!');
        } else {
          toast.error('No API key found. Add one in settings.');
        }
      }
    } catch (error) {
      toast.error(`Failed to test ${integration.name}`);
    } finally {
      // Recheck all integrations
      checkIntegrations();
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const allConnected = integrations.every(i => i.status === 'connected');
  const someConnected = integrations.some(i => i.status === 'connected');

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Integration Status</h3>
          <p className="text-sm text-muted-foreground">
            {allConnected
              ? '✨ All systems operational'
              : someConnected
              ? '🔧 Some integrations need attention'
              : '👋 Let\'s get you connected'}
          </p>
        </div>
        <button
          onClick={() => checkIntegrations()}
          className="text-sm px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg transition"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {integrations.map(integration => {
          const Icon = integration.icon;
          const StatusIcon = integration.status === 'connected' ? CheckCircle2
            : integration.status === 'error' ? XCircle
            : integration.status === 'checking' ? Loader2
            : AlertCircle;

          return (
            <div
              key={integration.id}
              className={`p-4 rounded-lg border transition-all ${
                integration.status === 'connected'
                  ? 'bg-green-500/5 border-green-500/20'
                  : integration.status === 'error'
                  ? 'bg-red-500/5 border-red-500/20'
                  : 'bg-yellow-500/5 border-yellow-500/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${
                    integration.status === 'connected'
                      ? 'bg-green-500/10'
                      : integration.status === 'error'
                      ? 'bg-red-500/10'
                      : 'bg-yellow-500/10'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">
                      {integration.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <StatusIcon className={`w-5 h-5 ${
                  integration.status === 'connected'
                    ? 'text-green-500'
                    : integration.status === 'error'
                    ? 'text-red-500'
                    : integration.status === 'checking'
                    ? 'text-blue-500 animate-spin'
                    : 'text-yellow-500'
                }`} />
              </div>

              {integration.details && (
                <div className="text-xs text-muted-foreground mb-3 px-2 py-1 bg-background/50 rounded">
                  {integration.details}
                </div>
              )}

              <div className="flex items-center gap-2">
                {integration.actionUrl && (
                  <a
                    href={integration.actionUrl}
                    className={`flex-1 text-center px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                      integration.status === 'connected'
                        ? 'bg-muted hover:bg-muted/80 text-muted-foreground'
                        : 'bg-accent text-accent-foreground hover:opacity-90'
                    }`}
                  >
                    {integration.actionLabel}
                  </a>
                )}
                {integration.status !== 'connected' && integration.id !== 'tracking-links' && (
                  <button
                    onClick={() => testIntegration(integration.id)}
                    className="p-1.5 hover:bg-muted rounded-lg transition"
                    title="Test integration"
                  >
                    <TestTube className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!allConnected && (
        <div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/10">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> Complete all integrations for the best attribution tracking experience.
            Start with creating a tracking link, then connect Zapier to start receiving conversion data.
          </p>
        </div>
      )}
    </div>
  );
}