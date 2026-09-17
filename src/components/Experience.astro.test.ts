/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Experience from './Experience.astro';
import { createMockResumeData } from '../test/mockResumeData';

const resumeData = createMockResumeData({
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
});

describe('Experience', () => {
  it('renders experience section with expected content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Experience, { props: { resumeData } });

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
