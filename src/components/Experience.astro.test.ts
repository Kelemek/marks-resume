/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, vi } from 'vitest';
import Experience from './Experience.astro';

const mockResumeData = vi.hoisted(() => ({
  systemsSoftware: [],
  developmentSoftware: [],
  certificates: [],
  scrimbaCertificates: [],
  jobs: [
    {
      title: 'Senior Engineer',
      company: 'Acme Corp',
      location: 'Minneapolis, MN',
      period: '2020-2024',
      achievements: ['Built systems'],
      responsibilities: ['Led team'],
    },
  ],
  itStartYear: 1995,
}));

vi.mock('../lib/resumeData', () => ({
  getResumeData: vi.fn().mockResolvedValue(mockResumeData),
}));

describe('Experience', () => {
  it('renders experience section with expected content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Experience);

    expect(html).toContain('Professional Experience');
    expect(html).toContain('Senior Engineer');
    expect(html).toContain('Acme Corp');
    expect(html).toContain('Minneapolis, MN');
    expect(html).toContain('2020-2024');
    expect(html).toContain('Built systems');
    expect(html).toContain('Led team');
    expect(html).toContain('id="experience"');
  });
});
