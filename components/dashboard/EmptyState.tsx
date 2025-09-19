'use client';

import { useRouter } from 'next/navigation';
import { Link2, Zap, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';

interface EmptyStateProps {
  type: 'links' | 'conversions' | 'campaigns';
}

export default function EmptyState({ type }: EmptyStateProps) {
  const router = useRouter();

  const content = {
    links: {
      icon: Link2,
      title: 'No tracking links yet',
      description: 'Create your first tracking link to start monitoring which content drives members to your Skool community.',
      steps: [
        'Create a tracking link for your content',
        'Share it in YouTube descriptions, Instagram bios, etc.',
        'Track clicks and conversions automatically'
      ],
      action: {
        label: 'Create Your First Link',
        onClick: () => router.push('/dashboard/links/create')
      }
    },
    conversions: {
      icon: Zap,
      title: 'No conversions tracked yet',
      description: 'Once you connect Zapier and people join through your links, you\'ll see attribution data here.',
      steps: [
        'Connect Zapier to your Skool community',
        'Map member data to Allumi webhook',
        'Watch conversions flow in automatically'
      ],
      action: {
        label: 'Go to Settings',
        onClick: () => router.push('/dashboard/settings')
      }
    },
    campaigns: {
      icon: BarChart3,
      title: 'Start tracking your campaigns',
      description: 'Create tracking links for each piece of content to see what\'s working.',
      steps: [
        'Create unique links for each campaign',
        'Name them clearly (e.g., "YouTube-Video-Title")',
        'Compare performance across channels'
      ],
      action: {
        label: 'Create Campaign Link',
        onClick: () => router.push('/dashboard/links/create')
      }
    }
  }[type];

  const Icon = content.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-accent" />
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-3">
        {content.title}
      </h3>

      <p className="text-muted-foreground text-center max-w-md mb-8">
        {content.description}
      </p>

      <div className="bg-muted/50 rounded-lg p-6 mb-8 max-w-md w-full">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <span className="text-sm bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center">
            ?
          </span>
          How it works
        </h4>
        <ul className="space-y-3">
          {content.steps.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={content.action.onClick}
        className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition flex items-center gap-2 group"
      >
        {content.action.label}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}