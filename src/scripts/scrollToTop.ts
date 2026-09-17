const SCROLL_THRESHOLD_PX = 320;

export function initScrollToTop() {
  const button = document.getElementById('scrollToTop');
  if (!button) return;

  function updateVisibility() {
    const show = window.scrollY > SCROLL_THRESHOLD_PX;
    button.classList.toggle('scroll-to-top--visible', show);
    button.toggleAttribute('hidden', !show);
  }

  function scrollToTop() {
    const top = document.getElementById('top');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (top) {
      top.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  }

  button.addEventListener('click', scrollToTop);
  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
}
