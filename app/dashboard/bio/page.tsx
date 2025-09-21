'use client';

import { useState, useEffect } from 'react';
import { Plus, ExternalLink, Edit2, BarChart, Copy, Trash2, Eye, Link } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BioPage {
  id: string;
  slug: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  theme: string;
  is_active: boolean;
  views: number;
  created_at: string;
}

interface BioLink {
  id: string;
  title: string;
  url: string;
  clicks: number;
  is_active: boolean;
}

export default function BioDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bioPage, setBioPage] = useState<BioPage | null>(null);
  const [bioLinks, setBioLinks] = useState<BioLink[]>([]);
  const [stats, setStats] = useState({
    pageViews: 0,
    linkClicks: 0,
    ctr: 0,
    activeLinks: 0
  });

  useEffect(() => {
    fetchBioData();
  }, []);

  const fetchBioData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }

      // Fetch bio page
      const { data: pageData, error: pageError } = await supabase
        .from('bio_pages')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (pageData && !pageError) {
        setBioPage(pageData);

        // Fetch bio links
        const { data: linksData, error: linksError } = await supabase
          .from('bio_links')
          .select('*')
          .eq('page_id', pageData.id)
          .order('position');

        if (linksData && !linksError) {
          setBioLinks(linksData);

          // Calculate stats
          const totalClicks = linksData.reduce((sum, link) => sum + (link.clicks || 0), 0);
          const activeLinksCount = linksData.filter(link => link.is_active).length;
          const calculatedCtr = pageData.views > 0 ? ((totalClicks / pageData.views) * 100).toFixed(1) : 0;

          setStats({
            pageViews: pageData.views || 0,
            linkClicks: totalClicks,
            ctr: Number(calculatedCtr),
            activeLinks: activeLinksCount
          });
        }
      }
    } catch (error) {
      console.error('Error fetching bio data:', error);
      toast.error('Failed to load bio data');
    } finally {
      setLoading(false);
    }
  };

  const copyBioLink = () => {
    if (bioPage) {
      const bioUrl = `${window.location.origin}/${bioPage.slug}`;
      navigator.clipboard.writeText(bioUrl);
      toast.success('Bio link copied to clipboard!');
    }
  };

  const handleCreateBioPage = () => {
    router.push('/dashboard/bio/edit');
  };

  const handleEditBio = () => {
    router.push('/dashboard/bio/edit');
  };

  const handleManageLinks = () => {
    router.push('/dashboard/bio/links');
  };

  const handleViewPublicPage = () => {
    if (bioPage) {
      window.open(`/${bioPage.slug}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card p-4 rounded-lg border border-border">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-muted rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Link in Bio</h1>
          <p className="text-muted-foreground">
            Create a beautiful bio page with all your important links
          </p>
        </div>
        {!bioPage ? (
          <button
            onClick={handleCreateBioPage}
            className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Bio Page
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleViewPublicPage}
              className="px-4 py-2 rounded-lg border border-border hover:bg-muted flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Page
            </button>
            <button
              onClick={copyBioLink}
              className="px-4 py-2 rounded-lg border border-border hover:bg-muted flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">Page Views</div>
          <div className="text-2xl font-bold">{stats.pageViews.toLocaleString()}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">Link Clicks</div>
          <div className="text-2xl font-bold">{stats.linkClicks.toLocaleString()}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">CTR</div>
          <div className="text-2xl font-bold">{stats.ctr}%</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">Active Links</div>
          <div className="text-2xl font-bold">{stats.activeLinks}</div>
        </div>
      </div>

      {/* Bio Page Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        {!bioPage ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Link className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Bio Page Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first bio page to share all your important links in one place
            </p>
            <button
              onClick={handleCreateBioPage}
              className="bg-accent text-accent-foreground px-6 py-2 rounded-lg hover:bg-accent/90"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div>
            {/* Bio Page Info */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {bioPage.avatar_url ? (
                  <img
                    src={bioPage.avatar_url}
                    alt={bioPage.title}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {bioPage.title?.charAt(0)?.toUpperCase() || 'B'}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{bioPage.title || 'Untitled Bio'}</h3>
                  <p className="text-muted-foreground">/{bioPage.slug}</p>
                  {bioPage.bio && (
                    <p className="text-sm mt-1">{bioPage.bio}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEditBio}
                  className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted flex items-center gap-1.5 text-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Page
                </button>
                <button
                  onClick={handleManageLinks}
                  className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 flex items-center gap-1.5 text-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Manage Links
                </button>
              </div>
            </div>

            {/* Links Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Links ({bioLinks.length})</h4>
                {bioLinks.length > 0 && (
                  <button
                    onClick={handleManageLinks}
                    className="text-sm text-accent hover:underline"
                  >
                    View All
                  </button>
                )}
              </div>
              {bioLinks.length === 0 ? (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground mb-3">No links added yet</p>
                  <button
                    onClick={handleManageLinks}
                    className="text-accent hover:underline text-sm"
                  >
                    Add your first link
                  </button>
                </div>
              ) : (
                <div className="grid gap-2">
                  {bioLinks.slice(0, 3).map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{link.title}</p>
                          <p className="text-sm text-muted-foreground">{link.url}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{link.clicks} clicks</p>
                        {link.is_active ? (
                          <span className="text-xs text-green-500">Active</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Inactive</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {bioLinks.length > 3 && (
                    <p className="text-center text-sm text-muted-foreground">
                      +{bioLinks.length - 3} more links
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Public URL */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Public Bio URL</p>
                  <p className="font-mono text-sm">
                    {window.location.origin}/{bioPage.slug}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyBioLink}
                    className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-sm"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={handleViewPublicPage}
                    className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-sm"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}