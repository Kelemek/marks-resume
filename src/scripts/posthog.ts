import posthog from 'posthog-js';

export function initPostHog() {
  const key = import.meta.env.PUBLIC_POSTHOG_KEY;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

  if (!key) return;

  posthog.init(key, {
    api_host: host,
    capture_pageview: true,
    capture_pageleave: true,
  });
}
