/** @type {import('tailwindcss').Config} */
const { join } = require('path');

const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');

module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        fredoka: 'Fredoka',
        'fredoka-one': 'Fredoka One',
      },
    },
  },
};
