#!/usr/bin/env bash
set -euo pipefail
# shellcheck source=scripts/verify-marks-resume/common.sh
source "$(dirname "$0")/common.sh"

ROOT="$(repo_root)"
attach_run

if [[ ! -f "$PID_FILE" ]]; then
  echo "[doctor] Missing pid file ${PID_FILE}. Run launch.sh first." >&2
  exit 1
fi

PID="$(tr -d '[:space:]' < "$PID_FILE")"
if [[ -z "$PID" ]] || ! kill -0 "$PID" 2>/dev/null; then
  echo "[doctor] Process ${PID:-<empty>} is not running" >&2
  exit 1
fi

if ! command -v lsof >/dev/null; then
  echo "[doctor] lsof is required to prove this run owns the port" >&2
  exit 1
fi

mapfile -t listeners < <(listeners_on_port "$MARKS_RESUME_VERIFY_PORT")
if [[ "${#listeners[@]}" -eq 0 ]]; then
  echo "[doctor] Nothing is listening on port ${MARKS_RESUME_VERIFY_PORT}" >&2
  exit 1
fi

for listener in "${listeners[@]}"; do
  if [[ "$listener" != "$PID" ]] && ! pid_is_ancestor_of "$PID" "$listener"; then
    echo "[doctor] Port ${MARKS_RESUME_VERIFY_PORT} is owned by pid ${listener}, not the preview pid ${PID}" >&2
    exit 1
  fi
done

if ! lsof -nP -iTCP:"$MARKS_RESUME_VERIFY_PORT" -sTCP:LISTEN | grep -q "127.0.0.1:${MARKS_RESUME_VERIFY_PORT}"; then
  echo "[doctor] Port ${MARKS_RESUME_VERIFY_PORT} is not bound to 127.0.0.1" >&2
  exit 1
fi

if [[ ! -f "$BUILD_STAMP" ]]; then
  echo "[doctor] Missing build stamp ${BUILD_STAMP}" >&2
  exit 1
fi

stamp_sha="$(sed -n 's/^git_sha=//p' "$BUILD_STAMP" | head -n 1)"
head_sha="$(git -C "$ROOT" rev-parse HEAD)"
if [[ "$stamp_sha" != "$head_sha" ]]; then
  echo "[doctor] Preview was built from ${stamp_sha}; HEAD is ${head_sha}. Cleanup and launch again." >&2
  exit 1
fi

data_source="$(sed -n 's/^data_source=//p' "$BUILD_STAMP" | head -n 1)"
if [[ "$data_source" != "supabase" ]]; then
  echo "[doctor] Expected data_source=supabase, found ${data_source:-<empty>}" >&2
  exit 1
fi

body_file="${MARKS_RESUME_VERIFY_DIR}/doctor-body.html"
http_code="$(curl -sS -o "$body_file" -w '%{http_code}' --max-time 10 "${MARKS_RESUME_VERIFY_URL}/" || true)"
if [[ "$http_code" != "200" ]]; then
  echo "[doctor] GET / returned ${http_code:-000}" >&2
  exit 1
fi

require_in_body() {
  local needle="$1"
  if ! grep -q -F -- "$needle" "$body_file"; then
    echo "[doctor] Response is missing ${needle}" >&2
    exit 1
  fi
}

require_in_body "Mark Dean Larson"
require_in_body 'id="profile"'
require_in_body 'id="experience"'
require_in_body 'id="skills"'
require_in_body 'id="education"'
require_in_body 'id="contact"'
require_in_body 'id="themeToggle"'
require_in_body 'id="downloadPDF"'
require_in_body 'id="hamburgerMenu"'
require_in_body "Professional Experience"

echo "[doctor] OK pid=${PID} url=${MARKS_RESUME_VERIFY_URL} run_id=${MARKS_RESUME_VERIFY_RUN_ID} git_sha=${head_sha} data_source=${data_source}"
