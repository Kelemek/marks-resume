/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Contact from './Contact.astro';

describe('Contact', () => {
  it('renders contact section with expected content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Contact);

    expect(html).toContain('Get in Touch');
    expect(html).toContain('markdlarson@me.com');
    expect(html).toContain('763.355.2923');
    expect(html).toContain('2130 Cleveland Lane S, Cambridge, MN 55008');
    expect(html).toContain('id="contact"');
    expect(html).toContain('mailto:markdlarson@me.com');
    expect(html).toContain('tel:+17633552923');
  });
});
