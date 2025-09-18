/**
 * PostHog Event Tracking for Allumi
 * Comprehensive analytics for attribution tracking
 */

import { PostHog } from 'posthog-node';

// Event names as constants to avoid typos
export const EVENTS = {
  // Link events
  LINK_CREATED: 'link_created',
  LINK_CLICKED: 'link_clicked',
  LINK_SHARED: 'link_shared',
  
  // Attribution events
  ATTRIBUTION_CALCULATED: 'attribution_calculated',
  ATTRIBUTION_UPDATED: 'attribution_updated',
  MULTI_TOUCH_IDENTIFIED: 'multi_touch_identified',
  
  // Conversion events
  VISITOR_IDENTIFIED: 'visitor_identified',
  TRIAL_STARTED: 'trial_started',
  TRIAL_CONVERTED: 'trial_converted',
  PAYMENT_RECEIVED: 'payment_received',
  SKOOL_MEMBER_JOINED: 'skool_member_joined',
  
  // Whale tracking
  WHALE_VISITED: 'whale_visited',
  WHALE_ENGAGED: 'whale_engaged',
  WHALE_CONTACTED: 'whale_contacted',
  WHALE_RESPONDED: 'whale_responded',
  WHALE_CONVERTED: 'whale_converted',
  
  // User actions
  DASHBOARD_VIEWED: 'dashboard_viewed',
  REPORT_GENERATED: 'report_generated',
  INTEGRATION_CONNECTED: 'integration_connected',
  WEBHOOK_RECEIVED: 'webhook_received',
  
  // Performance metrics
  PAGE_LOAD_TIME: 'page_load_time',
  API_RESPONSE_TIME: 'api_response_time',
  ATTRIBUTION_CALCULATION_TIME: 'attribution_calculation_time',
} as const;

// User properties for identification
export interface UserProperties {
  email?: string;
  name?: string;
  company?: string;
  skool_group_url?: string;
  mrr?: number;
  plan?: 'trial' | 'starter' | 'growth' | 'enterprise';
  whale_tier?: 1 | 2 | 3;
  signup_date?: string;
  lifetime_value?: number;
  total_links_created?: number;
  total_clicks_tracked?: number;
  total_conversions?: number;
}

// Event properties interfaces
export interface LinkEventProperties {
  link_id: string;
  short_id: string;
  destination_url: string;
  campaign_name?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface AttributionEventProperties {
  attribution_id: string;
  model: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'u_shaped';
  confidence_score: number;
  touchpoints_count: number;
  days_to_conversion?: number;
  channels_involved: string[];
  primary_channel?: string;
  revenue_attributed?: number;
}

export interface ConversionEventProperties {
  conversion_id: string;
  conversion_type: 'trial' | 'paid' | 'skool_join';
  revenue?: number;
  attribution_data?: any;
  source_link_id?: string;
  time_to_convert?: number; // in seconds
  device_type?: string;
  referrer?: string;
}

export interface WhaleEventProperties {
  whale_id: string;
  whale_name: string;
  whale_tier: 1 | 2 | 3;
  mrr: number;
  community_size?: number;
  engagement_type?: 'dm' | 'email' | 'linkedin' | 'comment';
  message_template_used?: string;
  response_time?: number; // in hours
}

/**
 * Enhanced PostHog client with Allumi-specific methods
 */
export class AllumiAnalytics {
  private posthog: PostHog | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize PostHog client
   */
  private initialize() {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

    if (!apiKey) {
      console.warn('PostHog API key not found. Analytics disabled.');
      return;
    }

    try {
      this.posthog = new PostHog(apiKey, {
        host,
        flushAt: 20,
        flushInterval: 10000, // 10 seconds
      });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize PostHog:', error);
    }
  }

  /**
   * Track a custom event
   */
  track(eventName: string, properties?: Record<string, any>, distinctId?: string) {
    if (!this.isInitialized || !this.posthog) return;

    try {
      this.posthog.capture({
        distinctId: distinctId || 'anonymous',
        event: eventName,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          $current_url: typeof window !== 'undefined' ? window.location.href : undefined,
          $referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        }
      });
    } catch (error) {
      console.error(`Failed to track event ${eventName}:`, error);
    }
  }

  /**
   * Identify a user
   */
  identify(distinctId: string, properties?: UserProperties) {
    if (!this.isInitialized || !this.posthog) return;

    try {
      this.posthog.identify({
        distinctId,
        properties: properties as any,
      });
    } catch (error) {
      console.error('Failed to identify user:', error);
    }
  }

  /**
   * Track link creation
   */
  trackLinkCreated(properties: LinkEventProperties, userId: string) {
    this.track(EVENTS.LINK_CREATED, properties, userId);
  }

  /**
   * Track link click with attribution data
   */
  trackLinkClicked(properties: LinkEventProperties & {
    visitor_id?: string;
    device_fingerprint?: string;
    ip_address?: string;
    user_agent?: string;
  }, visitorId?: string) {
    this.track(EVENTS.LINK_CLICKED, properties, visitorId);
  }

  /**
   * Track attribution calculation
   */
  trackAttributionCalculated(properties: AttributionEventProperties, userId: string) {
    this.track(EVENTS.ATTRIBUTION_CALCULATED, {
      ...properties,
      $revenue: properties.revenue_attributed,
    }, userId);
  }

  /**
   * Track whale engagement
   */
  trackWhaleEngagement(
    eventType: 'visited' | 'engaged' | 'contacted' | 'responded' | 'converted',
    properties: WhaleEventProperties
  ) {
    const eventMap = {
      visited: EVENTS.WHALE_VISITED,
      engaged: EVENTS.WHALE_ENGAGED,
      contacted: EVENTS.WHALE_CONTACTED,
      responded: EVENTS.WHALE_RESPONDED,
      converted: EVENTS.WHALE_CONVERTED,
    };

    this.track(eventMap[eventType], {
      ...properties,
      whale_value: properties.mrr * 12, // Annual value
    }, properties.whale_id);

    // Set whale as identified user if converted
    if (eventType === 'converted') {
      this.identify(properties.whale_id, {
        whale_tier: properties.whale_tier,
        mrr: properties.mrr,
      });
    }
  }

  /**
   * Track conversion with full attribution
   */
  trackConversion(properties: ConversionEventProperties, userId: string) {
    const eventMap = {
      trial: EVENTS.TRIAL_STARTED,
      paid: EVENTS.PAYMENT_RECEIVED,
      skool_join: EVENTS.SKOOL_MEMBER_JOINED,
    };

    this.track(eventMap[properties.conversion_type], {
      ...properties,
      $revenue: properties.revenue,
    }, userId);
  }

  /**
   * Track page performance
   */
  trackPagePerformance(loadTime: number, pageName: string) {
    this.track(EVENTS.PAGE_LOAD_TIME, {
      load_time_ms: loadTime,
      page_name: pageName,
      performance_rating: loadTime < 1000 ? 'fast' : loadTime < 3000 ? 'moderate' : 'slow',
    });
  }

  /**
   * Create funnel for whale conversion
   */
  trackWhaleFunnel(stage: 'awareness' | 'interest' | 'consideration' | 'intent' | 'purchase', whaleProperties: WhaleEventProperties) {
    this.track(`whale_funnel_${stage}`, {
      ...whaleProperties,
      funnel_stage: stage,
      potential_value: whaleProperties.mrr * 12,
    }, whaleProperties.whale_id);
  }

  /**
   * Batch track multiple events
   */
  batchTrack(events: Array<{
    eventName: string;
    properties?: Record<string, any>;
    distinctId?: string;
  }>) {
    events.forEach(event => {
      this.track(event.eventName, event.properties, event.distinctId);
    });
  }

  /**
   * Flush events immediately
   */
  async flush() {
    if (!this.isInitialized || !this.posthog) return;
    
    try {
      await this.posthog.flush();
    } catch (error) {
      console.error('Failed to flush PostHog events:', error);
    }
  }

  /**
   * Shutdown analytics (call on app termination)
   */
  async shutdown() {
    if (!this.isInitialized || !this.posthog) return;
    
    try {
      await this.posthog.shutdown();
    } catch (error) {
      console.error('Failed to shutdown PostHog:', error);
    }
  }
}

// Singleton instance
let analyticsInstance: AllumiAnalytics | null = null;

export function getAnalytics(): AllumiAnalytics {
  if (!analyticsInstance) {
    analyticsInstance = new AllumiAnalytics();
  }
  return analyticsInstance;
}

// React hook for analytics
export function useAnalytics() {
  return getAnalytics();
}

// Server-side tracking helper
export async function trackServerEvent(
  eventName: string,
  properties?: Record<string, any>,
  distinctId: string = 'server'
) {
  const analytics = getAnalytics();
  analytics.track(eventName, properties, distinctId);
  await analytics.flush();
}