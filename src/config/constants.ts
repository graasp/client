import { EmailFrequency } from '@graasp/sdk';

export const DEFAULT_EMAIL_FREQUENCY = EmailFrequency.Always;

export const emailFrequency = {
  [EmailFrequency.Always]: 'ALWAYS_RECEIVE_EMAILS',
  // daily: 'Receive email notifications once per day',
  [EmailFrequency.Never]: 'DISABLE_EMAILS',
} as const;

export const AVATAR_SIZE = 128;

export const ADMIN_CONTACT = 'admin@graasp.org';

export const GRAASP_BLOG_URL = 'https://graasp.github.io/docs/blog';

export const LINKEDIN_DOMAIN = 'linkedin';
export const FACEBOOK_DOMAIN = 'facebook';
export const TWITTER_DOMAIN = 'twitter';

export const NS = {
  Account: 'account',
  Analytics: 'analytics',
  Auth: 'auth',
  Builder: 'builder',
  Common: 'common',
  Enums: 'enums',
  Landing: 'landing',
  Messages: 'messages',
  Player: 'player',
} as const;

export const PRIVACY_EMAIL = 'privacy@graasp.org';

export const DEFAULT_LINK_SHOW_BUTTON = true;
export const DEFAULT_LINK_SHOW_IFRAME = false;
