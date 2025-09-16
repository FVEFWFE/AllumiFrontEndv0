'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, ChevronUp, ChevronDown } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  memberCount: number;
  unreadCount?: number;
  color?: string;
}

interface GroupSwitcherProps {
  currentGroupSlug?: string;
}

export function GroupSwitcher({ currentGroupSlug }: GroupSwitcherProps) {
  const pathname = usePathname();
  const [groups, setGroups] = useState<Group[]>([]);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);

  // Mock data
  useEffect(() => {
    const mockGroups: Group[] = [
      {
        id: '1',
        name: 'Tech Community',
        slug: 'tech-community',
        memberCount: 1234,
        unreadCount: 3,
        color: '#3B82F6',
      },
      {
        id: '2',
        name: 'Startups',
        slug: 'startups',
        memberCount: 892,
        unreadCount: 0,
        color: '#10B981',
      },
      {
        id: '3',
        name: 'Marketing Hub',
        slug: 'marketing-hub',
        memberCount: 567,
        unreadCount: 12,
        color: '#F59E0B',
        logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=marketing',
      },
      {
        id: '4',
        name: 'AI Builders',
        slug: 'ai-builders',
        memberCount: 2341,
        unreadCount: 0,
        color: '#8B5CF6',
      },
      {
        id: '5',
        name: 'Growth Hackers',
        slug: 'growth-hackers',
        memberCount: 1567,
        unreadCount: 5,
        color: '#EF4444',
      },
      {
        id: '6',
        name: 'Design System',
        slug: 'design-system',
        memberCount: 423,
        unreadCount: 0,
        color: '#EC4899',
      },
      {
        id: '7',
        name: 'Product Managers',
        slug: 'product-managers',
        memberCount: 789,
        unreadCount: 2,
        color: '#14B8A6',
      },
      {
        id: '8',
        name: 'Web3 Developers',
        slug: 'web3-developers',
        memberCount: 334,
        unreadCount: 0,
        color: '#F97316',
      },
    ];
    setGroups(mockGroups);
  }, []);

  const getGroupColor = (groupName: string): string => {
    const colors = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Amber
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#14B8A6', // Teal
      '#F97316', // Orange
    ];
    
    const index = groupName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    setShowScrollUp(element.scrollTop > 0);
    setShowScrollDown(
      element.scrollTop < element.scrollHeight - element.clientHeight - 10
    );
  };

  const isActive = (slug: string) => pathname.includes(`/c/${slug}`);

  return (
    <div className="fixed left-0 top-0 h-screen w-[72px] bg-zinc-900 border-r border-zinc-800 z-40 flex flex-col">
      {/* Home Button */}
      <Link
        href="/dashboard"
        className="flex items-center justify-center h-[72px] hover:bg-zinc-800 transition-colors group relative"
        onMouseEnter={() => setHoveredGroup('home')}
        onMouseLeave={() => setHoveredGroup(null)}
      >
        <div className={`w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center transition-all group-hover:scale-105 ${
          pathname === '/dashboard' ? 'ring-2 ring-emerald-500' : ''
        }`}>
          <Home className="w-6 h-6 text-white" />
        </div>

        {/* Tooltip */}
        {hoveredGroup === 'home' && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-zinc-800 rounded-lg shadow-lg whitespace-nowrap z-50">
            <p className="text-sm font-semibold text-white">Your Dashboard</p>
            <p className="text-xs text-zinc-400">View all communities</p>
          </div>
        )}
      </Link>

      <div className="w-full px-3">
        <div className="h-px bg-zinc-700" />
      </div>

      {/* Groups List */}
      <div className="flex-1 overflow-hidden relative">
        {/* Scroll Up Indicator */}
        {showScrollUp && (
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-zinc-900 to-transparent z-10 flex items-center justify-center">
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          </div>
        )}

        <div
          className="h-full overflow-y-auto scrollbar-hide py-2"
          onScroll={handleScroll}
        >
          {groups.map(group => (
            <Link
              key={group.id}
              href={`/c/${group.slug}/feed`}
              className="flex items-center justify-center h-[72px] hover:bg-zinc-800 transition-colors group relative"
              onMouseEnter={() => setHoveredGroup(group.id)}
              onMouseLeave={() => setHoveredGroup(null)}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-lg overflow-hidden transition-all group-hover:scale-105 ${
                  isActive(group.slug) ? 'ring-2 ring-emerald-500 rounded-xl' : ''
                } ${!isActive(group.slug) ? 'opacity-70 group-hover:opacity-100' : ''}`}>
                  {group.logo ? (
                    <img
                      src={group.logo}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: group.color || getGroupColor(group.name) }}
                    >
                      {group.name[0].toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Unread Badge */}
                {group.unreadCount && group.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1">
                    {group.unreadCount > 99 ? (
                      <div className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                        99+
                      </div>
                    ) : group.unreadCount > 9 ? (
                      <div className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                        {group.unreadCount}
                      </div>
                    ) : (
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                )}
              </div>

              {/* Tooltip */}
              {hoveredGroup === group.id && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-zinc-800 rounded-lg shadow-lg whitespace-nowrap z-50">
                  <p className="text-sm font-semibold text-white">{group.name}</p>
                  <p className="text-xs text-zinc-400">{group.memberCount.toLocaleString()} members</p>
                  {group.unreadCount && group.unreadCount > 0 && (
                    <p className="text-xs text-emerald-500 mt-1">{group.unreadCount} new posts</p>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Scroll Down Indicator */}
        {showScrollDown && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-900 to-transparent z-10 flex items-center justify-center">
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </div>
        )}
      </div>

      <div className="w-full px-3">
        <div className="h-px bg-zinc-700" />
      </div>

      {/* Add Group Button */}
      <Link
        href="/create-community"
        className="flex items-center justify-center h-[72px] hover:bg-zinc-800 transition-colors group relative"
        onMouseEnter={() => setHoveredGroup('add')}
        onMouseLeave={() => setHoveredGroup(null)}
      >
        <div className="w-12 h-12 rounded-lg border-2 border-dashed border-zinc-600 flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-emerald-500">
          <Plus className="w-6 h-6 text-zinc-400 group-hover:text-emerald-500" />
        </div>

        {/* Tooltip */}
        {hoveredGroup === 'add' && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-zinc-800 rounded-lg shadow-lg whitespace-nowrap z-50">
            <p className="text-sm font-semibold text-white">Create or Join</p>
            <p className="text-xs text-zinc-400">Start a new community</p>
          </div>
        )}
      </Link>
    </div>
  );
}