import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Release tracking
    environment: process.env.NODE_ENV,

    // Only send errors in production
    enabled: process.env.NODE_ENV === "production",

    // Integrations
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
      Sentry.browserTracingIntegration(),
    ],

    // Filtering
    beforeSend(event, hint) {
      // Filter out non-error events in development
      if (process.env.NODE_ENV === "development") {
        if (event.level !== "error") {
          return null;
        }
      }

      // Filter out specific errors
      if (event.exception?.values?.[0]?.type === "NetworkError") {
        return null;
      }

      return event;
    },

    // Track user interactions
    trackUserInteractions: true,
  });
}