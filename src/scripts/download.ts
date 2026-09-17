import { saveAs } from 'file-saver';
import type { AtsDownloadPayload } from '../lib/types';
import { buildAtsDocumentText } from '../lib/atsDownload';
import { resumeIdentity } from '../lib/resumeIdentity';

declare global {
  interface Window {
    atsResumeData?: AtsDownloadPayload;
  }
}

export function initDownload() {
  const button = document.getElementById('downloadPDF');
  if (!button) return;

  button.addEventListener('click', generateATSFriendlyDoc);
}

function generateATSFriendlyDoc() {
  const button = document.getElementById('downloadPDF') as HTMLButtonElement | null;
  if (!button) return;

  const payload = window.atsResumeData;
  if (!payload) {
    console.error('Resume data not available');
    return;
  }

  const originalText = button.textContent || '';
  button.textContent = 'Generating Document...';
  button.disabled = true;

  try {
    const textContent = buildAtsDocumentText(payload);
    const blob = new Blob([textContent], {
      type: 'text/plain;charset=utf-8',
    });

    saveAs(blob, resumeIdentity.atsDownloadFilename);

    button.textContent = originalText;
    button.disabled = false;
  } catch (error) {
    console.error('Document generation failed:', error);
    button.textContent = 'Download Failed - Try Again';
    button.disabled = false;
    setTimeout(() => {
      button.textContent = 'Download Resume';
    }, 3000);
  }
}
