import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initScrollToTop } from './scrollToTop';

describe('initScrollToTop', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="top"></section>
      <button type="button" id="scrollToTop" hidden aria-label="Scroll to top"></button>
    `;
    vi.stubGlobal('scrollY', 0);
  });

  it('returns early when button is missing', () => {
    document.body.innerHTML = '';
    expect(() => initScrollToTop()).not.toThrow();
  });

  it('shows the button after scrolling past the threshold', () => {
    const button = document.getElementById('scrollToTop')!;
    initScrollToTop();
    expect(button.hasAttribute('hidden')).toBe(true);

    vi.stubGlobal('scrollY', 400);
    window.dispatchEvent(new Event('scroll'));
    expect(button.hasAttribute('hidden')).toBe(false);
    expect(button.classList.contains('scroll-to-top--visible')).toBe(true);
  });

  it('scrolls to #top on click', () => {
    const top = document.getElementById('top')!;
    const scrollIntoView = vi.fn();
    top.scrollIntoView = scrollIntoView;

    initScrollToTop();
    document.getElementById('scrollToTop')!.click();

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });
});
