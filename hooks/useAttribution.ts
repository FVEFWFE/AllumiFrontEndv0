import { useEffect, useCallback, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import attributionTracker from '@/lib/attribution/tracker';

/**
 * Hook to initialize attribution tracking
 */
export function useAttributionInit(userId?: string, communityId?: string) {
  useEffect(() => {
    attributionTracker.init(userId, communityId);
    
    // Update user ID when it changes
    if (userId) {
      attributionTracker.setUserId(userId);
    }
    
    // Update community ID when it changes
    if (communityId) {
      attributionTracker.setCommunityId(communityId);
    }
  }, [userId, communityId]);
}

/**
 * Hook to track page views automatically
 */
export function usePageTracking(metadata?: Record<string, any>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Track page view on route change
    attributionTracker.trackPageView({
      ...metadata,
      path: pathname,
      query: Object.fromEntries(searchParams.entries()),
    });
  }, [pathname, searchParams, metadata]);
}

/**
 * Hook to get attribution tracking functions
 */
export function useAttribution() {
  const [attributionData, setAttributionData] = useState(() => 
    attributionTracker.getAttributionData()
  );
  
  // Refresh attribution data
  const refreshAttributionData = useCallback(() => {
    setAttributionData(attributionTracker.getAttributionData());
  }, []);
  
  // Track signup
  const trackSignup = useCallback((metadata?: Record<string, any>) => {
    attributionTracker.trackSignup(metadata);
    refreshAttributionData();
  }, [refreshAttributionData]);
  
  // Track login
  const trackLogin = useCallback((metadata?: Record<string, any>) => {
    attributionTracker.trackLogin(metadata);
    refreshAttributionData();
  }, [refreshAttributionData]);
  
  // Track purchase
  const trackPurchase = useCallback((revenue: number, metadata?: Record<string, any>) => {
    attributionTracker.trackPurchase(revenue, metadata);
    refreshAttributionData();
  }, [refreshAttributionData]);
  
  // Track trial start
  const trackTrialStart = useCallback((metadata?: Record<string, any>) => {
    attributionTracker.trackTrialStart(metadata);
    refreshAttributionData();
  }, [refreshAttributionData]);
  
  // Track content view
  const trackContentView = useCallback((
    contentId: string, 
    contentType: string, 
    metadata?: Record<string, any>
  ) => {
    attributionTracker.trackContentView(contentId, contentType, metadata);
  }, []);
  
  // Track course events
  const trackCourseStart = useCallback((courseId: string, metadata?: Record<string, any>) => {
    attributionTracker.trackCourseStart(courseId, metadata);
  }, []);
  
  const trackCourseComplete = useCallback((courseId: string, metadata?: Record<string, any>) => {
    attributionTracker.trackCourseComplete(courseId, metadata);
  }, []);
  
  // Track community events
  const trackCommunityJoin = useCallback((communityId: string, metadata?: Record<string, any>) => {
    attributionTracker.trackCommunityJoin(communityId, metadata);
    refreshAttributionData();
  }, [refreshAttributionData]);
  
  const trackCommunityCreate = useCallback((communityId: string, metadata?: Record<string, any>) => {
    attributionTracker.trackCommunityCreate(communityId, metadata);
    refreshAttributionData();
  }, [refreshAttributionData]);
  
  // Track milestones
  const trackFirstPost = useCallback((metadata?: Record<string, any>) => {
    attributionTracker.trackFirstPost(metadata);
  }, []);
  
  const trackFirstPayment = useCallback((revenue: number, metadata?: Record<string, any>) => {
    attributionTracker.trackFirstPayment(revenue, metadata);
    refreshAttributionData();
  }, [refreshAttributionData]);
  
  // Get attribution info
  const getFirstTouch = useCallback(() => {
    return attributionTracker.getFirstTouch();
  }, []);
  
  const getLastTouch = useCallback(() => {
    return attributionTracker.getLastTouch();
  }, []);
  
  // Clear attribution (for testing or logout)
  const clearAttribution = useCallback(() => {
    attributionTracker.clear();
    refreshAttributionData();
  }, [refreshAttributionData]);
  
  return {
    // Current attribution data
    attributionData,
    
    // Tracking functions
    trackSignup,
    trackLogin,
    trackPurchase,
    trackTrialStart,
    trackContentView,
    trackCourseStart,
    trackCourseComplete,
    trackCommunityJoin,
    trackCommunityCreate,
    trackFirstPost,
    trackFirstPayment,
    
    // Attribution info
    getFirstTouch,
    getLastTouch,
    
    // Utilities
    clearAttribution,
    refreshAttributionData,
  };
}

/**
 * Hook to track conversion events
 */
export function useConversionTracking() {
  const { trackPurchase, trackTrialStart, trackSignup } = useAttribution();
  
  const trackConversion = useCallback((
    type: 'purchase' | 'trial' | 'signup',
    value?: number,
    metadata?: Record<string, any>
  ) => {
    switch (type) {
      case 'purchase':
        if (value) {
          trackPurchase(value, metadata);
        }
        break;
      case 'trial':
        trackTrialStart(metadata);
        break;
      case 'signup':
        trackSignup(metadata);
        break;
    }
    
    // Also send to any third-party analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: process.env.NEXT_PUBLIC_GA_ID,
        value: value || 0,
        currency: 'USD',
        conversion_type: type,
        ...metadata,
      });
    }
  }, [trackPurchase, trackTrialStart, trackSignup]);
  
  return { trackConversion };
}

/**
 * Hook to get UTM parameters
 */
export function useUTMParams() {
  const searchParams = useSearchParams();
  const [utmParams, setUtmParams] = useState<Record<string, string | null>>({});
  
  useEffect(() => {
    const params = {
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_term: searchParams.get('utm_term'),
      utm_content: searchParams.get('utm_content'),
    };
    
    // Filter out null values
    const filtered = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    setUtmParams(filtered);
  }, [searchParams]);
  
  return utmParams;
}

/**
 * Hook to track element visibility (for content engagement)
 */
export function useVisibilityTracking(
  elementId: string,
  contentType: string,
  threshold = 0.5,
  metadata?: Record<string, any>
) {
  const { trackContentView } = useAttribution();
  const [hasTracked, setHasTracked] = useState(false);
  
  useEffect(() => {
    if (hasTracked) return;
    
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            trackContentView(elementId, contentType, {
              ...metadata,
              visibility_threshold: threshold,
              time_visible: entry.time,
            });
            setHasTracked(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [elementId, contentType, threshold, metadata, hasTracked, trackContentView]);
  
  return hasTracked;
}

/**
 * Hook for A/B testing with attribution
 */
export function useABTest(testName: string, variants: string[]) {
  const [variant, setVariant] = useState<string>('');
  
  useEffect(() => {
    // Get or assign variant
    const storageKey = `ab_test_${testName}`;
    let assignedVariant = localStorage.getItem(storageKey);
    
    if (!assignedVariant) {
      // Randomly assign variant
      assignedVariant = variants[Math.floor(Math.random() * variants.length)];
      localStorage.setItem(storageKey, assignedVariant);
      
      // Track assignment
      attributionTracker.trackPageView({
        ab_test: testName,
        ab_variant: assignedVariant,
      });
    }
    
    setVariant(assignedVariant);
  }, [testName, variants]);
  
  return variant;
}