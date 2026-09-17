/// <reference path="../env.server.d.ts" />
import type { ResumeData } from './types';
import { resumeBuildFallback } from './emptyResumeData';

function useResumeBuildFallback(): boolean {
  const enabled = import.meta.env.RESUME_BUILD_FALLBACK === 'true';
  if (enabled && import.meta.env.PROD) {
    throw new Error(
      'RESUME_BUILD_FALLBACK cannot be enabled in production builds. Unset it in your deployment environment.',
    );
  }
  return enabled;
}

export async function getResumeData(): Promise<ResumeData> {
  if (useResumeBuildFallback()) {
    return resumeBuildFallback;
  }

  const { fetchResumeDataFromSupabase } = await import('./fetchResumeDataFromSupabase');
  return fetchResumeDataFromSupabase();
}
