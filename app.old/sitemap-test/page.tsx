'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Home, Users, Target, CreditCard, Award, Settings,
  Plus, LogIn, UserPlus, LayoutDashboard, BarChart3,
  DollarSign, Zap, Globe, MessageCircle, BookOpen,
  Calendar, Trophy, Info, User, ExternalLink, Check,
  Bell, Mail, Search, Shield, Palette, Share2, Download,
  PlayCircle, Link as LinkIcon, TrendingUp, Database,
  FileText, Activity, ChevronRight, X, CheckCircle,
  AlertCircle, Clock, Sparkles, Rocket, Code, ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SitemapTestPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyCompleted, setShowOnlyCompleted] = useState(false);

  const pages = [
    {
      category: '🚀 Landing & Public',
      key: 'landing',
      description: 'Public-facing pages and authentication',
      items: [
        { name: 'Landing Page', path: '/', icon: Home, status: 'completed', priority: 'high' },
        { name: 'Login', path: '/login', icon: LogIn, status: 'completed', priority: 'high' },
        { name: 'Signup', path: '/signup', icon: UserPlus, status: 'completed', priority: 'high' },
        { name: 'Blog', path: '/blog', icon: FileText, status: 'completed', priority: 'medium' },
        { name: 'Changelog', path: '/changelog', icon: Activity, status: 'completed', priority: 'low' },
        { name: 'Community Overview', path: '/community', icon: Users, status: 'completed', priority: 'medium' },
        { name: 'Attribution Demo', path: '/attribution-demo', icon: Target, status: 'completed', priority: 'high' },
        { name: 'Claim Domain', path: '/claim-domain', icon: Globe, status: 'completed', priority: 'medium' },
        { name: 'Create Community', path: '/create-community', icon: Plus, status: 'completed', priority: 'high' },
      ]
    },
    {
      category: '🎯 Platform Dashboard',
      key: 'dashboard',
      description: 'Multi-community owner dashboard',
      items: [
        { name: 'Owner Dashboard', path: '/dashboard', icon: LayoutDashboard, status: 'completed', priority: 'high' },
        { name: 'Communities Manager', path: '/dashboard/communities', icon: Users, status: 'completed', priority: 'high' },
        { name: 'Platform Analytics', path: '/dashboard/analytics', icon: BarChart3, status: 'completed', priority: 'high' },
        { name: 'Attribution Dashboard', path: '/dashboard/attribution', icon: Target, status: 'completed', priority: 'high', badge: 'KEY' },
        { name: 'Billing & Subscription', path: '/dashboard/billing', icon: CreditCard, status: 'completed', priority: 'high' },
        { name: 'Affiliate Program', path: '/dashboard/affiliates', icon: Award, status: 'completed', priority: 'medium' },
        { name: 'Monetization Overview', path: '/dashboard/monetization', icon: DollarSign, status: 'completed', priority: 'high' },
        { name: 'Integrations', path: '/dashboard/integrations', icon: Zap, status: 'completed', priority: 'medium' },
      ]
    },
    {
      category: '🏘️ Community Pages',
      key: 'community',
      description: 'Member-facing community features',
      items: [
        { name: 'Community Home', path: '/c/growth-lab', icon: Home, status: 'completed', priority: 'high' },
        { name: 'Community Feed', path: '/c/growth-lab/feed', icon: MessageCircle, status: 'completed', priority: 'high' },
        { name: 'Classroom', path: '/c/growth-lab/classroom', icon: BookOpen, status: 'completed', priority: 'high' },
        { name: 'Lesson Viewer', path: '/c/growth-lab/classroom/1/1', icon: PlayCircle, status: 'completed', priority: 'high', badge: 'NEW' },
        { name: 'Calendar/Events', path: '/c/growth-lab/calendar', icon: Calendar, status: 'completed', priority: 'medium' },
        { name: 'Members Directory', path: '/c/growth-lab/members', icon: Users, status: 'completed', priority: 'medium' },
        { name: 'Member Profile', path: '/c/growth-lab/members/sarahchen', icon: User, status: 'completed', priority: 'high', badge: 'NEW' },
        { name: 'Leaderboard', path: '/c/growth-lab/leaderboard', icon: Trophy, status: 'completed', priority: 'medium' },
        { name: 'About', path: '/c/growth-lab/about', icon: Info, status: 'completed', priority: 'low' },
        { name: 'Pricing', path: '/c/growth-lab/pricing', icon: CreditCard, status: 'completed', priority: 'high' },
        { name: 'Checkout', path: '/c/growth-lab/checkout', icon: ShoppingCart, status: 'completed', priority: 'high' },
        { name: 'Welcome/Onboarding', path: '/c/growth-lab/welcome', icon: Rocket, status: 'completed', priority: 'high' },
      ]
    },
    {
      category: '👑 Community Admin',
      key: 'admin',
      description: 'Owner-only management pages',
      items: [
        { name: 'Community Analytics', path: '/c/growth-lab/analytics', icon: BarChart3, status: 'completed', priority: 'high' },
        { name: 'Revenue Analytics', path: '/c/growth-lab/revenue', icon: DollarSign, status: 'completed', priority: 'high', badge: 'NEW' },
        { name: 'Attribution Setup', path: '/c/growth-lab/attribution/setup', icon: Target, status: 'completed', priority: 'high', badge: 'KEY' },
        { name: 'Community Settings', path: '/c/growth-lab/settings', icon: Settings, status: 'completed', priority: 'high' },
        { name: 'Community Monetization', path: '/c/growth-lab/monetization', icon: DollarSign, status: 'completed', priority: 'high' },
      ]
    },
    {
      category: '👤 User Account',
      key: 'account',
      description: 'Personal settings and profile',
      items: [
        { name: 'User Profile', path: '/profile/janjegen', icon: User, status: 'completed', priority: 'high' },
        { name: 'Profile Settings', path: '/settings/profile', icon: User, status: 'completed', priority: 'high', badge: 'NEW' },
        { name: 'Notifications Settings', path: '/settings/notifications', icon: Bell, status: 'completed', priority: 'high', badge: 'NEW' },
        { name: 'Billing Settings', path: '/settings/billing', icon: CreditCard, status: 'completed', priority: 'high', badge: 'NEW' },
        { name: 'Security Settings', path: '/settings/security', icon: Shield, status: 'pending', priority: 'medium' },
        { name: 'Appearance', path: '/settings/appearance', icon: Palette, status: 'pending', priority: 'low' },
        { name: 'Communities', path: '/settings/communities', icon: Users, status: 'pending', priority: 'medium' },
        { name: 'Referrals', path: '/settings/referrals', icon: Share2, status: 'pending', priority: 'medium' },
        { name: 'Data Export', path: '/settings/export', icon: Download, status: 'pending', priority: 'low' },
      ]
    },
    {
      category: '💬 Communication',
      key: 'communication',
      description: 'Messaging and notifications',
      items: [
        { name: 'Messages/DMs', path: '/messages', icon: Mail, status: 'completed', priority: 'high', badge: 'NEW' },
        { name: 'Notifications', path: '/notifications', icon: Bell, status: 'completed', priority: 'high', badge: 'NEW' },
        { name: 'Search Results', path: '/search?q=attribution', icon: Search, status: 'pending', priority: 'medium' },
      ]
    },
    {
      category: '🔧 Developer/Testing',
      key: 'developer',
      description: 'Development and testing pages',
      items: [
        { name: 'Sitemap Test', path: '/sitemap-test', icon: Database, status: 'completed', priority: 'low' },
        { name: 'API Test DB', path: '/api/test-db', icon: Database, status: 'completed', priority: 'low' },
        { name: 'API Test Supabase', path: '/api/test-supabase', icon: Database, status: 'completed', priority: 'low' },
        { name: 'Blog RSS', path: '/blog/rss.xml', icon: FileText, status: 'completed', priority: 'low' },
        { name: 'Changelog RSS', path: '/changelog/rss.xml', icon: FileText, status: 'completed', priority: 'low' },
      ]
    }
  ];

  // Calculate statistics
  const totalPages = pages.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedPages = pages.reduce((acc, cat) => 
    acc + cat.items.filter(item => item.status === 'completed').length, 0
  );
  const pendingPages = totalPages - completedPages;
  const completionPercentage = Math.round((completedPages / totalPages) * 100);

  // Filter pages based on search and category
  const filteredPages = pages.map(category => ({
    ...category,
    items: category.items.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.path.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !showOnlyCompleted || item.status === 'completed';
      return matchesSearch && matchesStatus;
    })
  })).filter(category => 
    (selectedCategory === 'all' || category.key === selectedCategory) &&
    category.items.length > 0
  );

  // Key features count
  const keyFeatures = pages.reduce((acc, cat) => 
    acc + cat.items.filter(item => item.badge === 'KEY').length, 0
  );
  const newFeatures = pages.reduce((acc, cat) => 
    acc + cat.items.filter(item => item.badge === 'NEW').length, 0
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Database className="w-6 h-6 text-emerald-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">Allumi.com Sitemap & Testing Dashboard</h1>
                <p className="text-sm text-gray-400">Complete overview of all pages and features</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-emerald-600">{completedPages}/{totalPages} Pages Complete</Badge>
              <Badge className="bg-purple-600">{keyFeatures} Key Features</Badge>
              <Badge className="bg-blue-600">{newFeatures} New Pages</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Progress Overview */}
        <Card className="border-gray-800 bg-gray-900/50 mb-6">
          <CardHeader>
            <CardTitle>Development Progress</CardTitle>
            <CardDescription>Overall completion status of the Allumi platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Overall Completion</span>
                  <span className="text-white font-bold">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-3" />
              </div>
              
              <div className="grid grid-cols-4 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">{completedPages}</div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{pendingPages}</div>
                  <div className="text-sm text-gray-400">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{keyFeatures}</div>
                  <div className="text-sm text-gray-400">Key Features</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{newFeatures}</div>
                  <div className="text-sm text-gray-400">New Today</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attribution Features Alert */}
        <Alert className="mb-6 bg-emerald-600/10 border-emerald-600/50">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <AlertDescription className="text-emerald-300">
            <strong>Key Differentiators Ready:</strong> Attribution Setup Wizard, Revenue Analytics Dashboard, 
            and Member LTV tracking are fully built. These features position Allumi as the only 
            attribution-first community platform, justifying premium pricing vs Skool.
          </AlertDescription>
        </Alert>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Button
            variant={showOnlyCompleted ? 'default' : 'outline'}
            onClick={() => setShowOnlyCompleted(!showOnlyCompleted)}
          >
            {showOnlyCompleted ? <CheckCircle className="w-4 h-4 mr-2" /> : <Circle className="w-4 h-4 mr-2" />}
            Completed Only
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="grid w-full grid-cols-8 bg-gray-900/50">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="landing">Landing</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="communication">Comms</TabsTrigger>
            <TabsTrigger value="developer">Dev</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Page Categories */}
        <div className="space-y-6">
          {filteredPages.map((category) => (
            <Card key={category.key} className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{category.category}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                  <Badge variant="outline">
                    {category.items.filter(i => i.status === 'completed').length}/{category.items.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    const isCompleted = item.status === 'completed';
                    
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        target="_blank"
                        className={`
                          flex items-center gap-3 p-3 rounded-lg border transition-all
                          ${isCompleted 
                            ? 'border-gray-700 hover:border-emerald-600 hover:bg-gray-800/50' 
                            : 'border-gray-800 opacity-60 hover:opacity-100'
                          }
                        `}
                      >
                        <div className={`
                          p-2 rounded-lg
                          ${isCompleted ? 'bg-emerald-600/20' : 'bg-gray-800'}
                        `}>
                          <Icon className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium ${isCompleted ? 'text-white' : 'text-gray-400'}`}>
                              {item.name}
                            </p>
                            {item.badge === 'KEY' && (
                              <Badge className="bg-purple-600 text-xs">KEY</Badge>
                            )}
                            {item.badge === 'NEW' && (
                              <Badge className="bg-blue-600 text-xs">NEW</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{item.path}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-400" />
                          )}
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Test Scenarios */}
        <Card className="border-gray-800 bg-gray-900/50 mt-6">
          <CardHeader>
            <CardTitle>Quick Test Scenarios</CardTitle>
            <CardDescription>Common user flows to test</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-white mb-2">🎯 Attribution Flow</h4>
                <ol className="space-y-1 text-sm text-gray-400">
                  <li>1. Go to <Link href="/c/growth-lab/attribution/setup" className="text-emerald-400 hover:underline">Attribution Setup</Link></li>
                  <li>2. Complete the wizard</li>
                  <li>3. View <Link href="/c/growth-lab/revenue" className="text-emerald-400 hover:underline">Revenue Analytics</Link></li>
                  <li>4. Check <Link href="/dashboard/attribution" className="text-emerald-400 hover:underline">Platform Attribution</Link></li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-white mb-2">📚 Learning Flow</h4>
                <ol className="space-y-1 text-sm text-gray-400">
                  <li>1. Visit <Link href="/c/growth-lab/classroom" className="text-emerald-400 hover:underline">Classroom</Link></li>
                  <li>2. Open <Link href="/c/growth-lab/classroom/1/1" className="text-emerald-400 hover:underline">Lesson Viewer</Link></li>
                  <li>3. Check progress tracking</li>
                  <li>4. Test video controls & notes</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-white mb-2">💬 Communication Flow</h4>
                <ol className="space-y-1 text-sm text-gray-400">
                  <li>1. Open <Link href="/messages" className="text-emerald-400 hover:underline">Messages</Link></li>
                  <li>2. Check <Link href="/notifications" className="text-emerald-400 hover:underline">Notifications</Link></li>
                  <li>3. View <Link href="/c/growth-lab/members/sarahchen" className="text-emerald-400 hover:underline">Member Profile</Link></li>
                  <li>4. Test follow/message actions</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-white mb-2">⚙️ Settings Flow</h4>
                <ol className="space-y-1 text-sm text-gray-400">
                  <li>1. Go to <Link href="/settings/profile" className="text-emerald-400 hover:underline">Profile Settings</Link></li>
                  <li>2. Check <Link href="/settings/notifications" className="text-emerald-400 hover:underline">Notifications</Link></li>
                  <li>3. Review <Link href="/settings/billing" className="text-emerald-400 hover:underline">Billing</Link></li>
                  <li>4. Test save actions</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Notes */}
        <Card className="border-gray-800 bg-gray-900/50 mt-6">
          <CardHeader>
            <CardTitle>Development Status</CardTitle>
            <CardDescription>Next steps and technical notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-white mb-2">✅ Completed Features</h4>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>• Attribution Setup Wizard with UTM builder</li>
                  <li>• Revenue Analytics Dashboard with channel ROI</li>
                  <li>• Lesson Viewer with video player and transcripts</li>
                  <li>• Messages/DMs with real-time chat UI</li>
                  <li>• Comprehensive notification system</li>
                  <li>• User settings pages (profile, notifications, billing)</li>
                  <li>• Member profile with activity tracking</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">🔄 Ready for Backend</h4>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>• Supabase client configured in <code className="text-emerald-400">/lib/supabase</code></li>
                  <li>• Mock data structured for easy migration</li>
                  <li>• API routes prepared for testing</li>
                  <li>• Authentication middleware ready</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">📝 Remaining Tasks</h4>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>• Connect real Supabase data</li>
                  <li>• Implement Stripe/Whop payments</li>
                  <li>• Deploy to Vercel</li>
                  <li>• Set up custom domains</li>
                  <li>• Create demo video</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add missing Circle import in the actual implementation
const Circle = ({ className }: { className?: string }) => (
  <div className={`w-4 h-4 rounded-full border-2 border-current ${className}`} />
);