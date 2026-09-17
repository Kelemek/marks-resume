/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Skills from './Skills.astro';
import { mockResumeData } from '../test/mockResumeData';

describe('Skills', () => {
  it('renders skills section with expected content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Skills, { props: { resumeData: mockResumeData } });

    expect(html).toContain('Systems Software');
    expect(html).toContain('Development Software');
    expect(html).toContain('VMware');
    expect(html).toContain('JavaScript');
    expect(html).toContain('10+');
    expect(html).toContain('5+');
    expect(html).toContain('id="skills"');
  });
});
