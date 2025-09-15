'use client';

import { useState } from 'react';
import { 
  Users, Globe, Shield, TrendingUp, DollarSign,
  Settings, Plus, Search, Filter, MoreVertical,
  Calendar, Activity, Lock, Unlock, ExternalLink,
  BarChart3, Target, Award, Zap, ArrowUpRight,
  ArrowDownRight, Eye, Edit, Trash2, Copy
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('revenue');

  const communities = [
    {
      id: 1,
      name: 'The Growth Lab',
      slug: 'growth-lab',
      avatar: 'https://picsum.photos/seed/growth/100/100',
      description: 'Learn growth strategies that actually work',
      status: 'active',
      domain: 'community.growthlab.io',
      members: 1247,
      revenue: 12450,
      mrr: 6200,
      growth: 12.5,
      conversion: 3.8,
      topSource: 'YouTube',
      createdAt: '2024-01-15',
      plan: 'pro',
      features: {
        customDomain: true,
        attribution: true,
        whiteLabel: true
      }
    },
    {
      id: 2,
      name: 'SaaS Founders',
      slug: 'saas-founders',
      avatar: 'https://picsum.photos/seed/saas/100/100',
      description: 'For founders building SaaS products',
      status: 'active',
      domain: null,
      members: 523,
      revenue: 8920,
      mrr: 4100,
      growth: 8.3,
      conversion: 2.9,
      topSource: 'Twitter',
      createdAt: '2024-02-20',
      plan: 'growth',
      features: {
        customDomain: false,
        attribution: true,
        whiteLabel: false
      }
    },
    {
      id: 3,
      name: 'Creator Economy',
      slug: 'creator-economy',
      avatar: 'https://picsum.photos/seed/creator/100/100',
      description: 'Monetize your creative work',
      status: 'paused',
      domain: null,
      members: 89,
      revenue: 1240,
      mrr: 890,
      growth: -2.1,
      conversion: 1.2,
      topSource: 'Direct',
      createdAt: '2024-06-01',
      plan: 'starter',
      features: {
        customDomain: false,
        attribution: false,
        whiteLabel: false
      }
    }
  ];

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          community.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || community.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedCommunities = [...filteredCommunities].sort((a, b) => {
    switch(sortBy) {
      case 'revenue': return b.mrr - a.mrr;
      case 'members': return b.members - a.members;
      case 'growth': return b.growth - a.growth;
      case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default: return 0;
    }
  });

  const totalStats = {
    communities: communities.length,
    activeComm: communities.filter(c => c.status === 'active').length,
    totalMembers: communities.reduce((sum, c) => sum + c.members, 0),
    totalMRR: communities.reduce((sum, c) => sum + c.mrr, 0),
    avgConversion: (communities.reduce((sum, c) => sum + c.conversion, 0) / communities.length).toFixed(1)
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Your Communities</h1>
        <p className="text-gray-400">Manage all your communities in one place</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-emerald-500" />
            <span className="text-xs text-emerald-400">{totalStats.activeComm} active</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalStats.communities}</div>
          <div className="text-sm text-gray-500">Total Communities</div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-white">{totalStats.totalMembers.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Total Members</div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-white">${totalStats.totalMRR.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Total MRR</div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-white">{totalStats.avgConversion}%</div>
          <div className="text-sm text-gray-500">Avg Conversion</div>
        </div>

        <Link 
          href="/create-community"
          className="bg-emerald-600 hover:bg-emerald-700 rounded-xl p-6 transition-colors flex flex-col items-center justify-center text-white"
        >
          <Plus className="w-8 h-8 mb-2" />
          <span className="font-medium">New Community</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communities..."
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="revenue">Sort by Revenue</option>
            <option value="members">Sort by Members</option>
            <option value="growth">Sort by Growth</option>
            <option value="newest">Sort by Newest</option>
          </select>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedCommunities.map((community) => (
          <div key={community.id} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:bg-gray-900/70 transition-all">
            {/* Community Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <Image
                    src={community.avatar}
                    alt={community.name}
                    width={64}
                    height={64}
                    className="rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      {community.name}
                      {community.status === 'active' ? (
                        <Unlock className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-400">{community.description}</p>
                    {community.domain ? (
                      <div className="flex items-center gap-1 mt-2">
                        <Globe className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-emerald-400">{community.domain}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">allumi.com/c/{community.slug}</span>
                    )}
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Members</span>
                    <Users className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="text-lg font-semibold text-white">{community.members.toLocaleString()}</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">MRR</span>
                    <DollarSign className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="text-lg font-semibold text-white">${community.mrr.toLocaleString()}</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Growth</span>
                    {community.growth > 0 ? (
                      <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                  <div className={`text-lg font-semibold ${community.growth > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {community.growth > 0 ? '+' : ''}{community.growth}%
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Top Source</span>
                    <Target className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="text-lg font-semibold text-white">{community.topSource}</div>
                </div>
              </div>

              {/* Features */}
              <div className="flex items-center gap-2 mt-4">
                {community.features.customDomain && (
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Custom Domain
                  </span>
                )}
                {community.features.attribution && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    Attribution
                  </span>
                )}
                {community.features.whiteLabel && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    White Label
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-gray-800/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link
                  href={`/c/${community.slug}`}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                  title="View Community"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  href={`/c/${community.slug}/analytics`}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                  title="Analytics"
                >
                  <BarChart3 className="w-4 h-4" />
                </Link>
                <Link
                  href={`/c/${community.slug}/settings`}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              </div>
              <Link
                href={`/c/${community.slug}`}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                Manage
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedCommunities.length === 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No communities found</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery || filterStatus !== 'all' 
              ? 'Try adjusting your filters'
              : 'Create your first community to get started'
            }
          </p>
          {!searchQuery && filterStatus === 'all' && (
            <Link
              href="/create-community"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Community
            </Link>
          )}
        </div>
      )}
    </div>
  );
}