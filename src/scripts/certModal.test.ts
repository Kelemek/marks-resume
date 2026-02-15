import { describe, it, expect, beforeEach } from 'vitest';
import { initCertModal } from './certModal';

describe('initCertModal', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="certModal" style="display:none">
        <div class="modal-content"></div>
        <span class="close">&times;</span>
        <iframe id="certViewer"></iframe>
        <img id="certImage" style="display:none" />
      </div>
      <button class="cert-button" data-cert="/test.pdf">View PDF</button>
      <button class="cert-button" data-cert="https://example.com/image.png">View Image</button>
      <button class="cert-button" data-cert="">Empty path</button>
      <button class="cert-button">No data-cert</button>
    `;
  });

  it('returns early when required elements are missing', () => {
    document.body.innerHTML = '';
    expect(() => initCertModal()).not.toThrow();
  });

  it('shows PDF in iframe when certificate button clicked', () => {
    initCertModal();
    const modal = document.getElementById('certModal') as HTMLElement;
    const iframe = document.getElementById('certViewer') as HTMLIFrameElement;
    const certButton = document.querySelector('.cert-button[data-cert="/test.pdf"]')!;

    certButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(modal.style.display).toBe('block');
    expect(iframe.src).toContain('/test.pdf');
    expect(iframe.src).toContain('toolbar=0');
  });

  it('shows image in img element for image extensions', () => {
    initCertModal();
    const modal = document.getElementById('certModal') as HTMLElement;
    const iframe = document.getElementById('certViewer') as HTMLIFrameElement;
    const certImage = document.getElementById('certImage') as HTMLImageElement;
    const certButton = document.querySelector('.cert-button[data-cert="https://example.com/image.png"]')!;

    certButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(modal.style.display).toBe('block');
    expect(certImage.style.display).toBe('block');
    expect(certImage.src).toContain('image.png');
    expect(iframe.style.display).toBe('none');
  });

  it('closes modal when close button clicked', () => {
    initCertModal();
    const modal = document.getElementById('certModal') as HTMLElement;
    const closeBtn = document.querySelector('.close')!;
    const certButton = document.querySelector('.cert-button')!;

    certButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.style.display).toBe('block');

    closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.style.display).toBe('none');
  });

  it('closes modal when clicking backdrop', () => {
    initCertModal();
    const modal = document.getElementById('certModal') as HTMLElement;
    const certButton = document.querySelector('.cert-button')!;

    certButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.style.display).toBe('block');

    modal.dispatchEvent(new MouseEvent('click', { bubbles: true, target: modal }));
    expect(modal.style.display).toBe('none');
  });

  it('does not open modal when cert path is empty', () => {
    initCertModal();
    const modal = document.getElementById('certModal') as HTMLElement;
    const emptyButton = document.querySelector('.cert-button[data-cert=""]')!;

    emptyButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(modal.style.display).not.toBe('block');
  });

  it('does not open modal when button has no data-cert', () => {
    initCertModal();
    const modal = document.getElementById('certModal') as HTMLElement;
    const noCertButton = Array.from(document.querySelectorAll('.cert-button')).find(b => !b.getAttribute('data-cert'))!;

    noCertButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(modal.style.display).not.toBe('block');
  });

  it('closes modal on Escape key', () => {
    initCertModal();
    const modal = document.getElementById('certModal') as HTMLElement;
    const certButton = document.querySelector('.cert-button')!;

    certButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    modal.style.display = 'block';
    expect(modal.style.display).toBe('block');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(modal.style.display).toBe('none');
  });
});
