'use client';

import { useState } from 'react';
import { 
  MessageCircle, Heart, Reply, MoreVertical, Send, 
  Flag, Trash2, Edit2, ChevronDown, ChevronUp, 
  User, Shield, Star, Trophy, AtSign
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentAuthor {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  level: number;
  isAdmin?: boolean;
  isPro?: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: CommentAuthor;
  timestamp: Date;
  likes: number;
  liked: boolean;
  replies: Comment[];
  isEditing?: boolean;
  isTyping?: boolean;
}

interface CommentInterfaceProps {
  postId: string;
  comments?: Comment[];
  onAddComment?: (content: string, parentId?: string) => void;
  currentUser?: CommentAuthor;
  isCollapsed?: boolean;
}

export function CommentInterface({ 
  postId, 
  comments: initialComments = [], 
  onAddComment,
  currentUser = {
    id: 'current',
    name: 'Current User',
    username: 'currentuser',
    level: 3
  },
  isCollapsed: initialCollapsed = true
}: CommentInterfaceProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments.length > 0 ? initialComments : [
    {
      id: '1',
      content: 'This is exactly what I needed to hear today! The attribution tracking feature alone is worth the switch from Skool.',
      author: {
        id: '1',
        name: 'Sarah Chen',
        username: 'sarahchen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        level: 5,
        isPro: true
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 12,
      liked: false,
      replies: [
        {
          id: '1-1',
          content: 'Totally agree! I\'ve been tracking my revenue sources manually and this would save me hours every week.',
          author: {
            id: '2',
            name: 'Mike Johnson',
            username: 'mikej',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
            level: 3
          },
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          likes: 5,
          liked: true,
          replies: []
        }
      ]
    },
    {
      id: '2',
      content: 'Has anyone successfully migrated from Skool to Allumi? What was your experience like?',
      author: {
        id: '3',
        name: 'Alex Rivera',
        username: 'alexr',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        level: 7,
        isAdmin: true
      },
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 8,
      liked: false,
      replies: []
    }
  ]);

  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const totalComments = comments.reduce((total, comment) => {
    return total + 1 + comment.replies.length;
  }, 0);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: currentUser,
      timestamp: new Date(),
      likes: 0,
      liked: false,
      replies: []
    };

    setComments(prev => [...prev, newCommentObj]);
    setNewComment('');
    
    if (onAddComment) {
      onAddComment(newComment);
    }
  };

  const handleAddReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const newReply: Comment = {
      id: `${parentId}-${Date.now()}`,
      content: replyContent,
      author: currentUser,
      timestamp: new Date(),
      likes: 0,
      liked: false,
      replies: []
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        };
      }
      return comment;
    }));

    setReplyContent('');
    setReplyingTo(null);
    
    if (onAddComment) {
      onAddComment(replyContent, parentId);
    }
  };

  const handleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    setComments(prev => prev.map(comment => {
      if (!isReply && comment.id === commentId) {
        return {
          ...comment,
          liked: !comment.liked,
          likes: comment.liked ? comment.likes - 1 : comment.likes + 1
        };
      } else if (isReply && parentId && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === commentId) {
              return {
                ...reply,
                liked: !reply.liked,
                likes: reply.liked ? reply.likes - 1 : reply.likes + 1
              };
            }
            return reply;
          })
        };
      }
      return comment;
    }));
  };

  const handleEdit = (commentId: string, content: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, content };
      }
      return {
        ...comment,
        replies: comment.replies.map(reply => {
          if (reply.id === commentId) {
            return { ...reply, content };
          }
          return reply;
        })
      };
    }));
    setEditingComment(null);
    setEditContent('');
  };

  const handleDelete = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    setComments(prev => {
      if (!isReply) {
        return prev.filter(comment => comment.id !== commentId);
      } else if (parentId) {
        return prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== commentId)
            };
          }
          return comment;
        });
      }
      return prev;
    });
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const getLevelBadge = (level: number) => {
    if (level >= 9) return { icon: Trophy, color: 'text-yellow-500' };
    if (level >= 7) return { icon: Star, color: 'text-purple-500' };
    if (level >= 5) return { icon: Shield, color: 'text-blue-500' };
    return { icon: User, color: 'text-gray-500' };
  };

  const renderComment = (comment: Comment, isReply: boolean = false, parentId?: string) => {
    const LevelIcon = getLevelBadge(comment.author.level).icon;
    const levelColor = getLevelBadge(comment.author.level).color;
    const isEditing = editingComment === comment.id;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const areRepliesExpanded = expandedReplies.has(comment.id);

    return (
      <div key={comment.id} className={`${isReply ? 'ml-12' : ''}`}>
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {comment.author.avatar ? (
              <img 
                src={comment.author.avatar} 
                alt={comment.author.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-zinc-600" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Author info */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-white">{comment.author.name}</span>
              <span className="text-sm text-zinc-500">@{comment.author.username}</span>
              <LevelIcon className={`w-4 h-4 ${levelColor}`} />
              <span className={`text-xs ${levelColor}`}>Level {comment.author.level}</span>
              {comment.author.isAdmin && (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                  Admin
                </span>
              )}
              {comment.author.isPro && (
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                  Pro
                </span>
              )}
              <span className="text-xs text-zinc-500">
                {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
              </span>
            </div>

            {/* Comment content */}
            {isEditing ? (
              <div className="mb-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white resize-none focus:border-emerald-500 focus:outline-none"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(comment.id, editContent)}
                    className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                    className="px-3 py-1 text-zinc-400 hover:text-white text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-zinc-300 mb-2">{comment.content}</p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLike(comment.id, isReply, parentId)}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  comment.liked ? 'text-red-500' : 'text-zinc-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${comment.liked ? 'fill-current' : ''}`} />
                <span>{comment.likes}</span>
              </button>

              {!isReply && (
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="flex items-center gap-1 text-sm text-zinc-500 hover:text-emerald-500 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              )}

              {comment.author.id === currentUser.id && (
                <>
                  <button
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditContent(comment.content);
                    }}
                    className="flex items-center gap-1 text-sm text-zinc-500 hover:text-blue-500 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id, isReply, parentId)}
                    className="flex items-center gap-1 text-sm text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </>
              )}

              <button className="text-zinc-500 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Reply input */}
            {replyingTo === comment.id && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddReply(comment.id);
                    }
                  }}
                  placeholder="Write a reply..."
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  onClick={() => handleAddReply(comment.id)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                  className="px-3 py-2 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Show/hide replies button */}
            {hasReplies && !isReply && (
              <button
                onClick={() => toggleReplies(comment.id)}
                className="mt-3 flex items-center gap-1 text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                {areRepliesExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Hide {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                  </>
                )}
              </button>
            )}

            {/* Nested replies */}
            {hasReplies && areRepliesExpanded && (
              <div className="mt-4 space-y-4">
                {comment.replies.map(reply => renderComment(reply, true, comment.id))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="border-t border-zinc-800 pt-4">
      {/* Comments header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center gap-2 mb-4 text-zinc-400 hover:text-white transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium">
          {totalComments} {totalComments === 1 ? 'Comment' : 'Comments'}
        </span>
        {isCollapsed ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </button>

      {/* Comments section */}
      {!isCollapsed && (
        <div className="space-y-6">
          {/* New comment input */}
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-zinc-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  setShowTypingIndicator(e.target.value.length > 0);
                }}
                onBlur={() => setShowTypingIndicator(false)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 resize-none focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                rows={3}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-zinc-500">
                  {showTypingIndicator && 'Typing...'}
                </div>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-6">
            {comments.map(comment => renderComment(comment))}
          </div>

          {/* Empty state */}
          {comments.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">No comments yet</p>
              <p className="text-sm text-zinc-600 mt-1">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}