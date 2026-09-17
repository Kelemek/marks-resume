import { describe, it, expect, vi, afterEach } from 'vitest';
import { resumeBuildFallback } from './emptyResumeData';

describe('getResumeData fallback', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns build fallback when RESUME_BUILD_FALLBACK is true', async () => {
    vi.resetModules();
    vi.stubEnv('RESUME_BUILD_FALLBACK', 'true');
    vi.stubEnv('PROD', '');
    const { getResumeData } = await import('./resumeData');
    const result = await getResumeData();
    expect(result).toEqual(resumeBuildFallback);
  });

  it('throws when RESUME_BUILD_FALLBACK is true in production', async () => {
    vi.resetModules();
    vi.stubEnv('RESUME_BUILD_FALLBACK', 'true');
    vi.stubEnv('PROD', 'true');
    const { getResumeData } = await import('./resumeData');
    await expect(getResumeData()).rejects.toThrow('cannot be enabled in production');
  });
});
