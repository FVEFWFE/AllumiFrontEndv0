'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatNumber, getTimeAgo } from '@/lib/mock-data';

interface Comment {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    level: number;
  };
  content: string;
  createdAt: Date;
  likes: number;
  replies?: Comment[];
  isEdited?: boolean;
}

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  onReply?: (parentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  currentUserId?: string;
}

function LevelBadge({ level }: { level: number }) {
  const colors = [
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
  
  return (
    <div className={cn(
      "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white",
      colors[level - 1]
    )}>
      {level}
    </div>
  );
}

function CommentItem({ 
  comment, 
  depth = 0, 
  onReply, 
  onEdit, 
  onDelete,
  currentUserId = 'current-user'
}: CommentItemProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [collapsed, setCollapsed] = useState(false);
  
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isOwner = comment.author.username === currentUserId;
  const maxDepth = 3; // Max nesting level
  
  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };
  
  const handleReply = () => {
    if (replyContent.trim() && onReply) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyBox(false);
    }
  };
  
  const handleEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };
  
  return (
    <div className={cn("group", depth > 0 && "ml-12")}>
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
        
        {/* Comment Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm">{comment.author.name}</span>
            <LevelBadge level={comment.author.level} />
            <span className="text-xs text-gray-500">@{comment.author.username}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{getTimeAgo(comment.createdAt)}</span>
            {comment.isEdited && (
              <>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500 italic">edited</span>
              </>
            )}
          </div>
          
          {/* Content */}
          {isEditing ? (
            <div className="mb-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px] bg-gray-800 border-gray-700 text-white text-sm"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={handleEdit}
                  className="bg-emerald-600 hover:bg-emerald-700 h-7 text-xs"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-300 mb-2 whitespace-pre-wrap">{comment.content}</p>
          )}
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <Heart className={cn("h-3.5 w-3.5", liked && "fill-red-500 text-red-500")} />
              <span>{formatNumber(likes)}</span>
            </button>
            
            {/* Reply */}
            {depth < maxDepth && (
              <button
                onClick={() => setShowReplyBox(!showReplyBox)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Reply
              </button>
            )}
            
            {/* Collapse/Expand */}
            {hasReplies && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {collapsed ? (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    Show {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
                  </>
                ) : (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    Hide
                  </>
                )}
              </button>
            )}
            
            {/* More Options */}
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem
                    onClick={() => setIsEditing(true)}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white text-sm"
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete && onDelete(comment.id)}
                    className="text-red-400 hover:bg-gray-700 hover:text-red-300 text-sm"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {/* Reply Box */}
          {showReplyBox && (
            <div className="mt-3 flex gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-[60px] bg-gray-800 border-gray-700 text-white text-sm"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={!replyContent.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 h-7 text-xs"
                  >
                    Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowReplyBox(false);
                      setReplyContent('');
                    }}
                    className="h-7 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Nested Replies */}
          {hasReplies && !collapsed && (
            <div className="mt-4 space-y-4">
              {comment.replies!.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CommentThreadProps {
  comments: Comment[];
  onAddComment?: (content: string) => void;
  onReply?: (parentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  sortBy?: 'new' | 'top' | 'old';
}

export function CommentThread({
  comments,
  onAddComment,
  onReply,
  onEdit,
  onDelete,
  sortBy = 'new'
}: CommentThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [sortOrder, setSortOrder] = useState(sortBy);
  
  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === 'new') return b.createdAt.getTime() - a.createdAt.getTime();
    if (sortOrder === 'old') return a.createdAt.getTime() - b.createdAt.getTime();
    if (sortOrder === 'top') return b.likes - a.likes;
    return 0;
  });
  
  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment);
      setNewComment('');
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Add Comment */}
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://i.pravatar.cc/150?img=1" />
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="min-h-[80px] bg-gray-800 border-gray-700 text-white"
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 text-xs",
                  sortOrder === 'new' ? "text-emerald-500" : "text-gray-400"
                )}
                onClick={() => setSortOrder('new')}
              >
                Newest
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 text-xs",
                  sortOrder === 'top' ? "text-emerald-500" : "text-gray-400"
                )}
                onClick={() => setSortOrder('top')}
              >
                Top
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 text-xs",
                  sortOrder === 'old' ? "text-emerald-500" : "text-gray-400"
                )}
                onClick={() => setSortOrder('old')}
              >
                Oldest
              </Button>
            </div>
            <Button
              size="sm"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 h-7 text-xs"
            >
              Comment
            </Button>
          </div>
        </div>
      </div>
      
      {/* Comments List */}
      {sortedComments.length > 0 ? (
        <div className="space-y-4">
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}