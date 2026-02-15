/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Layout from './Layout.astro';

describe('Layout', () => {
  it('renders full document structure with title and slot content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Layout, {
      props: { title: 'Test Page' },
      slots: { default: '<p>Page content</p>' },
    });

    expect(html).toContain('<html lang="en">');
    expect(html).toContain('<title>Test Page</title>');
    expect(html).toContain('Page content');
  });

  it('renders default description when not provided', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Layout, {
      props: { title: 'Resume' },
      slots: { default: '' },
    });

    expect(html).toContain('Senior Systems Engineer');
  });

  it('renders custom description when provided', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Layout, {
      props: { title: 'Resume', description: 'Custom description' },
      slots: { default: '' },
    });

    expect(html).toContain('content="Custom description"');
  });

  it('renders navigation with all links', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Layout, {
      props: { title: 'Test' },
      slots: { default: '' },
    });

    expect(html).toContain('Mark Dean Larson');
    expect(html).toContain('href="#top"');
    expect(html).toContain('href="#profile"');
    expect(html).toContain('href="#experience"');
    expect(html).toContain('href="#skills"');
    expect(html).toContain('href="#education"');
    expect(html).toContain('href="#contact"');
    expect(html).toContain('portfolio.romans8.net');
    expect(html).toContain('id="themeToggle"');
    expect(html).toContain('id="hamburgerMenu"');
    expect(html).toContain('id="navLinks"');
  });

  it('renders certificate modal structure', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Layout, {
      props: { title: 'Test' },
      slots: { default: '' },
    });

    expect(html).toContain('id="certModal"');
    expect(html).toContain('id="certViewer"');
    expect(html).toContain('id="certImage"');
    expect(html).toContain('close');
  });
});
