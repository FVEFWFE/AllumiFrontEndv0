'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CreditCard, Lock, Shield, Check, Loader2, 
  ArrowLeft, ArrowRight, AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Steps in checkout process
const checkoutSteps = [
  { id: 'account', label: 'Account', icon: '1' },
  { id: 'payment', label: 'Payment', icon: '2' },
  { id: 'confirm', label: 'Confirm', icon: '3' },
];

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState('account');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    // Account
    email: '',
    password: '',
    confirmPassword: '',
    // Payment handled by Whop
    // Terms
    agreeToTerms: false,
    subscribeNewsletter: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Get plan from URL
  const planId = searchParams.get('plan') || 'monthly';
  const productId = searchParams.get('product');
  
  // Mock plan data - would come from API
  const planDetails = {
    monthly: {
      name: 'Monthly Membership',
      price: '$49',
      period: '/month',
      description: 'Full access, billed monthly',
      whopProductId: 'prod_growth_monthly',
    },
    annual: {
      name: 'Annual Membership',
      price: '$470',
      period: '/year',
      originalPrice: '$588',
      savings: 'Save $118',
      description: 'Best value with annual billing',
      whopProductId: 'prod_growth_annual',
    },
  }[planId] || {
    name: 'Monthly Membership',
    price: '$49',
    period: '/month',
    description: 'Full access, billed monthly',
    whopProductId: 'prod_growth_monthly',
  };

  // Community data - would come from API
  const communityData = {
    name: 'Growth Lab',
    logo: 'https://i.pravatar.cc/150?img=20',
  };

  const validateAccount = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAccount()) {
      // In production, would create account first
      setCurrentStep('payment');
    }
  };

  const handleWhopCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // In production, you would:
      // 1. Create user account in your database
      // 2. Generate a Whop checkout session
      // 3. Redirect to Whop checkout with session ID
      
      // For now, simulate redirect to Whop
      const whopCheckoutUrl = `https://whop.com/checkout/${planDetails.whopProductId}`;
      const checkoutParams = new URLSearchParams({
        email: formData.email,
        community: params.slug,
        return_url: `${window.location.origin}/c/${params.slug}/welcome`,
        cancel_url: `${window.location.origin}/c/${params.slug}/pricing`,
      });
      
      // Redirect to Whop checkout
      window.location.href = `${whopCheckoutUrl}?${checkoutParams}`;
    } catch (error) {
      console.error('Checkout error:', error);
      setErrors({ submit: 'Failed to process checkout. Please try again.' });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/c/${params.slug}/pricing`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to pricing
          </Link>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="h-4 w-4" />
            Secure Checkout
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {checkoutSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    currentStep === step.id
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : checkoutSteps.findIndex(s => s.id === currentStep) > index
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-500"
                      : "border-gray-700 bg-gray-800 text-gray-500"
                  )}
                >
                  {checkoutSteps.findIndex(s => s.id === currentStep) > index ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="ml-2">
                  <div className={cn(
                    "text-sm font-medium",
                    currentStep === step.id ? "text-white" : "text-gray-500"
                  )}>
                    {step.label}
                  </div>
                </div>
                {index < checkoutSteps.length - 1 && (
                  <div className="mx-4 h-px w-16 bg-gray-700" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 'account' && (
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Create Your Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAccountSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="you@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-gray-300">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="At least 8 characters"
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="text-gray-300">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Confirm your password"
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.subscribeNewsletter}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, subscribeNewsletter: checked as boolean })
                        }
                      />
                      <Label htmlFor="newsletter" className="text-sm text-gray-400">
                        Send me updates and community news
                      </Label>
                    </div>

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Continue to Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <p className="text-center text-sm text-gray-500">
                      Already have an account?{' '}
                      <Link href="/login" className="text-emerald-500 hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}

            {currentStep === 'payment' && (
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Payment via Whop</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Whop Info */}
                  <div className="rounded-lg bg-gray-800/50 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="h-5 w-5 text-emerald-500" />
                      <span className="font-medium text-white">Secure Checkout with Whop</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      You'll be redirected to Whop's secure checkout to complete your payment. 
                      Whop handles all payment processing and keeps your information safe.
                    </p>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-500" />
                        PCI compliant payment processing
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-500" />
                        Supports all major credit cards
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-500" />
                        Apple Pay & Google Pay available
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, agreeToTerms: checked as boolean })
                        }
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-400">
                        I agree to the{' '}
                        <Link href="/terms" className="text-emerald-500 hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-emerald-500 hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {errors.terms && (
                      <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleWhopCheckout}
                      disabled={!formData.agreeToTerms || isProcessing}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Continue to Whop Checkout
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => setCurrentStep('account')}
                      className="w-full"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Account
                    </Button>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Lock className="h-3 w-3" />
                      SSL Encrypted
                    </div>
                    <div className="text-xs text-gray-500">
                      Powered by Whop
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Community */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                  <Image
                    src={communityData.logo}
                    alt={communityData.name}
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                  <div>
                    <div className="font-medium text-white">{communityData.name}</div>
                    <div className="text-sm text-gray-500">Community Access</div>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Plan</span>
                    <span className="text-white">{planDetails.name}</span>
                  </div>
                  
                  {planDetails.originalPrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Original Price</span>
                      <span className="text-gray-500 line-through">
                        {planDetails.originalPrice}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-400">Price</span>
                    <span className="text-white font-medium">
                      {planDetails.price}{planDetails.period}
                    </span>
                  </div>

                  {planDetails.savings && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Savings</span>
                      <Badge className="bg-emerald-600">{planDetails.savings}</Badge>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-medium text-white">Total Due Today</span>
                    <span className="text-2xl font-bold text-emerald-500">
                      {planDetails.price}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {planDetails.period === '/month' 
                      ? 'Recurring monthly. Cancel anytime.'
                      : 'Recurring annually. Cancel anytime.'}
                  </p>
                </div>

                {/* Guarantees */}
                <div className="space-y-2 pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-emerald-500" />
                    30-day money back guarantee
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Instant access after payment
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Attribution dashboard included
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}