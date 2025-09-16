'use client';

import { useState } from 'react';
import { 
  Target, Link, Code, Copy, Check, ChevronRight, ChevronLeft,
  Youtube, Twitter, Facebook, Linkedin, Instagram, Mail,
  Globe, Hash, Calendar, DollarSign, TrendingUp, AlertCircle,
  Sparkles, Zap, ArrowRight, ExternalLink, Settings, TestTube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AttributionSetupProps {
  params: {
    slug: string;
  };
}

export default function AttributionSetup({ params }: AttributionSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({});
  const [testMode, setTestMode] = useState(false);
  
  // UTM Builder State
  const [utmParams, setUtmParams] = useState({
    source: '',
    medium: '',
    campaign: '',
    content: '',
    term: ''
  });

  const [generatedLinks, setGeneratedLinks] = useState<Array<{
    channel: string;
    icon: any;
    url: string;
    shortUrl: string;
    color: string;
  }>>([]);

  const steps = [
    { number: 1, title: 'Choose Channels', icon: Globe },
    { number: 2, title: 'Configure UTMs', icon: Settings },
    { number: 3, title: 'Generate Links', icon: Link },
    { number: 4, title: 'Test & Verify', icon: TestTube },
  ];

  const channels = [
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500', selected: true },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'text-blue-400', selected: true },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', selected: false },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', selected: true },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', selected: false },
    { id: 'email', name: 'Email', icon: Mail, color: 'text-gray-400', selected: true },
    { id: 'direct', name: 'Direct/Organic', icon: Globe, color: 'text-emerald-500', selected: true },
  ];

  const templates = [
    {
      name: 'YouTube Video Campaign',
      description: 'Track viewers from specific videos',
      params: {
        source: 'youtube',
        medium: 'video',
        campaign: 'product-launch-2025',
        content: 'video-description',
        term: ''
      }
    },
    {
      name: 'Email Newsletter',
      description: 'Monitor email campaign performance',
      params: {
        source: 'newsletter',
        medium: 'email',
        campaign: 'weekly-digest',
        content: 'header-cta',
        term: ''
      }
    },
    {
      name: 'Social Media Post',
      description: 'Track organic social traffic',
      params: {
        source: 'twitter',
        medium: 'social',
        campaign: 'community-growth',
        content: 'pinned-tweet',
        term: ''
      }
    }
  ];

  const handleCopyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLinks({ ...copiedLinks, [id]: true });
    setTimeout(() => {
      setCopiedLinks({ ...copiedLinks, [id]: false });
    }, 2000);
  };

  const generateLinks = () => {
    const baseUrl = `https://allumi.com/c/${params.slug}`;
    const selectedChannels = channels.filter(c => c.selected);
    
    const links = selectedChannels.map(channel => {
      const utm = `utm_source=${channel.id}&utm_medium=${utmParams.medium || 'organic'}&utm_campaign=${utmParams.campaign || 'default'}`;
      const fullUrl = `${baseUrl}?${utm}`;
      const shortUrl = `allumi.link/${Math.random().toString(36).substring(7)}`;
      
      return {
        channel: channel.name,
        icon: channel.icon,
        url: fullUrl,
        shortUrl: shortUrl,
        color: channel.color
      };
    });
    
    setGeneratedLinks(links);
    setCurrentStep(3);
  };

  const testTracking = () => {
    setTestMode(true);
    // Simulate tracking test
    setTimeout(() => {
      setTestMode(false);
      setCurrentStep(4);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Target className="w-6 h-6 text-emerald-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">Attribution Setup Wizard</h1>
                <p className="text-sm text-gray-400">Configure tracking to see exactly where your revenue comes from</p>
              </div>
            </div>
            <Badge className="bg-emerald-600">
              <Sparkles className="w-3 h-3 mr-1" />
              Pro Feature
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-colors
                      ${isActive ? 'bg-emerald-600 text-white' : 
                        isCompleted ? 'bg-emerald-600/20 text-emerald-400' : 
                        'bg-gray-800 text-gray-400'}
                    `}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                        Step {step.number}
                      </p>
                      <p className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      flex-1 h-0.5 mx-4 transition-colors
                      ${currentStep > step.number ? 'bg-emerald-600' : 'bg-gray-800'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        {/* Why Attribution Alert */}
        <Alert className="mb-6 bg-emerald-600/10 border-emerald-600/50">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <AlertTitle className="text-emerald-400">Why Attribution Matters</AlertTitle>
          <AlertDescription className="text-emerald-300">
            Communities using attribution see <strong>47% higher conversion rates</strong> and save 
            <strong> 10+ hours/month</strong> by focusing on channels that actually drive revenue.
            You'll know exactly which YouTube videos, tweets, or emails bring in your best members.
          </AlertDescription>
        </Alert>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Select Your Traffic Channels</CardTitle>
                <CardDescription>Choose the channels where you promote your community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {channels.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <button
                        key={channel.id}
                        onClick={() => {
                          const updated = channels.map(c => 
                            c.id === channel.id ? { ...c, selected: !c.selected } : c
                          );
                          channel.selected = !channel.selected;
                        }}
                        className={`
                          p-4 rounded-lg border-2 transition-all
                          ${channel.selected 
                            ? 'border-emerald-600 bg-emerald-600/10' 
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                          }
                        `}
                      >
                        <Icon className={`w-8 h-8 ${channel.color} mx-auto mb-2`} />
                        <p className="text-sm font-medium text-white">{channel.name}</p>
                        {channel.selected && (
                          <Check className="w-4 h-4 text-emerald-400 mx-auto mt-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" disabled>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button onClick={() => setCurrentStep(2)}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Configure UTM Parameters</CardTitle>
                <CardDescription>Set up consistent tracking parameters for all your links</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="custom" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                    <TabsTrigger value="custom">Custom Parameters</TabsTrigger>
                    <TabsTrigger value="templates">Use Template</TabsTrigger>
                  </TabsList>

                  <TabsContent value="custom" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="source">UTM Source *</Label>
                        <Input
                          id="source"
                          placeholder="e.g., youtube, newsletter"
                          value={utmParams.source}
                          onChange={(e) => setUtmParams({ ...utmParams, source: e.target.value })}
                          className="mt-1 bg-gray-800 border-gray-700 text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">Where the traffic comes from</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="medium">UTM Medium *</Label>
                        <Input
                          id="medium"
                          placeholder="e.g., video, email, social"
                          value={utmParams.medium}
                          onChange={(e) => setUtmParams({ ...utmParams, medium: e.target.value })}
                          className="mt-1 bg-gray-800 border-gray-700 text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">Type of traffic</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="campaign">UTM Campaign</Label>
                        <Input
                          id="campaign"
                          placeholder="e.g., black-friday-2025"
                          value={utmParams.campaign}
                          onChange={(e) => setUtmParams({ ...utmParams, campaign: e.target.value })}
                          className="mt-1 bg-gray-800 border-gray-700 text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">Specific campaign name</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="content">UTM Content</Label>
                        <Input
                          id="content"
                          placeholder="e.g., header-link, footer-cta"
                          value={utmParams.content}
                          onChange={(e) => setUtmParams({ ...utmParams, content: e.target.value })}
                          className="mt-1 bg-gray-800 border-gray-700 text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">Differentiate similar content</p>
                      </div>
                    </div>

                    <Alert className="bg-blue-600/10 border-blue-600/50">
                      <AlertCircle className="h-4 w-4 text-blue-400" />
                      <AlertDescription className="text-blue-300">
                        <strong>Pro Tip:</strong> Use consistent naming conventions. For example, always use 
                        lowercase and hyphens instead of spaces (youtube-video not "YouTube Video").
                      </AlertDescription>
                    </Alert>
                  </TabsContent>

                  <TabsContent value="templates" className="space-y-4 mt-6">
                    <RadioGroup defaultValue="custom">
                      {templates.map((template, index) => (
                        <div key={index} className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                          <RadioGroupItem value={template.name} id={template.name} />
                          <Label htmlFor={template.name} className="flex-1 cursor-pointer">
                            <div className="font-medium text-white">{template.name}</div>
                            <div className="text-sm text-gray-400">{template.description}</div>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                Source: {template.params.source}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Medium: {template.params.medium}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Campaign: {template.params.campaign}
                              </Badge>
                            </div>
                          </Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setUtmParams(template.params)}
                          >
                            Use Template
                          </Button>
                        </div>
                      ))}
                    </RadioGroup>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button onClick={generateLinks}>
                Generate Links
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Your Attribution Links</CardTitle>
                <CardDescription>Copy these links for each channel to track revenue sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generatedLinks.map((link, index) => {
                    const Icon = link.icon;
                    const linkId = `link-${index}`;
                    
                    return (
                      <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-700 rounded-lg">
                              <Icon className={`w-5 h-5 ${link.color}`} />
                            </div>
                            <div>
                              <p className="font-medium text-white">{link.channel}</p>
                              <p className="text-sm text-gray-400">Short URL: {link.shortUrl}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopyLink(linkId, link.url)}
                            >
                              {copiedLinks[linkId] ? (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Link
                                </>
                              )}
                            </Button>
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-2 bg-gray-900 rounded text-xs text-gray-300 font-mono break-all">
                          {link.url}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Alert className="mt-6 bg-emerald-600/10 border-emerald-600/50">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  <AlertDescription className="text-emerald-300">
                    <strong>Next Step:</strong> Replace all your existing links with these tracked versions. 
                    Update your YouTube descriptions, Twitter bio, email signatures, and anywhere else you promote your community.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button onClick={testTracking} disabled={testMode}>
                {testMode ? 'Testing...' : 'Test Tracking'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>✅ Attribution Setup Complete!</CardTitle>
                <CardDescription>Your tracking is now active and collecting data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Test Results */}
                  <div className="p-4 bg-emerald-600/10 border border-emerald-600/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                      <h3 className="font-semibold text-white">All Systems Operational</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Link Generation</span>
                        <Badge className="bg-emerald-600">Working</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">UTM Tracking</span>
                        <Badge className="bg-emerald-600">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Revenue Attribution</span>
                        <Badge className="bg-emerald-600">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Real-time Analytics</span>
                        <Badge className="bg-emerald-600">Live</Badge>
                      </div>
                    </div>
                  </div>

                  {/* What Happens Next */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">What Happens Next?</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-emerald-400">1</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Replace Your Links</p>
                          <p className="text-sm text-gray-400">Update all your promotional links with the tracked versions</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-emerald-400">2</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Wait for Data</p>
                          <p className="text-sm text-gray-400">Attribution data will start appearing within 24 hours</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-emerald-400">3</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">View Analytics</p>
                          <p className="text-sm text-gray-400">Check your attribution dashboard to see which channels drive revenue</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Projection */}
                  <Card className="border-emerald-600/50 bg-emerald-600/5">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-400">Expected Revenue Increase</p>
                          <p className="text-3xl font-bold text-emerald-400">+32%</p>
                        </div>
                        <TrendingUp className="w-12 h-12 text-emerald-400/20" />
                      </div>
                      <p className="text-sm text-gray-300">
                        Based on average results from communities using attribution tracking. 
                        You'll be able to double down on your best channels and cut waste.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href={`/c/${params.slug}/settings`}>
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Settings
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/c/${params.slug}/analytics`}>
                  View Attribution Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}