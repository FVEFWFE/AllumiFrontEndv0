'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, MessageSquare, Bell, User, MapPin, Gamepad2, ShoppingBag, ChevronDown } from 'lucide-react';
import { useState, useRef } from 'react';
import { DirectMessages } from './direct-messages';
import { NotificationsDropdown } from './notifications-dropdown';

interface CommunityHeaderProps {
  communityName: string;
  communitySlug: string;
  user?: any;
}

export function CommunityHeader({ communityName, communitySlug, user }: CommunityHeaderProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  const navItems = [
    { href: `/c/${communitySlug}/feed`, label: 'Community', active: pathname.includes('/feed') },
    { href: `/c/${communitySlug}/classroom`, label: 'Classroom', active: pathname.includes('/classroom') },
    { href: `/c/${communitySlug}/events`, label: 'Calendar', active: pathname.includes('/events') },
    { href: `/c/${communitySlug}/members`, label: 'Members', active: pathname.includes('/members') },
    { href: `/c/${communitySlug}/map`, label: 'Map', icon: MapPin, active: pathname.includes('/map') },
    { href: `/c/${communitySlug}/games`, label: 'Games', icon: Gamepad2, active: pathname.includes('/games') },
    { href: `/c/${communitySlug}/merch`, label: 'Merch', icon: ShoppingBag, active: pathname.includes('/merch') },
    { href: `/c/${communitySlug}/about`, label: 'About', active: pathname.includes('/about') },
  ];

  return (
    <>
    <header className="sticky top-0 z-50 w-full bg-gray-900 border-b border-gray-800">
      {/* Top Bar */}
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Community Name */}
        <Link href={`/c/${communitySlug}/feed`} className="flex items-center gap-2">
          <span className="text-lg font-semibold text-white">{communityName}</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Chat */}
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <MessageSquare className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-emerald-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2">
                <div className="px-4 py-2 border-b border-gray-700">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                </div>
                <div className="px-4 py-3 text-sm text-gray-400">
                  No new notifications
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2">
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                  Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                  Settings
                </Link>
                <hr className="my-2 border-gray-700" />
                <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                  Owner Dashboard
                </Link>
                <hr className="my-2 border-gray-700" />
                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="h-12 px-4 flex items-center gap-1 bg-gray-950/50">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${item.active 
                ? 'bg-gray-800 text-emerald-500' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }
            `}
          >
            <span className="flex items-center gap-2">
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </header>

    {/* Direct Messages Overlay */}
    <DirectMessages
      isOpen={showChat}
      onClose={() => setShowChat(false)}
      userLevel={2}
    />
    </>
  );
}