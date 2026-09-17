// Theme Toggle Functionality
export function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeText = document.querySelector('.theme-text');
  const body = document.body;

  if (!themeToggle || !themeText) return;

  function updateThemeText(theme: string) {
    if (!themeText || !themeToggle) return;

    if (theme === 'light') {
      themeText.textContent = 'Dark Mode';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      themeText.textContent = 'Light Mode';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    }
  }

  function applyTheme(theme: string, animate = false) {
    if (animate) {
      body.classList.add('theme-transitioning');
      window.setTimeout(() => body.classList.remove('theme-transitioning'), 350);
    }
    body.setAttribute('data-theme', theme);
    updateThemeText(theme);
  }

  const savedTheme = localStorage.getItem('theme');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme(prefersDarkScheme ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme, true);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light', true);
    }
  });
}
