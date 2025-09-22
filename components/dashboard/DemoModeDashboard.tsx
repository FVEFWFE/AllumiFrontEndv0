'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, TrendingUp, TrendingDown, Users, DollarSign, BarChart3, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface DemoMetrics {
  youtube: {
    members: number;
    revenue: number;
    trend: number;
    topContent: string;
    conversion: number;
  };
  instagram: {
    members: number;
    revenue: number;
    trend: number;
    topContent: string;
    conversion: number;
  };
  tiktok: {
    members: number;
    revenue: number;
    trend: number;
    topContent: string;
    conversion: number;
  };
  email: {
    members: number;
    revenue: number;
    trend: number;
    topContent: string;
    conversion: number;
  };
}

const demoData: DemoMetrics = {
  youtube: {
    members: 127,
    revenue: 10033,
    trend: 47,
    topContent: "How I Built My $50k/mo Skool Community",
    conversion: 3.2
  },
  instagram: {
    members: 12,
    revenue: 948,
    trend: -12,
    topContent: "Story: 5 Tips for Course Creators",
    conversion: 0.8
  },
  tiktok: {
    members: 43,
    revenue: 3397,
    trend: 234,
    topContent: "This ONE trick changed everything...",
    conversion: 5.1
  },
  email: {
    members: 89,
    revenue: 7031,
    trend: 18,
    topContent: "Newsletter: January Launch Special",
    conversion: 12.3
  }
};

export default function DemoModeDashboard({ onStartReal }: { onStartReal?: () => void }) {
  const router = useRouter();
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);
  const [animatedNumbers, setAnimatedNumbers] = useState<any>({});
  const [showInteractiveTip, setShowInteractiveTip] = useState(true);

  useEffect(() => {
    // Animate numbers on mount
    Object.keys(demoData).forEach(source => {
      const target = demoData[source as keyof DemoMetrics].revenue;
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedNumbers((prev: any) => ({ ...prev, [source]: Math.floor(current) }));
      }, 30);
    });

    // Show interactive tip after 3 seconds
    setTimeout(() => {
      toast.custom((t) => (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-md">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Try clicking on the data!</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click any source to see the full attribution path
              </p>
            </div>
          </div>
        </div>
      ), { duration: 5000 });
    }, 3000);
  }, []);

  const handleSourceClick = (source: string, data: any) => {
    // Trigger confetti for high performers
    if (data.trend > 50) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    // Show attribution path
    toast.custom((t) => (
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-lg">
        <div className="space-y-3">
          <div className="font-semibold text-foreground capitalize">{source} Attribution Path</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-accent/10 rounded text-accent">{source}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="px-2 py-1 bg-muted rounded">Landing Page</span>
            <ChevronRight className="w-4 h-4" />
            <span className="px-2 py-1 bg-muted rounded">Email Capture</span>
            <ChevronRight className="w-4 h-4" />
            <span className="px-2 py-1 bg-green-500/10 rounded text-green-500">Skool Join</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <strong>Top Content:</strong> {data.topContent}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>CVR: <strong className="text-foreground">{data.conversion}%</strong></span>
            <span>Revenue: <strong className="text-green-500">${data.revenue}</strong></span>
          </div>
        </div>
      </div>
    ), { duration: 6000 });
  };

  return (
    <div className="relative">
      {/* Demo Mode Banner */}
      <div className="mb-6 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 border border-accent/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                This is what YOUR dashboard will look like!
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Demo data showing real attribution insights from a successful Skool community
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
              });
              router.push('/dashboard/links/create');
            }}
            className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition flex items-center gap-2 group"
          >
            Start Tracking Real Data
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-green-500 font-medium">+23%</span>
          </div>
          <div className="text-3xl font-bold text-foreground">271</div>
          <div className="text-sm text-muted-foreground mt-1">Total Members</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-green-500 font-medium">+47%</span>
          </div>
          <div className="text-3xl font-bold text-foreground">$21,409</div>
          <div className="text-sm text-muted-foreground mt-1">Attributed Revenue</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-green-500 font-medium">85%</span>
          </div>
          <div className="text-3xl font-bold text-foreground">3.8%</div>
          <div className="text-sm text-muted-foreground mt-1">Avg Conversion Rate</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-accent font-medium">TikTok</span>
          </div>
          <div className="text-3xl font-bold text-foreground">234%</div>
          <div className="text-sm text-muted-foreground mt-1">Best Channel Growth</div>
        </div>
      </div>

      {/* Source Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(demoData).map(([source, data]) => (
          <div
            key={source}
            onClick={() => handleSourceClick(source, data)}
            onMouseEnter={() => setHoveredSource(source)}
            onMouseLeave={() => setHoveredSource(null)}
            className="bg-card border border-border rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg hover:border-accent/50 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground capitalize flex items-center gap-2">
                  {source === 'youtube' && '📹'}
                  {source === 'instagram' && '📸'}
                  {source === 'tiktok' && '🎵'}
                  {source === 'email' && '📧'}
                  {source}
                  {hoveredSource === source && (
                    <span className="text-xs text-accent opacity-0 group-hover:opacity-100 transition">
                      Click for details →
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{data.topContent}</p>
              </div>
              <div className={`flex items-center gap-1 text-sm ${data.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {data.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium">{Math.abs(data.trend)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-foreground">{data.members}</div>
                <div className="text-xs text-muted-foreground">Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">
                  ${animatedNumbers[source] || 0}
                </div>
                <div className="text-xs text-muted-foreground">Revenue</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{data.conversion}%</div>
                <div className="text-xs text-muted-foreground">CVR</div>
              </div>
            </div>

            {/* Mini chart visualization */}
            <div className="mt-4 h-16 flex items-end gap-1">
              {[65, 72, 78, 82, 79, 88, 92, 85, 91, 95].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-accent/20 rounded-t transition-all group-hover:bg-accent/30"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Tips */}
      {showInteractiveTip && (
        <div className="mt-8 bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  💡 Pro Tip: Your real dashboard will update in real-time
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Every click, every conversion, tracked automatically with 85% accuracy
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInteractiveTip(false)}
              className="text-muted-foreground hover:text-foreground transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}