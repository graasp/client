// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-file-upload';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-localstorage-commands';
import { ITEM_LAYOUT_MODES } from '../../src/enums';
import {
  MODE_GRID_BUTTON_ID,
  MODE_LIST_BUTTON_ID,
} from '../../src/config/selectors';
import {
  mockCopyItem,
  mockCopyItems,
  mockDeleteItem,
  mockGetChildren,
  mockGetItem,
  mockGetOwnItems,
  mockMoveItem,
  mockMoveItems,
  mockPostItem,
  mockEditItem,
  mockShareItem,
  mockGetMember,
  mockGetMemberBy,
  mockDeleteItems,
  mockDefaultDownloadFile,
  mockGetS3Metadata,
  mockGetS3FileContent,
  mockUploadItem,
  mockGetCurrentMember,
  mockSignInRedirection,
  mockSignOut,
  mockPostItemLogin,
  mockGetItemLogin,
  mockGetItemMembershipsForItem,
  mockGetItemTags,
  mockGetTags,
  mockPostItemTag,
  mockPutItemLogin,
  mockEditMember,
  mockGetSharedItems,
  mockEditItemMembershipForItem,
  mockDeleteItemMembershipForItem,
  mockGetPublicItem,
  mockGetPublicChildren,
  mockGetItems,
  mockGetFlags,
  mockPostItemFlag,
  mockGetItemChat,
  mockPostItemChatMessage,
  mockGetAppLink,
  mockAppApiAccessToken,
  mockGetAppData,
  mockPostAppData,
  mockDeleteAppData,
  mockPatchAppData,
} from './server';
import './commands/item';
import './commands/navigation';
import { CURRENT_USER, MEMBERS } from '../fixtures/members';
import { SAMPLE_FLAGS } from '../fixtures/flags';

Cypress.Commands.add(
  'setUpApi',
  ({
    items = [],
    members = Object.values(MEMBERS),
    currentMember = CURRENT_USER,
    tags = [],
    flags = SAMPLE_FLAGS,
    deleteItemError = false,
    deleteItemsError = false,
    postItemError = false,
    moveItemError = false,
    moveItemsError = false,
    copyItemError = false,
    copyItemsError = false,
    getItemError = false,
    editItemError = false,
    shareItemError = false,
    getMemberError = false,
    defaultUploadError = false,
    defaultDownloadFileError = false,
    getS3MetadataError = false,
    getS3FileContentError = false,
    getCurrentMemberError = false,
    postItemTagError = false,
    postItemLoginError = false,
    putItemLoginError = false,
    editMemberError = false,
    postItemFlagError = false,
    getItemChatError = false,
  } = {}) => {
    const cachedItems = JSON.parse(JSON.stringify(items));
    const cachedMembers = JSON.parse(JSON.stringify(members));

    mockGetOwnItems(cachedItems);

    mockGetSharedItems({ items: cachedItems, member: currentMember });

    mockPostItem(cachedItems, postItemError);

    mockDeleteItem(cachedItems, deleteItemError);

    mockDeleteItems(cachedItems, deleteItemsError);

    mockGetItem(
      { items: cachedItems, currentMember },
      getItemError || getCurrentMemberError,
    );

    mockGetChildren({ items: cachedItems, currentMember });

    mockMoveItem(cachedItems, moveItemError);

    mockMoveItems(cachedItems, moveItemsError);

    mockCopyItem(cachedItems, copyItemError);

    mockCopyItems(cachedItems, copyItemsError);

    mockEditItem(cachedItems, editItemError);

    mockShareItem(cachedItems, shareItemError);

    mockGetMember(cachedMembers);

    mockGetMemberBy(cachedMembers, getMemberError);

    mockUploadItem(cachedItems, defaultUploadError);

    mockDefaultDownloadFile(cachedItems, defaultDownloadFileError);

    mockGetS3Metadata(cachedItems, getS3MetadataError);

    mockGetS3FileContent(getS3FileContentError);

    mockGetCurrentMember(currentMember, getCurrentMemberError);

    mockSignInRedirection();

    mockSignOut();

    mockGetItemLogin(items);

    mockPostItemLogin(items, postItemLoginError);

    mockPutItemLogin(items, putItemLoginError);

    mockGetItemMembershipsForItem(items);

    mockGetTags(tags);

    mockGetItemTags(items);

    mockPostItemTag(items, postItemTagError);

    mockEditMember(members, editMemberError);

    mockEditItemMembershipForItem(items);

    mockDeleteItemMembershipForItem(items);

    mockGetFlags(flags);

    mockPostItemFlag(items, postItemFlagError);

    mockGetPublicItem(items);

    mockGetPublicChildren(items);

    mockGetItems({ items, currentMember });

    mockGetItemChat({ items }, getItemChatError);

    mockPostItemChatMessage();

    mockGetAppLink();

    mockAppApiAccessToken();

    mockGetAppData();

    mockPostAppData();

    mockDeleteAppData();

    mockPatchAppData();
  },
);

Cypress.Commands.add('switchMode', (mode) => {
  switch (mode) {
    case ITEM_LAYOUT_MODES.GRID:
      cy.get(`#${MODE_GRID_BUTTON_ID}`).click({ force: true });
      break;
    case ITEM_LAYOUT_MODES.LIST:
      cy.get(`#${MODE_LIST_BUTTON_ID}`).click({ force: true });
      break;
    default:
      console.error(`invalid mode ${mode} provided`);
      break;
  }
});

Cypress.Commands.add(
  'visitAndMockWs',
  (visitRoute, sampleData, wsClientStub) => {
    cy.setUpApi(sampleData);
    cy.visit(visitRoute, {
      onBeforeLoad: (win) => {
        cy.stub(win, 'WebSocket', () => wsClientStub);
      },
    });
  },
);

Cypress.Commands.add(
  'clickElementInIframe',
  (iframeSelector, elementSelector) =>
    cy
      .get(iframeSelector)
      .then(($iframe) =>
        cy.wrap($iframe.contents().find(elementSelector)).click(),
      ),
);

Cypress.Commands.add(
  'checkContentInElementInIframe',
  (iframeSelector, elementSelector, text) =>
    cy
      .get(iframeSelector)
      .then(($iframe) =>
        cy
          .wrap($iframe.contents().find(elementSelector))
          .should('contain', text),
      ),
);
