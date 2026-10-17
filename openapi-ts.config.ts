import { defineConfig } from '@hey-api/openapi-ts';

const API_HOST =
  process.env.VITE_GRAASP_API_HOST ?? 'http://localhost:3000';

export default defineConfig({
  input: `${API_HOST}/docs/json`,
  output: {
    format: 'prettier',
    lint: 'eslint',
    path: './src/openapi/client',
  },
  plugins: [
    '@tanstack/react-query',
    {
      name: '@hey-api/client-fetch',
      runtimeConfigPath: '../clientConfig.ts',
    },
  ],
});
