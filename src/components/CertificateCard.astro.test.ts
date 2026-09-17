/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import CertificateCard from './CertificateCard.astro';

describe('CertificateCard', () => {
  it('renders view button when pdfPath is present', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CertificateCard, {
      props: {
        cert: {
          title: 'AWS',
          institution: 'Amazon',
          pdfPath: '/cert.pdf',
          ariaLabel: 'View AWS',
        },
      },
    });

    expect(html).toContain('AWS');
    expect(html).toContain('data-cert="/cert.pdf"');
    expect(html).toContain('aria-label="View AWS"');
  });

  it('omits view button when pdfPath is missing', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CertificateCard, {
      props: {
        cert: { title: 'Course', institution: 'School' },
      },
    });

    expect(html).toContain('Course');
    expect(html).not.toContain('cert-button');
  });
});
