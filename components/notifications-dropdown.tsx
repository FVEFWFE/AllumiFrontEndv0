'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Settings, Check, X, Users, Trophy, MessageCircle, Heart, AtSign, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'mention' | 'follow' | 'achievement' | 'announcement' | 'event';
  title: string;
  description?: string;
  context?: string;
  link?: string;
  avatar?: string;
  userName?: string;
  timestamp: Date;
  read: boolean;
  icon?: React.ReactNode;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

export function NotificationsDropdown({ isOpen, onClose, buttonRef }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'mentions'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'like',
        title: 'liked your post',
        userName: 'John Smith',
        description: 'Great insights on attribution tracking!',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        read: false,
        link: '/c/growth-hackers/feed/post-123',
      },
      {
        id: '2',
        type: 'comment',
        title: 'replied to your comment',
        userName: 'Sarah Lee',
        description: 'I agree with your point about ROI tracking...',
        context: 'in Community Feed',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        link: '/c/growth-hackers/feed/post-456#comment-789',
      },
      {
        id: '3',
        type: 'mention',
        title: 'mentioned you',
        userName: 'Mike Chen',
        description: '@username check this out - perfect for our discussion',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: false,
        link: '/c/growth-hackers/feed/post-789',
      },
      {
        id: '4',
        type: 'announcement',
        title: 'Group Announcement',
        description: 'New event: Weekly Meetup',
        context: 'Starting tomorrow at 3 PM',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        link: '/c/growth-hackers/events',
        icon: <Calendar className="w-5 h-5" />,
      },
      {
        id: '5',
        type: 'achievement',
        title: 'Achievement Unlocked',
        description: 'You reached Level 3!',
        context: '65 points earned',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: true,
        link: '/c/growth-hackers/leaderboard',
        icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      },
      {
        id: '6',
        type: 'follow',
        title: '3 new followers',
        description: 'Anna, David, and 1 other',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
        link: '/c/growth-hackers/members',
        icon: <Users className="w-5 h-5 text-emerald-500" />,
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef?.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'mentions') return n.type === 'mention';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (notification: Notification) => {
    if (notification.icon) return notification.icon;
    
    switch (notification.type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'mention':
        return <AtSign className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const groupNotificationsByTime = (notifications: Notification[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups: { [key: string]: Notification[] } = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Older: [],
    };

    notifications.forEach(n => {
      if (n.timestamp >= today) {
        groups.Today.push(n);
      } else if (n.timestamp >= yesterday) {
        groups.Yesterday.push(n);
      } else if (n.timestamp >= weekAgo) {
        groups['This Week'].push(n);
      } else {
        groups.Older.push(n);
      }
    });

    return groups;
  };

  if (!isOpen) return null;

  const groupedNotifications = groupNotificationsByTime(filteredNotifications);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 bg-zinc-900 rounded-lg shadow-2xl border border-zinc-800 z-50 overflow-hidden"
      style={{ maxHeight: '500px' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Mark all as read
              </button>
            )}
            <button className="text-zinc-400 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4">
          {(['all', 'unread', 'mentions'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`text-sm capitalize pb-2 border-b-2 transition-colors ${
                filter === tab
                  ? 'text-emerald-500 border-emerald-500'
                  : 'text-zinc-400 border-transparent hover:text-white'
              }`}
            >
              {tab}
              {tab === 'unread' && unreadCount > 0 && (
                <span className="ml-1 text-xs bg-emerald-500 text-black rounded-full px-1.5 py-0.5">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400 font-medium">No new notifications</p>
            <p className="text-sm text-zinc-500 mt-1">You're all caught up!</p>
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([group, items]) => {
            if (items.length === 0) return null;
            
            return (
              <div key={group}>
                <div className="px-4 py-2 text-xs font-medium text-zinc-500 bg-zinc-950">
                  {group}
                </div>
                {items.map(notification => (
                  <div
                    key={notification.id}
                    className="relative group hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.link) {
                        window.location.href = notification.link;
                      }
                    }}
                  >
                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full" />
                    )}

                    <div className="p-4 pl-8 flex gap-3">
                      {/* Avatar or Icon */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <img
                            src={notification.avatar}
                            alt={notification.userName}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                            {getIcon(notification)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.read ? 'font-semibold text-white' : 'text-zinc-300'}`}>
                          {notification.userName && (
                            <span className="font-medium">{notification.userName} </span>
                          )}
                          {notification.title}
                        </p>
                        {notification.description && (
                          <p className="text-sm text-zinc-400 truncate mt-0.5">
                            {notification.description}
                          </p>
                        )}
                        {notification.context && (
                          <p className="text-xs text-emerald-500 mt-1">
                            {notification.context}
                          </p>
                        )}
                        <p className="text-xs text-zinc-500 mt-1">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="p-1 text-zinc-400 hover:text-emerald-500 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}

        {/* Load More */}
        {hasMore && filteredNotifications.length > 0 && (
          <div className="p-4 text-center border-t border-zinc-800">
            <button
              onClick={() => {
                setIsLoading(true);
                // Simulate loading more
                setTimeout(() => {
                  setIsLoading(false);
                  setHasMore(false);
                }, 1000);
              }}
              disabled={isLoading}
              className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}