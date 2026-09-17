/**
 * @vitest-environment node
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Profile from './Profile.astro';
import { mockResumeData } from '../test/mockResumeData';

describe('Profile', () => {
  it('renders profile section with expected content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Profile, { props: { resumeData: mockResumeData } });

    expect(html).toContain('Professional Profile');
    expect(html).toContain('Systems Engineer');
    expect(html).toContain('id="profile"');
  });
});
