# marks-resume verification map

This directory is the maintained source for verifying the user-facing behavior of the resume site. Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- From the repo root, with Node 22.23.4+ and `npm ci` already done.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in the environment or `.env`. They must not be the `.env.example` placeholders.
- `RESUME_BUILD_FALLBACK` is unset. A production build throws when it is `true`.
- `scripts/verify-marks-resume/launch.sh` then `doctor.sh` must pass.
- Base URL: `http://127.0.0.1:${MARKS_RESUME_VERIFY_PORT:-4391}`.
- The preview was started by this verification run. Never drive a preview you did not start.
- One checkout shares `dist/`. Do not run two launches at once.

## Driving conventions

- Run browser actions through the `scripts/verify-marks-resume/drive-*.sh` wrappers.
- Prefer the ids and accessible names in each feature file (`#themeToggle`, `Download Resume`, `#experience`).
- Harness contexts use a light color scheme and an empty `localStorage`. That is the script’s starting point, not a claim that every visitor’s OS is light.
- Do not report a feature as verified because a different feature’s script passed.

## Proof and skip reporting

- Save screenshots and `*.txt` transcripts under `/tmp/marks-resume-verify-$RUN_ID/evidence/`.
- UI proof includes the screenshot and, for the page journey, an ARIA snapshot. The fixed nav shows “Mark Dean Larson”.
- The download proof includes the saved text file, not only a picture of the button.
- Report an unmet precondition with the command and the reason. A certificate journey with no View button fails; it is not a pass.
- Do not report a skipped entry point as verified through a different path.

## Features

- [Resume page](./page-sections.md) — load `/`, read the sections, follow in-page links, check contact and portfolio anchors.
- [Theme toggle](./theme-toggle.md) — switch light and dark, then reload.
- [ATS resume download](./ats-download.md) — Download Resume writes the text file.
- [Certificates](./certificates.md) — open the Scrimba stack and a certificate, then close it.
- [Mobile navigation and scroll to top](./mobile-nav.md) — the 390px menu and the return-to-top control.
