import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Set environment
    environment: process.env.NODE_ENV,

    // Only send errors in production
    enabled: process.env.NODE_ENV === "production",

    // Capture console errors
    integrations: [
      Sentry.captureConsoleIntegration({
        levels: ["error", "warn"],
      }),
    ],

    // Filtering
    beforeSend(event, hint) {
      // Filter out non-error events in development
      if (process.env.NODE_ENV === "development") {
        if (event.level !== "error") {
          return null;
        }
      }

      // Don't send test user errors
      if (event.user?.email?.includes("test@")) {
        return null;
      }

      return event;
    },

    // Error sampling
    sampleRate: process.env.NODE_ENV === "production" ? 0.9 : 1.0,
  });
}