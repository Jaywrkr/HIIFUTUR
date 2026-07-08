import * as Sentry from "@sentry/nextjs";

// Sentry no-ops cleanly when dsn is undefined — same pattern as RESEND_API_KEY
// and CRON_SECRET elsewhere: works locally without it, real in production.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
});
