// import the original type declarations
import 'i18next';

import account from '../locales/en/account.json';
import analytics from '../locales/en/analytics.json';
import auth from '../locales/en/auth.json';
import builder from '../locales/en/builder.json';
import common from '../locales/en/common.json';
import enums from '../locales/en/enums.json';
import landing from '../locales/en/landing.json';
import messages from '../locales/en/messages.json';
import player from '../locales/en/player.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      account: typeof account;
      analytics: typeof analytics;
      auth: typeof auth;
      builder: typeof builder;
      common: typeof common;
      enums: typeof enums;
      landing: typeof landing;
      messages: typeof messages;
      player: typeof player;
    };
  }
}
export type MessageKeys = typeof messages;
