# marks-resume

Personal resume site (Astro + Tailwind + Supabase).

## Development

```bash
npm ci
npm run dev
```

Copy `.env.example` to `.env` and set:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional: `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`

Node **22.12+** (see `.nvmrc`).

## Build

```bash
npm run build
```

Requires valid Supabase env vars for a full resume (data is fetched at build time).

## CI and forks

GitHub Actions runs `npm run build` with repository secrets `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

If those secrets are missing (e.g. fork PRs), the workflow sets `RESUME_BUILD_FALLBACK=true` and builds with empty placeholder content so the pipeline still passes. **Do not set `RESUME_BUILD_FALLBACK` in production** — production builds will fail if it is enabled.

## Tests

```bash
npm run test:run
```
