export async function initPostHog() {
  const key = import.meta.env.PUBLIC_POSTHOG_KEY;
  if (!key) return;

  const host = import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
  const { default: posthog } = await import('posthog-js');

  posthog.init(key, {
    api_host: host,
    capture_pageview: true,
    capture_pageleave: true,
  });
}
