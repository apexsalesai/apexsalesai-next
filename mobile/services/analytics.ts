/**
 * Analytics Service
 *
 * This service provides analytics and crash reporting integration.
 * Configure your analytics provider credentials in the respective dashboards.
 *
 * Supported providers:
 * - Mixpanel (recommended for product analytics)
 * - Amplitude (recommended for user behavior)
 * - Segment (recommended for multi-platform)
 * - Sentry (recommended for crash reporting)
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

interface UserProperties {
  userId?: string;
  [key: string]: any;
}

class AnalyticsService {
  private enabled: boolean = false;
  private userId: string | null = null;

  /**
   * Initialize analytics services
   *
   * @param apiKeys - API keys for analytics providers
   *
   * Example usage:
   * ```
   * analytics.init({
   *   mixpanel: 'YOUR_MIXPANEL_TOKEN',
   *   sentry: 'YOUR_SENTRY_DSN',
   * });
   * ```
   */
  init(apiKeys?: {
    mixpanel?: string;
    amplitude?: string;
    segment?: string;
    sentry?: string;
  }): void {
    if (!apiKeys || Object.keys(apiKeys).length === 0) {
      console.log('[Analytics] No API keys provided - running in development mode');
      this.enabled = false;
      return;
    }

    // TODO: Initialize actual analytics SDKs here
    // Example for Mixpanel:
    // if (apiKeys.mixpanel) {
    //   Mixpanel.initialize(apiKeys.mixpanel);
    // }

    // Example for Sentry:
    // if (apiKeys.sentry) {
    //   Sentry.init({
    //     dsn: apiKeys.sentry,
    //     enableInExpoDevelopment: false,
    //     debug: __DEV__,
    //   });
    // }

    this.enabled = true;
    console.log('[Analytics] Initialized');
  }

  /**
   * Track an event
   *
   * @param event - Event name and properties
   *
   * Example:
   * ```
   * analytics.track({
   *   name: 'Claim Verified',
   *   properties: {
   *     verdict: 'Accurate',
   *     confidence: 95,
   *     claimLength: 120
   *   }
   * });
   * ```
   */
  track(event: AnalyticsEvent): void {
    if (!this.enabled) {
      console.log('[Analytics] Track:', event.name, event.properties);
      return;
    }

    // TODO: Send to actual analytics provider
    // Mixpanel.track(event.name, event.properties);
    // Amplitude.logEvent(event.name, event.properties);
    // Analytics.track(event.name, event.properties); // Segment
  }

  /**
   * Identify a user
   *
   * @param userId - Unique user identifier
   * @param properties - User properties
   *
   * Example:
   * ```
   * analytics.identify('user123', {
   *   email: 'user@example.com',
   *   plan: 'free'
   * });
   * ```
   */
  identify(userId: string, properties?: UserProperties): void {
    this.userId = userId;

    if (!this.enabled) {
      console.log('[Analytics] Identify:', userId, properties);
      return;
    }

    // TODO: Send to actual analytics provider
    // Mixpanel.identify(userId);
    // Mixpanel.getPeople().set(properties);
    // Amplitude.setUserId(userId);
    // Amplitude.setUserProperties(properties);
  }

  /**
   * Track a screen view
   *
   * @param screenName - Name of the screen
   * @param properties - Additional properties
   *
   * Example:
   * ```
   * analytics.screen('Home', { source: 'deep_link' });
   * ```
   */
  screen(screenName: string, properties?: Record<string, any>): void {
    this.track({
      name: 'Screen Viewed',
      properties: {
        screen: screenName,
        ...properties,
      },
    });
  }

  /**
   * Log an error
   *
   * @param error - Error object or message
   * @param context - Additional context
   *
   * Example:
   * ```
   * analytics.error(new Error('API failed'), {
   *   endpoint: '/api/verify',
   *   statusCode: 500
   * });
   * ```
   */
  error(error: Error | string, context?: Record<string, any>): void {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;

    console.error('[Analytics] Error:', errorMessage, context);

    if (!this.enabled) {
      return;
    }

    // TODO: Send to crash reporting provider
    // Sentry.captureException(error, {
    //   contexts: { extra: context }
    // });

    // Also track as event
    this.track({
      name: 'Error Occurred',
      properties: {
        error: errorMessage,
        ...context,
      },
    });
  }

  /**
   * Set user properties
   *
   * @param properties - User properties to set
   *
   * Example:
   * ```
   * analytics.setUserProperties({
   *   verificationsCount: 10,
   *   lastActive: new Date().toISOString()
   * });
   * ```
   */
  setUserProperties(properties: UserProperties): void {
    if (!this.enabled) {
      console.log('[Analytics] Set user properties:', properties);
      return;
    }

    // TODO: Send to analytics provider
    // Mixpanel.getPeople().set(properties);
    // Amplitude.setUserProperties(properties);
  }

  /**
   * Reset analytics (e.g., on logout)
   */
  reset(): void {
    this.userId = null;

    if (!this.enabled) {
      console.log('[Analytics] Reset');
      return;
    }

    // TODO: Reset analytics providers
    // Mixpanel.reset();
    // Amplitude.regenerateDeviceId();
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Predefined events for Echo Breaker
export const AnalyticsEvents = {
  APP_OPENED: 'App Opened',
  CLAIM_SUBMITTED: 'Claim Submitted',
  VERIFICATION_SUCCESS: 'Verification Success',
  VERIFICATION_FAILED: 'Verification Failed',
  RESULT_SHARED: 'Result Shared',
  SOURCE_CLICKED: 'Source Clicked',
  PRESET_USED: 'Preset Used',
  CACHE_HIT: 'Cache Hit',
  OFFLINE_MODE: 'Offline Mode',
  ERROR_DISPLAYED: 'Error Displayed',
};
