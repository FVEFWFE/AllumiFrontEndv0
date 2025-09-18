'use client';

import { useState } from 'react';
import { 
  CreditCard, Download, ChevronRight, AlertCircle,
  CheckCircle, Calendar, DollarSign, TrendingUp,
  FileText, Shield, Zap, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function BillingSettings() {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  // Mock subscription data
  const subscription = {
    plan: 'Allumi Pro',
    status: 'active',
    price: 89,
    billingCycle: 'monthly',
    nextBillingDate: '2025-10-14',
    memberSince: '2025-09-14',
    savedVsSkool: 120,
    totalSaved: 360,
    usage: {
      communities: { used: 3, limit: 10 },
      members: { used: 1859, limit: 10000 },
      storage: { used: 2.4, limit: 100 }, // GB
      videoHours: { used: 12, limit: 500 },
    }
  };

  const invoices = [
    { id: 'INV-2025-003', date: '2025-09-14', amount: 89, status: 'paid' },
    { id: 'INV-2025-002', date: '2025-08-14', amount: 89, status: 'paid' },
    { id: 'INV-2025-001', date: '2025-07-14', amount: 89, status: 'paid' },
  ];

  const paymentMethod = {
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2028
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 49,
      features: [
        '1 Community',
        'Up to 100 members',
        'Basic attribution',
        '10 GB storage',
        'Email support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 89,
      current: true,
      features: [
        '10 Communities',
        'Up to 10,000 members',
        'Advanced attribution',
        '100 GB storage',
        'Priority support',
        'Custom domain',
        'API access'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      features: [
        'Unlimited communities',
        'Unlimited members',
        'Enterprise attribution',
        '1 TB storage',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'Advanced security'
      ]
    }
  ];

  return (
    <div className="p-6 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Billing & Subscription</h2>
        <p className="text-gray-400">Manage your subscription and payment methods</p>
      </div>

      {/* Savings Alert */}
      <Alert className="mb-6 bg-emerald-600/20 border-emerald-600">
        <TrendingUp className="h-4 w-4 text-emerald-400" />
        <AlertTitle className="text-emerald-400">You're saving money!</AlertTitle>
        <AlertDescription className="text-emerald-300">
          You've saved ${subscription.totalSaved} compared to Skool since joining. 
          That's ${subscription.savedVsSkool}/month in your pocket!
        </AlertDescription>
      </Alert>

      {/* Current Plan */}
      <Card className="border-gray-800 bg-gray-900/50 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription details</CardDescription>
            </div>
            <Badge className="bg-emerald-600">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-600/20 rounded-lg">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">{subscription.plan}</div>
                  <div className="text-sm text-gray-400">
                    ${subscription.price}/month • Billed {subscription.billingCycle}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Next billing date</div>
                <div className="text-white font-medium">{subscription.nextBillingDate}</div>
              </div>
            </div>

            {/* Usage */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-400">Current Usage</h4>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">Communities</span>
                    <span className="text-sm text-gray-400">
                      {subscription.usage.communities.used} / {subscription.usage.communities.limit}
                    </span>
                  </div>
                  <Progress 
                    value={(subscription.usage.communities.used / subscription.usage.communities.limit) * 100} 
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">Total Members</span>
                    <span className="text-sm text-gray-400">
                      {subscription.usage.members.used.toLocaleString()} / {subscription.usage.members.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={(subscription.usage.members.used / subscription.usage.members.limit) * 100} 
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">Storage</span>
                    <span className="text-sm text-gray-400">
                      {subscription.usage.storage.used} GB / {subscription.usage.storage.limit} GB
                    </span>
                  </div>
                  <Progress 
                    value={(subscription.usage.storage.used / subscription.usage.storage.limit) * 100} 
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">Video Hours</span>
                    <span className="text-sm text-gray-400">
                      {subscription.usage.videoHours.used} / {subscription.usage.videoHours.limit} hours
                    </span>
                  </div>
                  <Progress 
                    value={(subscription.usage.videoHours.used / subscription.usage.videoHours.limit) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Change Plan</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">Change Your Plan</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Select a plan that best fits your needs
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                      {plans.map((plan) => (
                        <div key={plan.id} className="relative">
                          <RadioGroupItem
                            value={plan.id}
                            id={plan.id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={plan.id}
                            className={`
                              flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer
                              ${plan.current 
                                ? 'border-emerald-600 bg-emerald-600/10' 
                                : 'border-gray-700 hover:border-gray-600'
                              }
                              peer-checked:border-emerald-500 peer-checked:bg-emerald-600/20
                            `}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{plan.name}</span>
                                {plan.current && (
                                  <Badge className="bg-emerald-600">Current</Badge>
                                )}
                              </div>
                              <div className="text-2xl font-bold text-white mt-1">
                                ${plan.price}<span className="text-sm font-normal text-gray-400">/month</span>
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Confirm Change</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                onClick={() => setShowCancelDialog(true)}
              >
                Cancel Subscription
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="border-gray-800 bg-gray-900/50 mb-6">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Your default payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-700 rounded-lg">
                <CreditCard className="w-6 h-6 text-gray-300" />
              </div>
              <div>
                <div className="font-medium text-white">
                  {paymentMethod.brand} •••• {paymentMethod.last4}
                </div>
                <div className="text-sm text-gray-400">
                  Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
          <Button variant="outline" className="w-full mt-4">
            <CreditCard className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="border-gray-800 bg-gray-900/50 mb-6">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-white">{invoice.id}</div>
                    <div className="text-sm text-gray-400">{invoice.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium text-white">${invoice.amount}</div>
                    <Badge className="bg-emerald-600/20 text-emerald-400">
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Invoices
          </Button>
        </CardContent>
      </Card>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Cancel Subscription?</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to cancel your subscription? You'll lose access to:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <div className="flex items-center gap-2 text-gray-300">
              <X className="w-4 h-4 text-red-400" />
              <span>Advanced attribution tracking</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <X className="w-4 h-4 text-red-400" />
              <span>Custom domains for your communities</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <X className="w-4 h-4 text-red-400" />
              <span>Priority support</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <X className="w-4 h-4 text-red-400" />
              <span>API access</span>
            </div>
          </div>
          <Alert className="bg-yellow-900/20 border-yellow-600">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              Your subscription will remain active until {subscription.nextBillingDate}
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Subscription
            </Button>
            <Button variant="destructive">
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}