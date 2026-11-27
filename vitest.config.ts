import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const shared = fileURLToPath(new URL('./shared/src/index.ts', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@ww/shared': shared,
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // integration tests boot a real workerd + D1 instance per file
    pool: 'forks',
    testTimeout: 60_000,
    hookTimeout: 120_000,
    isolate: true,
  },
  esbuild: { target: 'es2022' },
});
