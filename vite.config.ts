import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import rsc from '@vitejs/plugin-rsc'

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    cloudflare({
      // TanStack Start's Worker fetch lives in the `ssr` environment
      // (`@tanstack/react-start/server-entry`). RSC is a child module graph
      // inside that Worker. Do not set the parent to `rsc` — that entry has
      // no default export and wrangler deploy fails with a service-worker error.
      viteEnvironment: {
        name: 'ssr',
        childEnvironments: ['rsc'],
      },
    }),
    tanstackStart({
      rsc: { enabled: true },
    }),
    rsc(),
    viteReact(),
  ],
})
