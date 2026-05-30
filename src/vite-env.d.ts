/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_MSW: string;
  readonly VITE_API_BASE: string;
  readonly VITE_USE_LOCAL_STORAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
