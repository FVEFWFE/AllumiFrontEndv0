'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CreateLink() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    campaignName: '',
    destinationUrl: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    recipientId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/links/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        setCreatedLink(data.shortUrl);
      } else {
        alert('Error creating link: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-muted-foreground hover:text-foreground mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-foreground">Create Tracking Link</h1>
          <p className="text-muted-foreground mt-2">
            Create a short link that tracks clicks and conversions
          </p>
        </div>

        {/* Form or Success */}
        {!createdLink ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campaign Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Campaign Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="e.g., YouTube Launch Video"
                value={formData.campaignName}
                onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                A friendly name to identify this campaign in your reports
              </p>
            </div>

            {/* Destination URL */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Destination URL *
              </label>
              <input
                type="url"
                required
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://www.skool.com/your-group"
                value={formData.destinationUrl}
                onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Where the link should redirect (usually your Skool group URL)
              </p>
            </div>

            {/* UTM Parameters */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">UTM Parameters (Optional)</h3>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  UTM Source
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g., youtube, instagram, email"
                  value={formData.utmSource}
                  onChange={(e) => setFormData({ ...formData, utmSource: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  UTM Medium
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g., video, post, newsletter"
                  value={formData.utmMedium}
                  onChange={(e) => setFormData({ ...formData, utmMedium: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  UTM Campaign
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g., launch-week, black-friday"
                  value={formData.utmCampaign}
                  onChange={(e) => setFormData({ ...formData, utmCampaign: e.target.value })}
                />
              </div>
            </div>

            {/* Advanced */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Recipient ID (For Email Campaigns)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="e.g., subscriber-123 or email hash"
                value={formData.recipientId}
                onChange={(e) => setFormData({ ...formData, recipientId: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional: Use for personalized email tracking
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Link'}
            </button>
          </form>
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Link Created!</h2>
            
            <div className="bg-background p-4 rounded-lg mb-6">
              <code className="text-accent break-all">{createdLink}</code>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={copyLink}
                className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90"
              >
                Copy Link
              </button>
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
                }}
                className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-card"
              >
                Create Another
              </button>
            </div>

            <div className="mt-8 p-4 bg-background rounded-lg text-left">
              <h3 className="font-semibold text-foreground mb-2">Next Steps:</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Share this link in your content (YouTube, Instagram, etc.)</li>
                <li>Set up Zapier to send new Skool members to Allumi</li>
                <li>Watch your dashboard to see attribution data</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}