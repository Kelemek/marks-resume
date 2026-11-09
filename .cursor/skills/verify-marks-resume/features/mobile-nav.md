# Mobile navigation and scroll to top

On a narrow screen the section links sit behind the menu button. After the visitor scrolls, a control returns them to the top.

## Sub-features

- `hamburger-closed` hides the section links at 390px wide.
- `hamburger-open` shows the links and marks the button active.
- `hamburger-link` chooses Profile, sets `#profile`, and closes the menu.
- `scroll-top` shows the control after scrolling past 320px and hides it again at the top.

## How to get to it (user POV)

- View the page at a phone width (480px or narrower).
- Choose `Toggle navigation menu`, then a section link.
- Scroll down until `Scroll to top` appears, then choose it.

## Driving it with Playwright

Preconditions:

- `launch.sh` and `doctor.sh` succeed.
- The page is tall enough to scroll past 320px. A short empty page fails `scroll-top`.

- **See the closed menu.** Run `scripts/verify-marks-resume/drive-mobile-nav.sh` (viewport 390×844). The button `Toggle navigation menu` is visible. The Profile link inside `#navLinks` is not. `#scrollToTop` has the `hidden` attribute.
- **Open the menu.** Click the button. `#navLinks` and the button have class `active`. Profile is visible.
- **Choose Profile.** Click that link. The URL ends with `#profile`, `#navLinks` loses `active`, and Profile is hidden again.
- **Scroll.** `window.scrollTo(0, 900)` until `scrollY` is greater than 320. The button `Scroll to top` is visible.
- **Return to the top.** Click it. `#top`’s top is between 0 and 220 pixels, and `#scrollToTop` has `hidden` again.
- **Proof.** The script writes `evidence/mobile-nav-closed.png`, `evidence/mobile-nav-open.png`, `evidence/mobile-nav-scrolled.png`, `evidence/mobile-nav-top.png`, and `evidence/mobile-nav.txt`.

## Gotchas

- The hamburger is `display: none` above 480px. A 1280px viewport cannot prove this journey.
- Choosing a nav link closes the menu because the click target is an `a`. Clicking the button again also toggles it; this script uses the link.
- `Scroll to top` stays `hidden` until `scrollY` passes 320, then the page adds `scroll-to-top--visible` and removes `hidden`.
- Scrolling is smooth. Wait for `scrollY` and for `#top` to sit under the navbar.
- The desktop page-sections journey does not prove the menu or the scroll button.
