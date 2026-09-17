import { describe, it, expect } from 'vitest';
import {
  parseCertificates,
  parseItStartYearSettings,
  parseJobs,
  parseSkills,
} from './parseResumeRows';

describe('parseResumeRows', () => {
  it('parses valid skill rows', () => {
    const skills = parseSkills([
      { id: '1', name: 'VMware', years: '10+', category: 'systems', sort_order: 1 },
    ]);
    expect(skills[0].name).toBe('VMware');
  });

  it('rejects invalid skill category', () => {
    expect(() =>
      parseSkills([{ id: '1', name: 'X', years: '1', category: 'other', sort_order: 1 }]),
    ).toThrow('invalid category');
  });

  it('parses jobs with achievement arrays', () => {
    const jobs = parseJobs([
      {
        id: '1',
        title: 'Eng',
        company: 'Co',
        location: 'Loc',
        period: '2020',
        achievements: ['A'],
        responsibilities: [],
        sort_order: 1,
      },
    ]);
    expect(jobs[0].achievements).toEqual(['A']);
  });

  it('parses certificate rows', () => {
    const certs = parseCertificates([
      {
        id: '1',
        title: 'Cert',
        institution: 'School',
        pdf_path: null,
        aria_label: null,
        category: 'education',
        sort_order: 1,
      },
    ]);
    expect(certs[0].title).toBe('Cert');
  });

  it('validates it_start_year settings', () => {
    const settings = parseItStartYearSettings({
      id: '1',
      key: 'it_start_year',
      value: '1995',
    });
    expect(settings.value).toBe('1995');
  });

  it('rejects invalid it_start_year', () => {
    expect(() =>
      parseItStartYearSettings({ id: '1', key: 'it_start_year', value: 'not-a-year' }),
    ).toThrow('invalid it_start_year');
  });
});
