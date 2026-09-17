import type { ResumeData } from './types';

const DEFAULT_IT_START_YEAR = 1995;

export function createEmptyResumeData(itStartYear = DEFAULT_IT_START_YEAR): ResumeData {
  return {
    systemsSoftware: [],
    developmentSoftware: [],
    certificates: [],
    scrimbaCertificates: [],
    jobs: [],
    itStartYear,
  };
}

/** CI / local builds without Supabase credentials. */
export const resumeBuildFallback = createEmptyResumeData();
