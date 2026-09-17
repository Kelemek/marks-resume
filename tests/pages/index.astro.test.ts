/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Index from '../../src/pages/index.astro';
import { mockResumeData } from '../../src/test/mockResumeData';

const { getResumeData } = vi.hoisted(() => ({
  getResumeData: vi.fn(),
}));

vi.mock('../../src/lib/resumeData', () => ({
  getResumeData,
}));

describe('index', () => {
  beforeEach(() => {
    getResumeData.mockReset();
    getResumeData.mockResolvedValue(mockResumeData);
  });

  it('loads resume data once per page render', async () => {
    const container = await AstroContainer.create();
    await container.renderToString(Index);

    expect(getResumeData).toHaveBeenCalledTimes(1);
  });

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
