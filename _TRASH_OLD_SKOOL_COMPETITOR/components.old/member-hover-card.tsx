'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, MessageSquare, UserPlus, UserCheck, 
  Trophy, Star, Shield, Zap, Calendar, MapPin,
  Award, TrendingUp, Users, Activity
} from 'lucide-react';

interface MemberStats {
  posts: number;
  comments: number;
  likes: number;
  joinedDate: Date;
  lastActive: Date;
  followers: number;
  following: number;
}

interface Member {
  id: string;
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
  level: number;
  points: number;
  location?: string;
  isPro?: boolean;
  isAdmin?: boolean;
  isOnline?: boolean;
  stats: MemberStats;
}

interface MemberHoverCardProps {
  member: Member;
  children: React.ReactNode;
  delay?: number;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  onFollow?: (memberId: string) => void;
  onMessage?: (memberId: string) => void;
  currentUserId?: string;
}

export function MemberHoverCard({
  member,
  children,
  delay = 500,
  placement = 'bottom',
  onFollow,
  onMessage,
  currentUserId = 'current'
}: MemberHoverCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const getLevelInfo = (level: number) => {
    if (level >= 9) return { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/20', label: 'Master' };
    if (level >= 7) return { icon: Star, color: 'text-purple-500', bg: 'bg-purple-500/20', label: 'Expert' };
    if (level >= 5) return { icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/20', label: 'Advanced' };
    if (level >= 3) return { icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/20', label: 'Active' };
    return { icon: User, color: 'text-gray-500', bg: 'bg-gray-500/20', label: 'Member' };
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !cardRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();
    const spacing = 8;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - cardRect.height - spacing;
        left = triggerRect.left + (triggerRect.width - cardRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + spacing;
        left = triggerRect.left + (triggerRect.width - cardRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - cardRect.height) / 2;
        left = triggerRect.left - cardRect.width - spacing;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - cardRect.height) / 2;
        left = triggerRect.right + spacing;
        break;
    }

    // Keep card within viewport
    const padding = 16;
    if (left < padding) left = padding;
    if (left + cardRect.width > window.innerWidth - padding) {
      left = window.innerWidth - cardRect.width - padding;
    }
    if (top < padding) top = padding;
    if (top + cardRect.height > window.innerHeight - padding) {
      top = window.innerHeight - cardRect.height - padding;
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible]);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (onFollow) {
      onFollow(member.id);
    }
  };

  const handleMessage = () => {
    if (onMessage) {
      onMessage(member.id);
    }
  };

  const levelInfo = getLevelInfo(member.level);
  const LevelIcon = levelInfo.icon;
  const isCurrentUser = member.id === currentUserId;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Active now';
    if (hours < 24) return `Active ${hours}h ago`;
    if (hours < 48) return 'Active yesterday';
    return `Active ${Math.floor(hours / 24)}d ago`;
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={cardRef}
          className="fixed z-50 w-80 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200"
          style={{ top: position.top, left: position.left }}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Header with gradient background */}
          <div className="h-20 bg-gradient-to-br from-emerald-600 to-purple-600 relative">
            {member.isOnline && (
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-white">Online</span>
              </div>
            )}
          </div>

          {/* Profile section */}
          <div className="px-4 -mt-10 relative">
            {/* Avatar */}
            <div className="relative inline-block">
              {member.avatar ? (
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-20 h-20 rounded-full border-4 border-zinc-900"
                />
              ) : (
                <div className="w-20 h-20 bg-zinc-800 rounded-full border-4 border-zinc-900 flex items-center justify-center">
                  <User className="w-10 h-10 text-zinc-600" />
                </div>
              )}
              {/* Level badge */}
              <div className={`absolute -bottom-1 -right-1 w-8 h-8 ${levelInfo.bg} rounded-full flex items-center justify-center border-2 border-zinc-900`}>
                <LevelIcon className={`w-4 h-4 ${levelInfo.color}`} />
              </div>
            </div>

            {/* Name and username */}
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {member.name}
                {member.isAdmin && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                    Admin
                  </span>
                )}
                {member.isPro && (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                    Pro
                  </span>
                )}
              </h3>
              <p className="text-sm text-zinc-400">@{member.username}</p>
            </div>

            {/* Bio */}
            {member.bio && (
              <p className="mt-2 text-sm text-zinc-300 line-clamp-2">{member.bio}</p>
            )}

            {/* Level and points */}
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <LevelIcon className={`w-4 h-4 ${levelInfo.color}`} />
                <span className={`text-sm font-medium ${levelInfo.color}`}>
                  Level {member.level} {levelInfo.label}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-400">{member.points.toLocaleString()} points</span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="mt-4 grid grid-cols-3 gap-3 pb-3 border-b border-zinc-800">
              <div className="text-center">
                <div className="text-lg font-semibold text-white">{member.stats.posts}</div>
                <div className="text-xs text-zinc-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-white">{member.stats.followers}</div>
                <div className="text-xs text-zinc-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-white">{member.stats.following}</div>
                <div className="text-xs text-zinc-500">Following</div>
              </div>
            </div>

            {/* Additional info */}
            <div className="mt-3 space-y-2 text-sm">
              {member.location && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <MapPin className="w-4 h-4" />
                  <span>{member.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-zinc-400">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(member.stats.joinedDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Activity className="w-4 h-4" />
                <span>{formatLastActive(member.stats.lastActive)}</span>
              </div>
            </div>

            {/* Action buttons */}
            {!isCurrentUser && (
              <div className="mt-4 pb-4 flex gap-2">
                <button
                  onClick={handleFollow}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    isFollowing
                      ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </button>
                <button
                  onClick={handleMessage}
                  className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>
              </div>
            )}

            {/* View profile link */}
            <Link
              href={`/profile/${member.username}`}
              className="block text-center pb-3 text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              View full profile →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}