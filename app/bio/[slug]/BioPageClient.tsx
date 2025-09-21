'use client';

import { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface BioPage {
  id: string;
  slug: string;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme: string;
}

interface BioLink {
  id: string;
  title: string;
  url: string;
  position: number;
}

interface BioPageClientProps {
  bioPage: BioPage;
  bioLinks: BioLink[];
}

export default function BioPageClient({ bioPage, bioLinks }: BioPageClientProps) {
  useEffect(() => {
    // Track page view
    fetch(`/api/bio/track?slug=${bioPage.slug}`);

    // Apply theme
    if (bioPage.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (bioPage.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, [bioPage]);

  const handleLinkClick = async (link: BioLink) => {
    try {
      // Track click and get URL with UTM parameters
      const response = await fetch('/api/bio/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkId: link.id,
          slug: bioPage.slug,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        window.open(data.url, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback to direct URL if tracking fails
        window.open(link.url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error tracking link click:', error);
      // Fallback to direct URL
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
        {/* Profile Section */}
        <div className="text-center mb-8">
          {/* Avatar */}
          {bioPage.avatar_url ? (
            <img
              src={bioPage.avatar_url}
              alt={bioPage.title || 'Profile'}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 object-cover border-4 border-border"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-border">
              <span className="text-3xl sm:text-4xl font-bold">
                {bioPage.title?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
          )}

          {/* Title */}
          {bioPage.title && (
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {bioPage.title}
            </h1>
          )}

          {/* Bio */}
          {bioPage.bio && (
            <p className="text-muted-foreground max-w-md mx-auto">
              {bioPage.bio}
            </p>
          )}
        </div>

        {/* Links Section */}
        <div className="space-y-3 sm:space-y-4">
          {bioLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className="w-full group"
            >
              <div className="bg-card border-2 border-border hover:border-accent rounded-xl p-4 sm:p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-left">
                    {link.title}
                  </span>
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="https://allumi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Powered by Allumi
          </a>
        </div>
      </div>

      {/* Mobile-optimized styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          .min-h-screen {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `}</style>
    </div>
  );
}