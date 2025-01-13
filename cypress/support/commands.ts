import {
  ChatMessage,
  CookieKeys,
  Member,
  MemberStorageItem,
  PublicProfile,
} from '@graasp/sdk';

import {
  EMAIL_SIGN_IN_FIELD_ID,
  EMAIL_SIGN_UP_FIELD_ID,
  MAGIC_LINK_EMAIL_FIELD_ID,
  NAME_SIGN_UP_FIELD_ID,
  PASSWORD_SIGN_IN_FIELD_ID,
  REGISTER_AGREEMENTS_CHECKBOX_ID,
} from '../../src/config/selectors';
import {
  fillPasswordSignInLayout,
  fillSignInByMailLayout,
  fillSignUpLayout,
  submitPasswordSignIn,
  submitRegister,
  submitSignIn,
} from '../e2e/auth/util';
import { CURRENT_MEMBER, MEMBER_PUBLIC_PROFILE } from '../fixtures/members';
import { MockItem } from '../fixtures/mockTypes';
import { MEMBER_STORAGE_ITEM_RESPONSE } from '../fixtures/storage';
import {
  mockAnalytics,
  mockAppApiAccessToken,
  mockBuilder,
  mockCreatePassword,
  mockDefaultDownloadFile,
  mockDeleteAppData,
  mockDeleteCurrentMember,
  mockEditCurrentMember,
  mockEditPublicProfile,
  mockExportData,
  mockGetAccessibleItems,
  mockGetAppData,
  mockGetAppLink,
  mockGetChildren,
  mockGetCurrentMember,
  mockGetCurrentMemberAvatar,
  mockGetDescendants,
  mockGetItem,
  mockGetItemChat,
  mockGetItemGeolocation,
  mockGetItemsInMap,
  mockGetLoginSchemaType,
  mockGetMemberStorageFiles,
  mockGetOwnProfile,
  mockGetPasswordStatus,
  mockGetStatus,
  mockGetStorage,
  mockLogin,
  mockPatchAppData,
  mockPostAppData,
  mockPostAvatar,
  mockRequestPasswordReset,
  mockResetPassword,
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
        hasPassword?: boolean;
        currentProfile?: PublicProfile | null;
        storageAmountInBytes?: number;
        getCurrentMemberError?: boolean;
        getCurrentProfileError?: boolean;
        editMemberError?: boolean;
        editPublicProfileError?: boolean;
        getAvatarUrlError?: boolean;
        postAvatarError?: boolean;
        updatePasswordError?: boolean;
        createPasswordError?: boolean;
        updateEmailError?: boolean;
        files?: MemberStorageItem[];
        getMemberStorageFilesError?: boolean;
        exportDataError?: boolean;
        shouldFailRequestPasswordReset?: boolean;
        shouldFailResetPassword?: boolean;
        shouldFailLogin?: boolean;
        items?: MockItem[];
        itemLogins?: { [key: string]: string };
        chatMessages?: ChatMessage[];
        storedSessions?: { id: string; token: string; createdAt: number }[];
        getItemError?: boolean;
        getAppLinkError?: boolean;
      }): Chainable;

      checkErrorTextField(id: string, flag: unknown): Chainable;

      signUpAndCheck(
        member: Member & {
          nameValid?: boolean;
          emailValid?: boolean;
          passwordValid?: boolean;
        },
        acceptAllTerms?: boolean,
      ): Chainable;

      signInByMailAndCheck(
        value: Partial<Member> & {
          nameValid?: boolean;
          emailValid?: boolean;
          passwordValid?: boolean;
        },
      ): Chainable;

      signInPasswordAndCheck(
        member: Member & {
          nameValid?: boolean;
          emailValid?: boolean;
          passwordValid?: boolean;
          password?: string;
        },
      ): Chainable;

      agreeWithAllTerms(): Chainable;

      getIframeDocument(iframeSelector: string): Chainable;
      getIframeBody(iframeSelector: string): Chainable;

      checkContentInElementInIframe(
        iframeSelector: string,
        elementSelector: string,
        text: string,
      ): Chainable;
    }
  }
}

Cypress.Commands.add(
  'setUpApi',
  ({
    currentMember = CURRENT_MEMBER,
    hasPassword = false,
    currentProfile = MEMBER_PUBLIC_PROFILE,
    getCurrentMemberError = false,
    getCurrentProfileError = false,
    editMemberError = false,
    editPublicProfileError = false,
    getAvatarUrlError = false,
    postAvatarError = false,
    updatePasswordError = false,
    createPasswordError = false,
    updateEmailError = false,
    exportDataError = false,
    storageAmountInBytes = 10000,
    files = MEMBER_STORAGE_ITEM_RESPONSE,
    getMemberStorageFilesError = false,
    shouldFailRequestPasswordReset = false,
    shouldFailResetPassword = false,
    shouldFailLogin = false,
    items = [],
    itemLogins = {},
    chatMessages = [],
    getItemError = false,
    getAppLinkError = false,
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

    mockEditCurrentMember(cachedCurrentMember, editMemberError);
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
    mockExportData(exportDataError);
    mockDeleteCurrentMember();

    mockGetPasswordStatus(hasPassword);
    mockCreatePassword(createPasswordError);

    mockGetStatus();
    mockRequestPasswordReset(shouldFailRequestPasswordReset);
    mockResetPassword(shouldFailResetPassword);
    mockLogin(shouldFailLogin);

    mockGetAccessibleItems(items);
    mockGetItem(
      { items, currentMember },
      getItemError || getCurrentMemberError,
    );
    mockGetItemChat({ chatMessages });

    mockGetLoginSchemaType(itemLogins);

    mockGetChildren(items, currentMember);

    mockGetDescendants(items, currentMember);

    mockDefaultDownloadFile({ items, currentMember });

    mockBuilder();
    mockAnalytics();

    mockGetAppLink(getAppLinkError);
    mockAppApiAccessToken(getAppLinkError);
    mockGetAppData(getAppLinkError);
    mockPostAppData(getAppLinkError);
    mockPatchAppData(getAppLinkError);
    mockDeleteAppData(getAppLinkError);

    mockGetItemGeolocation(items);
    mockGetItemsInMap(items, currentMember);
  },
);

Cypress.Commands.add('checkErrorTextField', (id, flag) => {
  const existence = flag ? 'not.exist' : 'exist';
  cy.get(`#${id}-helper-text`).should(existence);
});

Cypress.Commands.add('agreeWithAllTerms', () => {
  cy.get(`[data-cy="${REGISTER_AGREEMENTS_CHECKBOX_ID}"] input`)
    .check()
    .should('be.checked');
});

Cypress.Commands.add('signUpAndCheck', (user, acceptAllTerms) => {
  fillSignUpLayout(user);
  if (acceptAllTerms) {
    cy.agreeWithAllTerms();
  }
  submitRegister();

  cy.checkErrorTextField(NAME_SIGN_UP_FIELD_ID, user.nameValid);
  cy.checkErrorTextField(EMAIL_SIGN_UP_FIELD_ID, user.emailValid);
});

Cypress.Commands.add('signInByMailAndCheck', (user) => {
  fillSignInByMailLayout(user);
  submitSignIn();
  cy.checkErrorTextField(MAGIC_LINK_EMAIL_FIELD_ID, user.emailValid);
});

Cypress.Commands.add('signInPasswordAndCheck', (user) => {
  fillPasswordSignInLayout(user);
  if (user.password) {
    submitPasswordSignIn();
  }
  if (!user.passwordValid) {
    cy.get(`#${PASSWORD_SIGN_IN_FIELD_ID}`).clear();
  }
  cy.checkErrorTextField(EMAIL_SIGN_IN_FIELD_ID, user.emailValid);
  cy.checkErrorTextField(PASSWORD_SIGN_IN_FIELD_ID, user.passwordValid);
});

Cypress.Commands.add('getIframeDocument', (iframeSelector) =>
  cy.get(iframeSelector).its('0.contentDocument').should('exist').then(cy.wrap),
);

Cypress.Commands.add('getIframeBody', (iframeSelector) =>
  // retry to get the body until the iframe is loaded
  cy
    .getIframeDocument(iframeSelector)
    .its('body')
    .should('not.be.undefined')
    .then(cy.wrap),
);

Cypress.Commands.add(
  'checkContentInElementInIframe',
  (iframeSelector: string, elementSelector, text) =>
    cy
      .get(iframeSelector)
      .then(($iframe) =>
        cy
          .wrap($iframe.contents().find(elementSelector))
          .should('contain', text),
      ),
);
