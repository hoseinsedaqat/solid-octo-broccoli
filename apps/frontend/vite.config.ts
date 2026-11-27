import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The Mini App is served by the same Worker as the API (Workers Static Assets).
// In development Vite proxies /api to wrangler dev so the browser only ever talks to one origin.
const API_TARGET = process.env.WW_API_TARGET ?? 'http://127.0.0.1:8787';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // shared source (constants + zod schemas) is bundled straight from the workspace,
      // so the UI can never drift from the categories/statuses the Worker uses
      '@ww/shared': new URL('../../shared/src/index.ts', import.meta.url).pathname,
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: true },
      '/bot': { target: API_TARGET, changeOrigin: true },
    },
  },
  preview: { host: '0.0.0.0', port: 4173, allowedHosts: true },
  build: { outDir: 'dist', sourcemap: false, target: 'es2020' },
});
