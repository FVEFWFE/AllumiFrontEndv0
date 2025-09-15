'use client';

import { useState } from 'react';
import { 
  Heart, MessageCircle, Share2, MoreHorizontal, Pin, Lock, 
  Image as ImageIcon, Video, Link2, Hash, Search, Plus,
  TrendingUp, Clock, Star
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getMockData, getTimeAgo, formatNumber } from '@/lib/mock-data';
import { PostEditor } from '@/components/post-editor';

const mockData = getMockData();

// Level badge colors
const levelColors = [
  'bg-gray-500',
  'bg-gray-400',
  'bg-green-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-yellow-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-pink-500',
];

function LevelBadge({ level }: { level: number }) {
  return (
    <div className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${levelColors[level - 1]}`}>
      {level}
    </div>
  );
}

function PostCard({ post }: { post: any }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  
  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };
  
  return (
    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.fullName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">{post.author.fullName}</span>
                <LevelBadge level={post.author.level} />
                {post.author.role === 'owner' && (
                  <Badge variant="secondary" className="bg-emerald-900 text-emerald-400">Owner</Badge>
                )}
                {post.author.role === 'admin' && (
                  <Badge variant="secondary" className="bg-blue-900 text-blue-400">Admin</Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{getTimeAgo(post.createdAt)}</span>
                {post.category && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-500">#{post.category}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {post.isPinned && <Pin className="h-4 w-4 text-emerald-500" />}
            {post.isLocked && <Lock className="h-4 w-4 text-yellow-500" />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-gray-800 bg-gray-900">
                <DropdownMenuItem className="text-gray-300">Save post</DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300">Copy link</DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300">Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Post Content */}
        <div className="mb-4">
          {post.title && (
            <h3 className="mb-2 text-lg font-semibold text-white">{post.title}</h3>
          )}
          <p className="whitespace-pre-wrap text-gray-300">{post.content}</p>
        </div>
        
        {/* Post Media */}
        {post.media && post.media[0] && (
          <div className="mb-4">
            {post.media[0].type === 'image' && (
              <img 
                src={post.media[0].url} 
                alt="" 
                className="rounded-lg"
              />
            )}
            {post.media[0].type === 'video' && (
              <div className="relative aspect-video rounded-lg bg-gray-800">
                <Video className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-gray-600" />
              </div>
            )}
          </div>
        )}
        
        {/* Post Actions */}
        <div className="flex items-center justify-between border-t border-gray-800 pt-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                liked ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm">{formatNumber(likes)}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-400 transition-colors hover:text-gray-300"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{formatNumber(post.comments)}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-400 transition-colors hover:text-gray-300">
              <Share2 className="h-5 w-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
        
        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-3 border-t border-gray-800 pt-4">
            <div className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={mockData.currentUser.avatar} />
                <AvatarFallback>{mockData.currentUser.fullName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea 
                  placeholder="Write a comment..." 
                  className="min-h-[80px] border-gray-800 bg-gray-900 text-white placeholder:text-gray-500"
                />
                <div className="mt-2 flex justify-end">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CommunityFeedPage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('new');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postContent, setPostContent] = useState('');
  
  const categories = ['All', 'General', 'Announcements', 'Questions', 'Resources', 'Wins'];
  
  // Filter posts based on active tab
  const filteredPosts = activeTab === 'all' 
    ? mockData.posts 
    : mockData.posts.filter(post => post.category?.toLowerCase() === activeTab.toLowerCase());
  
  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'new') return b.createdAt.getTime() - a.createdAt.getTime();
    if (sortBy === 'top') return b.likes - a.likes;
    if (sortBy === 'hot') return (b.likes + b.comments) - (a.likes + a.comments);
    return 0;
  });
  
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl p-6">
        {/* Community Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Marketing Mastery Community</h1>
              <p className="text-gray-400">847 members • 2,341 posts</p>
            </div>
            <Button 
              onClick={() => setIsCreatingPost(!isCreatingPost)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </div>
        </div>
        
        {/* Create Post with Rich Editor */}
        {isCreatingPost && (
          <div className="mb-6">
            <PostEditor 
              communitySlug={params.slug}
              onPostCreated={(post) => {
                console.log('New post created:', post);
                setIsCreatingPost(false);
                // In production, this would refresh the posts list
              }}
              className="mb-6"
            />
            <div className="flex justify-end mt-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsCreatingPost(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {/* Filters and Tabs */}
        <div className="mb-6 flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="border-gray-800 bg-gray-900">
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category.toLowerCase()}
                  className="data-[state=active]:bg-emerald-600"
                >
                  {category === 'All' ? (
                    category
                  ) : (
                    <>
                      <Hash className="mr-1 h-3 w-3" />
                      {category}
                    </>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={sortBy === 'new' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('new')}
              className={sortBy === 'new' ? 'bg-emerald-600' : ''}
            >
              <Clock className="mr-1 h-3 w-3" />
              New
            </Button>
            <Button
              variant={sortBy === 'top' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('top')}
              className={sortBy === 'top' ? 'bg-emerald-600' : ''}
            >
              <Star className="mr-1 h-3 w-3" />
              Top
            </Button>
            <Button
              variant={sortBy === 'hot' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('hot')}
              className={sortBy === 'hot' ? 'bg-emerald-600' : ''}
            >
              <TrendingUp className="mr-1 h-3 w-3" />
              Hot
            </Button>
          </div>
        </div>
        
        {/* Posts Feed */}
        <div className="space-y-4">
          {sortedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}