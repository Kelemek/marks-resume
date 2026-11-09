# Theme toggle

The visitor switches the page between light and dark. The choice is stored and kept after a reload.

## Sub-features

- `theme-initial` follows the harness light color scheme.
- `theme-toggle` flips `data-theme`, the visible label, and the button’s aria-label.
- `theme-persist` keeps dark after reload.

## How to get to it (user POV)

- Use the theme button in the top navbar. Its visible text names the mode you are switching to (`Dark Mode` or `Light Mode`).

## Driving it with Playwright

Preconditions:

- `launch.sh` and `doctor.sh` succeed.
- The script’s context forces `colorScheme: 'light'` and starts with empty storage.

- **See the light page.** Run `scripts/verify-marks-resume/drive-theme-toggle.sh`. `body` `data-theme` is `light`, `.theme-text` is `Dark Mode`, and `#themeToggle` aria-label is `Switch to dark mode`.
- **Switch to dark.** Click `#themeToggle`. `data-theme` is `dark`, the text is `Light Mode`, the aria-label is `Switch to light mode`, and `localStorage.theme` is `dark`.
- **Reload.** Load the page again in the same context. `data-theme` is still `dark` and the text is still `Light Mode`.
- **Proof.** The script writes `evidence/theme-toggle-light.png`, `evidence/theme-toggle-dark.png`, `evidence/theme-toggle-persisted.png`, and `evidence/theme-toggle.txt`.

## Gotchas

- The accessible name is the aria-label (`Switch to dark mode`), not the visible words `Dark Mode`. Those words name the destination theme.
- The first paint in the HTML has no `data-theme`. The default CSS tokens are the dark palette until the script sets `light`. Assert after the aria-label has updated.
- A context that already has `localStorage.theme` will not follow the color scheme. The drive script uses a new context.
- This journey does not prove the system color-scheme listener. It proves a saved choice survives reload.
