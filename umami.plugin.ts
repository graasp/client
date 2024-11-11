import type { Plugin, ResolvedConfig } from 'vite';

export interface UmamiPluginOptions {
  /**
   * The ID of the project Clarity provides to you.
   *
   * Can be found in the URL of your project.
   *
   * @example `k4vhy94oj3`
   */
  websiteId: string;

  /**
   * Host where the script is hosted
   * @default "https://cloud.umami.is"
   */
  host?: string;
  /**
   * Path to prepend to the script invocation
   */
  path?: string;
  /**
   * Whether to inject the script in development mode.
   *
   * @default false
   */
  enableInDevMode?: boolean;
}

export default function umamiPlugin(options: UmamiPluginOptions): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'umami-script',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transformIndexHtml() {
      if (config.command === 'serve' && !options.enableInDevMode) {
        return [];
      }

      if (!options.websiteId) {
        throw new Error(
          '[umami-script] No website id provided. Please provide a website id.',
        );
      }

      return [
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: options.host,
          },
        },
        {
          tag: 'script',
          attrs: {
            defer: true,
            // remove trailing slash from base
            src: `${config.base.replace(/\/$/, '')}/umami.js`,
            'data-website-id': options.websiteId,
            'data-host-url': options.host,
          },
          children: '',
          injectTo: 'head',
        },
      ];
    },
  };
}
