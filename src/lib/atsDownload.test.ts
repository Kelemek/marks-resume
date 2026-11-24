import { describe, it, expect } from 'vitest';
import { buildAtsDocumentText, toAtsDownloadPayload } from './atsDownload';
import { createMockResumeData } from '../test/mockResumeData';
import { resumeIdentity } from './resumeIdentity';

describe('atsDownload', () => {
  it('strips certificate URLs from client payload', () => {
    const payload = toAtsDownloadPayload(
      createMockResumeData({
        certificates: [
          { title: 'Cert', institution: 'Inst', pdfPath: 'https://secret.example/cert.pdf' },
        ],
      }),
    );

    expect(payload.certificates[0]).toEqual({ title: 'Cert', institution: 'Inst' });
    expect(payload.certificates[0]).not.toHaveProperty('pdfPath');
  });

  it('builds ATS text with identity header and summary', () => {
    const text = buildAtsDocumentText(toAtsDownloadPayload(createMockResumeData()));

    expect(text).toContain(resumeIdentity.atsName);
    expect(text).toContain(resumeIdentity.email);
    expect(text).toContain('PROFESSIONAL SUMMARY');
    expect(text).toContain('Engineer');
    expect(text).toContain(
      'Founded Romans 8 Partners, an AI coaching and consulting practice helping small-business owners apply practical AI tools in their day-to-day work.',
    );
  });
});
