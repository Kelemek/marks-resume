/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Education from './Education.astro';
import { createMockResumeData } from '../test/mockResumeData';

const resumeData = createMockResumeData({
  systemsSoftware: [],
  developmentSoftware: [],
  jobs: [],
  certificates: [
    { title: 'BSc Computer Science', institution: 'University', pdfPath: '/cert.pdf', ariaLabel: 'View' },
  ],
  scrimbaCertificates: [{ title: 'Frontend Path', institution: 'Scrimba' }],
});

describe('Education', () => {
  it('renders education section with expected content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Education, { props: { resumeData } });

    expect(html).toContain('Education & Certifications');
    expect(html).toContain('BSc Computer Science');
    expect(html).toContain('University');
    expect(html).toContain('Scrimba Certificates');
    expect(html).toContain('Frontend Path');
    expect(html).toContain('Professional Training');
    expect(html).toContain('id="education"');
    expect(html).toContain('data-cert="/cert.pdf"');
  });
});
