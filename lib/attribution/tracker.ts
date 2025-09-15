/**
 * Allumi Attribution Tracker
 * Core client-side tracking for the platform's primary differentiator
 * Tracks user journeys, UTM parameters, and conversion events
 */

import { v4 as uuidv4 } from 'uuid';

// Attribution event types
export type AttributionEventType = 
  | 'page_view'
  | 'signup'
  | 'login'
  | 'purchase'
  | 'trial_start'
  | 'content_view'
  | 'course_start'
  | 'course_complete'
  | 'community_join'
  | 'community_create'
  | 'first_post'
  | 'first_payment';

// Attribution data structure
export interface AttributionData {
  // UTM Parameters
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  
  // Additional tracking
  referrer?: string | null;
  landing_page?: string | null;
  session_id: string;
  user_id?: string | null;
  community_id?: string | null;
  
  // Event specific
  event_type: AttributionEventType;
  revenue?: number;
  metadata?: Record<string, any>;
  
  // Technical
  ip_address?: string | null;
  user_agent?: string | null;
  timestamp: string;
}

// Cookie names for persistence
const COOKIE_NAMES = {
  UTM_SOURCE: 'allumi_utm_source',
  UTM_MEDIUM: 'allumi_utm_medium',
  UTM_CAMPAIGN: 'allumi_utm_campaign',
  UTM_TERM: 'allumi_utm_term',
  UTM_CONTENT: 'allumi_utm_content',
  REFERRER: 'allumi_initial_referrer',
  LANDING_PAGE: 'allumi_landing_page',
  SESSION_ID: 'allumi_session_id',
  FIRST_TOUCH: 'allumi_first_touch',
  LAST_TOUCH: 'allumi_last_touch',
};

// Cookie duration (30 days)
const COOKIE_DURATION = 30 * 24 * 60 * 60 * 1000;

class AttributionTracker {
  private sessionId: string;
  private userId: string | null = null;
  private communityId: string | null = null;
  private isInitialized = false;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  /**
   * Initialize the tracker (call once on app load)
   */
  public init(userId?: string, communityId?: string) {
    if (this.isInitialized) return;
    
    this.userId = userId || null;
    this.communityId = communityId || null;
    
    // Capture UTM parameters from URL
    this.captureUTMParameters();
    
    // Capture initial referrer
    this.captureReferrer();
    
    // Capture landing page
    this.captureLandingPage();
    
    // Track initial page view
    this.trackPageView();
    
    this.isInitialized = true;
  }

  /**
   * Set user ID after authentication
   */
  public setUserId(userId: string) {
    this.userId = userId;
    this.updateLastTouch();
  }

  /**
   * Set community context
   */
  public setCommunityId(communityId: string) {
    this.communityId = communityId;
  }

  /**
   * Track a page view
   */
  public trackPageView(metadata?: Record<string, any>) {
    this.track('page_view', { metadata });
  }

  /**
   * Track signup event
   */
  public trackSignup(metadata?: Record<string, any>) {
    this.track('signup', { metadata });
    this.setFirstTouch();
  }

  /**
   * Track login event
   */
  public trackLogin(metadata?: Record<string, any>) {
    this.track('login', { metadata });
  }

  /**
   * Track purchase event with revenue
   */
  public trackPurchase(revenue: number, metadata?: Record<string, any>) {
    this.track('purchase', { 
      revenue, 
      metadata: {
        ...metadata,
        conversion: true,
      }
    });
    this.updateConversionPath();
  }

  /**
   * Track trial start
   */
  public trackTrialStart(metadata?: Record<string, any>) {
    this.track('trial_start', { metadata });
  }

  /**
   * Track content view (posts, lessons, etc)
   */
  public trackContentView(contentId: string, contentType: string, metadata?: Record<string, any>) {
    this.track('content_view', { 
      metadata: {
        content_id: contentId,
        content_type: contentType,
        ...metadata,
      }
    });
  }

  /**
   * Track course interactions
   */
  public trackCourseStart(courseId: string, metadata?: Record<string, any>) {
    this.track('course_start', { 
      metadata: {
        course_id: courseId,
        ...metadata,
      }
    });
  }

  public trackCourseComplete(courseId: string, metadata?: Record<string, any>) {
    this.track('course_complete', { 
      metadata: {
        course_id: courseId,
        ...metadata,
      }
    });
  }

  /**
   * Track community interactions
   */
  public trackCommunityJoin(communityId: string, metadata?: Record<string, any>) {
    this.track('community_join', { 
      metadata: {
        community_id: communityId,
        ...metadata,
      }
    });
  }

  public trackCommunityCreate(communityId: string, metadata?: Record<string, any>) {
    this.track('community_create', { 
      metadata: {
        community_id: communityId,
        ...metadata,
      }
    });
  }

  /**
   * Track user milestones
   */
  public trackFirstPost(metadata?: Record<string, any>) {
    this.track('first_post', { 
      metadata: {
        milestone: true,
        ...metadata,
      }
    });
  }

  public trackFirstPayment(revenue: number, metadata?: Record<string, any>) {
    this.track('first_payment', { 
      revenue,
      metadata: {
        milestone: true,
        ltv_start: true,
        ...metadata,
      }
    });
  }

  /**
   * Get current attribution data
   */
  public getAttributionData(): Partial<AttributionData> {
    return {
      utm_source: this.getCookie(COOKIE_NAMES.UTM_SOURCE),
      utm_medium: this.getCookie(COOKIE_NAMES.UTM_MEDIUM),
      utm_campaign: this.getCookie(COOKIE_NAMES.UTM_CAMPAIGN),
      utm_term: this.getCookie(COOKIE_NAMES.UTM_TERM),
      utm_content: this.getCookie(COOKIE_NAMES.UTM_CONTENT),
      referrer: this.getCookie(COOKIE_NAMES.REFERRER),
      landing_page: this.getCookie(COOKIE_NAMES.LANDING_PAGE),
      session_id: this.sessionId,
      user_id: this.userId,
      community_id: this.communityId,
    };
  }

  /**
   * Get first touch attribution
   */
  public getFirstTouch(): any {
    const firstTouch = this.getCookie(COOKIE_NAMES.FIRST_TOUCH);
    return firstTouch ? JSON.parse(firstTouch) : null;
  }

  /**
   * Get last touch attribution
   */
  public getLastTouch(): any {
    const lastTouch = this.getCookie(COOKIE_NAMES.LAST_TOUCH);
    return lastTouch ? JSON.parse(lastTouch) : null;
  }

  /**
   * Clear attribution data (for testing or logout)
   */
  public clear() {
    Object.values(COOKIE_NAMES).forEach(name => {
      this.deleteCookie(name);
    });
    this.sessionId = this.getOrCreateSessionId();
    this.userId = null;
    this.communityId = null;
  }

  // Private methods

  private track(eventType: AttributionEventType, options: {
    revenue?: number;
    metadata?: Record<string, any>;
  } = {}) {
    const data: AttributionData = {
      ...this.getAttributionData(),
      event_type: eventType,
      revenue: options.revenue,
      metadata: options.metadata,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    } as AttributionData;

    // Send to API
    this.sendToAPI(data);

    // Update last touch
    this.updateLastTouch();
  }

  private async sendToAPI(data: AttributionData) {
    try {
      const response = await fetch('/api/attribution/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error('Attribution tracking failed:', response.statusText);
      }
    } catch (error) {
      console.error('Attribution tracking error:', error);
      // Store in localStorage for retry
      this.storeForRetry(data);
    }
  }

  private storeForRetry(data: AttributionData) {
    const stored = localStorage.getItem('allumi_attribution_queue');
    const queue = stored ? JSON.parse(stored) : [];
    queue.push(data);
    // Keep only last 100 events
    if (queue.length > 100) {
      queue.shift();
    }
    localStorage.setItem('allumi_attribution_queue', JSON.stringify(queue));
  }

  private captureUTMParameters() {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    
    // Capture each UTM parameter
    const utmParams = {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_term: params.get('utm_term'),
      utm_content: params.get('utm_content'),
    };

    // Store in cookies if present
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        const cookieName = COOKIE_NAMES[key.toUpperCase().replace('_', '_')];
        this.setCookie(cookieName, value);
      }
    });
  }

  private captureReferrer() {
    if (typeof document === 'undefined') return;
    
    const referrer = document.referrer;
    if (referrer && !this.getCookie(COOKIE_NAMES.REFERRER)) {
      this.setCookie(COOKIE_NAMES.REFERRER, referrer);
    }
  }

  private captureLandingPage() {
    if (typeof window === 'undefined') return;
    
    const landingPage = window.location.href;
    if (!this.getCookie(COOKIE_NAMES.LANDING_PAGE)) {
      this.setCookie(COOKIE_NAMES.LANDING_PAGE, landingPage);
    }
  }

  private setFirstTouch() {
    if (!this.getCookie(COOKIE_NAMES.FIRST_TOUCH)) {
      const touchData = {
        ...this.getAttributionData(),
        timestamp: new Date().toISOString(),
      };
      this.setCookie(COOKIE_NAMES.FIRST_TOUCH, JSON.stringify(touchData));
    }
  }

  private updateLastTouch() {
    const touchData = {
      ...this.getAttributionData(),
      timestamp: new Date().toISOString(),
    };
    this.setCookie(COOKIE_NAMES.LAST_TOUCH, JSON.stringify(touchData));
  }

  private updateConversionPath() {
    // This would ideally track the full journey
    const conversionData = {
      first_touch: this.getFirstTouch(),
      last_touch: this.getLastTouch(),
      session_count: this.getSessionCount(),
      days_to_conversion: this.getDaysToConversion(),
    };
    
    // Send conversion path to API
    this.sendToAPI({
      ...this.getAttributionData(),
      event_type: 'purchase',
      metadata: { conversion_path: conversionData },
    } as AttributionData);
  }

  private getSessionCount(): number {
    if (typeof window === 'undefined') return 1;
    const count = parseInt(localStorage.getItem('allumi_session_count') || '0');
    return count + 1;
  }

  private getDaysToConversion(): number {
    const firstTouch = this.getFirstTouch();
    if (!firstTouch) return 0;
    
    const first = new Date(firstTouch.timestamp);
    const now = new Date();
    const diff = now.getTime() - first.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private getOrCreateSessionId(): string {
    let sessionId = this.getCookie(COOKIE_NAMES.SESSION_ID);
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${uuidv4()}`;
      this.setCookie(COOKIE_NAMES.SESSION_ID, sessionId);
      
      // Increment session count (only in browser)
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const count = parseInt(localStorage.getItem('allumi_session_count') || '0');
        localStorage.setItem('allumi_session_count', String(count + 1));
      }
    }
    
    return sessionId;
  }

  // Cookie utilities

  private setCookie(name: string, value: string) {
    if (typeof document === 'undefined') return;
    
    const date = new Date();
    date.setTime(date.getTime() + COOKIE_DURATION);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    
    return null;
  }

  private deleteCookie(name: string) {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
}

// Export singleton instance
export const attributionTracker = new AttributionTracker();

// Export for use in React components
export default attributionTracker;