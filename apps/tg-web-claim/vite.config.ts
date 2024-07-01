/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    outDir: '../../dist/apps/tg-web-claim',
    reportCompressedSize: true,
  },

  cacheDir: '../../node_modules/.vite/apps/tg-web-claim',

  plugins: [react(), nxViteTsPaths(), nodePolyfills()],

  preview: {
    host: 'localhost',
    port: 4300,
  },

  root: __dirname,

  server: {
    host: 'localhost',
    port: 4200,
  },

  test: {
    cache: {
      dir: '../../node_modules/.vitest',
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../coverage/apps/tg-web-claim',
    },
    environment: 'jsdom',
    globals: true,

    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
  },
});
