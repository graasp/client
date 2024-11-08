import { EmailFrequency } from '@graasp/sdk';

import { ACCOUNT } from '@/langs/account';

export const DEFAULT_EMAIL_FREQUENCY = EmailFrequency.Always;

export const emailFrequency = {
  [EmailFrequency.Always]: ACCOUNT.ALWAYS_RECEIVE_EMAILS,
  // todo: schedule a digest of the notifications
  // daily: 'Receive email notifications once per day',
  [EmailFrequency.Never]: ACCOUNT.DISABLE_EMAILS,
};

export const AVATAR_SIZE = 128;

export const ADMIN_CONTACT = 'admin@graasp.org';

export const LINKEDIN_DOMAIN = 'linkedin';
export const FACEBOOK_DOMAIN = 'facebook';
export const TWITTER_DOMAIN = 'twitter';

export const NS = {
  Landing: 'landing',
  Account: 'account',
  Common: 'common',
  Enums: 'enums',
  Messages: 'messages',
} as const;
