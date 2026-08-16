/// <reference types="@cloudflare/workers-types" />
/// <reference types="vite/client" />

interface Env {
  DB: D1Database
  MEDIA: R2Bucket
  SITE_URL: string
  SITE_NAME: string
  PUBLISH_SECRET?: string
}

declare module 'cloudflare:workers' {
  export const env: Env
}
