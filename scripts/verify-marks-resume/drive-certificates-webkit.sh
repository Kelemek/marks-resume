#!/usr/bin/env bash
set -euo pipefail
# shellcheck source=scripts/verify-marks-resume/common.sh
source "$(dirname "$0")/common.sh"

ROOT="$(repo_root)"
attach_run
"${ROOT}/scripts/verify-marks-resume/doctor.sh"
ensure_playwright_webkit
cd "$ROOT"
export PLAYWRIGHT_BROWSER=webkit
export MARKS_RESUME_VERIFY_VIEWPORT_W="${MARKS_RESUME_VERIFY_VIEWPORT_W:-1166}"
export MARKS_RESUME_VERIFY_VIEWPORT_H="${MARKS_RESUME_VERIFY_VIEWPORT_H:-813}"
node "${ROOT}/scripts/verify-marks-resume/drive.mjs" certificates