/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    outDir: '../../dist/apps/tg-web',
    reportCompressedSize: true,
  },

  cacheDir: '../../node_modules/.vite/apps/tg-web',

  plugins: [
    react(),
    nxViteTsPaths(),
    nodePolyfills(),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        description: 'Catch a bera in the Farty Arcade',
        icons: [
          {
            sizes: '192x192',
            src: 'logo-192x192.png',
            type: 'image/png',
          },
          {
            sizes: '512x512',
            src: 'logo.png',
            type: 'image/png',
          },
        ],
        name: 'Farty Claw - Bera',
        short_name: 'Farty Claw - Bera',
        theme_color: '#FFF9F2',
      },
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000,
      },
    }),
  ],

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
      reportsDirectory: '../../coverage/apps/tg-web',
    },
    environment: 'jsdom',
    globals: true,

    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
  },
});
