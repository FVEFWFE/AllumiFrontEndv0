'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit2, Trash2, GripVertical, Eye, EyeOff, ExternalLink, Save, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BioLink {
  id: string;
  title: string;
  url: string;
  position: number;
  is_active: boolean;
  clicks: number;
}

interface BioPage {
  id: string;
  slug: string;
  title: string;
}

export default function ManageBioLinks() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bioPage, setBioPage] = useState<BioPage | null>(null);
  const [links, setLinks] = useState<BioLink[]>([]);
  const [editingLink, setEditingLink] = useState<BioLink | null>(null);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [showNewLinkForm, setShowNewLinkForm] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }

      // Fetch bio page
      const { data: pageData, error: pageError } = await supabase
        .from('bio_pages')
        .select('id, slug, title')
        .eq('user_id', user.id)
        .single();

      if (!pageData || pageError) {
        toast.error('Please create a bio page first');
        router.push('/dashboard/bio');
        return;
      }

      setBioPage(pageData);

      // Fetch links
      const { data: linksData, error: linksError } = await supabase
        .from('bio_links')
        .select('*')
        .eq('page_id', pageData.id)
        .order('position');

      if (linksData && !linksError) {
        setLinks(linksData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!bioPage) return;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newPosition = links.length;
      const { data, error } = await supabase
        .from('bio_links')
        .insert({
          page_id: bioPage.id,
          user_id: user.id,
          title: newLink.title,
          url: newLink.url,
          position: newPosition,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setLinks([...links, data]);
      setNewLink({ title: '', url: '' });
      setShowNewLinkForm(false);
      toast.success('Link added successfully!');
    } catch (error) {
      console.error('Error adding link:', error);
      toast.error('Failed to add link');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLink = async (link: BioLink) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('bio_links')
        .update({
          title: link.title,
          url: link.url,
          is_active: link.is_active
        })
        .eq('id', link.id);

      if (error) throw error;

      setLinks(links.map(l => l.id === link.id ? link : l));
      setEditingLink(null);
      toast.success('Link updated successfully!');
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('Failed to update link');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const { error } = await supabase
        .from('bio_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update positions after deletion
      const updatedLinks = links
        .filter(l => l.id !== id)
        .map((link, index) => ({ ...link, position: index }));

      setLinks(updatedLinks);

      // Update positions in database
      for (const link of updatedLinks) {
        await supabase
          .from('bio_links')
          .update({ position: link.position })
          .eq('id', link.id);
      }

      toast.success('Link deleted successfully!');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    }
  };

  const handleToggleActive = async (id: string) => {
    const link = links.find(l => l.id === id);
    if (!link) return;

    try {
      const { error } = await supabase
        .from('bio_links')
        .update({ is_active: !link.is_active })
        .eq('id', id);

      if (error) throw error;

      setLinks(links.map(l =>
        l.id === id ? { ...l, is_active: !l.is_active } : l
      ));

      toast.success(link.is_active ? 'Link deactivated' : 'Link activated');
    } catch (error) {
      console.error('Error toggling link status:', error);
      toast.error('Failed to update link status');
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const draggedLink = links[draggedItem];
    const newLinks = [...links];

    // Remove dragged item and insert at new position
    newLinks.splice(draggedItem, 1);
    newLinks.splice(dropIndex, 0, draggedLink);

    // Update positions
    const updatedLinks = newLinks.map((link, index) => ({
      ...link,
      position: index
    }));

    setLinks(updatedLinks);
    setDraggedItem(null);

    // Update positions in database
    try {
      for (const link of updatedLinks) {
        await supabase
          .from('bio_links')
          .update({ position: link.position })
          .eq('id', link.id);
      }
      toast.success('Links reordered successfully!');
    } catch (error) {
      console.error('Error updating positions:', error);
      toast.error('Failed to save new order');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
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
          <h1 className="text-2xl font-bold">Manage Links</h1>
          <p className="text-muted-foreground">
            Add, edit, and reorder your bio links
          </p>
        </div>
        {bioPage && (
          <a
            href={`/${bioPage.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border border-border hover:bg-muted flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Page
          </a>
        )}
      </div>

      {/* Add New Link */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        {!showNewLinkForm ? (
          <button
            onClick={() => setShowNewLinkForm(true)}
            className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:bg-muted/30 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Link
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Add New Link</h3>
              <button
                onClick={() => {
                  setShowNewLinkForm(false);
                  setNewLink({ title: '', url: '' });
                }}
                className="p-1 rounded hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  placeholder="Link title"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNewLinkForm(false);
                  setNewLink({ title: '', url: '' });
                }}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLink}
                disabled={saving || !newLink.title || !newLink.url}
                className="px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Links List */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Your Links ({links.length})</h2>

        {links.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No links added yet</p>
            <button
              onClick={() => setShowNewLinkForm(true)}
              className="text-accent hover:underline"
            >
              Add your first link
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link, index) => (
              <div
                key={link.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`p-4 bg-muted/30 rounded-lg border border-border hover:border-accent/50 transition-colors ${
                  draggedItem === index ? 'opacity-50' : ''
                }`}
              >
                {editingLink?.id === link.id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editingLink.title}
                        onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                        className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <input
                        type="url"
                        value={editingLink.url}
                        onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                        className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingLink(null)}
                        className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateLink(editingLink)}
                        disabled={saving}
                        className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 text-sm disabled:opacity-50"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center gap-3">
                    <div className="cursor-move">
                      <GripVertical className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{link.title}</h4>
                          <p className="text-sm text-muted-foreground">{link.url}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {link.clicks} clicks
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(link.id)}
                            className="p-1.5 rounded-lg hover:bg-muted"
                            title={link.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {link.is_active ? (
                              <Eye className="w-4 h-4 text-green-500" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingLink(link)}
                            className="p-1.5 rounded-lg hover:bg-muted"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            className="p-1.5 rounded-lg hover:bg-muted"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {links.length > 0 && (
          <p className="text-xs text-muted-foreground mt-4">
            Drag and drop to reorder links
          </p>
        )}
      </div>
    </div>
  );
}