import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFrom = vi.hoisted(() => vi.fn());
const mockGetPublicUrl = vi.hoisted(() => vi.fn());

vi.mock('./supabaseAdmin', () => ({
  supabaseAdmin: {
    from: (...args: unknown[]) => mockFrom(...args),
    storage: {
      from: () => ({
        getPublicUrl: (path: string) => mockGetPublicUrl(path),
      }),
    },
  },
}));

const mockSkills = {
  data: [
    { id: '1', name: 'VMware', years: '10+', category: 'systems', sort_order: 1 },
    { id: '2', name: 'JavaScript', years: '5+', category: 'development', sort_order: 2 },
  ],
  error: null,
};
const mockCerts = {
  data: [
    { id: '1', title: 'Cert', institution: 'Inst', pdf_path: '/local.pdf', aria_label: 'View', category: 'education', sort_order: 1 },
    { id: '2', title: 'Scrimba', institution: 'Scrimba', pdf_path: 'storage/cert.pdf', aria_label: null, category: 'scrimba', sort_order: 2 },
  ],
  error: null,
};
const mockJobs = { data: [{ id: '1', title: 'Eng', company: 'Co', location: 'Loc', period: '2020-24', achievements: ['A1'], responsibilities: ['R1'], sort_order: 1 }], error: null };
const mockSettings = { data: { id: '1', key: 'it_start_year', value: '1995' }, error: null };

mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://storage.example.com/cert.pdf' } });

import { calculateITExperience, getResumeData } from './resumeData';

describe('calculateITExperience', () => {
  it('returns correct years based on start year', () => {
    const currentYear = new Date().getFullYear();
    expect(calculateITExperience(currentYear)).toBe(0);
    expect(calculateITExperience(currentYear - 5)).toBe(5);
    expect(calculateITExperience(currentYear - 30)).toBe(30);
  });
});

describe('getResumeData', () => {
  const setupMocks = (
    skills = mockSkills,
    certs = mockCerts,
    jobs = mockJobs,
    settings = mockSettings
  ) => {
    mockFrom.mockReset();
    mockFrom
      .mockReturnValueOnce({ select: () => ({ order: () => Promise.resolve(skills) }) })
      .mockReturnValueOnce({ select: () => ({ order: () => Promise.resolve(certs) }) })
      .mockReturnValueOnce({ select: () => ({ order: () => Promise.resolve(jobs) }) })
      .mockReturnValueOnce({ select: () => ({ eq: () => ({ single: () => Promise.resolve(settings) }) }) });
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://storage.example.com/cert.pdf' } });
  };

  beforeEach(() => setupMocks());

  it('fetches and transforms resume data', async () => {
    const result = await getResumeData();

    expect(result.systemsSoftware).toEqual([{ name: 'VMware', years: '10+' }]);
    expect(result.developmentSoftware).toEqual([{ name: 'JavaScript', years: '5+' }]);
    expect(result.certificates).toHaveLength(1);
    expect(result.certificates[0]).toMatchObject({
      title: 'Cert',
      institution: 'Inst',
      pdfPath: '/local.pdf', // path starts with / so returned as-is
      ariaLabel: 'View',
    });
    expect(result.scrimbaCertificates).toHaveLength(1);
    expect(result.scrimbaCertificates[0].pdfPath).toBe('https://storage.example.com/cert.pdf');
    expect(result.jobs).toHaveLength(1);
    expect(result.jobs[0]).toMatchObject({
      title: 'Eng',
      achievements: ['A1'],
      responsibilities: ['R1'],
    });
    expect(result.itStartYear).toBe(1995);
  });

  it('passes through http URLs for pdf_path', async () => {
    const certsWithHttp = {
      data: [{ id: '1', title: 'C', institution: 'I', pdf_path: 'https://example.com/cert.pdf', aria_label: null, category: 'education', sort_order: 1 }],
      error: null,
    };
    setupMocks(mockSkills, certsWithHttp);

    const result = await getResumeData();
    expect(result.certificates[0].pdfPath).toBe('https://example.com/cert.pdf');
  });

  it('returns undefined pdfPath when pdf_path is null', async () => {
    const certsNoPdf = {
      data: [{ id: '1', title: 'C', institution: 'I', pdf_path: null, aria_label: null, category: 'education', sort_order: 1 }],
      error: null,
    };
    setupMocks(mockSkills, certsNoPdf);

    const result = await getResumeData();
    expect(result.certificates[0].pdfPath).toBeUndefined();
  });

  it('omits achievements when empty', async () => {
    const jobsNoAchievements = {
      data: [{ id: '1', title: 'Eng', company: 'Co', location: 'Loc', period: '2020-24', achievements: [], responsibilities: ['R1'], sort_order: 1 }],
      error: null,
    };
    setupMocks(mockSkills, mockCerts, jobsNoAchievements);

    const result = await getResumeData();
    expect(result.jobs[0].achievements).toBeUndefined();
    expect(result.jobs[0].responsibilities).toEqual(['R1']);
  });

  it('throws on skills fetch error', async () => {
    setupMocks(
      { data: null, error: { message: 'DB error' } },
      mockCerts,
      mockJobs,
      mockSettings
    );
    await expect(getResumeData()).rejects.toThrow('Skills fetch failed: DB error');
  });

  it('throws on certificates fetch error', async () => {
    setupMocks(
      mockSkills,
      { data: null, error: { message: 'Cert error' } },
      mockJobs,
      mockSettings
    );
    await expect(getResumeData()).rejects.toThrow('Certificates fetch failed: Cert error');
  });

  it('throws on jobs fetch error', async () => {
    setupMocks(
      mockSkills,
      mockCerts,
      { data: null, error: { message: 'Job error' } },
      mockSettings
    );
    await expect(getResumeData()).rejects.toThrow('Jobs fetch failed: Job error');
  });

  it('throws on settings fetch error', async () => {
    setupMocks(
      mockSkills,
      mockCerts,
      mockJobs,
      { data: null, error: { message: 'Settings error' } }
    );
    await expect(getResumeData()).rejects.toThrow('Settings fetch failed: Settings error');
  });
});
