declare global {
  interface ImportMetaEnv {
    readonly SUPABASE_URL: string;
    readonly SUPABASE_SERVICE_ROLE_KEY: string;
    readonly RESUME_BUILD_FALLBACK?: string;
  }
}

export {};
