/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Hero from './Hero.astro';
import { mockResumeData } from '../test/mockResumeData';

describe('Hero', () => {
  it('renders hero section with expected content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Hero, { props: { resumeData: mockResumeData } });

    expect(html).toContain('Mark Dean Larson');
    expect(html).toContain('Systems Engineer');
    expect(html).toContain('id="top"');
    expect(html).toContain('Get in touch');
    expect(html).toContain('Download Resume');
    expect(html).toContain('mailto:markdlarson@me.com');
  });
});
