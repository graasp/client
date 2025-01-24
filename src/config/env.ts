export const API_HOST =
  import.meta.env.VITE_GRAASP_API_HOST ?? 'http://localhost:3000';

export const SHOW_NOTIFICATIONS =
  (import.meta.env.VITE_SHOW_NOTIFICATIONS ?? 'true') === 'true';

export const APP_VERSION = import.meta.env.VITE_VERSION;

export const GRAASP_LIBRARY_HOST =
  import.meta.env.VITE_GRAASP_LIBRARY_HOST ?? 'http://localhost:3005';

export const SENTRY_ENV = import.meta.env.VITE_SENTRY_ENV;
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
export const GRAASP_REDIRECTION_HOST = import.meta.env
  .VITE_GRAASP_REDIRECTION_HOST;
export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// expect integration url to be present in production
// we should not use the backend integration in production as it exposes the cookies to the h5p files if they are served on the same domain.
if (import.meta.env.PROD && !import.meta.env.VITE_GRAASP_H5P_INTEGRATION_URL) {
  throw new Error(
    "Missing required env variable in production: 'VITE_GRAASP_H5P_INTEGRATION_URL'",
  );
}

export const H5P_INTEGRATION_URL =
  import.meta.env.VITE_GRAASP_H5P_INTEGRATION_URL ??
  `${API_HOST}/items/h5p-assets/integration.html`;

// Question: should we host the pdf player assets inside the public directory here instead of at another bucket ?
// Are there any security implications if it is hosted on the same domain as the app code ?
export const GRAASP_ASSETS_URL = import.meta.env.VITE_GRAASP_ASSETS_URL;

export const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_KEY;
