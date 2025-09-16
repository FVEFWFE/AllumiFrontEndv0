'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, List, ListOrdered, Quote, Code, 
  Link, Image, Youtube, Smile, Film, Paperclip,
  X, Send, Eye, Hash, AtSign, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PostEditorProps {
  communitySlug: string;
  onPostCreated?: (post: any) => void;
  className?: string;
}

interface Attachment {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video' | 'document';
  name: string;
  size: string;
}

interface Embed {
  id: string;
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  type: 'link' | 'youtube';
}

export function PostEditor({ communitySlug, onPostCreated, className }: PostEditorProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [embeds, setEmbeds] = useState<Embed[]>([]);
  const [category, setCategory] = useState('general');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [draftSaved, setDraftSaved] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_CHARS = 5000;

  // Categories (would come from API/community settings)
  const categories = [
    { id: 'general', name: 'General', color: 'bg-gray-500' },
    { id: 'announcements', name: 'Announcements', color: 'bg-blue-500' },
    { id: 'discussion', name: 'Discussion', color: 'bg-green-500' },
    { id: 'questions', name: 'Questions', color: 'bg-purple-500' },
    { id: 'resources', name: 'Resources', color: 'bg-yellow-500' },
  ];

  // Mock user data (would come from auth context)
  const currentUser = {
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    username: 'johndoe',
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(80, scrollHeight), 400)}px`;
    }
  }, [content]);

  // Character count
  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  // Auto-save draft
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (content.length > 0) {
        localStorage.setItem(`draft-${communitySlug}`, content);
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      }
    }, 30000); // Save every 30 seconds

    return () => clearTimeout(saveTimer);
  }, [content, communitySlug]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`draft-${communitySlug}`);
    if (savedDraft) {
      setContent(savedDraft);
    }
  }, [communitySlug]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Max size is 10MB.`);
        return;
      }

      const fileType = file.type.startsWith('image/') ? 'image' 
        : file.type.startsWith('video/') ? 'video' 
        : 'document';

      const attachment: Attachment = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        url: URL.createObjectURL(file),
        type: fileType,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      };

      setAttachments(prev => [...prev, attachment]);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleYouTubeEmbed = () => {
    const url = prompt('Enter YouTube URL:');
    if (url) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        const embed: Embed = {
          id: Math.random().toString(36).substr(2, 9),
          url,
          type: 'youtube',
          title: 'YouTube Video',
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        };
        setEmbeds(prev => [...prev, embed]);
      }
    }
  };

  const extractYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleLinkEmbed = async () => {
    const url = prompt('Enter URL:');
    if (url) {
      // In production, this would fetch metadata from the server
      const embed: Embed = {
        id: Math.random().toString(36).substr(2, 9),
        url,
        type: 'link',
        title: 'Link Preview',
        description: 'Loading...',
      };
      setEmbeds(prev => [...prev, embed]);
    }
  };

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newText);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selectedText.length;
      textarea.focus();
    }, 0);
  };

  const handlePost = async () => {
    if (!content.trim() || isPosting) return;

    setIsPosting(true);
    
    try {
      // In production, this would post to the API
      const postData = {
        content,
        attachments: attachments.map(a => a.file),
        embeds,
        category,
        communitySlug,
      };
      
      console.log('Posting:', postData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear draft
      localStorage.removeItem(`draft-${communitySlug}`);
      
      // Reset form
      setContent('');
      setAttachments([]);
      setEmbeds([]);
      setIsExpanded(false);
      
      // Callback
      if (onPostCreated) {
        onPostCreated(postData);
      }
    } catch (error) {
      console.error('Error posting:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to post
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handlePost();
    }
    // Other shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 'b':
          e.preventDefault();
          insertFormatting('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertFormatting('*', '*');
          break;
      }
    }
  };

  return (
    <div className={cn("bg-gray-900 rounded-lg border border-gray-800", className)}>
      <div className="p-4">
        <div className="flex gap-3">
          {/* User Avatar */}
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
          </Avatar>

          {/* Editor Container */}
          <div className="flex-1">
            {/* Category Selector */}
            <div className="flex items-center gap-2 mb-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px] h-8 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id} className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", cat.color)} />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {draftSaved && (
                <span className="text-xs text-gray-500">Draft saved</span>
              )}
            </div>

            {/* Text Area */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onKeyDown={handleKeyDown}
              placeholder="Write something..."
              className={cn(
                "w-full bg-gray-800 text-white placeholder-gray-500",
                "border border-gray-700 rounded-lg p-3",
                "focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500",
                "resize-none transition-all",
                "min-h-[80px]"
              )}
              maxLength={MAX_CHARS}
            />

            {/* Character Counter */}
            {charCount > 4500 && (
              <div className="text-right mt-1">
                <span className={cn(
                  "text-xs",
                  charCount >= MAX_CHARS ? "text-red-500" : "text-gray-500"
                )}>
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
            )}

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {attachments.map(attachment => (
                  <div key={attachment.id} className="relative group">
                    {attachment.type === 'image' ? (
                      <img 
                        src={attachment.url} 
                        alt={attachment.name}
                        className="h-20 w-20 object-cover rounded-lg border border-gray-700"
                      />
                    ) : (
                      <div className="h-20 w-32 bg-gray-800 rounded-lg border border-gray-700 p-2 flex flex-col justify-center">
                        <Paperclip className="h-6 w-6 text-gray-500 mb-1" />
                        <span className="text-xs text-gray-400 truncate">{attachment.name}</span>
                        <span className="text-xs text-gray-500">{attachment.size}</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Embeds Preview */}
            {embeds.length > 0 && (
              <div className="mt-3 space-y-2">
                {embeds.map(embed => (
                  <div key={embed.id} className="bg-gray-800 rounded-lg border border-gray-700 p-3">
                    {embed.type === 'youtube' ? (
                      <div className="flex items-center gap-3">
                        <img 
                          src={embed.thumbnail} 
                          alt="YouTube thumbnail"
                          className="h-16 w-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="text-sm text-white">{embed.title}</div>
                          <div className="text-xs text-gray-500">YouTube Video</div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm text-white">{embed.title}</div>
                        <div className="text-xs text-gray-500">{embed.url}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Toolbar */}
            {isExpanded && (
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    {/* File Attachment */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Attach File</TooltipContent>
                    </Tooltip>

                    {/* Link Embed */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                          onClick={handleLinkEmbed}
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add Link</TooltipContent>
                    </Tooltip>

                    {/* YouTube */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                          onClick={handleYouTubeEmbed}
                        >
                          <Youtube className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add YouTube Video</TooltipContent>
                    </Tooltip>

                    {/* Emoji */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add Emoji</TooltipContent>
                    </Tooltip>

                    {/* GIF */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                          onClick={() => setShowGifPicker(!showGifPicker)}
                        >
                          <Film className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add GIF</TooltipContent>
                    </Tooltip>

                    <div className="w-px h-6 bg-gray-700 mx-1" />

                    {/* Bold */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                          onClick={() => insertFormatting('**', '**')}
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bold (Ctrl+B)</TooltipContent>
                    </Tooltip>

                    {/* Italic */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                          onClick={() => insertFormatting('*', '*')}
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Italic (Ctrl+I)</TooltipContent>
                    </Tooltip>

                    {/* List */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                          onClick={() => insertFormatting('- ', '')}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>

                    {/* Code */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                          onClick={() => insertFormatting('`', '`')}
                        >
                          <Code className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Code</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={handlePost}
                    disabled={!content.trim() || isPosting}
                  >
                    {isPosting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/mp4,application/pdf,application/msword"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview Panel (if enabled) */}
      {showPreview && (
        <div className="border-t border-gray-800 p-4">
          <div className="text-sm text-gray-400 mb-2">Preview</div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="prose prose-invert max-w-none">
              {/* In production, this would render markdown */}
              <div className="text-white whitespace-pre-wrap">{content}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}