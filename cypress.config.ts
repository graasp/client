import setupCoverage from '@cypress/code-coverage/task.js';
import { defineConfig } from 'cypress';

const ENV = {
  VITE_GRAASP_REDIRECTION_HOST: process.env.VITE_GRAASP_REDIRECTION_HOST,
  VITE_GRAASP_DOMAIN: process.env.VITE_GRAASP_DOMAIN,
  VITE_GRAASP_API_HOST: process.env.VITE_GRAASP_API_HOST,
  VITE_SHOW_NOTIFICATIONS: false,
  VITE_GRAASP_LIBRARY_HOST: process.env.VITE_GRAASP_LIBRARY_HOST,
  VITE_GRAASP_ANALYZER_HOST: process.env.VITE_GRAASP_ANALYZER_HOST,
};

export default defineConfig({
  e2e: {
    // needed for redirection tests to pass
    chromeWebSecurity: false,
    env: ENV,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      setupCoverage(on, config);
      return config;
    },
    baseUrl: `http://localhost:${process.env.VITE_PORT ?? 3333}`,
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    env: ENV,
  },
});
