import {
  clearCertImageLayout,
  layoutCertImage,
  waitForCertImage,
} from './certImageLayout';

export function isCertificateRasterPath(path: string): boolean {
  return (
    /^data:image\//i.test(path) ||
    /\.(jpe?g|png|webp|gif|svg)(\?|#|$)/i.test(path)
  );
}

export function initCertModal() {
  const certModal = document.getElementById('certModal') as HTMLElement | null;
  const certViewer = document.getElementById('certViewer') as HTMLIFrameElement | null;
  const closeModal = document.querySelector('.close') as HTMLElement | null;
  const certImage = document.getElementById('certImage') as HTMLImageElement | null;

  if (!certModal || !certViewer || !closeModal || !certImage) return;

  let imageShowGeneration = 0;

  function closeCertModal() {
    imageShowGeneration += 1;
    certModal.style.display = 'none';
    certViewer.src = '';
    certViewer.style.display = 'none';
    clearCertImageLayout(certImage);
    certImage.src = '';
    certImage.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  async function showRasterCertificate(pdfPath: string) {
    const generation = ++imageShowGeneration;

    certViewer.style.display = 'none';
    certViewer.src = '';
    certImage.style.display = 'none';
    clearCertImageLayout(certImage);
    certImage.src = '';

    certImage.src = pdfPath;

    try {
      await waitForCertImage(certImage);
    } catch {
      if (generation !== imageShowGeneration) return;
    }

    if (generation !== imageShowGeneration) return;

    layoutCertImage(certImage);
    certImage.style.display = 'block';
    certModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function showCertificate(pdfPath: string) {
    if (!pdfPath) return;

    const isImage = isCertificateRasterPath(pdfPath);

    if (isImage) {
      void showRasterCertificate(pdfPath);
      return;
    }

    imageShowGeneration += 1;
    certImage.style.display = 'none';
    clearCertImageLayout(certImage);
    certImage.src = '';
    const cleanPdfUrl = `${pdfPath}#toolbar=0&navpanes=0&scrollbar=0`;
    certViewer.style.display = 'block';
    certViewer.src = cleanPdfUrl;
    certModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  closeModal.addEventListener('click', closeCertModal);

  window.addEventListener('click', (e) => {
    if (e.target === certModal) {
      closeCertModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.style.display === 'block') {
      closeCertModal();
    }
  });

  const certButtons = document.querySelectorAll('.cert-button');
  certButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const pdfUrl = button.getAttribute('data-cert');
      if (pdfUrl) {
        showCertificate(pdfUrl);
      }
    });
  });
}