/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, vi } from 'vitest';
import Index from '../../src/pages/index.astro';

const mockResumeData = vi.hoisted(() => ({
  systemsSoftware: [{ name: 'VMware', years: '10+' }],
  developmentSoftware: [{ name: 'JavaScript', years: '5+' }],
  certificates: [{ title: 'Cert', institution: 'Inst' }],
  scrimbaCertificates: [{ title: 'Scrimba', institution: 'Scrimba' }],
  jobs: [{ title: 'Engineer', company: 'Co', location: 'Loc', period: '2020-24', achievements: ['A1'], responsibilities: ['R1'] }],
  itStartYear: 1995,
}));

vi.mock('../../src/lib/resumeData', () => ({
  getResumeData: vi.fn().mockResolvedValue(mockResumeData),
  calculateITExperience: vi.fn((year: number) => new Date().getFullYear() - year),
}));

describe('index', () => {
  it('renders full resume page with all sections', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);

    expect(html).toContain('Mark Dean Larson - Resume');
    expect(html).toContain('id="top"');
    expect(html).toContain('id="profile"');
    expect(html).toContain('id="experience"');
    expect(html).toContain('id="skills"');
    expect(html).toContain('id="education"');
    expect(html).toContain('id="contact"');
  });

  it('renders hero section content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);

    expect(html).toContain('Systems Engineer');
    expect(html).toContain('Download Resume');
  });

  it('renders profile section', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);

    expect(html).toContain('Professional Profile');
  });

  it('renders contact section with email', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);

    expect(html).toContain('Get in Touch');
    expect(html).toContain('markdlarson@me.com');
  });
});
