// Type declarations for Vite environment variables used in the project
// Add any VITE_* variables here so TypeScript recognizes them on import.meta.env
declare global {
  interface ImportMetaEnv {
    readonly SUPABASE_URL?: string;
    readonly SUPABASE_SERVICE_ROLE_KEY?: string;
    readonly PUBLIC_POSTHOG_KEY?: string;
    readonly PUBLIC_POSTHOG_HOST?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
/// <reference path="../.astro/types.d.ts" />