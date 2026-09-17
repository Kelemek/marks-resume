export function initCertModal() {
  const certModal = document.getElementById('certModal') as HTMLElement | null;
  const certViewer = document.getElementById('certViewer') as HTMLIFrameElement | null;
  const closeModal = document.querySelector('.close') as HTMLElement | null;
  const certImage = document.getElementById('certImage') as HTMLImageElement | null;

  if (!certModal || !certViewer || !closeModal || !certImage) return;

  function closeCertModal() {
    certModal.style.display = 'none';
    certViewer.src = '';
    certViewer.style.display = 'none';
    certImage.src = '';
    certImage.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  function showCertificate(pdfPath: string) {
    if (!pdfPath) return;

    const isImage = /\.(jpe?g|png|webp|gif|svg)$/i.test(pdfPath);

    if (isImage) {
      certViewer.style.display = 'none';
      certViewer.src = '';
      certImage.src = pdfPath;
      certImage.style.display = 'block';
      certModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      return;
    }

    const cleanPdfUrl = `${pdfPath}#toolbar=0&navpanes=0&scrollbar=0`;
    certImage.style.display = 'none';
    certImage.src = '';
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
