# Certificates

The visitor expands the Scrimba certificate stack and opens a certificate in the modal, then dismisses it.

## Sub-features

- `scrimba-collapsed` starts with the stack closed.
- `scrimba-expand` opens the stack and shows every Scrimba title.
- `cert-open` opens the first education certificate that has a View button.
- `cert-close` dismisses the modal with the × control and with Escape.

## How to get to it (user POV)

- Scroll to Education & Certifications.
- Choose `Scrimba Certificates (N)`.
- Choose `View` on a certificate card.
- Choose the ×, press Escape, or click the backdrop to close.

## Driving it with Playwright

Preconditions:

- `launch.sh` and `doctor.sh` succeed.
- At least one education certificate (not inside the Scrimba stack) has a View button. If none does, the script exits non-zero with `unmet precondition`. That is a failure, not a skip.

- **See the stack closed.** Run `scripts/verify-marks-resume/drive-certificates.sh`. `#scrimbaStackToggle` aria-expanded is `false`, and `#scrimbaStack` does not have class `expanded`. The toggle text matches `Scrimba Certificates (N)`.
- **Expand.** Click the toggle. aria-expanded is `true`, the stack has class `expanded`, and `#scrimbaStackPanel h3` count equals N.
- **Open a certificate.** Click the first `.cert-button` that is a direct education card (`#education-grid > div:not(.stacked-card-container) .cert-button`). For a raster `data-cert`, `#certImage` is shown, its src equals that value, and `naturalWidth` is greater than 0. For any other file, `#certViewer` is shown and its src starts with that value. The other viewer stays `display: none`. The modal’s `display` is `block`.
- **Close with ×.** Click `#certModal .close`. The modal and both viewers are `display: none`.
- **Close with Escape.** Open the same certificate again and press Escape. The modal hides again.
- **Proof.** The script writes `evidence/certificates-collapsed.png`, `evidence/certificates-expanded.png`, `evidence/certificates-modal.png`, `evidence/certificates-closed.png`, and `evidence/certificates.txt`.

## Gotchas

- Scrimba View buttons are in the collapsed panel and are not the click target for `cert-open`. Use an education card outside the stack.
- N is the number of Scrimba certificates, including cards with no file. The title count must match N. The View-button count can be lower.
- Raster certificates are images (including `.webp`). PDF paths use the iframe. The script branches on the extension the same way the page does.
- The × control is a `span.close`, not a button. Backdrop click also closes; this script does not click the backdrop.
- Clearing `img.src` in the page script can make the property resolve to the page URL. The proof is that the modal is hidden, not that the src attribute is empty.
- A dataset with no education View button fails `cert-open`. Do not pass the journey on the heading alone.
