import type { Plugin, ResolvedConfig } from 'vite';

export interface UmamiPluginOptions {
  /**
   * The Google recaptcha key
   */
  recaptchaKey?: string;

  /**
   * Whether to inject the script in development mode.
   *
   * @default false
   */
  enableInDevMode?: boolean;

  /**
   * Whether this is required when building for production
   */
  requireInProduction?: boolean;
}

export function recaptchaPlugin(options: UmamiPluginOptions): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'recaptcha-script',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transformIndexHtml() {
      if (config.command === 'serve' && !options.enableInDevMode) {
        return [];
      }

      // fail if the build mode is production and we are requiring the presence of the key
      if (
        !options.recaptchaKey &&
        options.requireInProduction &&
        config.mode == 'production'
      ) {
        throw new Error(
          '[recaptcha-script] No recaptcha key provided. Captcha will not work, users might be unable to log in.',
        );
      }

      return [
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://www.google.com',
          },
        },
        {
          tag: 'script',
          attrs: {
            defer: true,
            src: `https://www.google.com/recaptcha/api.js?render=${options.recaptchaKey}`,
          },
          children: '',
          injectTo: 'head',
        },
      ];
    },
  };
}
