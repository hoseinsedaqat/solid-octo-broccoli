import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The Mini App is served by the same Worker as the API (Workers Static Assets).
// In development Vite proxies /api to wrangler dev so the browser only ever talks to one origin.
const API_TARGET = process.env.WW_API_TARGET ?? 'http://127.0.0.1:8787';

export default defineConfig({
  plugins: [react()],
  // no alias needed for @ww/shared: npm workspaces symlink it into node_modules and its
  // package.json exports ./src/index.ts directly — which also avoids URL→path bugs on Windows
  // (new URL(...).pathname yields "/E:/Data%20Analysis/..." there and breaks vite build).
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
