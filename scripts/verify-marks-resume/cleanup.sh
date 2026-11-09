#!/usr/bin/env bash
set -euo pipefail
# shellcheck source=scripts/verify-marks-resume/common.sh
source "$(dirname "$0")/common.sh"

attach_run

if [[ ! -f "$PID_FILE" ]]; then
  echo "[cleanup] No pid file at ${PID_FILE}"
else
  PID="$(tr -d '[:space:]' < "$PID_FILE")"
  if [[ -n "$PID" ]] && kill -0 "$PID" 2>/dev/null; then
    kill_tree "$PID" TERM
    for _ in 1 2 3 4 5; do
      if ! kill -0 "$PID" 2>/dev/null; then
        break
      fi
      sleep 1
    done
    if kill -0 "$PID" 2>/dev/null; then
      kill_tree "$PID" KILL
    fi
    echo "[cleanup] Stopped preview pid ${PID}"
  else
    echo "[cleanup] pid ${PID:-<empty>} already stopped"
  fi
  rm -f "$PID_FILE"
fi

if [[ -f "$LOCK_FILE" ]]; then
  lock_id="$(sed -n 's/^run_id=//p' "$LOCK_FILE" | head -n 1 || true)"
  if [[ "$lock_id" == "$MARKS_RESUME_VERIFY_RUN_ID" ]]; then
    rm -f "$LOCK_FILE"
  else
    echo "[cleanup] Left lock for run ${lock_id}"
  fi
fi

if [[ -n "$(listeners_on_port "$MARKS_RESUME_VERIFY_PORT")" ]]; then
  echo "[cleanup] Port ${MARKS_RESUME_VERIFY_PORT} is still listening. Not killing processes this run did not start." >&2
  lsof -nP -iTCP:"$MARKS_RESUME_VERIFY_PORT" -sTCP:LISTEN >&2 || true
  exit 1
fi

echo "[cleanup] Evidence preserved at ${EVIDENCE_DIR}"
