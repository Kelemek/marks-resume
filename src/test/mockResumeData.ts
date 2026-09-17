import { createEmptyResumeData } from '../lib/emptyResumeData';
import type { ResumeData } from '../lib/types';

const baseMockResumeData: ResumeData = {
  ...createEmptyResumeData(1995),
  systemsSoftware: [{ name: 'VMware', years: '10+' }],
  developmentSoftware: [{ name: 'JavaScript', years: '5+' }],
  certificates: [{ title: 'Cert', institution: 'Inst' }],
  scrimbaCertificates: [{ title: 'Scrimba', institution: 'Scrimba' }],
  jobs: [
    {
      title: 'Engineer',
      company: 'Co',
      location: 'Loc',
      period: '2020-24',
      achievements: ['A1'],
      responsibilities: ['R1'],
    },
  ],
};

export const mockResumeData: ResumeData = { ...baseMockResumeData };

export function createMockResumeData(overrides: Partial<ResumeData> = {}): ResumeData {
  return { ...baseMockResumeData, ...overrides };
}
