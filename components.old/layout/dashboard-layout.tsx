'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, Users, TrendingUp, CreditCard,
  Settings, Zap, Award, MessageCircle, Bell,
  ChevronLeft, ChevronRight, Menu, X, Sparkles,
  Shield, Target, DollarSign, Plus, LogOut,
  HelpCircle, ExternalLink, BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigation = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Communities', href: '/dashboard/communities', icon: Users },
        { name: 'Attribution', href: '/dashboard/attribution', icon: Target },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Revenue',
      items: [
        { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
        { name: 'Affiliates', href: '/dashboard/affiliates', icon: Award },
        { name: 'Monetization', href: '/dashboard/monetization', icon: DollarSign },
      ]
    },
    {
      title: 'Tools',
      items: [
        { name: 'Integrations', href: '/dashboard/integrations', icon: Zap },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ]
    }
  ];

  const notifications = [
    {
      id: 1,
      type: 'revenue',
      title: 'New subscription',
      message: 'Sarah Chen subscribed to Pro plan',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'attribution',
      title: 'Attribution insight',
      message: 'YouTube driving 3x more conversions this week',
      time: '5 hours ago',
      unread: true
    },
    {
      id: 3,
      type: 'community',
      title: 'Community milestone',
      message: 'The Growth Lab reached 1,000 members',
      time: '1 day ago',
      unread: false
    }
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className={`${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } bg-gray-900/50 border-r border-gray-800 transition-all duration-300 hidden lg:block`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-emerald-500" />
              {!sidebarCollapsed && (
                <div>
                  <span className="text-xl font-bold text-white">Allumi</span>
                  <span className="text-xs text-gray-500 block">Owner Dashboard</span>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
            {navigation.map((section) => (
              <div key={section.title}>
                {!sidebarCollapsed && (
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-emerald-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                        title={sidebarCollapsed ? item.name : undefined}
                      >
                        <item.icon className="w-5 h-5" />
                        {!sidebarCollapsed && (
                          <span className="text-sm font-medium">{item.name}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Create Community Button */}
          <div className="p-4 border-t border-gray-800">
            <Link
              href="/create-community"
              className={`flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors ${
                sidebarCollapsed ? 'px-3' : ''
              }`}
            >
              <Plus className="w-5 h-5" />
              {!sidebarCollapsed && <span>New Community</span>}
            </Link>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-4 border-t border-gray-800 text-gray-400 hover:text-white"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 mx-auto" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Search */}
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search communities, members, or settings..."
                    className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4 ml-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-400 hover:text-white"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.some(n => n.unread) && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50">
                      <div className="p-4 border-b border-gray-800">
                        <h3 className="text-white font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer ${
                              notification.unread ? 'bg-gray-800/30' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === 'revenue' ? 'bg-emerald-400' :
                                notification.type === 'attribution' ? 'bg-purple-400' :
                                'bg-blue-400'
                              }`} />
                              <div className="flex-1">
                                <p className="text-sm text-white font-medium">{notification.title}</p>
                                <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-800">
                        <button className="text-sm text-emerald-400 hover:text-emerald-300">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <Image
                      src="https://i.pravatar.cc/150?img=1"
                      alt="User"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="text-left hidden md:block">
                      <p className="text-sm text-white font-medium">John Doe</p>
                      <p className="text-xs text-gray-500">Pro Plan</p>
                    </div>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-2">
                      <Link
                        href="/profile/johndoe"
                        className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
                      >
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">Your Profile</span>
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </Link>
                      <Link
                        href="/help"
                        className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span className="text-sm">Help & Support</span>
                      </Link>
                      <hr className="my-2 border-gray-800" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-emerald-500" />
                <span className="text-xl font-bold text-white">Allumi</span>
              </Link>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-6">
              {navigation.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setShowMobileMenu(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-emerald-600 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}