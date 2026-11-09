#!/usr/bin/env bash
set -euo pipefail
# shellcheck source=scripts/verify-marks-resume/common.sh
source "$(dirname "$0")/common.sh"

ROOT="$(repo_root)"
begin_launch

if [[ "${MARKS_RESUME_VERIFY_ALREADY:-}" == "1" ]]; then
  echo "[verify-marks-resume] Server already running (pid ${MARKS_RESUME_VERIFY_SERVER_PID}) at ${MARKS_RESUME_VERIFY_URL}"
  echo "[verify-marks-resume] run_id=${MARKS_RESUME_VERIFY_RUN_ID} evidence=${EVIDENCE_DIR}"
  echo "[verify-marks-resume] This launch did not rebuild. Cleanup and launch again after code changes."
  exit 0
fi

SERVER_PID=""
on_exit() {
  local status=$?
  if [[ "$status" -eq 0 ]]; then
    return 0
  fi
  if [[ -n "$SERVER_PID" ]]; then
    kill_tree "$SERVER_PID" TERM
    sleep 1
    kill_tree "$SERVER_PID" KILL
  fi
  if [[ -f "$LOCK_FILE" ]]; then
    local lock_id
    lock_id="$(sed -n 's/^run_id=//p' "$LOCK_FILE" | head -n 1 || true)"
    if [[ "$lock_id" == "$MARKS_RESUME_VERIFY_RUN_ID" ]]; then
      rm -f "$LOCK_FILE" "$PID_FILE"
    fi
  fi
}
trap on_exit EXIT

if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
  echo "[verify-marks-resume] node and npm are required" >&2
  exit 1
fi
if ! node -e 'const [maj, min, pat] = process.versions.node.split(".").map(Number); if (maj < 22 || (maj === 22 && (min < 23 || (min === 23 && pat < 4)))) process.exit(1)'; then
  echo "[verify-marks-resume] Node $(node -v) is too old. Use Node 22.23.4 or newer (.nvmrc)." >&2
  exit 1
fi
if [[ ! -x "${ROOT}/node_modules/.bin/astro" ]]; then
  echo "[verify-marks-resume] Dependencies are missing. From the repo root run: npm ci" >&2
  exit 1
fi
if ! command -v curl >/dev/null || ! command -v lsof >/dev/null || ! command -v python3 >/dev/null; then
  echo "[verify-marks-resume] curl, lsof, and python3 are required" >&2
  exit 1
fi

python3 "${ROOT}/scripts/verify-marks-resume/check_env.py" "$ROOT"

if [[ -n "$(listeners_on_port "$MARKS_RESUME_VERIFY_PORT")" ]]; then
  echo "[verify-marks-resume] Port ${MARKS_RESUME_VERIFY_PORT} is already in use. Refusing to kill it." >&2
  lsof -nP -iTCP:"$MARKS_RESUME_VERIFY_PORT" -sTCP:LISTEN >&2 || true
  echo "[verify-marks-resume] Choose another MARKS_RESUME_VERIFY_PORT or stop that process yourself." >&2
  exit 1
fi

cd "$ROOT"
export ASTRO_TELEMETRY_DISABLED=1
echo "[verify-marks-resume] Building static site (log: ${BUILD_LOG})"
if ! npm run build >"$BUILD_LOG" 2>&1; then
  echo "[verify-marks-resume] Build failed. Last lines of ${BUILD_LOG}:" >&2
  tail -n 40 "$BUILD_LOG" >&2 || true
  exit 1
fi

{
  printf 'git_sha=%s\n' "$(git -C "$ROOT" rev-parse HEAD)"
  printf 'data_source=supabase\n'
  printf 'port=%s\n' "$MARKS_RESUME_VERIFY_PORT"
  if [[ -n "$(git -C "$ROOT" status --porcelain)" ]]; then
    printf 'worktree_dirty=yes\n'
  else
    printf 'worktree_dirty=no\n'
  fi
} >"$BUILD_STAMP"

echo "[verify-marks-resume] Starting astro preview on ${MARKS_RESUME_VERIFY_URL}"
nohup npm run preview -- --host 127.0.0.1 --port "$MARKS_RESUME_VERIFY_PORT" >"$PREVIEW_LOG" 2>&1 &
SERVER_PID=$!
disown "$SERVER_PID" 2>/dev/null || true
printf '%s\n' "$SERVER_PID" >"$PID_FILE"
write_lock "$SERVER_PID"

for _ in $(seq 1 60); do
  if "${ROOT}/scripts/verify-marks-resume/doctor.sh" >/dev/null 2>&1; then
    echo "[verify-marks-resume] Ready at ${MARKS_RESUME_VERIFY_URL}"
    echo "[verify-marks-resume] run_id=${MARKS_RESUME_VERIFY_RUN_ID} evidence=${EVIDENCE_DIR}"
    exit 0
  fi
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "[verify-marks-resume] Preview exited early. Last lines of ${PREVIEW_LOG}:" >&2
    tail -n 40 "$PREVIEW_LOG" >&2 || true
    exit 1
  fi
  sleep 1
done

echo "[verify-marks-resume] Timed out waiting for preview. Doctor said:" >&2
"${ROOT}/scripts/verify-marks-resume/doctor.sh" >&2 || true
echo "[verify-marks-resume] Last lines of ${PREVIEW_LOG}:" >&2
tail -n 40 "$PREVIEW_LOG" >&2 || true
exit 1
