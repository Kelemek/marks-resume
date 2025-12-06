// Theme Toggle Functionality
export function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeText = document.querySelector('.theme-text');
  const body = document.body;

  if (!themeToggle || !themeText) return;

  // Check for saved theme preference or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateThemeText(savedTheme);
  } else {
    const systemTheme = prefersDarkScheme ? 'dark' : 'light';
    body.setAttribute('data-theme', systemTheme);
    updateThemeText(systemTheme);
  }

  // Theme toggle event listener
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeText(newTheme);
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const theme = e.matches ? 'dark' : 'light';
      body.setAttribute('data-theme', theme);
      updateThemeText(theme);
    }
  });

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
}
