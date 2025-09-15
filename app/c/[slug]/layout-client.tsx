'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Home, BookOpen, Calendar, Users, Map, Trophy, Info, 
  Search, MessageCircle, Bell, Settings, Plus, ChevronDown,
  LogOut, HelpCircle, Compass, X, Check, TrendingUp, DollarSign,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { getMockData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { DirectMessages } from '@/components/direct-messages';
import { GroupSwitcher } from '@/components/group-switcher';
import { SettingsModalComplete } from '@/components/settings-modal-complete';

const mockData = getMockData();

// Base navigation tabs (visible to all members)
const baseNavTabs = [
  { name: 'Community', href: 'feed', icon: Home },
  { name: 'Classroom', href: 'classroom', icon: BookOpen },
  { name: 'Calendar', href: 'calendar', icon: Calendar },
  { name: 'Members', href: 'members', icon: Users },
  { name: 'Leaderboard', href: 'leaderboard', icon: Trophy },
  { name: 'About', href: 'about', icon: Info },
];

// Owner-only navigation tabs
const ownerNavTabs = [
  { name: 'Analytics', href: 'analytics', icon: TrendingUp },
  { name: 'Monetization', href: 'monetization', icon: DollarSign },
  { name: 'Settings', href: 'settings', icon: Settings },
];

// Onboarding steps for new members
const memberOnboardingSteps = [
  { id: 1, title: 'Watch 60 sec intro video', completed: false },
  { id: 2, title: 'Find a post you like and leave a comment', completed: false },
  { id: 3, title: 'Download app', completed: false },
];

// Onboarding steps for group owners
const ownerOnboardingSteps = [
  { id: 1, title: 'Watch 2 min intro video', completed: false },
  { id: 2, title: 'Set cover image', completed: false },
  { id: 3, title: 'Invite 3 people', completed: false },
  { id: 4, title: 'Write your first post', completed: false },
  { id: 5, title: 'Download app', completed: false },
];

export default function CommunityLayoutClient({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
}) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showDirectMessages, setShowDirectMessages] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [unreadMessages, setUnreadMessages] = useState(2);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingSteps, setOnboardingSteps] = useState(memberOnboardingSteps);
  const [isOwner, setIsOwner] = useState(false);
  const [userLevel, setUserLevel] = useState(3); // Mock user level
  
  // Get current community - handle demo and missing communities
  let currentCommunity = mockData.communities.find(c => c.slug === slug);
  
  // If no community found and slug is 'demo', create a demo community
  if (!currentCommunity && slug === 'demo') {
    currentCommunity = {
      id: 'demo',
      name: 'Demo Community',
      slug: 'demo',
      description: 'Experience the power of Allumi attribution tracking',
      avatar: 'https://picsum.photos/seed/demo/100/100',
      logo: 'https://picsum.photos/seed/demo/100/100',
      cover: 'https://picsum.photos/seed/demo-cover/1200/400',
      memberCount: 1234,
      postCount: 567,
      revenue: 45678,
      isPublic: true,
      price: {
        monthly: 89,
        annual: 890,
      },
      owner: 'demo-owner',
    };
  }
  
  // Fallback to first community if still not found
  if (!currentCommunity) {
    currentCommunity = mockData.communities[0];
  }
  
  // Get current tab from pathname
  const pathParts = pathname.split('/').filter(Boolean);
  const currentTab = pathParts[pathParts.length - 1] || 'feed';
  
  // Combine nav tabs based on ownership
  const navTabs = isOwner ? [...baseNavTabs, ...ownerNavTabs] : baseNavTabs;
  
  useEffect(() => {
    // Check if user is owner (mock logic - in real app, this would come from API)
    // For demo: user owns the first community and demo community
    if (slug === 'growth-lab' || slug === 'demo' || (currentCommunity && currentCommunity.owner === mockData.currentUser.id)) {
      setIsOwner(true);
      setOnboardingSteps(ownerOnboardingSteps);
    }
  }, [currentCommunity, slug]);
  
  const handleOnboardingComplete = (stepId: number) => {
    // Special handling for "Set cover image" step (step 2 for owners)
    if (isOwner && stepId === 2) {
      setShowSettingsModal(true);
    }
    
    setOnboardingSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };
  
  const allOnboardingComplete = onboardingSteps.every(step => step.completed);
  
  return (
    <div className="min-h-screen bg-black">
      {/* Group Switcher Sidebar */}
      <GroupSwitcher currentGroupSlug={slug} />
      
      {/* Main Content - Shifted right to accommodate sidebar */}
      <div className="ml-[72px]">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="flex h-16 items-center px-4">
          {/* Left: Current Group & Switcher */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3 hover:bg-gray-800">
                  <Image
                    src={currentCommunity.avatar}
                    alt={currentCommunity.name}
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-white">{currentCommunity.name}</span>
                    {isOwner && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Owner
                      </span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-gray-900 border-gray-800">
                <div className="p-2">
                  <div className="text-xs text-gray-500 mb-2">YOUR COMMUNITIES</div>
                  {mockData.communities.map((community) => (
                    <DropdownMenuItem key={community.id} asChild>
                      <Link
                        href={`/c/${community.slug}`}
                        className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-gray-800"
                      >
                        <Image
                          src={community.avatar}
                          alt={community.name}
                          width={32}
                          height={32}
                          className="rounded-lg"
                        />
                        <div>
                          <div className="font-medium text-white">{community.name}</div>
                          <div className="text-xs text-gray-500">{community.memberCount} members</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator className="bg-gray-800" />
                {isOwner && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-purple-400 hover:bg-gray-800"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>Owner Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link
                    href="/create-community"
                    className="flex items-center space-x-2 px-4 py-2 text-emerald-400 hover:bg-gray-800"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create a community</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/discover"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-800"
                  >
                    <Compass className="h-4 w-4" />
                    <span>Discover communities</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-xl mx-auto px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">
            {/* Chat */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-800"
              onClick={() => setShowDirectMessages(!showDirectMessages)}
            >
              <MessageCircle className="h-5 w-5 text-gray-400" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-800"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5 text-gray-400" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={mockData.currentUser.avatar} />
                    <AvatarFallback>{mockData.currentUser.name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
                <div className="p-2">
                  <div className="font-medium text-white">{mockData.currentUser.name}</div>
                  <div className="text-sm text-gray-500">@{mockData.currentUser.username}</div>
                </div>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="text-gray-300 hover:bg-gray-800">
                  <Link href="/profile" className="flex items-center space-x-2">
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-gray-300 hover:bg-gray-800"
                  onClick={() => setShowSettingsModal(true)}
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:bg-gray-800">
                  <Link href="/affiliates" className="flex items-center space-x-2">
                    <span>Affiliates</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="text-gray-300 hover:bg-gray-800">
                  <Link href="/help" className="flex items-center space-x-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help Center</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400 hover:bg-gray-800">
                  <button className="flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="px-4">
          <div className="flex space-x-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.href;
              
              return (
                <Link
                  key={tab.name}
                  href={`/c/${slug}/${tab.href}`}
                  className={cn(
                    "flex items-center space-x-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "border-emerald-500 text-white"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex">
        {/* Left Sidebar - Community Quick Switcher */}
        <aside className="w-16 border-r border-gray-800 bg-gray-900/50 sticky top-20 h-[calc(100vh-5rem)]">
          <div className="p-2 space-y-2">
            {mockData.communities.slice(0, 5).map((community) => (
              <Link
                key={community.id}
                href={`/c/${community.slug}`}
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold transition-all hover:scale-110",
                  community.slug === slug
                    ? "bg-emerald-600 ring-2 ring-emerald-400"
                    : "bg-gray-700 hover:bg-gray-600"
                )}
                title={community.name}
              >
                {community.name[0]}
              </Link>
            ))}
            <Link
              href="/discover"
              className="h-10 w-10 rounded-lg flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-all"
              title="Discover communities"
            >
              <Plus className="h-5 w-5 text-gray-400" />
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Onboarding Bar */}
          {showOnboarding && !allOnboardingComplete && (
            <div className="bg-gray-900/50 border-b border-gray-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <span className="text-sm font-medium text-gray-400">
                    {isOwner ? 'Get Started' : 'Welcome! Complete these steps to get started'}
                  </span>
                  {onboardingSteps.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => handleOnboardingComplete(step.id)}
                      className={cn(
                        "flex items-center space-x-2 text-sm transition-colors",
                        step.completed
                          ? "text-emerald-400"
                          : "text-gray-400 hover:text-white"
                      )}
                    >
                      {step.completed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-gray-600" />
                      )}
                      <span>{step.title}</span>
                    </button>
                  ))}
                </div>
                {allOnboardingComplete && (
                  <button
                    onClick={() => setShowOnboarding(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex">
            {/* Page Content */}
            <div className="flex-1">
              {children}
            </div>

            {/* Right Sidebar */}
            <aside className="w-80 border-l border-gray-800 bg-gray-900/30 p-6 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
              {/* Community Info */}
              <div className="mb-6">
                <Image
                  src={currentCommunity.avatar}
                  alt={currentCommunity.name}
                  width={64}
                  height={64}
                  className="rounded-lg mb-3"
                />
                <h3 className="font-semibold text-white mb-1">{currentCommunity.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{currentCommunity.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{currentCommunity.memberCount} members</span>
                  <span className="text-emerald-400">
                    {Math.floor(currentCommunity.memberCount * 0.1)} online
                  </span>
                </div>
              </div>

              {/* Active Members */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Active Members</h4>
                <div className="grid grid-cols-4 gap-2">
                  {mockData.users.slice(0, 8).map((user) => (
                    <Link
                      key={user.id}
                      href={`/profile/${user.username}`}
                      className="relative group"
                    >
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full hover:ring-2 hover:ring-emerald-500 transition-all"
                      />
                      {user.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-gray-900" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Suggested Communities */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Suggested Communities</h4>
                <div className="space-y-2">
                  {mockData.communities.slice(0, 3).filter(c => c.id !== currentCommunity.id).map((community) => (
                    <Link
                      key={community.id}
                      href={`/c/${community.slug}`}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Image
                        src={community.avatar}
                        alt={community.name}
                        width={32}
                        height={32}
                        className="rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{community.name}</div>
                        <div className="text-xs text-gray-500">{community.memberCount} members</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      </div> {/* End of ml-[72px] wrapper */}

      {/* Direct Messages Sidebar */}
      <DirectMessages 
        isOpen={showDirectMessages}
        onClose={() => setShowDirectMessages(false)}
        userLevel={userLevel}
      />

      {/* Settings Modal */}
      <SettingsModalComplete
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        communitySlug={slug}
      />
    </div>
  );
}