import {
  AppItemExtra,
  CookieKeys,
  DiscriminatedItem,
  DocumentItemExtra,
  Member,
  PermissionLevel,
  getAppExtra,
  getDocumentExtra,
} from '@graasp/sdk';

import {
  CUSTOM_APP_CYPRESS_ID,
  CUSTOM_APP_URL_ID,
  EMAIL_SIGN_IN_FIELD_ID,
  EMAIL_SIGN_UP_FIELD_ID,
  FLAVOR_SELECT_ID,
  FOLDER_FORM_DESCRIPTION_ID,
  ITEM_FORM_APP_URL_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_FORM_DOCUMENT_TEXT_SELECTOR,
  ITEM_FORM_NAME_INPUT_ID,
  MAGIC_LINK_EMAIL_FIELD_ID,
  NAME_SIGN_UP_FIELD_ID,
  PASSWORD_SIGN_IN_FIELD_ID,
  REGISTER_AGREEMENTS_CHECKBOX_ID,
  buildFolderItemCardThumbnail,
  buildItemFormAppOptionId,
} from '../../src/config/selectors';
import {
  fillPasswordSignInLayout,
  fillSignInByMailLayout,
  fillSignUpLayout,
  submitPasswordSignIn,
  submitRegister,
  submitSignIn,
} from '../e2e/auth/util';
import { APP_NAME, CUSTOM_APP_URL, NEW_APP_NAME } from '../fixtures/apps/apps';
import { CURRENT_MEMBER, MEMBER_PUBLIC_PROFILE } from '../fixtures/members';
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
import { ApiConfig } from './types';

declare global {
  namespace Cypress {
    interface Chainable {
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

      fillShareForm(args: {
        email: string;
        permission: PermissionLevel;
        submit?: boolean;
        selector?: string;
      }): void;

      clickElementInIframe(
        iframeSelector: string,
        elementSelector: string,
      ): void;

      checkContentInElementInIframe(
        iframeSelector: string,
        elementSelector: string,
        text: string,
      ): void;

      attachFile(selector: Chainable, file: string, options?: object): void;
      attachFiles(
        selector: Chainable,
        filenames: string[],
        options?: object,
      ): void;

      clickTreeMenuItem(value: string): void;
      handleTreeMenu(path: string, rootId?: string): void;
      switchMode(mode: string): void;
      goToItemInCard(path: string): void;

      fillDocumentModal(
        payload: {
          name: string;
          extra?: DocumentItemExtra;
        },
        options?: { confirm?: boolean },
      ): void;
      fillAppModal(
        payload: { name: string; extra?: AppItemExtra },
        options?: {
          type?: boolean;
          id?: string;
          confirm?: boolean;
          custom?: boolean;
        },
      ): void;
      fillFolderModal(
        arg1: { name?: string; description?: string },
        arg2?: { confirm?: boolean },
      ): void;

      dragAndDrop(subject: string, x: number, y: number): void;

      selectItem(id: DiscriminatedItem['id']): void;

      setUpApi(args?: ApiConfig): void;

      fillBaseItemModal(
        item: { name?: string },
        options?: { confirm?: boolean },
      ): void;
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

Cypress.Commands.add(
  'fillBaseItemModal',
  ({ name = '' }, { confirm = true } = {}) => {
    // first select all the text and then remove it to have a clear field, then type new text
    cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`).type(`{selectall}{backspace}${name}`);

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);

Cypress.Commands.add(
  'fillFolderModal',
  ({ name = '', description = '' }, { confirm = true } = {}) => {
    cy.fillBaseItemModal({ name }, { confirm: false });
    // first select all the text and then remove it to have a clear field, then type new description
    cy.get(`#${FOLDER_FORM_DESCRIPTION_ID}`).type(
      `{selectall}{backspace}${description}`,
    );

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);

Cypress.Commands.add(
  'fillDocumentModal',
  ({ name = '', extra }, { confirm = true } = {}) => {
    cy.fillBaseItemModal({ name }, { confirm: false });

    if (extra.document.flavor) {
      cy.get(`#${FLAVOR_SELECT_ID} div`).click();
      cy.get(`li[data-value="${extra.document.flavor}"]`).click();
    }

    const content =
      // first select all the text and then remove it to have a clear field, then type new text
      `{selectall}{backspace}${getDocumentExtra(extra)?.content}`;

    if (extra.document.isRaw) {
      cy.get(`[role="tab"]:contains("HTML")`).click();
      cy.get('[role="tabpanel"] textarea[name="content"]').type(content);
    } else {
      cy.get(ITEM_FORM_DOCUMENT_TEXT_SELECTOR).type(content);
    }

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).scrollIntoView().click();
    }
  },
);

Cypress.Commands.add(
  'fillAppModal',
  (
    { name = '', extra },
    { confirm = true, id, type = false, custom = false } = {},
  ) => {
    cy.fillBaseItemModal({ name }, { confirm: false });

    if (type) {
      cy.get(`#${ITEM_FORM_APP_URL_ID}`).type(getAppExtra(extra)?.url);
    } else if (custom) {
      cy.get(`#${buildItemFormAppOptionId(CUSTOM_APP_CYPRESS_ID)}`).click();
      // check name get added automatically
      cy.fillBaseItemModal({ name }, { confirm: false });
      cy.get(`#${CUSTOM_APP_URL_ID}`).type(CUSTOM_APP_URL);
    } else {
      cy.get(`#${buildItemFormAppOptionId(id)}`).click();
      // check name get added automatically
      cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`).should('have.value', APP_NAME);
      // edit the app name
      cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`)
        .type(`{selectall}{backspace}${NEW_APP_NAME}`)
        .should('have.value', NEW_APP_NAME);
    }

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);

// This command was based on a solution found on github
// https://github.com/cypress-io/cypress/issues/3942#issuecomment-485648100
Cypress.Commands.add('dragAndDrop', (subject, x, y) => {
  cy.get(subject)
    .first()
    .then((target) => {
      const coordsDrag = target[0].getBoundingClientRect();
      cy.wrap(target)
        .trigger('mousedown', {
          button: 0,
          clientX: coordsDrag.x,
          clientY: coordsDrag.y,
          force: true,
        })
        .trigger('mousemove', {
          button: 0,
          clientX: coordsDrag.x + 10,
          clientY: coordsDrag.y,
          force: true,
        });
      cy.get('body')
        .trigger('mousemove', {
          button: 0,
          clientX: coordsDrag.x + x,
          clientY: coordsDrag.y + y,
          force: true,
        })
        .trigger('mouseup');
    });
});

Cypress.Commands.add('selectItem', (id: DiscriminatedItem['id']) => {
  cy.get(buildFolderItemCardThumbnail(id)).click();
});
