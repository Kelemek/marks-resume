// Certificate Modal Functionality
export function initCertModal() {
  const certModal = document.getElementById('certModal') as HTMLElement | null;
  const certViewer = document.getElementById('certViewer') as HTMLIFrameElement | null;
  const closeModal = document.querySelector('.close') as HTMLElement | null;

  if (!certModal || !certViewer || !closeModal) return;

  // Function to show certificate modal
  function showCertificate(pdfPath: string) {
    if (pdfPath && certModal && certViewer) {
      const cleanPdfUrl = `${pdfPath}#toolbar=0&navpanes=0&scrollbar=0`;
      certViewer.src = cleanPdfUrl;
      certModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }

  // Close modal when clicking the X button
  closeModal.addEventListener('click', () => {
    certModal.style.display = 'none';
    certViewer.src = '';
    document.body.style.overflow = 'auto';
  });

  // Close modal when clicking outside the modal content
  window.addEventListener('click', (e) => {
    if (e.target === certModal) {
      certModal.style.display = 'none';
      certViewer.src = '';
      document.body.style.overflow = 'auto';
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.style.display === 'block') {
      certModal.style.display = 'none';
      certViewer.src = '';
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
