import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin';
import { defineWorkspace } from 'vitest/config';

// More info at: https://storybook.js.org/docs/writing-tests/vitest-plugin
export default defineWorkspace([
  'vite.config.ts',
  {
    extends: 'vite.config.ts',
    plugins: [
      // See options at: https://storybook.js.org/docs/writing-tests/vitest-plugin#storybooktest
      storybookTest({ configDir: '.storybook' }),
    ],
    optimizeDeps: {
      entries: ['src/**/*.stories.tsx'],
    },
    test: {
      name: 'storybook',
      retry: 1,
      browser: {
        enabled: true,
        headless: true,
        name: 'chromium',
        provider: 'playwright',
      },
      setupFiles: ['.storybook/vitest.setup.ts'],
    },
  },
]);
