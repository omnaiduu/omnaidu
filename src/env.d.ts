/// <reference types="@cloudflare/workers-types" />
/// <reference types="vite/client" />

declare namespace Cloudflare {
  interface Env {
    DB: D1Database
    MEDIA: R2Bucket
    SITE_URL: string
    SITE_NAME: string
    PUBLISH_SECRET?: string
    STATS_TOKEN?: string
  }
}

interface CacheStorage {
  readonly default: Cache
}

declare module '*.wasm' {
  const value: WebAssembly.Module
  export default value
}

declare module '*.ttf?inline' {
  const value: string
  export default value
}
