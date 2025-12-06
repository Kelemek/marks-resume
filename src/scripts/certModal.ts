// Certificate Modal Functionality
export function initCertModal() {
  const certModal = document.getElementById('certModal') as HTMLElement | null;
  const certViewer = document.getElementById('certViewer') as HTMLIFrameElement | null;
  const closeModal = document.querySelector('.close') as HTMLElement | null;

  if (!certModal || !certViewer || !closeModal) return;

  // Function to show certificate modal. Supports PDFs and image types.
  function showCertificate(pdfPath: string) {
    if (!pdfPath || !certModal) return;

    const certImage = document.getElementById('certImage') as HTMLImageElement | null;

    const isImage = /\.(jpe?g|png|webp|gif|svg)$/i.test(pdfPath);

    if (isImage && certImage && certViewer) {
      // Show image element and hide iframe
      certViewer.style.display = 'none';
      certViewer.src = '';
      certImage.src = pdfPath;
      certImage.style.display = 'block';
      certModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      return;
    }

    // Default to PDF (or other embeddable content) in iframe
    if (certViewer) {
      const cleanPdfUrl = `${pdfPath}#toolbar=0&navpanes=0&scrollbar=0`;
      certImage && (certImage.style.display = 'none');
      certViewer.style.display = 'block';
      certViewer.src = cleanPdfUrl;
      certModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }

  // Close modal when clicking the X button
  closeModal.addEventListener('click', () => {
    certModal.style.display = 'none';
    certViewer && (certViewer.src = '');
    const certImage = document.getElementById('certImage') as HTMLImageElement | null;
    certImage && (certImage.src = '', certImage.style.display = 'none');
    document.body.style.overflow = 'auto';
  });

  // Close modal when clicking outside the modal content
  window.addEventListener('click', (e) => {
    if (e.target === certModal) {
      certModal.style.display = 'none';
      certViewer && (certViewer.src = '');
      const certImage = document.getElementById('certImage') as HTMLImageElement | null;
      certImage && (certImage.src = '', certImage.style.display = 'none');
      document.body.style.overflow = 'auto';
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.style.display === 'block') {
      certModal.style.display = 'none';
      certViewer && (certViewer.src = '');
      const certImage = document.getElementById('certImage') as HTMLImageElement | null;
      certImage && (certImage.src = '', certImage.style.display = 'none');
      document.body.style.overflow = 'auto';
    }
  });

  // Attach click handlers to all certificate buttons
  const certButtons = document.querySelectorAll('.cert-button');
  certButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const pdfUrl = button.getAttribute('data-cert');
      if (pdfUrl) {
        showCertificate(pdfUrl);
      }
    });
  });
}
