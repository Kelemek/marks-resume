import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockInit = vi.hoisted(() => vi.fn());

vi.mock('posthog-js', () => ({
  default: { init: mockInit },
}));

import { initPostHog } from './posthog';

describe('initPostHog', () => {
  beforeEach(() => {
    mockInit.mockClear();
    vi.stubEnv('PUBLIC_POSTHOG_KEY', '');
    vi.stubEnv('PUBLIC_POSTHOG_HOST', '');
  });

  it('does nothing when PUBLIC_POSTHOG_KEY is not set', () => {
    initPostHog();
    expect(mockInit).not.toHaveBeenCalled();
  });

  it('initializes PostHog when key is set', () => {
    vi.stubEnv('PUBLIC_POSTHOG_KEY', 'phc_test_key');
    vi.stubEnv('PUBLIC_POSTHOG_HOST', 'https://us.i.posthog.com');

    initPostHog();

    expect(mockInit).toHaveBeenCalledWith('phc_test_key', {
      api_host: 'https://us.i.posthog.com',
      capture_pageview: true,
      capture_pageleave: true,
    });
  });

  it('uses default host when PUBLIC_POSTHOG_HOST is not set', () => {
    vi.stubEnv('PUBLIC_POSTHOG_KEY', 'phc_test_key');

    initPostHog();

    expect(mockInit).toHaveBeenCalledWith('phc_test_key', expect.objectContaining({
      api_host: 'https://us.i.posthog.com',
    }));
  });
});
