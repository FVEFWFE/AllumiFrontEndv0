'use client';

import { useState, use } from 'react';
import { 
  Trophy, Star, Calendar, MessageCircle, Users,
  MapPin, Link2, Twitter, Instagram, Linkedin,
  Youtube, Settings, Share2, MoreVertical, Shield,
  Award, Target, Zap, ChevronRight, Edit
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = use(params);
  const [activeTab, setActiveTab] = useState('posts');
  
  // Mock user data
  const isOwnProfile = username === 'johndoe';
  const user = {
    username: username,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    coverImage: 'https://picsum.photos/seed/cover/1200/300',
    bio: 'Building communities that convert. Helping creators scale to $100K MRR with attribution-driven growth strategies.',
    location: 'San Francisco, CA',
    website: 'johndoe.com',
    joinedDate: 'January 2024',
    level: 7,
    points: 12450,
    rank: 3,
    badges: [
      { id: 1, name: 'Early Adopter', icon: Star, color: 'text-yellow-400' },
      { id: 2, name: 'Top Contributor', icon: Trophy, color: 'text-emerald-400' },
      { id: 3, name: 'Community Leader', icon: Shield, color: 'text-purple-400' }
    ],
    stats: {
      posts: 234,
      comments: 892,
      likes: 3421,
      followers: 1247,
      following: 523
    },
    communities: [
      { id: 1, name: 'The Growth Lab', slug: 'growth-lab', members: 1247, role: 'owner' },
      { id: 2, name: 'SaaS Founders', slug: 'saas-founders', members: 523, role: 'member' },
      { id: 3, name: 'Creator Economy', slug: 'creator-economy', members: 89, role: 'moderator' }
    ],
    socials: {
      twitter: 'johndoe',
      instagram: 'johndoe',
      linkedin: 'johndoe',
      youtube: 'johndoe'
    }
  };

  const recentPosts = [
    {
      id: 1,
      title: "How Attribution Tracking 10x'd My Community Revenue",
      excerpt: "After implementing Allumi's attribution dashboard, I discovered that my YouTube content was driving 80% of high-value members...",
      likes: 234,
      comments: 45,
      date: '2 days ago'
    },
    {
      id: 2,
      title: "The Hidden Cost of Skool's Discovery Page",
      excerpt: "Lost 3 of my top members to competitors they found browsing Discovery. Here's what I learned...",
      likes: 189,
      comments: 67,
      date: '5 days ago'
    },
    {
      id: 3,
      title: 'Custom Domain = 2.3x Higher Conversion',
      excerpt: 'A/B tested my custom domain vs the old Skool URL. The results will shock you...',
      likes: 412,
      comments: 89,
      date: '1 week ago'
    }
  ];

  const achievements = [
    { id: 1, name: '100 Posts', description: 'Published 100 posts', progress: 100, icon: MessageCircle },
    { id: 2, name: '1K Likes', description: 'Received 1,000 likes', progress: 100, icon: Star },
    { id: 3, name: 'Top 10', description: 'Reach top 10 leaderboard', progress: 30, icon: Trophy },
    { id: 4, name: 'Streak Master', description: '30-day login streak', progress: 70, icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-emerald-900/50 to-purple-900/50">
        <Image
          src={user.coverImage}
          alt="Cover"
          fill
          className="object-cover opacity-50"
        />
        {isOwnProfile && (
          <button className="absolute top-4 right-4 px-3 py-1.5 bg-gray-900/80 backdrop-blur text-white text-sm rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2">
            <Edit className="w-3 h-3" />
            Edit Cover
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="relative">
              <Image
                src={user.avatar}
                alt={user.name}
                width={120}
                height={120}
                className="rounded-full border-4 border-gray-900"
              />
              <div className="absolute -bottom-2 -right-2 px-2 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">
                LVL {user.level}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    {user.name}
                    {user.communities.some(c => c.role === 'owner') && (
                      <Shield className="w-5 h-5 text-emerald-400" />
                    )}
                  </h1>
                  <p className="text-gray-400">@{user.username}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isOwnProfile ? (
                    <Link
                      href="/settings/profile"
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Edit Profile
                    </Link>
                  ) : (
                    <>
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        Follow
                      </button>
                      <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>
                    </>
                  )}
                  <button className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 mt-4">{user.bio}</p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-400">
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {user.location}
                  </span>
                )}
                {user.website && (
                  <a href={`https://${user.website}`} className="flex items-center gap-1 hover:text-emerald-400">
                    <Link2 className="w-3 h-3" />
                    {user.website}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined {user.joinedDate}
                </span>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-4">
                {user.socials.twitter && (
                  <a href={`https://twitter.com/${user.socials.twitter}`} className="text-gray-400 hover:text-white">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {user.socials.instagram && (
                  <a href={`https://instagram.com/${user.socials.instagram}`} className="text-gray-400 hover:text-white">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {user.socials.linkedin && (
                  <a href={`https://linkedin.com/in/${user.socials.linkedin}`} className="text-gray-400 hover:text-white">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {user.socials.youtube && (
                  <a href={`https://youtube.com/@${user.socials.youtube}`} className="text-gray-400 hover:text-white">
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6 pt-6 border-t border-gray-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user.stats.posts}</div>
              <div className="text-sm text-gray-500">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user.stats.comments}</div>
              <div className="text-sm text-gray-500">Comments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user.stats.likes.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user.stats.followers.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user.stats.following}</div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">#{user.rank}</div>
              <div className="text-sm text-gray-500">Rank</div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-800">
            {user.badges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
                <badge.icon className={`w-4 h-4 ${badge.color}`} />
                <span className="text-sm text-white">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 border-b border-gray-800">
          {['posts', 'communities', 'achievements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 pb-12">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gray-900/70 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                  <p className="text-gray-400 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </span>
                      <span>{post.date}</span>
                    </div>
                    <Link 
                      href="#"
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      Read more
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'communities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.communities.map((community) => (
                <Link
                  key={community.id}
                  href={`/c/${community.slug}`}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gray-900/70 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{community.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{community.members.toLocaleString()} members</p>
                    </div>
                    {community.role === 'owner' && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                        Owner
                      </span>
                    )}
                    {community.role === 'moderator' && (
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        Moderator
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <achievement.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{achievement.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-white">{achievement.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}