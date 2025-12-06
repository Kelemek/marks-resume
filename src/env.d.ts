// Type declarations for Vite environment variables used in the project
// Add any VITE_* variables here so TypeScript recognizes them on import.meta.env
declare global {
  interface ImportMetaEnv {
    readonly VITE_CLARITY_ID?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
/// <reference path="../.astro/types.d.ts" />