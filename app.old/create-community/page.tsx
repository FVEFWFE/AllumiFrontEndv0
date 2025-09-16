'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Globe, DollarSign, Shield, Zap, 
  ChevronRight, ChevronLeft, Check, AlertCircle,
  Sparkles, Target, TrendingUp, Award, Lock,
  Twitter, Youtube, Instagram, Linkedin, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function CreateCommunity() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    slug: '',
    description: '',
    category: '',
    
    // Step 2: Monetization
    pricingModel: 'free',
    price: 0,
    currency: 'USD',
    trialDays: 0,
    
    // Step 3: Domain & Branding
    useCustomDomain: false,
    customDomain: '',
    primaryColor: '#10B981',
    logo: null as File | null,
    
    // Step 4: Attribution
    enableAttribution: true,
    utmTracking: true,
    conversionTracking: true,
    socialLinks: {
      twitter: '',
      youtube: '',
      instagram: '',
      linkedin: '',
    }
  });

  const categories = [
    'Business & Entrepreneurship',
    'Marketing & Sales',
    'Technology & Software',
    'Health & Fitness',
    'Personal Development',
    'Creative Arts',
    'Finance & Investing',
    'Education & Learning',
    'Community & Social',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: slug
      }));
    } else if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else if (name.startsWith('social.')) {
      const socialNetwork = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialNetwork]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateStep = () => {
    switch(step) {
      case 1:
        return formData.name && formData.slug && formData.description && formData.category;
      case 2:
        return formData.pricingModel && (formData.pricingModel === 'free' || formData.price > 0);
      case 3:
        return !formData.useCustomDomain || formData.customDomain;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 4) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('You must be logged in to create a community');
      }

      // Create community in database
      const { data: community, error: communityError } = await supabase
        .from('communities')
        .insert({
          owner_id: user.id,
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          custom_domain: formData.useCustomDomain ? formData.customDomain : null,
          settings: {
            category: formData.category,
            pricingModel: formData.pricingModel,
            price: formData.price,
            currency: formData.currency,
            trialDays: formData.trialDays,
            primaryColor: formData.primaryColor,
            enableAttribution: formData.enableAttribution,
            utmTracking: formData.utmTracking,
            conversionTracking: formData.conversionTracking,
            socialLinks: formData.socialLinks
          },
          is_published: true
        })
        .select()
        .single();

      if (communityError) throw communityError;

      // Create owner membership
      const { error: membershipError } = await supabase
        .from('memberships')
        .insert({
          user_id: user.id,
          community_id: community.id,
          role: 'owner',
          status: 'active'
        });

      if (membershipError) throw membershipError;

      console.log('Community created:', community);
      
      // Redirect to community settings
      router.push(`/c/${formData.slug}/settings`);
    } catch (error: any) {
      console.error('Error creating community:', error);
      setError(error.message || 'Failed to create community');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === step ? 'bg-emerald-500' : i < step ? 'bg-emerald-600' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Step Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            Step {step} of 4
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {step === 1 && 'Let\'s Build Your Community'}
            {step === 2 && 'Choose Your Monetization'}
            {step === 3 && 'Customize Your Brand'}
            {step === 4 && 'Set Up Attribution'}
          </h1>
          <p className="text-lg text-gray-400">
            {step === 1 && 'Start with the basics - what\'s your community about?'}
            {step === 2 && 'Free or paid? Set up how you\'ll grow revenue.'}
            {step === 3 && 'Make it yours with custom domain and branding.'}
            {step === 4 && 'Track what drives growth with Allumi\'s attribution.'}
          </p>
        </div>

        {/* Form Steps */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Community Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., The Growth Lab"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                />
                {formData.slug && (
                  <p className="mt-2 text-sm text-gray-500">
                    URL: allumi.com/c/{formData.slug}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="What's your community about? Who is it for?"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Monetization */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'free', name: 'Free', icon: Users, desc: 'Build your audience first' },
                  { id: 'paid', name: 'Paid', icon: DollarSign, desc: 'Charge for access' },
                  { id: 'freemium', name: 'Freemium', icon: Zap, desc: 'Free + paid tiers' }
                ].map(model => (
                  <button
                    key={model.id}
                    onClick={() => setFormData(prev => ({ ...prev, pricingModel: model.id }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.pricingModel === model.id
                        ? 'bg-emerald-500/10 border-emerald-500'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <model.icon className={`w-6 h-6 mb-2 ${
                      formData.pricingModel === model.id ? 'text-emerald-400' : 'text-gray-400'
                    }`} />
                    <div className="text-white font-medium">{model.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{model.desc}</div>
                  </button>
                ))}
              </div>

              {(formData.pricingModel === 'paid' || formData.pricingModel === 'freemium') && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Monthly Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="29"
                          className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Free Trial Days
                      </label>
                      <input
                        type="number"
                        name="trialDays"
                        value={formData.trialDays}
                        onChange={handleInputChange}
                        placeholder="7"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-emerald-400">You Own Your Stripe</div>
                        <div className="text-sm text-gray-300 mt-1">
                          Connect your own Stripe account. Keep 100% of your payment relationship and data.
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Domain & Branding */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="useCustomDomain"
                    checked={formData.useCustomDomain}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-white font-medium">Use Custom Domain</span>
                    <span className="text-gray-500 text-sm ml-2">(Can be added later)</span>
                  </div>
                </label>
              </div>

              {formData.useCustomDomain && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Domain
                  </label>
                  <input
                    type="text"
                    name="customDomain"
                    value={formData.customDomain}
                    onChange={handleInputChange}
                    placeholder="community.yourdomain.com"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    You'll need to add a CNAME record pointing to allumi.com
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleInputChange}
                    className="w-12 h-12 rounded-lg border border-gray-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-purple-400">No Discovery Tab</div>
                    <div className="text-sm text-gray-300 mt-1">
                      Unlike Skool, your members won't see competing communities. Build your brand, not theirs.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Attribution */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-emerald-900/20 to-purple-900/20 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-emerald-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Attribution Dashboard™</h3>
                    <p className="text-sm text-gray-400">See exactly where your revenue comes from</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">UTM</div>
                    <div className="text-xs text-gray-500">Track campaigns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">ROI</div>
                    <div className="text-xs text-gray-500">Measure returns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">AI</div>
                    <div className="text-xs text-gray-500">Get insights</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Social Links (Optional)
                </label>
                <div className="space-y-3">
                  {Object.entries({
                    twitter: Twitter,
                    youtube: Youtube,
                    instagram: Instagram,
                    linkedin: Linkedin
                  }).map(([network, Icon]) => (
                    <div key={network} className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        name={`social.${network}`}
                        value={formData.socialLinks[network as keyof typeof formData.socialLinks]}
                        onChange={handleInputChange}
                        placeholder={`https://${network}.com/yourhandle`}
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-blue-400">40% Affiliate Commission</div>
                    <div className="text-sm text-gray-300 mt-1">
                      Refer others to Allumi and earn 40% recurring commission on their subscriptions.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              step === 1
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!validateStep()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              validateStep()
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {step === 4 ? (
              <>
                Create Community
                <Check className="w-5 h-5" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}