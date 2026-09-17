import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initDownload } from './download';
import { toAtsDownloadPayload } from '../lib/atsDownload';
import { createMockResumeData } from '../test/mockResumeData';

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

describe('initDownload', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="downloadPDF">Download Resume</button>
    `;
    window.atsResumeData = toAtsDownloadPayload(createMockResumeData());
  });

  it('returns early when download button is missing', () => {
    document.body.innerHTML = '';
    expect(() => initDownload()).not.toThrow();
  });

  it('generates and downloads ATS document on button click', async () => {
    const { saveAs } = await import('file-saver');
    initDownload();

    const button = document.getElementById('downloadPDF')!;
    button.click();

    expect(saveAs).toHaveBeenCalled();
    const blob = (saveAs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(blob).toBeInstanceOf(Blob);
    const text = await blob.text();
    expect(text).toContain('MARK LARSON');
    expect(text).toContain('PROFESSIONAL SUMMARY');
    expect(text).toContain('Engineer');
    expect(text).toContain('VMware');
    expect(text).toContain('Cert');
    expect(text).toContain('Scrimba');
  });

  it('handles missing resumeData gracefully', () => {
    delete window.atsResumeData;
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    initDownload();

    const button = document.getElementById('downloadPDF')!;
    button.click();

    expect(consoleSpy).toHaveBeenCalledWith('Resume data not available');
    consoleSpy.mockRestore();
  });

  it('handles document generation failure', async () => {
    vi.useFakeTimers();
    const { saveAs } = await import('file-saver');
    (saveAs as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new Error('save failed');
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    initDownload();

    const button = document.getElementById('downloadPDF') as HTMLButtonElement;
    button.click();

    expect(consoleSpy).toHaveBeenCalled();
    expect(button.textContent).toBe('Download Failed - Try Again');
    expect(button.disabled).toBe(false);
    consoleSpy.mockRestore();

    await vi.advanceTimersByTimeAsync(3000);
    expect(button.textContent).toBe('Download Resume');
    vi.useRealTimers();
  });

  it('handles jobs without achievements or responsibilities', async () => {
    window.atsResumeData = toAtsDownloadPayload(
      createMockResumeData({
        systemsSoftware: [],
        developmentSoftware: [],
        certificates: [],
        scrimbaCertificates: [],
        jobs: [{ title: 'Eng', company: 'Co', location: 'Loc', period: '2020-24' }],
      }),
    );
    const { saveAs } = await import('file-saver');
    initDownload();

    const button = document.getElementById('downloadPDF')!;
    button.click();

    expect(saveAs).toHaveBeenCalled();
    const blob = (saveAs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    const text = await blob.text();
    expect(text).toContain('Eng');
  });
});
