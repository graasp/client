import { coverageConfigDefaults, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(viteConfig({ mode: 'test' }), {
  optimizeDeps: {
    include: [
      'react-dom/client',
      'react-helmet-async',
      '@graasp/stylis-plugin-rtl',
      '@emotion/cache',
      '@emotion/react',
      '@sentry/react',
      'stylis',
      'i18next-browser-languagedetector',
      'i18next-fetch-backend',
      '@tanstack/zod-adapter',
      'zod',
      'react-hook-form',
      '@tanstack/router-devtools',
      'date-fns/isAfter',
      'jwt-decode',
    ],
    exclude: ['.cache/**', '.vite'],
  },
  test: {
    environment: 'happy-dom',
    coverage: {
      exclude: [
        ...coverageConfigDefaults.exclude,
        'storybook.setup.ts',
        'src/**/*.stories.*',
        '.storybook',
        'public',
      ],
    },
  },
});
