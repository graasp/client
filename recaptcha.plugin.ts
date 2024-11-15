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

      if (!options.recaptchaKey) {
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
