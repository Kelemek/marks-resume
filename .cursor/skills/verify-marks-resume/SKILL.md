---
name: verify-marks-resume
description: "Drive the marks-resume Astro site from a local production build (astro build and astro preview) for agent proof — launch, doctor, Playwright journeys, and feature-map recipes. Use when a change to the resume page, theme, download, certificates, or mobile nav needs evidence from the running site."
---

# Verify marks-resume (web)

Agents prove behavior in the **built static site** served by **`astro preview`**. Resume rows are fetched from Supabase at **build** time. This is the local stand-in for https://resume.romans8.net. It is not a substitute for `npm run test:run`; run both when changing rendering or client scripts.

The site is one page, `/`. There is no second route.

## Launch

From the repo root, with Node **22.12+** (`.nvmrc`) and dependencies already installed (`npm ci`):

```bash
export MARKS_RESUME_VERIFY_RUN_ID="${MARKS_RESUME_VERIFY_RUN_ID:-$(date +%s)}"
export MARKS_RESUME_VERIFY_PORT="${MARKS_RESUME_VERIFY_PORT:-4391}"
scripts/verify-marks-resume/launch.sh
```

- Runs `npm run build`, then `npm run preview -- --host 127.0.0.1 --port $MARKS_RESUME_VERIFY_PORT`.
- Default port **4391** so a developer’s `astro preview` on **4321** is left alone.
- State directory: `/tmp/marks-resume-verify-$MARKS_RESUME_VERIFY_RUN_ID/` (`build.log`, `preview.log`, `preview.pid`, `build.stamp`, `evidence/`).
- **Ready** when `scripts/verify-marks-resume/doctor.sh` exits 0. Launch waits for that and prints `Ready at http://127.0.0.1:4391`.
- Credentials come from the environment or `.env`: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. `scripts/verify-marks-resume/check_env.py` rejects missing values and the `.env.example` placeholders. It prints no secret values.
- **Do not set `RESUME_BUILD_FALLBACK=true`.** `astro build` throws when that flag is set, on purpose, so an empty resume cannot ship. Launch refuses the flag before building.
- A second launch while this run’s preview is still up does **not** rebuild. It prints the existing URL and exits 0. Cleanup, then launch, after code or content changes.
- One checkout shares `dist/`. Launch holds `/tmp/marks-resume-verify.lock`. A second run is refused while that lock’s pid is alive. Do not point these scripts at a preview you did not start.

If you omit the exports, launch picks a run id and port 4391, and later scripts in a new shell attach to that lock.

## Doctor

```bash
scripts/verify-marks-resume/doctor.sh
```

Read-only. Checks:

1. `preview.pid` is alive and is the process, or an ancestor of the process, listening on the verify port.
2. That listener is bound to `127.0.0.1` (not a public interface).
3. `build.stamp` `git_sha` matches `HEAD`. A mismatch means the preview is stale.
4. `build.stamp` `data_source` is `supabase`.
5. `GET /` returns HTTP 200 and the HTML contains the name, the five section ids, the theme, download, and menu controls, and the experience heading.

If doctor fails, read `build.log` and `preview.log` in the run directory before retrying.

## Drive

Harness: **Playwright 1.65.0**, a devDependency (`playwright` in `package.json`, pin also in `scripts/verify-marks-resume/common.sh`). The scripts always open `http://127.0.0.1:$MARKS_RESUME_VERIFY_PORT`. There is no URL override, so a drive cannot be aimed at production by accident.

Read the feature map first: [features/README.md](./features/README.md).

**Helpers (preferred):**

| Script | Purpose |
|--------|---------|
| `scripts/verify-marks-resume/drive-page-sections.sh` | Page load, section headings, nav and contact links |
| `scripts/verify-marks-resume/drive-theme-toggle.sh` | Light/dark toggle and reload persistence |
| `scripts/verify-marks-resume/drive-ats-download.sh` | Download Resume button writes the ATS text file |
| `scripts/verify-marks-resume/drive-certificates.sh` | Scrimba stack, certificate modal, close and Escape |
| `scripts/verify-marks-resume/drive-mobile-nav.sh` | 390px menu and scroll-to-top |

Example:

```bash
scripts/verify-marks-resume/drive-page-sections.sh
```

Each wrapper runs doctor, installs Playwright Chromium for the local `playwright` package if needed, then runs `node scripts/verify-marks-resume/drive.mjs` with the feature name (`page-sections`, `theme-toggle`, `ats-download`, `certificates`, or `mobile-nav`). Call the wrapper, not `drive.mjs`, so the run id, port, and evidence directory are set.

Journeys use a fresh browser context with `colorScheme: 'light'`. They do not read the operator’s `localStorage`.

## Evidence

- Directory: `/tmp/marks-resume-verify-$MARKS_RESUME_VERIFY_RUN_ID/evidence/`
- Each drive writes PNG screenshots and a `*.txt` transcript (`feature`, `url`, checks, `status`).
- Page sections also write `page-sections.aria.txt` (Playwright ARIA snapshot). The nav logo “Mark Dean Larson” is in the viewport shots.
- The ATS journey saves `Mark_Dean_Larson_Resume_ATS.txt` into that directory and checks it contains the name, email, phone, summary, and the first job title rendered on the page.
- **Proof standards:** exercise the built page in a browser. Do not call `getResumeData` or other modules and call that a pass. Capture the action and the result (hash change, `data-theme`, download bytes, modal open and closed), not only the final screen. External targets (`mailto:`, `tel:`, Apple Maps, portfolio.romans8.net) are proved by the anchor’s href, target, and rel. The scripts do not hand those off to the OS or require the other site to be up.
- PostHog is a no-op unless `PUBLIC_POSTHOG_KEY` is set. Journeys do not assert analytics requests.
- **Cleanup must not delete evidence.**

## Cleanup

```bash
scripts/verify-marks-resume/cleanup.sh
```

Stops the pid recorded for this run, and its child processes, then removes `preview.pid` and this run’s lock. It does **not** remove the run directory or `evidence/`. It does not delete `dist/`. If the port is still held by a process this run did not start, cleanup exits 1 without killing that process.

## Helpers

| Script | Invocation |
|--------|------------|
| `scripts/verify-marks-resume/check_env.py` | `python3 scripts/verify-marks-resume/check_env.py <repo-root>` — exit 0 ready, 2 fallback flag set, 3 missing or placeholder credentials. No secret output. |
| `scripts/verify-marks-resume/launch.sh` | Starts the build and preview. |
| `scripts/verify-marks-resume/doctor.sh` | Read-only health check. |
| `scripts/verify-marks-resume/cleanup.sh` | Stops this run’s preview. |
| `scripts/verify-marks-resume/drive-*.sh` | One user journey each. |
| `scripts/verify-marks-resume/drive.mjs` | Playwright steps. Arguments: `page-sections`, `theme-toggle`, `ats-download`, `certificates`, `mobile-nav`. Requires `MARKS_RESUME_VERIFY_URL` and `EVIDENCE_DIR` from the shell wrappers. |
| `scripts/verify-marks-resume/common.sh` | Sourced by the shell scripts. Holds the port, lock, process-tree kill, and Playwright version. Do not execute it. |

Shell scripts honor:

- `MARKS_RESUME_VERIFY_RUN_ID`
- `MARKS_RESUME_VERIFY_PORT`

`MARKS_RESUME_VERIFY_URL` is always `http://127.0.0.1:$MARKS_RESUME_VERIFY_PORT`.

The first drive may download Chromium for the installed Playwright into the user cache (`node_modules/.bin/playwright install chromium`). That browser is not committed. `ensure_playwright` refuses a different Playwright version than `PLAYWRIGHT_VERSION`.

## Maintenance

When section ids, button names, theme labels, the download filename, or nav links change, update the matching file under `features/` and re-run that drive script. Use `/maintain-verification-skill` for a structured pass.
