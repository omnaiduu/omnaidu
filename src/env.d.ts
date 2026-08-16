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
  export const cache: {
    purge(opts: {
      tags?: string[]
      pathPrefixes?: string[]
      purgeEverything?: boolean
    }): Promise<unknown>
  }
}

declare module '*.wasm' {
  const value: WebAssembly.Module
  export default value
}

declare module '*.ttf?inline' {
  const value: string
  export default value
}
