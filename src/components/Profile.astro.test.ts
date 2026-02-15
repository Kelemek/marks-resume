/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, vi } from 'vitest';
import Profile from './Profile.astro';

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

describe('Profile', () => {
  it('renders profile section with expected content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Profile);

    expect(html).toContain('Professional Profile');
    expect(html).toContain('Systems Engineer');
    expect(html).toContain('id="profile"');
  });
});
