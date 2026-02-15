/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, vi } from 'vitest';
import Education from './Education.astro';

const mockResumeData = vi.hoisted(() => ({
  systemsSoftware: [],
  developmentSoftware: [],
  certificates: [
    { title: 'BSc Computer Science', institution: 'University', pdfPath: '/cert.pdf', ariaLabel: 'View' },
  ],
  scrimbaCertificates: [
    { title: 'Frontend Path', institution: 'Scrimba' },
  ],
  jobs: [],
  itStartYear: 1995,
}));

vi.mock('../lib/resumeData', () => ({
  getResumeData: vi.fn().mockResolvedValue(mockResumeData),
}));

describe('Education', () => {
  it('renders education section with expected content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Education);

    expect(html).toContain('Education & Certifications');
    expect(html).toContain('BSc Computer Science');
    expect(html).toContain('University');
    expect(html).toContain('Scrimba Certificates');
    expect(html).toContain('Frontend Path');
    expect(html).toContain('Professional Training');
    expect(html).toContain('id="education"');
  });
});
