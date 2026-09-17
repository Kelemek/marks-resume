// Client-visible env vars (PUBLIC_*). Server-only vars are typed in env.server.d.ts.
declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_POSTHOG_KEY?: string;
    readonly PUBLIC_POSTHOG_HOST?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
/// <reference path="../.astro/types.d.ts" />
