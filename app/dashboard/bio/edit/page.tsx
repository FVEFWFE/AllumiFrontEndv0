'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BioPage {
  id?: string;
  slug: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  theme: string;
  is_active: boolean;
}

export default function EditBioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bioPage, setBioPage] = useState<BioPage>({
    slug: '',
    title: '',
    bio: '',
    avatar_url: null,
    theme: 'dark',
    is_active: true
  });
  const [isNew, setIsNew] = useState(true);
  const [slugError, setSlugError] = useState('');

  useEffect(() => {
    fetchBioPage();
  }, []);

  const fetchBioPage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }

      const { data, error } = await supabase
        .from('bio_pages')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setBioPage(data);
        setIsNew(false);
      } else {
        // Generate a default slug from username or email
        const defaultSlug = user.email?.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-') || '';
        setBioPage(prev => ({ ...prev, slug: defaultSlug }));
      }
    } catch (error) {
      console.error('Error fetching bio page:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateSlug = (slug: string) => {
    if (!slug) {
      setSlugError('Slug is required');
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setSlugError('Slug can only contain lowercase letters, numbers, and hyphens');
      return false;
    }
    if (slug.length < 3) {
      setSlugError('Slug must be at least 3 characters long');
      return false;
    }
    if (slug.length > 50) {
      setSlugError('Slug must be less than 50 characters');
      return false;
    }
    setSlugError('');
    return true;
  };

  const handleSlugChange = (value: string) => {
    const formattedSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setBioPage(prev => ({ ...prev, slug: formattedSlug }));
    validateSlug(formattedSlug);
  };

  const handleSave = async () => {
    if (!validateSlug(bioPage.slug)) {
      toast.error('Please fix the slug errors');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return;
      }

      if (isNew) {
        // Create new bio page
        const { data, error } = await supabase
          .from('bio_pages')
          .insert({
            user_id: user.id,
            slug: bioPage.slug,
            title: bioPage.title,
            bio: bioPage.bio,
            avatar_url: bioPage.avatar_url,
            theme: bioPage.theme,
            is_active: bioPage.is_active
          })
          .select()
          .single();

        if (error) {
          if (error.code === '23505' && error.message.includes('slug')) {
            toast.error('This slug is already taken. Please choose another one.');
          } else {
            throw error;
          }
          return;
        }

        toast.success('Bio page created successfully!');
        router.push('/dashboard/bio');
      } else {
        // Update existing bio page
        const { error } = await supabase
          .from('bio_pages')
          .update({
            slug: bioPage.slug,
            title: bioPage.title,
            bio: bioPage.bio,
            avatar_url: bioPage.avatar_url,
            theme: bioPage.theme,
            is_active: bioPage.is_active
          })
          .eq('id', bioPage.id!);

        if (error) {
          if (error.code === '23505' && error.message.includes('slug')) {
            toast.error('This slug is already taken. Please choose another one.');
          } else {
            throw error;
          }
          return;
        }

        toast.success('Bio page updated successfully!');
        router.push('/dashboard/bio');
      }
    } catch (error) {
      console.error('Error saving bio page:', error);
      toast.error('Failed to save bio page');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-muted rounded w-1/6 mb-2"></div>
                <div className="h-10 bg-muted rounded"></div>
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
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/dashboard/bio')}
          className="p-2 rounded-lg hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {isNew ? 'Create Bio Page' : 'Edit Bio Page'}
          </h1>
          <p className="text-muted-foreground">
            Customize your bio page details and appearance
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !!slugError}
          className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Page Details */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Page Details</h2>

            {/* URL Slug */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{window.location.origin}/</span>
                <input
                  type="text"
                  value={bioPage.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="your-username"
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              {slugError && (
                <p className="text-red-500 text-sm mt-1">{slugError}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                This will be your public bio URL
              </p>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={bioPage.title}
                onChange={(e) => setBioPage(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Your Name or Brand"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Bio */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Bio Description
              </label>
              <textarea
                value={bioPage.bio}
                onChange={(e) => setBioPage(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell visitors about yourself..."
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <p className="text-xs text-muted-foreground mt-1">
                A short description that appears on your bio page
              </p>
            </div>

            {/* Avatar URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={bioPage.avatar_url || ''}
                onChange={(e) => setBioPage(prev => ({ ...prev, avatar_url: e.target.value || null }))}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL to your profile picture or logo
              </p>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Appearance</h2>

            {/* Theme */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Theme
              </label>
              <select
                value={bioPage.theme}
                onChange={(e) => setBioPage(prev => ({ ...prev, theme: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto (follows system)</option>
              </select>
            </div>

            {/* Active Status */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={bioPage.is_active}
                  onChange={(e) => setBioPage(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm font-medium">Page is active</span>
              </label>
              <p className="text-xs text-muted-foreground mt-1 ml-6">
                When inactive, your bio page will not be publicly accessible
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:sticky lg:top-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Live Preview</h2>

            {/* Phone Mockup */}
            <div className="max-w-sm mx-auto">
              <div className="bg-background border-4 border-muted rounded-[2rem] p-4">
                <div className="bg-card rounded-xl p-6 min-h-[500px]">
                  {/* Preview Avatar */}
                  <div className="text-center mb-4">
                    {bioPage.avatar_url ? (
                      <img
                        src={bioPage.avatar_url}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="text-2xl font-bold">
                          {bioPage.title?.charAt(0)?.toUpperCase() || 'A'}
                        </span>
                      </div>
                    )}
                    <h3 className="text-xl font-bold">
                      {bioPage.title || 'Your Name'}
                    </h3>
                    {bioPage.bio && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {bioPage.bio}
                      </p>
                    )}
                  </div>

                  {/* Preview Links Placeholder */}
                  <div className="space-y-3 mt-6">
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <span className="text-sm text-muted-foreground">Link 1</span>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <span className="text-sm text-muted-foreground">Link 2</span>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <span className="text-sm text-muted-foreground">Link 3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
              This is how your bio page will look on mobile devices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}