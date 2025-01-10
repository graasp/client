import { Schema, ValidateEnv } from '@julr/vite-plugin-validate-env';
import { defineConfig } from '@tanstack/start/config';
import svgr from 'vite-plugin-svgr';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    preset: 'node-server',
  },
  vite: {
    ...(process.env.NODE_ENV === 'production' && {
      ssr: {
        noExternal: ['@mui/*'],
      },
    }),

    plugins: [
      process.env.NODE_ENV === 'production'
        ? ValidateEnv({
            VITE_GRAASP_H5P_INTEGRATION_URL: Schema.string({
              format: 'url',
              protocol: true,
            }),
            VITE_GOOGLE_KEY: Schema.string(),
            VITE_GRAASP_REDIRECTION_HOST: Schema.string({
              format: 'url',
              protocol: true,
            }),
          })
        : undefined,
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      svgr(),
    ],
  },
});
