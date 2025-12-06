// Mobile Hamburger Menu Functionality
export function initHamburger() {
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  const navLinks = document.getElementById('navLinks');

  if (!hamburgerMenu || !navLinks) return;

  hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking on a nav link
  navLinks.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      hamburgerMenu.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!hamburgerMenu.contains(target) && !navLinks.contains(target)) {
      hamburgerMenu.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
}
