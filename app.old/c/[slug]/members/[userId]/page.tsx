'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MessageSquare, UserPlus, MoreVertical, Globe, Twitter, 
  Github, Linkedin, MapPin, Calendar, Award, TrendingUp,
  Clock, Heart, Bookmark, Flag, Shield, Ban, Mail,
  Star, Activity, Target, Zap, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

interface MemberProfileProps {
  params: {
    slug: string;
    userId: string;
  };
}

export default function MemberProfile({ params }: MemberProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('activity');

  // Mock member data
  const member = {
    id: params.userId,
    username: 'sarahchen',
    displayName: 'Sarah Chen',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    coverImage: 'https://picsum.photos/seed/sarahcover/1200/300',
    bio: 'Growth marketer & community builder. Helping SaaS founders scale with attribution-driven strategies.',
    location: 'San Francisco, CA',
    website: 'https://sarahchen.com',
    joinedDate: '2025-07-15',
    lastActive: '2 hours ago',
    isOnline: true,
    isPro: true,
    isAdmin: false,
    isModerator: true,
    level: 7,
    points: 8940,
    nextLevelPoints: 10000,
    badges: [
      { name: 'Early Adopter', icon: Star, color: 'text-yellow-500' },
      { name: 'Top Contributor', icon: Award, color: 'text-emerald-500' },
      { name: 'Helpful', icon: Heart, color: 'text-red-500' },
      { name: 'Expert', icon: Shield, color: 'text-purple-500' }
    ],
    stats: {
      posts: 142,
      comments: 487,
      likes: 1234,
      followers: 89,
      following: 156,
      coursesCompleted: 5,
      eventsAttended: 12
    },
    socials: {
      twitter: 'sarahchen',
      github: 'sarahchen',
      linkedin: 'sarahchen'
    }
  };

  // Mock activity data
  const recentActivity = [
    {
      id: 1,
      type: 'post',
      title: 'How I increased conversion by 47% with attribution tracking',
      time: '2 hours ago',
      likes: 34,
      comments: 12
    },
    {
      id: 2,
      type: 'comment',
      title: 'Replied to "Best practices for UTM parameters"',
      time: '5 hours ago',
      content: 'Great question! I always use a consistent naming convention...'
    },
    {
      id: 3,
      type: 'course',
      title: 'Completed "Advanced Attribution Strategies"',
      time: '1 day ago',
      progress: 100
    },
    {
      id: 4,
      type: 'event',
      title: 'Attended "Weekly Attribution Workshop"',
      time: '3 days ago'
    }
  ];

  // Mock posts data
  const posts = [
    {
      id: 1,
      title: 'How I increased conversion by 47% with attribution tracking',
      excerpt: 'After implementing proper UTM tracking across all our channels, we discovered that our email campaigns were...',
      category: 'Case Study',
      time: '2 hours ago',
      likes: 34,
      comments: 12,
      views: 567
    },
    {
      id: 2,
      title: 'The hidden cost of not tracking attribution',
      excerpt: 'Most community owners are leaving money on the table by not knowing where their best members come from...',
      category: 'Strategy',
      time: '2 days ago',
      likes: 56,
      comments: 23,
      views: 892
    },
    {
      id: 3,
      title: '5 Attribution mistakes I made (so you don\'t have to)',
      excerpt: 'Learn from my failures. Here are the top attribution tracking mistakes that cost me thousands...',
      category: 'Tips',
      time: '1 week ago',
      likes: 78,
      comments: 31,
      views: 1243
    }
  ];

  // Mock achievements
  const achievements = [
    { name: 'First Post', description: 'Created your first post', earned: true, icon: MessageSquare },
    { name: '100 Likes', description: 'Received 100 likes on your content', earned: true, icon: Heart },
    { name: 'Streak Week', description: 'Active for 7 consecutive days', earned: true, icon: Zap },
    { name: 'Course Master', description: 'Complete 10 courses', earned: false, progress: 50, icon: Award },
    { name: 'Community Leader', description: 'Reach 100 followers', earned: false, progress: 89, icon: Users }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Cover Image */}
      <div className="relative h-64 bg-gray-900">
        <Image
          src={member.coverImage}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="relative px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end gap-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-black">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.displayName[0]}</AvatarFallback>
              </Avatar>
              {member.isOnline && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-black" />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-white">{member.displayName}</h1>
                    {member.isPro && <Badge className="bg-emerald-600">PRO</Badge>}
                    {member.isModerator && <Badge className="bg-purple-600">Moderator</Badge>}
                  </div>
                  <p className="text-gray-400 mt-1">@{member.username} • Level {member.level}</p>
                  <p className="text-gray-300 mt-3 max-w-2xl">{member.bio}</p>
                  
                  <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
                    {member.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {member.location}
                      </div>
                    )}
                    {member.website && (
                      <a href={member.website} className="flex items-center gap-1 hover:text-emerald-400">
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(member.joinedDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-3 mt-4">
                    {member.socials.twitter && (
                      <a href={`https://twitter.com/${member.socials.twitter}`} className="text-gray-400 hover:text-white">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {member.socials.github && (
                      <a href={`https://github.com/${member.socials.github}`} className="text-gray-400 hover:text-white">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {member.socials.linkedin && (
                      <a href={`https://linkedin.com/in/${member.socials.linkedin}`} className="text-gray-400 hover:text-white">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? (
                      <>Following</>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bookmark className="w-4 h-4 mr-2" />
                        Save Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuItem className="text-red-400">
                        <Flag className="w-4 h-4 mr-2" />
                        Report User
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400">
                        <Ban className="w-4 h-4 mr-2" />
                        Block User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-7 gap-4 mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{member.stats.posts}</div>
              <div className="text-sm text-gray-400">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{member.stats.comments}</div>
              <div className="text-sm text-gray-400">Comments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{member.stats.likes}</div>
              <div className="text-sm text-gray-400">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{member.stats.followers}</div>
              <div className="text-sm text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{member.stats.following}</div>
              <div className="text-sm text-gray-400">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{member.stats.coursesCompleted}</div>
              <div className="text-sm text-gray-400">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{member.stats.eventsAttended}</div>
              <div className="text-sm text-gray-400">Events</div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">Level {member.level} • {member.points.toLocaleString()} points</div>
                  <div className="text-sm text-gray-400">
                    {(member.nextLevelPoints - member.points).toLocaleString()} points to Level {member.level + 1}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Progress</div>
                <div className="text-lg font-bold text-emerald-400">
                  {Math.round((member.points / member.nextLevelPoints) * 100)}%
                </div>
              </div>
            </div>
            <Progress value={(member.points / member.nextLevelPoints) * 100} className="h-2" />
          </div>

          {/* Badges */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Badges</h3>
            <div className="flex items-center gap-4">
              {member.badges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 rounded-lg border border-gray-800">
                    <Icon className={`w-5 h-5 ${badge.color}`} />
                    <span className="text-sm text-white">{badge.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-6">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest contributions and interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
                        <div className="p-2 bg-gray-800 rounded-lg">
                          {activity.type === 'post' && <MessageSquare className="w-5 h-5 text-emerald-400" />}
                          {activity.type === 'comment' && <MessageSquare className="w-5 h-5 text-purple-400" />}
                          {activity.type === 'course' && <Award className="w-5 h-5 text-blue-400" />}
                          {activity.type === 'event' && <Calendar className="w-5 h-5 text-yellow-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">{activity.title}</div>
                          {activity.content && (
                            <p className="text-sm text-gray-400 mt-1">{activity.content}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{activity.time}</span>
                            {activity.likes !== undefined && (
                              <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {activity.likes}
                              </span>
                            )}
                            {activity.comments !== undefined && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {activity.comments}
                              </span>
                            )}
                            {activity.progress !== undefined && (
                              <span className="text-emerald-400">{activity.progress}% complete</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="posts" className="mt-6">
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="border-gray-800 bg-gray-900/50 hover:bg-gray-900/70 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge className="mb-2">{post.category}</Badge>
                          <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                          <p className="text-gray-400 mb-4">{post.excerpt}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span>{post.time}</span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {post.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {post.comments}
                            </span>
                            <span>{post.views} views</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <Card key={index} className={`border-gray-800 ${achievement.earned ? 'bg-gray-900/50' : 'bg-gray-900/30 opacity-60'}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${achievement.earned ? 'bg-emerald-600/20' : 'bg-gray-800'}`}>
                            <Icon className={`w-6 h-6 ${achievement.earned ? 'text-emerald-400' : 'text-gray-500'}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{achievement.name}</h4>
                            <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                            {!achievement.earned && achievement.progress !== undefined && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-gray-400">Progress</span>
                                  <span className="text-emerald-400">{achievement.progress}%</span>
                                </div>
                                <Progress value={achievement.progress} className="h-2" />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="about" className="mt-6">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle>About {member.displayName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Bio</h4>
                    <p className="text-white">{member.bio}</p>
                  </div>
                  
                  <Separator className="bg-gray-800" />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Location</h4>
                      <p className="text-white">{member.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Website</h4>
                      {member.website ? (
                        <a href={member.website} className="text-emerald-400 hover:text-emerald-300">
                          {member.website.replace('https://', '')}
                        </a>
                      ) : (
                        <p className="text-gray-500">Not specified</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-800" />
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Member Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Member Since</span>
                        <span className="text-white">{new Date(member.joinedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Last Active</span>
                        <span className="text-white">{member.lastActive}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Status</span>
                        <Badge className="bg-emerald-600">
                          {member.isOnline ? 'Online' : 'Offline'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}