# ATS resume download

The visitor downloads a plain-text resume. The button is labeled Download Resume. The file is `Mark_Dean_Larson_Resume_ATS.txt`, not a PDF.

## Sub-features

- `download-file` saves that filename from the Download Resume button.
- `download-identity` includes the ATS name, email, and phone.
- `download-jobs` includes the first job title shown in Experience.
- `download-button-resets` returns the button to `Download Resume` and enables it.

## How to get to it (user POV)

- On the hero, choose `Download Resume`.

## Driving it with Playwright

Preconditions:

- `launch.sh` and `doctor.sh` succeed.
- `window.atsResumeData` is set and Experience has at least one `h3`.

- **Read the on-page job.** Run `scripts/verify-marks-resume/drive-ats-download.sh`. The script records the first `#experience h3`.
- **Download.** Click the button named `Download Resume` (`#downloadPDF`). The browser download’s filename is `Mark_Dean_Larson_Resume_ATS.txt`.
- **Read the file.** The saved text contains `MARK LARSON`, `markdlarson@me.com`, `763.355.2923`, `PROFESSIONAL SUMMARY`, `PROFESSIONAL EXPERIENCE`, and that job title.
- **See the button settle.** `#downloadPDF` is enabled and its text is `Download Resume`.
- **Proof.** The script writes the text file into `evidence/` plus `evidence/ats-download.png` and `evidence/ats-download.txt`.

## Gotchas

- The control says Download Resume and the bytes are UTF-8 text. Do not require a PDF.
- The button may briefly read `Generating Document...`. Assert the settled label after the download event.
- A download that does not contain the job title rendered on the page fails. Do not compare the file only to the hardcoded name.
- `file-saver` fires the download from a short timer. Wait for Playwright’s download event; do not invent the file from `buildAtsDocumentText`.
