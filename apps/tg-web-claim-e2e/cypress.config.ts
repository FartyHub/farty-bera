import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'nx run tg-web-claim:serve',
        production: 'nx run tg-web-claim:preview',
      },
      ciWebServerCommand: 'nx run tg-web-claim:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
