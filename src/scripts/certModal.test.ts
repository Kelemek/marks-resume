import { describe, it, expect, beforeEach } from 'vitest';
import { initCertModal, isCertificateRasterPath } from './certModal';

const TEST_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function primeImageLoad(img: HTMLImageElement, naturalWidth = 2400, naturalHeight = 1540) {
  Object.defineProperty(img, 'naturalWidth', { configurable: true, value: naturalWidth });
  Object.defineProperty(img, 'naturalHeight', { configurable: true, value: naturalHeight });
  Object.defineProperty(img, 'complete', { configurable: true, value: true });
  img.decode = () => Promise.resolve();
  img.dispatchEvent(new Event('load'));
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

function wireModalBodyMetrics() {
  const modal = document.getElementById('certModal') as HTMLElement;
  const body = document.querySelector('.modal-body') as HTMLElement;
  let forcedBodyWidth: number | null = null;

  Object.defineProperty(body, 'clientWidth', {
    configurable: true,
    get() {
      if (forcedBodyWidth !== null) return forcedBodyWidth;
      return modal.style.display === 'none' ? 0 : 858;
    },
  });
  Object.defineProperty(body, 'clientHeight', {
    configurable: true,
    get() {
      if (forcedBodyWidth !== null) {
        return Math.round((781 / 858) * forcedBodyWidth);
      }
      return modal.style.display === 'none' ? 0 : 781;
    },
  });

  return {
    setBodyWidth(width: number) {
      forcedBodyWidth = width;
    },
    resetBodyWidth() {
      forcedBodyWidth = null;
    },
  };
}

describe('isCertificateRasterPath', () => {
  it('detects raster extensions and data URLs', () => {
    expect(isCertificateRasterPath('/img/foo.webp')).toBe(true);
    expect(isCertificateRasterPath('/img/foo.webp?v=1')).toBe(true);
    expect(isCertificateRasterPath('data:image/webp;base64,abc')).toBe(true);
    expect(isCertificateRasterPath('/img/foo.pdf')).toBe(false);
  });
});

describe('initCertModal', () => {
  let bodyMetrics: ReturnType<typeof wireModalBodyMetrics>;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="certModal" style="display:none">
        <div class="modal-content"></div>
        <span class="close">&times;</span>
        <div class="modal-body" style="width:858px;height:781px;padding:20px;box-sizing:border-box">
          <iframe id="certViewer"></iframe>
          <img id="certImage" style="display:none" />
        </div>
      </div>
      <button class="cert-button" data-cert="/test.pdf">View PDF</button>
      <button class="cert-button" data-cert="${TEST_IMAGE}">View Image</button>
      <button class="cert-button" data-cert="">Empty path</button>
      <button class="cert-button">No data-cert</button>
    `;
    bodyMetrics = wireModalBodyMetrics();
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

  it('shows modal before layout when raster certificate is loading', async () => {
    initCertModal();
    const modal = document.getElementById('certModal') as HTMLElement;
    const certImage = document.getElementById('certImage') as HTMLImageElement;
    const certButton = document.querySelector(`.cert-button[data-cert="${TEST_IMAGE}"]`)!;

    certButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.style.display).toBe('block');

    primeImageLoad(certImage);
    await flushPromises();

    expect(certImage.style.width).toBe('818px');
    expect(certImage.style.height).toBe('525px');
    expect(certImage.style.maxWidth).toBe('818px');
    expect(certImage.style.maxHeight).toBe('525px');
  });

  it('shows image in img element for image extensions', async () => {
    initCertModal();
    const modal = document.getElementById('certModal') as HTMLElement;
    const iframe = document.getElementById('certViewer') as HTMLIFrameElement;
    const certImage = document.getElementById('certImage') as HTMLImageElement;
    const certButton = document.querySelector(`.cert-button[data-cert="${TEST_IMAGE}"]`)!;

    certButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    primeImageLoad(certImage);
    await flushPromises();

    expect(modal.style.display).toBe('block');
    expect(certImage.style.display).toBe('block');
    expect(certImage.src).toContain('data:image/gif');
    expect(iframe.style.display).toBe('none');
    expect(certImage.style.width).toBe('818px');
    expect(certImage.style.height).toBe('525px');
  });

  it('clears explicit image dimensions when modal closes', async () => {
    initCertModal();
    const modal = document.getElementById('certModal') as HTMLElement;
    const certImage = document.getElementById('certImage') as HTMLImageElement;
    const closeBtn = document.querySelector('.close')!;
    const certButton = document.querySelector(`.cert-button[data-cert="${TEST_IMAGE}"]`)!;

    certButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    primeImageLoad(certImage);
    await flushPromises();
    expect(certImage.style.width).not.toBe('');

    closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.style.display).toBe('none');
    expect(certImage.style.width).toBe('');
    expect(certImage.style.height).toBe('');
    expect(certImage.getAttribute('src')).toBeNull();
  });

  it('reopens the same cached raster certificate after src is removed', async () => {
    initCertModal();
    const certImage = document.getElementById('certImage') as HTMLImageElement;
    const closeBtn = document.querySelector('.close')!;
    const certButton = document.querySelector(`.cert-button[data-cert="${TEST_IMAGE}"]`)!;

    certButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    primeImageLoad(certImage);
    await flushPromises();
    closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    certButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    primeImageLoad(certImage);
    await flushPromises();

    expect(certImage.style.display).toBe('block');
    expect(certImage.style.width).toBe('818px');
  });

  it('relayouts raster certificate on window resize while modal is open', async () => {
    initCertModal();
    const certImage = document.getElementById('certImage') as HTMLImageElement;
    const certButton = document.querySelector(`.cert-button[data-cert="${TEST_IMAGE}"]`)!;

    certButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    primeImageLoad(certImage);
    await flushPromises();

    bodyMetrics.setBodyWidth(600);
    window.dispatchEvent(new Event('resize'));

    expect(certImage.style.width).toBe('560px');
    expect(certImage.style.height).toBe('359px');
    expect(certImage.style.maxHeight).toBe('359px');
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