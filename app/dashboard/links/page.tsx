'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Copy, Edit, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Link {
  id: string;
  short_id: string;
  campaign_name: string;
  destination_url: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  clicks: number;
  created_at: string;
}

export default function LinksPage() {
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/sign-in');
        return;
      }

      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading links:', error);
        return;
      }

      setLinks(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const copyLink = (shortId: string) => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/l/${shortId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const deleteLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId);

    if (!error) {
      setLinks(links.filter(l => l.id !== linkId));
      toast.success('Link deleted successfully');
    } else {
      toast.error('Failed to delete link');
    }
  };

  const filteredLinks = links.filter(link =>
    link.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.destination_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl">Loading links...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Links</h1>
            <p className="text-muted-foreground mt-2">
              Manage all your tracking links in one place
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/links/create')}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90"
          >
            + Create New Link
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search links..."
            className="w-full px-4 py-2 bg-card border border-border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Links Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4">Campaign</th>
                <th className="text-left p-4">Destination</th>
                <th className="text-center p-4">Clicks</th>
                <th className="text-left p-4">Created</th>
                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((link) => (
                <tr key={link.id} className="border-t border-border">
                  <td className="p-4">
                    <div className="font-medium">{link.campaign_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {link.utm_source && `Source: ${link.utm_source}`}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm truncate max-w-[300px]">
                      {link.destination_url}
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <span className="font-bold">{link.clicks || 0}</span>
                  </td>
                  <td className="p-4 text-sm">
                    {new Date(link.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => copyLink(link.short_id)}
                        className="p-1 hover:bg-muted rounded"
                        title="Copy link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/l/${link.short_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-muted rounded"
                        title="Open link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => deleteLink(link.id)}
                        className="p-1 hover:bg-muted rounded text-red-500"
                        title="Delete link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLinks.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              {searchTerm ? 'No links found matching your search' : 'No links created yet'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}