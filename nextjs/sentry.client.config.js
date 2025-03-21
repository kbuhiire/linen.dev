// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const SKIP_SENTRY = process.env.NEXT_PUBLIC_SKIP_SENTRY === 'true';

if (!SKIP_SENTRY) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.5,
  });
}
