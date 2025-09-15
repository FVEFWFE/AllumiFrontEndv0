'use client';

import { useState } from 'react';
import { 
  Sparkles, Mail, Lock, Eye, EyeOff, 
  ChevronRight, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      if (email && password) {
        router.push('/dashboard');
      } else {
        setError('Please enter your email and password');
        setIsLoading(false);
      }
    }, 1000);
  };


  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-8 inline-block">
            <img src="/allumi.png" alt="Allumi" className="h-10 w-auto" />
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-400">
              Sign in to your account or{' '}
              <Link href="/signup" className="text-emerald-400 hover:text-emerald-300">
                create a new one
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  Sign in
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel - Marketing */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-900/20 to-purple-900/20 items-center justify-center px-8 py-12">
        <div className="max-w-md">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              Save $120-$600+/year vs Skool
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              See What Drives Revenue
            </h2>
            <p className="text-lg text-gray-300">
              The only community platform with full attribution tracking. Know exactly where every member and dollar comes from.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-medium">Attribution Dashboard™</div>
                <div className="text-sm text-gray-400">Track UTMs, ROI, and conversion sources</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-medium">Your Custom Domain</div>
                <div className="text-sm text-gray-400">Build your brand, not ours</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-medium">No Discovery Page</div>
                <div className="text-sm text-gray-400">Keep members focused on your content</div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-900/50 rounded-lg border border-gray-800">
            <blockquote className="text-gray-300 italic">
              "Attribution showed me YouTube drives 3x more revenue than Instagram. I was wasting $2K/month on the wrong channels."
            </blockquote>
            <div className="mt-3 text-sm">
              <div className="text-white font-medium">Sarah Chen</div>
              <div className="text-gray-500">1,200+ member community</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}