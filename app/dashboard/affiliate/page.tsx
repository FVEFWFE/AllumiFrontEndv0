'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Users,
  Link2,
  Copy,
  Share2,
  DollarSign,
  TrendingUp,
  Gift,
  MessageCircle,
  Twitter,
  Linkedin,
  Instagram,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AffiliatePage() {
  const [affiliateLink, setAffiliateLink] = useState('');
  const [referrals, setReferrals] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [pendingPayout, setPendingPayout] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Generate affiliate link based on user ID
      const affiliateCode = session.user.id.slice(0, 8);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://allumi.com';
      setAffiliateLink(`${baseUrl}?ref=${affiliateCode}`);

      // Mock data for now - in production, load from database
      setReferrals(3);
      setEarnings(120);
      setPendingPayout(40);
    } catch (error) {
      console.error('Error loading affiliate data:', error);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    toast.success('Affiliate link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnPlatform = (platform: string) => {
    const text = "I'm using Allumi to track which content drives members to my Skool community. It's a game-changer for attribution! 🚀";
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(affiliateLink);

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      skoolers: '#' // Will open modal for instructions
    };

    if (platform === 'skoolers') {
      toast.success('Copy your link and share it in the Skoolers community!');
    } else if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: '40% Recurring Commission',
      description: 'Earn 40% of every payment, forever'
    },
    {
      icon: Users,
      title: 'Cookie-Free Tracking',
      description: '365-day attribution window'
    },
    {
      icon: Gift,
      title: 'Your Referrals Get 20% Off',
      description: 'First 2 months discounted'
    }
  ];

  const shareOptions = [
    {
      platform: 'Skoolers Group',
      icon: MessageCircle,
      color: 'bg-purple-500',
      action: () => shareOnPlatform('skoolers'),
      recommended: true
    },
    {
      platform: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-400',
      action: () => shareOnPlatform('twitter')
    },
    {
      platform: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-600',
      action: () => shareOnPlatform('linkedin')
    }
  ];

  const templates = [
    {
      title: 'For Skoolers Community',
      content: `Just discovered Allumi - finally know which YouTube videos and Instagram posts actually drive members to my Skool!

No more guessing what content works. I can see exactly which videos convert to paid members.

They have a 14-day free trial: ${affiliateLink}

Anyone else tracking their content attribution?`
    },
    {
      title: 'For Content Creators',
      content: `If you're creating content to grow your Skool community, you need to check out Allumi.

It shows you exactly which pieces of content are driving members - down to the specific YouTube video or Instagram post.

I've already found that my tutorial videos convert 3x better than my vlogs!

Try it free: ${affiliateLink}`
    },
    {
      title: 'Quick Share',
      content: `Game-changer for Skool creators → ${affiliateLink}

Finally tracking which content actually converts to members! 🎯`
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with CTA */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-accent" />
          <h1 className="text-3xl font-bold text-foreground">Affiliate Program</h1>
        </div>
        <p className="text-muted-foreground">
          Earn 40% recurring commission for every customer you refer
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Total Referrals</div>
          <div className="text-3xl font-bold text-foreground">{referrals}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Lifetime Earnings</div>
          <div className="text-3xl font-bold text-foreground">${earnings}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Pending Payout</div>
          <div className="text-3xl font-bold text-accent">${pendingPayout}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Conversion Rate</div>
          <div className="text-3xl font-bold text-foreground">24%</div>
        </div>
      </div>

      {/* Affiliate Link Section */}
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 border-2 border-accent/20 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Your Unique Affiliate Link</h2>
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-background border border-border rounded-lg px-4 py-3">
            <code className="text-sm text-accent break-all">{affiliateLink}</code>
          </div>
          <button
            onClick={copyLink}
            className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-accent text-accent-foreground hover:opacity-90'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          Share this link to earn 40% commission on all referred customers, forever!
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div key={index} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Share Buttons */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Share</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shareOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                onClick={option.action}
                className={`relative p-4 rounded-lg border transition hover:scale-105 ${
                  option.recommended
                    ? 'border-accent bg-accent/5 hover:bg-accent/10'
                    : 'border-border hover:bg-muted'
                }`}
              >
                {option.recommended && (
                  <span className="absolute -top-2 right-2 px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-xs font-medium">
                    Recommended
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${option.color} text-white rounded-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-foreground">{option.platform}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message Templates */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Message Templates</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Copy and customize these templates to share with your audience
        </p>

        <div className="space-y-4">
          {templates.map((template, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-foreground">{template.title}</h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(template.content);
                    toast.success(`${template.title} copied!`);
                  }}
                  className="text-xs px-3 py-1 bg-accent text-accent-foreground rounded hover:opacity-90 transition"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {template.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tips */}
      <div className="mt-8 p-6 bg-accent/5 border border-accent/10 rounded-lg">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Pro Tips for Maximum Conversions
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-accent mt-0.5" />
            <span className="text-sm text-muted-foreground">
              Share in Skoolers community - they convert at 3x the normal rate
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-accent mt-0.5" />
            <span className="text-sm text-muted-foreground">
              Focus on the pain point: "Finally know which content drives members"
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-accent mt-0.5" />
            <span className="text-sm text-muted-foreground">
              Share your own results - specific numbers build trust
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}