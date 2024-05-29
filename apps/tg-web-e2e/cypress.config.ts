import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'nx run tg-web:serve',
        production: 'nx run tg-web:preview',
      },
      ciWebServerCommand: 'nx run tg-web:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});