export const API_HOST =
  import.meta.env.VITE_GRAASP_API_HOST ?? 'http://localhost:3000';

export const SHOW_NOTIFICATIONS =
  (import.meta.env.VITE_SHOW_NOTIFICATIONS ?? 'true') === 'true';

export const APP_VERSION = import.meta.env.VITE_VERSION;

export const GRAASP_BUILDER_HOST =
  import.meta.env.VITE_GRAASP_BUILDER_HOST ?? 'http://localhost:3111';
export const GRAASP_PLAYER_HOST =
  import.meta.env.VITE_GRAASP_PLAYER_HOST ?? 'http://localhost:3112';
export const GRAASP_LIBRARY_HOST =
  import.meta.env.VITE_GRAASP_LIBRARY_HOST ?? 'http://localhost:3005';
export const GRAASP_ANALYTICS_HOST =
  import.meta.env.VITE_GRAASP_ANALYTICS_HOST ?? 'http://localhost:3113';

export const SENTRY_ENV = import.meta.env.VITE_SENTRY_ENV;
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
