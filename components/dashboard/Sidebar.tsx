'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Link2,
  TrendingUp,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  Users,
  Sparkles,
  BarChart3,
  Upload
} from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const navItems = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: Home,
    description: 'Dashboard & stats'
  },
  {
    href: '/dashboard/links',
    label: 'Tracking Links',
    icon: Link2,
    description: 'Create & manage'
  },
  {
    href: '/dashboard/conversions',
    label: 'Attribution',
    icon: TrendingUp,
    description: 'Track conversions'
  },
  {
    href: '/dashboard/analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'ROI & metrics',
    badge: 'New'
  },
  {
    href: '/dashboard/import',
    label: 'Import Members',
    icon: Upload,
    description: 'CSV upload'
  },
  {
    href: '/dashboard/affiliate',
    label: 'Affiliate Program',
    icon: Users,
    description: 'Earn 40% commission',
    badge: 'New',
    highlight: true
  },
  {
    href: '/dashboard/settings',
    label: 'Setup & Settings',
    icon: Settings,
    description: 'API keys & webhook',
    badge: 'Important'
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg"
      >
        {mobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-card border-r border-border
        transform transition-transform lg:transform-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                A
              </div>
              <span className="text-xl font-bold">Allumi</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href ||
                               (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg
                        transition-colors relative
                        ${isActive
                          ? 'bg-accent text-accent-foreground'
                          : item.highlight
                          ? 'hover:bg-accent/10 border border-accent/20'
                          : 'hover:bg-muted'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${item.highlight && !isActive ? 'text-accent' : ''}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                              item.badge === 'New'
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-yellow-500/20 text-yellow-500'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <span className="text-xs text-muted-foreground">{item.description}</span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                T
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">Test User</div>
                <div className="text-xs text-muted-foreground">test@allumi.com</div>
              </div>
            </div>
            <div className="space-y-1">
              <Link
                href="/dashboard/billing"
                className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <CreditCard className="w-4 h-4" />
                <span>Billing</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}