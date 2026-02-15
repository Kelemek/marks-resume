import { describe, it, expect, beforeEach } from 'vitest';
import { initHamburger } from './hamburger';

describe('initHamburger', () => {
  let hamburgerMenu: HTMLElement;
  let navLinks: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="hamburgerMenu"></button>
      <div id="navLinks">
        <a href="#profile">Profile</a>
      </div>
    `;
    hamburgerMenu = document.getElementById('hamburgerMenu')!;
    navLinks = document.getElementById('navLinks')!;
  });

  it('returns early when hamburgerMenu or navLinks is missing', () => {
    document.body.innerHTML = '';
    expect(() => initHamburger()).not.toThrow();
  });

  it('toggles active class on hamburger click', () => {
    initHamburger();
    expect(hamburgerMenu.classList.contains('active')).toBe(false);

    hamburgerMenu.click();
    expect(hamburgerMenu.classList.contains('active')).toBe(true);
    expect(navLinks.classList.contains('active')).toBe(true);

    hamburgerMenu.click();
    expect(hamburgerMenu.classList.contains('active')).toBe(false);
  });

  it('closes menu when clicking nav link', () => {
    initHamburger();
    hamburgerMenu.click();
    expect(hamburgerMenu.classList.contains('active')).toBe(true);

    const link = navLinks.querySelector('a')!;
    link.click();
    expect(hamburgerMenu.classList.contains('active')).toBe(false);
    expect(navLinks.classList.contains('active')).toBe(false);
  });

  it('closes menu when clicking outside', () => {
    document.body.innerHTML = `
      <button id="hamburgerMenu"></button>
      <div id="navLinks"></div>
      <div id="outside">Outside</div>
    `;
    initHamburger();
    const menu = document.getElementById('hamburgerMenu')!;
    const outside = document.getElementById('outside')!;
    menu.click();
    expect(menu.classList.contains('active')).toBe(true);

    outside.click();
    expect(menu.classList.contains('active')).toBe(false);
  });
});
