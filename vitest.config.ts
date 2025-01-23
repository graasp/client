import { coverageConfigDefaults, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(viteConfig({ mode: 'test' }), {
  optimizeDeps: {
    entries: ['src/**/*.stories.tsx'],
    // exclude: [
    //   'react-dom/client',
    //   'react-helmet-async',
    //   '@graasp/stylis-plugin-rtl',
    //   '@emotion/cache',
    //   '@emotion/react',
    //   '@sentry/react',
    //   'stylis',
    //   '@tanstack/zod-adapter',
    //   'zod',
    //   'react-hook-form',
    //   '@tanstack/router-devtools',
    //   'date-fns/isAfter',
    //   'jwt-decode',
    // ],
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
