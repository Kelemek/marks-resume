#!/usr/bin/env bash
# Shared state for marks-resume verification. Source this file; do not execute it.
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  echo "[verify-marks-resume] Source scripts/verify-marks-resume/common.sh; do not execute it." >&2
  exit 1
fi

set -euo pipefail

export PLAYWRIGHT_VERSION="${PLAYWRIGHT_VERSION:-1.65.0}"
LOCK_FILE="/tmp/marks-resume-verify.lock"

read_lock() {
  LOCK_RUN_ID=""
  LOCK_PORT=""
  LOCK_PID=""
  [[ -f "$LOCK_FILE" ]] || return 1
  LOCK_RUN_ID="$(sed -n 's/^run_id=//p' "$LOCK_FILE" | head -n 1)"
  LOCK_PORT="$(sed -n 's/^port=//p' "$LOCK_FILE" | head -n 1)"
  LOCK_PID="$(sed -n 's/^pid=//p' "$LOCK_FILE" | head -n 1)"
  [[ -n "$LOCK_RUN_ID" && -n "$LOCK_PORT" && -n "$LOCK_PID" ]]
}

lock_pid_alive() {
  [[ -n "${LOCK_PID:-}" ]] && kill -0 "$LOCK_PID" 2>/dev/null
}

write_lock() {
  local pid="$1"
  local tmp="${LOCK_FILE}.tmp"
  printf 'run_id=%s\nport=%s\npid=%s\n' "$MARKS_RESUME_VERIFY_RUN_ID" "$MARKS_RESUME_VERIFY_PORT" "$pid" >"$tmp"
  mv -f "$tmp" "$LOCK_FILE"
}

assign_paths() {
  export MARKS_RESUME_VERIFY_RUN_ID
  export MARKS_RESUME_VERIFY_PORT
  export MARKS_RESUME_VERIFY_URL="http://127.0.0.1:${MARKS_RESUME_VERIFY_PORT}"
  export MARKS_RESUME_VERIFY_DIR="/tmp/marks-resume-verify-${MARKS_RESUME_VERIFY_RUN_ID}"
  export EVIDENCE_DIR="${MARKS_RESUME_VERIFY_DIR}/evidence"
  export PID_FILE="${MARKS_RESUME_VERIFY_DIR}/preview.pid"
  export BUILD_LOG="${MARKS_RESUME_VERIFY_DIR}/build.log"
  export PREVIEW_LOG="${MARKS_RESUME_VERIFY_DIR}/preview.log"
  export BUILD_STAMP="${MARKS_RESUME_VERIFY_DIR}/build.stamp"
  mkdir -p "$MARKS_RESUME_VERIFY_DIR" "$EVIDENCE_DIR"
}

validate_identity() {
  if [[ ! "${MARKS_RESUME_VERIFY_RUN_ID}" =~ ^[A-Za-z0-9._-]+$ ]]; then
    echo "[verify-marks-resume] Invalid MARKS_RESUME_VERIFY_RUN_ID" >&2
    exit 1
  fi
  if [[ ! "${MARKS_RESUME_VERIFY_PORT}" =~ ^[0-9]+$ ]] \
    || [[ "$MARKS_RESUME_VERIFY_PORT" -lt 1 ]] \
    || [[ "$MARKS_RESUME_VERIFY_PORT" -gt 65535 ]]; then
    echo "[verify-marks-resume] Invalid MARKS_RESUME_VERIFY_PORT" >&2
    exit 1
  fi
}

attach_run() {
  if [[ -z "${MARKS_RESUME_VERIFY_RUN_ID:-}" ]]; then
    if ! read_lock || ! lock_pid_alive; then
      echo "[verify-marks-resume] No active run. Run scripts/verify-marks-resume/launch.sh first, or export MARKS_RESUME_VERIFY_RUN_ID." >&2
      exit 1
    fi
    MARKS_RESUME_VERIFY_RUN_ID="$LOCK_RUN_ID"
    if [[ -z "${MARKS_RESUME_VERIFY_PORT:-}" ]]; then
      MARKS_RESUME_VERIFY_PORT="$LOCK_PORT"
    elif [[ "$MARKS_RESUME_VERIFY_PORT" != "$LOCK_PORT" ]]; then
      echo "[verify-marks-resume] Live run ${LOCK_RUN_ID} is on port ${LOCK_PORT}, not ${MARKS_RESUME_VERIFY_PORT}." >&2
      exit 1
    fi
  fi
  export MARKS_RESUME_VERIFY_PORT="${MARKS_RESUME_VERIFY_PORT:-4391}"
  validate_identity
  assign_paths
}

begin_launch() {
  if read_lock && lock_pid_alive; then
    local ready_pid=""
    local run_dir="/tmp/marks-resume-verify-${LOCK_RUN_ID}"
    if [[ -f "${run_dir}/preview.pid" ]]; then
      ready_pid="$(tr -d '[:space:]' < "${run_dir}/preview.pid")"
    fi
    if [[ -n "$ready_pid" && "$ready_pid" == "$LOCK_PID" ]] && kill -0 "$ready_pid" 2>/dev/null; then
      if [[ -n "${MARKS_RESUME_VERIFY_RUN_ID:-}" && "$MARKS_RESUME_VERIFY_RUN_ID" != "$LOCK_RUN_ID" ]]; then
        echo "[verify-marks-resume] Run ${LOCK_RUN_ID} is already serving. Cleanup before starting ${MARKS_RESUME_VERIFY_RUN_ID}." >&2
        exit 1
      fi
      if [[ -n "${MARKS_RESUME_VERIFY_PORT:-}" && "$MARKS_RESUME_VERIFY_PORT" != "$LOCK_PORT" ]]; then
        echo "[verify-marks-resume] Live run ${LOCK_RUN_ID} is on port ${LOCK_PORT}. Refusing port ${MARKS_RESUME_VERIFY_PORT}." >&2
        exit 1
      fi
      export MARKS_RESUME_VERIFY_RUN_ID="$LOCK_RUN_ID"
      export MARKS_RESUME_VERIFY_PORT="$LOCK_PORT"
      export MARKS_RESUME_VERIFY_ALREADY=1
      export MARKS_RESUME_VERIFY_SERVER_PID="$LOCK_PID"
      validate_identity
      assign_paths
      return
    fi
    echo "[verify-marks-resume] Another launch is in progress (pid ${LOCK_PID}, run ${LOCK_RUN_ID}). Wait for it or run cleanup.sh for that run." >&2
    exit 1
  fi

  rm -f "$LOCK_FILE"
  export MARKS_RESUME_VERIFY_RUN_ID="${MARKS_RESUME_VERIFY_RUN_ID:-$(date +%s)}"
  export MARKS_RESUME_VERIFY_PORT="${MARKS_RESUME_VERIFY_PORT:-4391}"
  validate_identity
  assign_paths
  write_lock "$$"
}

repo_root() {
  cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd
}

ensure_playwright() {
  local root bin version
  root="$(repo_root)"
  bin="${root}/node_modules/.bin/playwright"
  if [[ ! -x "$bin" ]]; then
    echo "[verify-marks-resume] playwright is not installed. From the repo root run: npm ci" >&2
    exit 1
  fi
  version="$("$bin" --version)"
  if [[ "$version" != "Version ${PLAYWRIGHT_VERSION}" ]]; then
    echo "[verify-marks-resume] Expected Playwright ${PLAYWRIGHT_VERSION}, found ${version}. Run npm ci." >&2
    exit 1
  fi
  "$bin" install chromium
}

list_descendants() {
  local pid="$1"
  local child
  for child in $(ps -o pid= --ppid "$pid" 2>/dev/null); do
    child="${child// /}"
    [[ -n "$child" ]] || continue
    list_descendants "$child"
    printf '%s\n' "$child"
  done
}

kill_tree() {
  local pid="$1"
  local sig="${2:-TERM}"
  local child
  [[ -n "$pid" ]] || return 0
  for child in $(list_descendants "$pid"); do
    kill "-${sig}" "$child" 2>/dev/null || true
  done
  kill "-${sig}" "$pid" 2>/dev/null || true
}

pid_is_ancestor_of() {
  local ancestor="$1"
  local pid="$2"
  local guard=0
  while [[ -n "$pid" && "$pid" != "0" && "$pid" != "1" && "$guard" -lt 40 ]]; do
    if [[ "$pid" == "$ancestor" ]]; then
      return 0
    fi
    pid="$(ps -o ppid= -p "$pid" 2>/dev/null | tr -d '[:space:]' || true)"
    guard=$((guard + 1))
  done
  return 1
}

listeners_on_port() {
  lsof -nP -iTCP:"$1" -sTCP:LISTEN -t 2>/dev/null | awk 'NF' | sort -u || true
}
