#!/usr/bin/env bash
set -euo pipefail
# shellcheck source=scripts/verify-marks-resume/common.sh
source "$(dirname "$0")/common.sh"

ROOT="$(repo_root)"
attach_run
"${ROOT}/scripts/verify-marks-resume/doctor.sh"
ensure_playwright
cd "$ROOT"
node "${ROOT}/scripts/verify-marks-resume/drive.mjs" theme-toggle
