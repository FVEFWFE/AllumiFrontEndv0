'use client';

import { useState, useEffect } from 'react';
import { 
  Rocket, DollarSign, Users, Target, CheckCircle, Clock,
  AlertCircle, TrendingUp, Zap, Globe, Mail, Youtube,
  Twitter, Calendar, ArrowRight, ExternalLink, Copy,
  Code, Shield, CreditCard, MessageCircle, Award,
  BarChart3, PlayCircle, AlertTriangle, ChevronRight,
  Sparkles, Timer, Activity, Package
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

export default function LaunchReadiness() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [timeToLaunch, setTimeToLaunch] = useState({ days: 0, hours: 0 });

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeToLaunch = () => {
      const now = new Date();
      const launch = new Date('2025-10-01'); // Oct 1, 2025 target
      const diff = launch.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setTimeToLaunch({ days, hours });
    };
    
    calculateTimeToLaunch();
    const interval = setInterval(calculateTimeToLaunch, 3600000); // Update every hour
    return () => clearInterval(interval);
  }, []);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Launch checklist items
  const technicalTasks = [
    { id: 'tech-1', task: 'Connect Supabase authentication', priority: 'critical', effort: '2 hours', status: 'ready' },
    { id: 'tech-2', task: 'Set up Stripe payments', priority: 'critical', effort: '4 hours', status: 'ready' },
    { id: 'tech-3', task: 'Deploy to Vercel', priority: 'critical', effort: '1 hour', status: 'ready' },
    { id: 'tech-4', task: 'Configure custom domain', priority: 'high', effort: '2 hours', status: 'ready' },
    { id: 'tech-5', task: 'Set up Cloudflare CDN', priority: 'medium', effort: '1 hour', status: 'ready' },
    { id: 'tech-6', task: 'Enable error tracking (Sentry)', priority: 'medium', effort: '30 mins', status: 'ready' },
    { id: 'tech-7', task: 'Set up analytics (PostHog)', priority: 'high', effort: '1 hour', status: 'ready' },
    { id: 'tech-8', task: 'Configure email service (Resend)', priority: 'critical', effort: '2 hours', status: 'ready' },
  ];

  const marketingTasks = [
    { id: 'mark-1', task: 'Create 2-minute demo video', priority: 'critical', effort: '4 hours', status: 'pending' },
    { id: 'mark-2', task: 'Write 10 launch blog posts', priority: 'high', effort: '10 hours', status: 'pending' },
    { id: 'mark-3', task: 'Set up email sequence', priority: 'critical', effort: '3 hours', status: 'pending' },
    { id: 'mark-4', task: 'Create YouTube channel', priority: 'high', effort: '1 hour', status: 'pending' },
    { id: 'mark-5', task: 'Prepare Product Hunt launch', priority: 'high', effort: '2 hours', status: 'pending' },
    { id: 'mark-6', task: 'Build email list (100 subscribers)', priority: 'critical', effort: 'ongoing', status: 'in-progress' },
    { id: 'mark-7', task: 'Create comparison page vs Skool', priority: 'high', effort: '2 hours', status: 'pending' },
    { id: 'mark-8', task: 'Set up affiliate program', priority: 'medium', effort: '3 hours', status: 'pending' },
  ];

  const legalTasks = [
    { id: 'legal-1', task: 'Terms of Service', priority: 'critical', effort: '2 hours', status: 'pending' },
    { id: 'legal-2', task: 'Privacy Policy', priority: 'critical', effort: '2 hours', status: 'pending' },
    { id: 'legal-3', task: 'Cookie Policy', priority: 'high', effort: '1 hour', status: 'pending' },
    { id: 'legal-4', task: 'Refund Policy', priority: 'high', effort: '1 hour', status: 'pending' },
    { id: 'legal-5', task: 'Set up LLC/Corporation', priority: 'critical', effort: '2 days', status: 'pending' },
    { id: 'legal-6', task: 'Get business insurance', priority: 'medium', effort: '1 day', status: 'pending' },
  ];

  // Revenue projections
  const revenueProjections = [
    { month: 'Month 1', customers: 5, mrr: 445, arr: 5340 },
    { month: 'Month 2', customers: 12, mrr: 1068, arr: 12816 },
    { month: 'Month 3', customers: 25, mrr: 2225, arr: 26700 },
    { month: 'Month 6', customers: 75, mrr: 6675, arr: 80100 },
    { month: 'Month 12', customers: 200, mrr: 17800, arr: 213600 },
    { month: 'Month 18', customers: 350, mrr: 31150, arr: 373800 },
    { month: 'Month 24', customers: 470, mrr: 41830, arr: 501960 },
  ];

  // Quick wins for immediate revenue
  const quickWins = [
    {
      title: 'Pre-launch Lifetime Deal',
      description: 'Offer $497 lifetime access (limited to 20 spots)',
      revenue: '$9,940',
      effort: '1 day',
      icon: Zap,
      color: 'text-yellow-500'
    },
    {
      title: 'Attribution Setup Service',
      description: 'Charge $997 to set up attribution for existing communities',
      revenue: '$4,985',
      effort: '5 clients',
      icon: Target,
      color: 'text-emerald-500'
    },
    {
      title: 'Beta Access Program',
      description: '50% off for first 50 customers ($44.50/mo)',
      revenue: '$2,225/mo',
      effort: '1 week',
      icon: Users,
      color: 'text-purple-500'
    },
    {
      title: 'YouTube Course Presale',
      description: 'Sell attribution course for $297',
      revenue: '$5,940',
      effort: '20 sales',
      icon: Youtube,
      color: 'text-red-500'
    },
  ];

  // Calculate progress
  const allTasks = [...technicalTasks, ...marketingTasks, ...legalTasks];
  const totalTasks = allTasks.length;
  const completedCount = completedTasks.length;
  const readyTasks = allTasks.filter(t => t.status === 'ready').length;
  const criticalTasks = allTasks.filter(t => t.priority === 'critical').length;
  const criticalCompleted = allTasks.filter(t => t.priority === 'critical' && completedTasks.includes(t.id)).length;
  const overallProgress = Math.round((completedCount / totalTasks) * 100);

  // Minimum viable launch requirements
  const mvpComplete = 
    completedTasks.includes('tech-1') && // Auth
    completedTasks.includes('tech-2') && // Payments
    completedTasks.includes('tech-3') && // Deployed
    completedTasks.includes('legal-1') && // Terms
    completedTasks.includes('legal-2') && // Privacy
    completedTasks.includes('mark-1');    // Demo video

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Rocket className="w-6 h-6 text-emerald-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">Launch Readiness Dashboard</h1>
                <p className="text-sm text-gray-400">Everything you need to launch and get your first customers</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-emerald-600">
                <Timer className="w-3 h-3 mr-1" />
                {timeToLaunch.days} days to launch
              </Badge>
              {mvpComplete ? (
                <Badge className="bg-green-600">MVP Ready</Badge>
              ) : (
                <Badge className="bg-yellow-600">MVP Incomplete</Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Critical Alert */}
        {!mvpComplete && (
          <Alert className="mb-6 bg-red-900/20 border-red-600/50">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-400">MVP Not Ready</AlertTitle>
            <AlertDescription className="text-red-300">
              You need to complete {criticalTasks - criticalCompleted} critical tasks before you can launch. 
              Focus on authentication, payments, and legal requirements first.
            </AlertDescription>
          </Alert>
        )}

        {/* Progress Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-2xl font-bold text-white">{overallProgress}%</span>
              </div>
              <div className="text-sm text-gray-400">Overall Progress</div>
              <Progress value={overallProgress} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-2xl font-bold text-white">{criticalCompleted}/{criticalTasks}</span>
              </div>
              <div className="text-sm text-gray-400">Critical Tasks</div>
              <Progress value={(criticalCompleted/criticalTasks)*100} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-2xl font-bold text-white">~14 hrs</span>
              </div>
              <div className="text-sm text-gray-400">Time to MVP</div>
              <div className="text-xs text-gray-500 mt-1">If focused</div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span className="text-2xl font-bold text-white">$22K</span>
              </div>
              <div className="text-sm text-gray-400">Quick Win Revenue</div>
              <div className="text-xs text-gray-500 mt-1">Available now</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Wins Section */}
        <Card className="border-gray-800 bg-gray-900/50 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>🚀 Quick Revenue Wins</CardTitle>
                <CardDescription>Start making money before the full launch</CardDescription>
              </div>
              <Badge className="bg-emerald-600">$22,090 potential</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickWins.map((win, index) => {
                const Icon = win.icon;
                return (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-emerald-600/50 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-700 rounded-lg">
                        <Icon className={`w-5 h-5 ${win.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{win.title}</h4>
                        <p className="text-sm text-gray-400 mb-3">{win.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-emerald-600/20 text-emerald-400">
                            {win.revenue}
                          </Badge>
                          <span className="text-xs text-gray-500">Effort: {win.effort}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="checklist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
            <TabsTrigger value="checklist">Launch Checklist</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Projections</TabsTrigger>
            <TabsTrigger value="marketing">Go-to-Market</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="space-y-6">
            {/* Technical Tasks */}
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>🔧 Technical Requirements</CardTitle>
                <CardDescription>Backend and deployment tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {technicalTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <Checkbox
                        checked={completedTasks.includes(task.id)}
                        onCheckedChange={() => toggleTask(task.id)}
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${completedTasks.includes(task.id) ? 'line-through text-gray-500' : 'text-white'}`}>
                          {task.task}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.priority === 'critical' && (
                          <Badge className="bg-red-600">Critical</Badge>
                        )}
                        {task.priority === 'high' && (
                          <Badge className="bg-yellow-600">High</Badge>
                        )}
                        <span className="text-xs text-gray-400">{task.effort}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Marketing Tasks */}
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>📣 Marketing & Launch</CardTitle>
                <CardDescription>Get your first customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketingTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <Checkbox
                        checked={completedTasks.includes(task.id)}
                        onCheckedChange={() => toggleTask(task.id)}
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${completedTasks.includes(task.id) ? 'line-through text-gray-500' : 'text-white'}`}>
                          {task.task}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.priority === 'critical' && (
                          <Badge className="bg-red-600">Critical</Badge>
                        )}
                        {task.priority === 'high' && (
                          <Badge className="bg-yellow-600">High</Badge>
                        )}
                        {task.status === 'in-progress' && (
                          <Badge className="bg-blue-600">In Progress</Badge>
                        )}
                        <span className="text-xs text-gray-400">{task.effort}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Legal Tasks */}
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>⚖️ Legal & Compliance</CardTitle>
                <CardDescription>Protect your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {legalTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <Checkbox
                        checked={completedTasks.includes(task.id)}
                        onCheckedChange={() => toggleTask(task.id)}
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${completedTasks.includes(task.id) ? 'line-through text-gray-500' : 'text-white'}`}>
                          {task.task}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.priority === 'critical' && (
                          <Badge className="bg-red-600">Critical</Badge>
                        )}
                        {task.priority === 'high' && (
                          <Badge className="bg-yellow-600">High</Badge>
                        )}
                        <span className="text-xs text-gray-400">{task.effort}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Projections Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Revenue Growth Projections</CardTitle>
                <CardDescription>Path to $1M valuation (2x ARR)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Target Exit Valuation</p>
                      <p className="text-2xl font-bold text-emerald-400">$1,000,000</p>
                      <p className="text-xs text-gray-500">2x ARR multiple</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Required ARR</p>
                      <p className="text-2xl font-bold text-white">$500,000</p>
                      <p className="text-xs text-gray-500">$41,667/month</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Customers Needed</p>
                      <p className="text-2xl font-bold text-white">470</p>
                      <p className="text-xs text-gray-500">At $89/month avg</p>
                    </div>
                  </div>

                  {/* Projection Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-400">Timeline</th>
                          <th className="text-right py-2 text-gray-400">Customers</th>
                          <th className="text-right py-2 text-gray-400">MRR</th>
                          <th className="text-right py-2 text-gray-400">ARR</th>
                          <th className="text-right py-2 text-gray-400">Valuation (2x)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueProjections.map((projection, index) => (
                          <tr key={index} className="border-b border-gray-800">
                            <td className="py-3 text-white">{projection.month}</td>
                            <td className="text-right py-3 text-gray-300">{projection.customers}</td>
                            <td className="text-right py-3 text-gray-300">${projection.mrr.toLocaleString()}</td>
                            <td className="text-right py-3 text-gray-300">${projection.arr.toLocaleString()}</td>
                            <td className="text-right py-3 font-bold text-emerald-400">
                              ${(projection.arr * 2).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Alert className="bg-emerald-600/10 border-emerald-600/50">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <AlertDescription className="text-emerald-300">
                      <strong>Exit Strategy:</strong> At current growth rate, you'll reach $500K ARR in 24 months. 
                      Focus on attribution features to justify premium pricing and faster growth. 
                      Target acquisition by a larger EdTech or MarTech company looking for community analytics.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Go-to-Market Tab */}
          <TabsContent value="marketing" className="space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Go-to-Market Strategy</CardTitle>
                <CardDescription>Your first 100 customers playbook</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Week 1: Pre-Launch */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Week 1: Pre-Launch Preparation</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <Youtube className="w-5 h-5 text-red-500" />
                        <div className="flex-1">
                          <p className="text-sm text-white">Create "Attribution Setup in 5 Minutes" video</p>
                          <p className="text-xs text-gray-400">Post on YouTube, embed on landing page</p>
                        </div>
                        <Button size="sm" variant="outline">Start</Button>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <Mail className="w-5 h-5 text-emerald-500" />
                        <div className="flex-1">
                          <p className="text-sm text-white">Set up ConvertKit with 5-email welcome sequence</p>
                          <p className="text-xs text-gray-400">Focus on attribution education</p>
                        </div>
                        <Button size="sm" variant="outline">Start</Button>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <Twitter className="w-5 h-5 text-blue-400" />
                        <div className="flex-1">
                          <p className="text-sm text-white">Tweet thread: "How Skool is leaving money on the table"</p>
                          <p className="text-xs text-gray-400">Tag community builders</p>
                        </div>
                        <Button size="sm" variant="outline">Start</Button>
                      </div>
                    </div>
                  </div>

                  {/* Week 2: Launch */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Week 2: Launch Week</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <Rocket className="w-5 h-5 text-purple-500" />
                        <div className="flex-1">
                          <p className="text-sm text-white">Product Hunt launch (Tuesday, 12:01 AM PST)</p>
                          <p className="text-xs text-gray-400">Aim for #1 Product of the Day</p>
                        </div>
                        <Button size="sm" variant="outline">Schedule</Button>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <Users className="w-5 h-5 text-emerald-500" />
                        <div className="flex-1">
                          <p className="text-sm text-white">Reddit posts in r/Entrepreneur, r/SaaS, r/marketing</p>
                          <p className="text-xs text-gray-400">"I built a Skool alternative with attribution tracking"</p>
                        </div>
                        <Button size="sm" variant="outline">Draft</Button>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-yellow-500" />
                        <div className="flex-1">
                          <p className="text-sm text-white">Launch lifetime deal: $497 (limited to 20)</p>
                          <p className="text-xs text-gray-400">Create urgency with countdown timer</p>
                        </div>
                        <Button size="sm" variant="outline">Setup</Button>
                      </div>
                    </div>
                  </div>

                  {/* Ongoing Growth */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Ongoing: Growth Tactics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-medium text-white mb-2">Content Marketing</h4>
                        <ul className="space-y-1 text-sm text-gray-400">
                          <li>• Weekly YouTube videos on attribution</li>
                          <li>• Case studies of successful communities</li>
                          <li>• "Skool vs Allumi" comparison content</li>
                          <li>• Guest posts on IndieHackers</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-medium text-white mb-2">Direct Outreach</h4>
                        <ul className="space-y-1 text-sm text-gray-400">
                          <li>• DM 10 Skool users daily</li>
                          <li>• Offer free attribution audits</li>
                          <li>• Partner with course creators</li>
                          <li>• Affiliate program (40% commission)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Launch Timeline</CardTitle>
                <CardDescription>Critical path to first revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* This Week */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">This Week (Critical Path)</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-emerald-400">1</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">Monday-Tuesday: Technical Setup</p>
                          <p className="text-sm text-gray-400">Connect Supabase auth, set up Stripe, deploy to Vercel</p>
                          <p className="text-xs text-gray-500 mt-1">8 hours of focused work</p>
                        </div>
                        <Badge className="bg-red-600">Critical</Badge>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-emerald-400">2</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">Wednesday: Legal & Demo</p>
                          <p className="text-sm text-gray-400">Generate legal docs, record 2-min demo video</p>
                          <p className="text-xs text-gray-500 mt-1">4 hours</p>
                        </div>
                        <Badge className="bg-red-600">Critical</Badge>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-emerald-400">3</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">Thursday-Friday: First Customers</p>
                          <p className="text-sm text-gray-400">Launch lifetime deal, reach out to warm leads</p>
                          <p className="text-xs text-gray-500 mt-1">Target: 5 lifetime deals = $2,485</p>
                        </div>
                        <Badge className="bg-yellow-600">Revenue</Badge>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-800" />

                  {/* Next Week */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Next Week (Scale Up)</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-purple-400">4</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">Product Hunt Launch</p>
                          <p className="text-sm text-gray-400">Coordinate launch, engage with community</p>
                          <p className="text-xs text-gray-500 mt-1">Target: 50 signups</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-purple-400">5</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">Content Blitz</p>
                          <p className="text-sm text-gray-400">Publish 5 blog posts, 3 YouTube videos</p>
                          <p className="text-xs text-gray-500 mt-1">Focus on attribution education</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-800" />

                  {/* Month 1 Goals */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Month 1 Goals</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-emerald-400">25</p>
                        <p className="text-sm text-gray-400">Paying Customers</p>
                      </div>
                      <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-emerald-400">$2,225</p>
                        <p className="text-sm text-gray-400">MRR</p>
                      </div>
                      <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-emerald-400">100</p>
                        <p className="text-sm text-gray-400">Email Subscribers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 p-6 bg-gray-900/50 rounded-lg border border-gray-800">
          <div>
            <h3 className="font-semibold text-white mb-1">Ready to Launch?</h3>
            <p className="text-sm text-gray-400">Complete the critical tasks and start getting customers</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/sitemap-test">
                <Code className="w-4 h-4 mr-2" />
                View All Pages
              </Link>
            </Button>
            <Button asChild>
              <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer">
                Deploy Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}