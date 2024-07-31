import { CookieKeys, MemberStorageItem, PublicProfile } from '@graasp/sdk';

import {
  CURRENT_MEMBER,
  MEMBER_PUBLIC_PROFILE,
  MEMBER_STORAGE_ITEM_RESPONSE,
} from '../fixtures/members';
import {
  mockEditMember,
  mockEditPublicProfile,
  mockGetCurrentMember,
  mockGetCurrentMemberAvatar,
  mockGetMemberStorageFiles,
  mockGetOwnProfile,
  mockGetStorage,
  mockPostAvatar,
  mockSignInRedirection,
  mockSignOut,
  mockUpdateEmail,
  mockUpdatePassword,
} from './server';
import { MemberForTest } from './utils';

declare global {
  namespace Cypress {
    interface Chainable {
      setUpApi(args: {
        currentMember?: MemberForTest | null;
        currentProfile?: PublicProfile;
        storageAmountInBytes?: number;
        getCurrentMemberError?: boolean;
        getCurrentProfileError?: boolean;
        editMemberError?: boolean;
        editPublicProfileError?: boolean;
        getAvatarUrlError?: boolean;
        postAvatarError?: boolean;
        updatePasswordError?: boolean;
        updateEmailError?: boolean;
        files?: MemberStorageItem[];
        getMemberStorageFilesError?: boolean;
      }): Chainable;
    }
  }
}

Cypress.Commands.add(
  'setUpApi',
  ({
    currentMember = CURRENT_MEMBER,
    currentProfile = MEMBER_PUBLIC_PROFILE,
    getCurrentMemberError = false,
    getCurrentProfileError = false,
    editMemberError = false,
    editPublicProfileError = false,
    getAvatarUrlError = false,
    postAvatarError = false,
    updatePasswordError = false,
    updateEmailError = false,
    storageAmountInBytes = 10000,
    files = MEMBER_STORAGE_ITEM_RESPONSE,
    getMemberStorageFilesError = false,
  } = {}) => {
    const cachedCurrentMember = JSON.parse(JSON.stringify(currentMember));
    const cachedCurrentProfile = JSON.parse(JSON.stringify(currentProfile));
    const cachedCurrentStorageFiles = JSON.parse(JSON.stringify(files));
    // hide cookie banner by default
    cy.setCookie(CookieKeys.AcceptCookies, 'true');

    mockGetCurrentMember(cachedCurrentMember, getCurrentMemberError);
    mockGetOwnProfile(cachedCurrentProfile, getCurrentProfileError);

    mockSignInRedirection();

    mockSignOut();

    mockEditMember(cachedCurrentMember, editMemberError);
    mockEditPublicProfile(cachedCurrentProfile, editPublicProfileError);
    mockGetCurrentMemberAvatar(currentMember, getAvatarUrlError);

    mockPostAvatar(postAvatarError);

    mockUpdatePassword(updatePasswordError);
    mockUpdateEmail(updateEmailError);

    mockGetStorage(storageAmountInBytes);
    mockGetMemberStorageFiles(
      cachedCurrentStorageFiles,
      getMemberStorageFilesError,
    );
  },
);
