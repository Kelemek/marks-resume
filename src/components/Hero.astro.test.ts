/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, vi } from 'vitest';
import Hero from './Hero.astro';

const mockResumeData = vi.hoisted(() => ({
  systemsSoftware: [],
  developmentSoftware: [],
  certificates: [],
  scrimbaCertificates: [],
  jobs: [],
  itStartYear: 1995,
}));

vi.mock('../lib/resumeData', () => ({
  getResumeData: vi.fn().mockResolvedValue(mockResumeData),
  calculateITExperience: vi.fn((year: number) => new Date().getFullYear() - year),
}));

describe('Hero', () => {
  it('renders hero section with expected content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Hero);

    expect(html).toContain('Mark Dean Larson');
    expect(html).toContain('Systems Engineer');
    expect(html).toContain('id="top"');
    expect(html).toContain('Get in touch');
    expect(html).toContain('Download Resume');
    expect(html).toContain('markdlarson@me.com');
  });
});
