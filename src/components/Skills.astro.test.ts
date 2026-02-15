/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, vi } from 'vitest';
import Skills from './Skills.astro';

const mockResumeData = vi.hoisted(() => ({
  systemsSoftware: [{ name: 'VMware', years: '10+' }],
  developmentSoftware: [{ name: 'JavaScript', years: '5+' }],
  certificates: [],
  scrimbaCertificates: [],
  jobs: [],
  itStartYear: 1995,
}));

vi.mock('../lib/resumeData', () => ({
  getResumeData: vi.fn().mockResolvedValue(mockResumeData),
}));

describe('Skills', () => {
  it('renders skills section with expected content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Skills);

    expect(html).toContain('Systems Software');
    expect(html).toContain('Development Software');
    expect(html).toContain('VMware');
    expect(html).toContain('JavaScript');
    expect(html).toContain('10+');
    expect(html).toContain('5+');
    expect(html).toContain('id="skills"');
  });
});
