import {
  AccountType,
  CompleteMember,
  MemberFactory,
  Password,
  PublicProfile,
} from '@graasp/sdk';

import { MemberForTest } from '../support/types';
import { AVATAR_LINK } from './thumbnails/links';

export const MEMBER_WITH_AVATAR: MemberForTest = {
  ...MemberFactory({
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130004',
    name: 'bob',
    email: 'bob@email.com',
    extra: { lang: 'en', hasAvatar: true },
  }),
  // this only exists for test
  thumbnails: AVATAR_LINK,
};

export const MEMBER_PUBLIC_PROFILE: PublicProfile = {
  id: 'ecafbd2a-5642-31fb-ae93-0242ac130004',
  bio: 'text',
  twitterID: 'twitter_handle',
  facebookID: 'fb_handle',
  linkedinID: 'linkedin_handle',
  createdAt: '2021-04-13 14:56:34.749946',
  updatedAt: '2021-04-13 14:56:34.749946',
  visibility: false,
};

export const MEMBERS = {
  ANNA: MemberFactory({
    id: 'a44a00d2-7d67-44af-8637-86ca02933aa3',
    name: 'Anna',
    email: 'anna@graasp.org',
    extra: { lang: 'en' },
  }),
  BOB: MemberFactory({
    id: 'b0b00f28-bac6-4414-a649-1c0fb856d414',
    name: 'BOB',
    email: 'bob@gmail.com',
    createdAt: '2021-04-13 14:56:34.749946',
    enableSaveActions: true,
    extra: { lang: 'en', emailFreq: 'always', hasAvatar: true },
  }),
  CEDRIC: MemberFactory({ name: 'Cedric', email: 'cedric@example.com' }),
} as const;

export const CURRENT_MEMBER = MEMBERS.ANNA;

export const AUTH_MEMBERS = {
  GRAASP: {
    id: 'graasp-id',
    name: 'graasp',
    email: 'graasp@graasp.org',
    password: 'aPassword1',
    nameValid: true,
    emailValid: true,
    passwordValid: true,
    type: AccountType.Individual,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {},
    enableSaveActions: true,
    isValidated: true,
  },
  GRAASP_OTHER: {
    id: 'graasp_other-id',
    name: 'graasp_other',
    email: 'graasp_other@graasp.org',
    password: 'aPassword2',
    nameValid: true,
    emailValid: true,
    passwordValid: true,
    type: AccountType.Individual,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {},
    enableSaveActions: true,
    isValidated: true,
  },
  WRONG_NAME: {
    id: 'id1',
    name: 'w',
    email: 'graasp@graasp.org',
    nameValid: false,
    emailValid: true,
    passwordValid: false,
    type: AccountType.Individual,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {},
    enableSaveActions: true,
    isValidated: true,
  },
  INVALID_EMAIL: {
    id: 'id2',
    name: 'graasp',
    email: 'wrong',
    password: 'test',
    nameValid: true,
    emailValid: false,
    passwordValid: true,
    type: AccountType.Individual,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {},
    enableSaveActions: true,
    isValidated: true,
  },
  INVALID_PASSWORD: {
    id: 'id3',
    name: 'graasp',
    email: 'graasp@graasp.org',
    password: '',
    nameValid: true,
    emailValid: true,
    passwordValid: false,
    type: AccountType.Individual,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {},
    enableSaveActions: true,
    isValidated: true,
  },
  WRONG_PASSWORD: {
    id: 'id3',
    name: 'graasp',
    email: 'graasp@graasp.org',
    password: 'test',
    nameValid: true,
    emailValid: true,
    passwordValid: false,
    type: AccountType.Individual,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {},
    enableSaveActions: true,
    isValidated: true,
  },
  BOB: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130004',
    name: 'bob',
    email: 'bob@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    extra: { lang: 'en' },
    type: AccountType.Individual,
    updatedAt: new Date().toISOString(),
    enableSaveActions: true,
    isValidated: true,
  },
  CEDRIC: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130006',
    name: 'cedric',
    email: 'cedric@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    type: AccountType.Individual,
    updatedAt: new Date().toISOString(),
    extra: {},
    enableSaveActions: true,
    isValidated: true,
  },
} as const satisfies {
  [name: string]: CompleteMember & {
    nameValid?: boolean;
    emailValid?: boolean;
    passwordValid?: boolean;
    password?: Password;
  };
};
