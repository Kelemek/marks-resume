#!/usr/bin/env python3
"""Read-only check that a local astro build has Supabase credentials.

Prints no secret values. Exit 0 when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
are set in the environment or in <repo>/.env and are not the example placeholders.
Exit 2 when RESUME_BUILD_FALLBACK=true (astro build rejects that).
Exit 3 when the URL or key is missing or still a placeholder.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path


def load_dotenv(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for raw in path.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        if line.startswith("export "):
            line = line[len("export ") :]
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: check_env.py <repo-root>", file=sys.stderr)
        return 1

    root = Path(sys.argv[1])
    values = load_dotenv(root / ".env")
    for key in ("SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "RESUME_BUILD_FALLBACK"):
        if os.environ.get(key):
            values[key] = os.environ[key]

    if values.get("RESUME_BUILD_FALLBACK") == "true":
        print(
            "RESUME_BUILD_FALLBACK=true cannot build this site. "
            "astro build throws when that flag is set. Unset it and provide "
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
            file=sys.stderr,
        )
        return 2

    url = values.get("SUPABASE_URL", "")
    key = values.get("SUPABASE_SERVICE_ROLE_KEY", "")
    placeholder = (
        not url
        or "your-project-ref" in url
        or not key
        or "your-service-role-key" in key
    )
    if placeholder:
        print(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the environment "
            "or in .env, and must not still be the .env.example placeholders. "
            "Resume data is fetched at build time. Do not set RESUME_BUILD_FALLBACK to skip this.",
            file=sys.stderr,
        )
        return 3
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
