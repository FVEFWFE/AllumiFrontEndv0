'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, Bell, Shield, CreditCard, Palette, Users, 
  Share2, Download, ChevronLeft, Settings
} from 'lucide-react';

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Profile', href: '/settings/profile', icon: User },
    { name: 'Notifications', href: '/settings/notifications', icon: Bell },
    { name: 'Privacy & Security', href: '/settings/security', icon: Shield },
    { name: 'Billing', href: '/settings/billing', icon: CreditCard },
    { name: 'Appearance', href: '/settings/appearance', icon: Palette },
    { name: 'Communities', href: '/settings/communities', icon: Users },
    { name: 'Referrals', href: '/settings/referrals', icon: Share2 },
    { name: 'Data Export', href: '/settings/export', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-500" />
              <h1 className="text-xl font-semibold text-white">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 bg-gray-900/50">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/50' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}