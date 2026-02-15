import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initTheme } from './theme';

describe('initTheme', () => {
  let themeToggle: HTMLElement;
  let themeText: HTMLElement;
  let matchMediaMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="themeToggle">
        <span class="theme-text">Dark Mode</span>
      </button>
    `;
    themeToggle = document.getElementById('themeToggle')!;
    themeText = document.querySelector('.theme-text')!;

    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', { value: matchMediaMock, writable: true });
    localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('returns early when themeToggle or themeText is missing', () => {
    document.body.innerHTML = '';
    expect(() => initTheme()).not.toThrow();
  });

  it('applies saved theme from localStorage', () => {
    localStorage.setItem('theme', 'light');
    initTheme();
    expect(document.body.getAttribute('data-theme')).toBe('light');
    expect(themeText.textContent).toBe('Dark Mode');
  });

  it('applies system preference when no saved theme', () => {
    matchMediaMock.mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() });
    initTheme();
    expect(document.body.getAttribute('data-theme')).toBe('dark');
    expect(themeText.textContent).toBe('Light Mode');
  });

  it('toggles theme on button click', () => {
    localStorage.setItem('theme', 'dark');
    initTheme();
    expect(document.body.getAttribute('data-theme')).toBe('dark');

    themeToggle.click();
    expect(document.body.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(themeText.textContent).toBe('Dark Mode');

    themeToggle.click();
    expect(document.body.getAttribute('data-theme')).toBe('dark');
    expect(themeText.textContent).toBe('Light Mode');
  });

  it('responds to system theme change when no saved preference', () => {
    let changeHandler: ((e: { matches: boolean }) => void) | null = null;
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn((_event: string, handler: (e: { matches: boolean }) => void) => {
        changeHandler = handler;
      }),
      removeEventListener: vi.fn(),
    });
    initTheme();
    expect(document.body.getAttribute('data-theme')).toBe('light');

    expect(changeHandler).toBeTruthy();
    changeHandler!({ matches: true });
    expect(document.body.getAttribute('data-theme')).toBe('dark');
  });
});
