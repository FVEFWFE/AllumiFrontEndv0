'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Bell, MessageSquare, Heart, UserPlus, DollarSign, 
  TrendingUp, Award, Calendar, Video, BookOpen,
  Check, X, Settings, Filter, Archive, Trash2,
  ChevronRight, Clock, AlertCircle, CheckCircle,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Mock notifications data
  const notifications = {
    unread: [
      {
        id: '1',
        type: 'revenue',
        title: 'New subscription!',
        description: 'Sarah Chen just subscribed to The Growth Lab for $89/month',
        time: '5 minutes ago',
        icon: DollarSign,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-600/20',
        link: '/dashboard/analytics',
        user: {
          name: 'Sarah Chen',
          avatar: 'https://picsum.photos/seed/sarah/100/100'
        },
        action: {
          label: 'View Details',
          link: '/dashboard/analytics'
        }
      },
      {
        id: '2',
        type: 'social',
        title: 'New follower',
        description: 'Mike Rodriguez started following you',
        time: '15 minutes ago',
        icon: UserPlus,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-600/20',
        link: '/profile/mikerodriguez',
        user: {
          name: 'Mike Rodriguez',
          avatar: 'https://picsum.photos/seed/mike/100/100'
        }
      },
      {
        id: '3',
        type: 'engagement',
        title: 'Your post is trending!',
        description: '"Attribution tracking guide" received 50+ likes in the last hour',
        time: '1 hour ago',
        icon: TrendingUp,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-600/20',
        link: '/c/growth-lab/feed',
        stats: {
          likes: 127,
          comments: 34,
          shares: 12
        }
      },
      {
        id: '4',
        type: 'mention',
        title: 'You were mentioned',
        description: 'Emily Johnson mentioned you in "Weekly attribution report"',
        time: '2 hours ago',
        icon: MessageSquare,
        iconColor: 'text-yellow-500',
        iconBg: 'bg-yellow-600/20',
        link: '/c/growth-lab/feed/post-123',
        user: {
          name: 'Emily Johnson',
          avatar: 'https://picsum.photos/seed/emily/100/100'
        }
      }
    ],
    today: [
      {
        id: '5',
        type: 'event',
        title: 'Event reminder',
        description: 'Attribution Masterclass starts in 2 hours',
        time: '3 hours ago',
        icon: Calendar,
        iconColor: 'text-orange-500',
        iconBg: 'bg-orange-600/20',
        link: '/c/growth-lab/events/masterclass',
        action: {
          label: 'Join Event',
          link: '/c/growth-lab/events/masterclass'
        }
      },
      {
        id: '6',
        type: 'achievement',
        title: 'Achievement unlocked!',
        description: 'You reached Level 8 - Attribution Expert',
        time: '5 hours ago',
        icon: Award,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-600/20',
        link: '/profile/janjegen',
        reward: {
          points: 500,
          badge: 'Expert'
        }
      },
      {
        id: '7',
        type: 'course',
        title: 'Course completed',
        description: 'You finished "Advanced Attribution Strategies"',
        time: '8 hours ago',
        icon: BookOpen,
        iconColor: 'text-indigo-500',
        iconBg: 'bg-indigo-600/20',
        link: '/c/growth-lab/classroom',
        certificate: true
      }
    ],
    earlier: [
      {
        id: '8',
        type: 'revenue',
        title: 'Payment received',
        description: 'Monthly subscription payment of $890 processed successfully',
        time: '2 days ago',
        icon: CheckCircle,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-600/20',
        link: '/dashboard/billing'
      },
      {
        id: '9',
        type: 'alert',
        title: 'Churn risk detected',
        description: '3 members haven\'t logged in for 14+ days',
        time: '3 days ago',
        icon: AlertCircle,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-600/20',
        link: '/dashboard/analytics',
        priority: 'high'
      },
      {
        id: '10',
        type: 'update',
        title: 'New feature available',
        description: 'Custom domain setup is now live for all communities',
        time: '1 week ago',
        icon: Bell,
        iconColor: 'text-gray-400',
        iconBg: 'bg-gray-600/20',
        link: '/changelog'
      }
    ]
  };

  const allNotifications = [...notifications.unread, ...notifications.today, ...notifications.earlier];
  
  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.unread;
      case 'mentions':
        return allNotifications.filter(n => n.type === 'mention');
      case 'revenue':
        return allNotifications.filter(n => n.type === 'revenue');
      case 'social':
        return allNotifications.filter(n => ['social', 'engagement'].includes(n.type));
      default:
        return allNotifications;
    }
  };

  const handleMarkAllRead = () => {
    // Handle marking all as read
    console.log('Marking all as read');
  };

  const handleArchiveSelected = () => {
    // Handle archiving selected
    console.log('Archiving selected:', selectedNotifications);
    setSelectedNotifications([]);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Bell className="w-6 h-6 text-emerald-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <p className="text-sm text-gray-400">{notifications.unread.length} unread notifications</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {selectedNotifications.length > 0 && (
                <>
                  <span className="text-sm text-gray-400">
                    {selectedNotifications.length} selected
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleArchiveSelected}
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                </>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkAllRead}
              >
                <Check className="w-4 h-4 mr-2" />
                Mark all read
              </Button>
              <Link href="/settings/notifications">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-gray-900/50 mb-6">
            <TabsTrigger value="all">
              All
              <Badge className="ml-2 bg-gray-700">{allNotifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              <Badge className="ml-2 bg-emerald-600">{notifications.unread.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="mentions">Mentions</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Notification Groups */}
            {activeTab === 'all' && (
              <>
                {/* Unread Section */}
                {notifications.unread.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">New</h3>
                    <Card className="border-gray-800 bg-gray-900/50">
                      <CardContent className="p-0">
                        {notifications.unread.map((notification, index) => (
                          <NotificationItem 
                            key={notification.id} 
                            notification={notification}
                            isLast={index === notifications.unread.length - 1}
                            isUnread={true}
                            isSelected={selectedNotifications.includes(notification.id)}
                            onSelect={(id) => {
                              if (selectedNotifications.includes(id)) {
                                setSelectedNotifications(selectedNotifications.filter(n => n !== id));
                              } else {
                                setSelectedNotifications([...selectedNotifications, id]);
                              }
                            }}
                          />
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Today Section */}
                {notifications.today.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Today</h3>
                    <Card className="border-gray-800 bg-gray-900/50">
                      <CardContent className="p-0">
                        {notifications.today.map((notification, index) => (
                          <NotificationItem 
                            key={notification.id} 
                            notification={notification}
                            isLast={index === notifications.today.length - 1}
                            isSelected={selectedNotifications.includes(notification.id)}
                            onSelect={(id) => {
                              if (selectedNotifications.includes(id)) {
                                setSelectedNotifications(selectedNotifications.filter(n => n !== id));
                              } else {
                                setSelectedNotifications([...selectedNotifications, id]);
                              }
                            }}
                          />
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Earlier Section */}
                {notifications.earlier.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Earlier</h3>
                    <Card className="border-gray-800 bg-gray-900/50">
                      <CardContent className="p-0">
                        {notifications.earlier.map((notification, index) => (
                          <NotificationItem 
                            key={notification.id} 
                            notification={notification}
                            isLast={index === notifications.earlier.length - 1}
                            isSelected={selectedNotifications.includes(notification.id)}
                            onSelect={(id) => {
                              if (selectedNotifications.includes(id)) {
                                setSelectedNotifications(selectedNotifications.filter(n => n !== id));
                              } else {
                                setSelectedNotifications([...selectedNotifications, id]);
                              }
                            }}
                          />
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}

            {/* Filtered View */}
            {activeTab !== 'all' && (
              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-0">
                  {getFilteredNotifications().length > 0 ? (
                    getFilteredNotifications().map((notification, index) => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification}
                        isLast={index === getFilteredNotifications().length - 1}
                        isUnread={notifications.unread.includes(notification)}
                        isSelected={selectedNotifications.includes(notification.id)}
                        onSelect={(id) => {
                          if (selectedNotifications.includes(id)) {
                            setSelectedNotifications(selectedNotifications.filter(n => n !== id));
                          } else {
                            setSelectedNotifications([...selectedNotifications, id]);
                          }
                        }}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No notifications in this category</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Notification Item Component
function NotificationItem({ 
  notification, 
  isLast, 
  isUnread = false,
  isSelected = false,
  onSelect
}: { 
  notification: any; 
  isLast: boolean; 
  isUnread?: boolean;
  isSelected?: boolean;
  onSelect: (id: string) => void;
}) {
  const Icon = notification.icon;
  
  return (
    <>
      <div className={`
        flex items-start gap-4 p-4 hover:bg-gray-800/50 transition-colors cursor-pointer
        ${isUnread ? 'bg-emerald-600/5' : ''}
        ${isSelected ? 'bg-emerald-600/10' : ''}
      `}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(notification.id)}
          className="mt-1 rounded border-gray-600 bg-gray-800 text-emerald-600 focus:ring-emerald-500"
        />
        
        <div className={`p-2 rounded-lg ${notification.iconBg}`}>
          <Icon className={`w-5 h-5 ${notification.iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-white">{notification.title}</p>
                {isUnread && (
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                )}
                {notification.priority === 'high' && (
                  <Badge className="bg-red-600">High Priority</Badge>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-0.5">{notification.description}</p>
              
              {notification.user && (
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={notification.user.avatar} />
                    <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-300">{notification.user.name}</span>
                </div>
              )}
              
              {notification.stats && (
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {notification.stats.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {notification.stats.comments}
                  </span>
                </div>
              )}
              
              {notification.reward && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-emerald-600">+{notification.reward.points} points</Badge>
                  <Badge className="bg-purple-600">{notification.reward.badge}</Badge>
                </div>
              )}
              
              {notification.action && (
                <Link href={notification.action.link}>
                  <Button size="sm" variant="outline" className="mt-3">
                    {notification.action.label}
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs text-gray-500">{notification.time}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                  <DropdownMenuItem>
                    <Check className="w-4 h-4 mr-2" />
                    Mark as read
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem className="text-red-400">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      {!isLast && <Separator className="bg-gray-800" />}
    </>
  );
}