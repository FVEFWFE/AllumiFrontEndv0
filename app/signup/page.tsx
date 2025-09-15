'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, TrendingUp, DollarSign, ChevronRight, ChevronLeft,
  Check, Mail, Lock, User, Eye, EyeOff, Sparkles, Target,
  BarChart3, Rocket, Globe, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const audienceSizes = [
  { 
    id: 'under-10k', 
    label: 'Under 10k',
    description: 'Just getting started',
    icon: User,
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: '10k-100k', 
    label: '10k to 100k',
    description: 'Growing audience',
    icon: Users,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: '100k-1m', 
    label: '100k to 1M',
    description: 'Established creator',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500'
  },
  { 
    id: 'over-1m', 
    label: 'Over 1M',
    description: 'Industry leader',
    icon: Rocket,
    color: 'from-emerald-500 to-green-500'
  },
];

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    audienceSize: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Capture UTM parameters
  const utmParams = {
    utm_source: searchParams.get('utm_source') || null,
    utm_medium: searchParams.get('utm_medium') || null,
    utm_campaign: searchParams.get('utm_campaign') || null,
    utm_term: searchParams.get('utm_term') || null,
    utm_content: searchParams.get('utm_content') || null,
  };

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(formData.password), text: 'One number' },
    { met: /[!@#$%^&*]/.test(formData.password), text: 'One special character' }
  ];

  const allPasswordRequirementsMet = passwordRequirements.every(req => req.met);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.audienceSize) {
      newErrors.audienceSize = 'Please select your audience size';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!allPasswordRequirementsMet) {
      newErrors.password = 'Password must meet all requirements';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setErrors({});
    } else if (step === 2) {
      // Allow skipping audience size
      setStep(3);
      setErrors({});
    }
  };

  const handleSkipAudienceSize = () => {
    setFormData({ ...formData, audienceSize: 'skipped' });
    setStep(3);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) return;

    setLoading(true);
    
    try {
      // Store signup data with UTM params
      const signupData = {
        ...formData,
        ...utmParams,
        timestamp: new Date().toISOString()
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('signupData', JSON.stringify(signupData));
        localStorage.setItem('allumi_audience_size', formData.audienceSize);
        
        // Store UTM params for attribution
        Object.entries(utmParams).forEach(([key, value]) => {
          if (value) {
            localStorage.setItem(`allumi_${key}`, value);
          }
        });
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-black to-gray-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <img src="/allumi.png" alt="Allumi" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Finally, see what
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600"> drives revenue</span>
            </h1>
            <p className="text-xl text-gray-400">
              The only community platform with built-in attribution tracking. 
              Know exactly which channels convert.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: Target, text: 'Multi-touch attribution tracking' },
              { icon: DollarSign, text: 'Save $120-$3,600/year vs Skool' },
              { icon: Globe, text: 'White-label on your domain' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-gray-300">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-white">$42k</div>
              <div className="text-sm text-gray-400">MRR to exit</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">470</div>
              <div className="text-sm text-gray-400">Customers needed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">32mo</div>
              <div className="text-sm text-gray-400">Timeline</div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-sm text-gray-500">
          © 2025 Allumi. Built to exit for $1M+ by May 2028.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                  step >= num 
                    ? "bg-emerald-600 text-white" 
                    : "bg-gray-800 text-gray-500"
                )}>
                  {step > num ? <Check className="w-5 h-5" /> : num}
                </div>
                {num < 3 && (
                  <div className={cn(
                    "w-12 h-0.5 transition-all",
                    step > num ? "bg-emerald-600" : "bg-gray-800"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* UTM Tracking Indicator */}
          {Object.values(utmParams).some(v => v) && (
            <div className="mb-4 p-2 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">
                  Attribution tracking active: {utmParams.utm_source || 'direct'}
                </span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {errors.submit && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">{errors.submit}</span>
            </div>
          )}

          {/* Step 1: Account Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
                <p className="text-gray-400">Start your 14-day free trial</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="pl-10 bg-gray-900 border-gray-800 focus:border-emerald-500"
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 bg-gray-900 border-gray-800 focus:border-emerald-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Continue
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>

              <p className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: Audience Size (SKOOL-STYLE) */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">What's your audience size?</h2>
                <p className="text-gray-400">
                  How many followers do you have on your main social media profile?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {audienceSizes.map((size) => {
                  const Icon = size.icon;
                  return (
                    <button
                      key={size.id}
                      onClick={() => setFormData({ ...formData, audienceSize: size.id })}
                      className={cn(
                        "p-6 rounded-xl border-2 transition-all text-left group",
                        formData.audienceSize === size.id
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-gray-800 hover:border-gray-700 bg-gray-900/50"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-lg bg-gradient-to-r mb-3 flex items-center justify-center",
                        size.color
                      )}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-semibold text-white mb-1">{size.label}</div>
                      <div className="text-sm text-gray-400">{size.description}</div>
                      {formData.audienceSize === size.id && (
                        <div className="mt-3 flex items-center gap-2 text-emerald-400">
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Selected</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {errors.audienceSize && (
                <p className="text-red-500 text-sm text-center">{errors.audienceSize}</p>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                >
                  <ChevronLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  disabled={!formData.audienceSize}
                >
                  Continue
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              <button 
                onClick={handleSkipAudienceSize}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-400"
              >
                I'll add this later
              </button>
            </div>
          )}

          {/* Step 3: Password & Terms */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Secure your account</h2>
                <p className="text-gray-400">Create a strong password</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 bg-gray-900 border-gray-800 focus:border-emerald-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                
                {/* Password Requirements */}
                <div className="mt-3 space-y-1">
                  {passwordRequirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {req.met ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-600" />
                      )}
                      <span className={req.met ? 'text-emerald-400' : 'text-gray-500'}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
                <h3 className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  What you're getting
                </h3>
                <ul className="space-y-1">
                  {[
                    '14-day free trial, no credit card',
                    'Full attribution tracking',
                    '40% lifetime referral commission',
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-gray-400">
                    I agree to the{' '}
                    <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">
                      Terms
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-sm">{errors.terms}</p>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1"
                  >
                    <ChevronLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Account
                        <Rocket className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}