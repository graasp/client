import {
  Context,
  PackedFolderItemFactory,
  ShortLink,
  appendPathToUrl,
} from '@graasp/sdk';

import {
  SHARE_ITEM_QR_BTN_ID,
  SHARE_ITEM_QR_DIALOG_ID,
  SHORT_LINK_COMPONENT,
  buildShareButtonId,
  buildShortLinkPlatformTextId,
  buildShortLinkUrlTextId,
} from '../../../../../src/config/selectors';
import { GRAASP_REDIRECTION_HOST } from '../../../../support/env';
import {
  buildGraaspBuilderView,
  buildGraaspLibraryLink,
  buildGraaspPlayerView,
} from '../../../../support/paths';
import { PublishedItemFactory } from '../../fixtures/items';
import { expectNumberOfShortLinks } from '../../fixtures/shortLinks';
import { buildItemPath, buildItemSharePath } from '../../utils';

type ShortLinkPlatform = ShortLink['platform'];

export const checkContainPlatformText = (platform: ShortLinkPlatform): void => {
  cy.get(`#${buildShortLinkPlatformTextId(platform)}`).should(
    'contain',
    platform,
  );
};

export const checkContainUrlText = (
  platform: ShortLinkPlatform,
  itemId: string,
): void => {
  let expectedUrl;

  // The client host manager can't be used here because
  // cypress run this before the main.tsx, where the manager is init.
  switch (platform) {
    case 'builder':
      expectedUrl = buildGraaspBuilderView(itemId);
      break;
    case 'player':
      expectedUrl = buildGraaspPlayerView(itemId);
      break;
    case 'library':
      expectedUrl = buildGraaspLibraryLink(itemId);
      break;
    default:
      throw new Error(`The given platform ${platform} is unknown.`);
  }

  cy.get(`#${buildShortLinkUrlTextId(platform)}`).should(
    'contain',
    expectedUrl,
  );
};

const checkContainShortLinkText = (
  platform: ShortLinkPlatform,
  alias: string,
) => {
  const expectedUrl = appendPathToUrl({
    baseURL: GRAASP_REDIRECTION_HOST,
    pathname: alias,
  }).toString();

  cy.get(`#${buildShortLinkUrlTextId(platform)}`).should(
    'contain',
    expectedUrl,
  );
};

describe('Share Item Link', () => {
  describe('Without short links', () => {
    const item = PublishedItemFactory(PackedFolderItemFactory());

    beforeEach(() => {
      cy.setUpApi({ items: [item] });
    });

    it('Builder link is correctly displayed', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      const context = Context.Builder;
      checkContainPlatformText(context);
      checkContainUrlText(context, item.id);
    });

    it('Player link is correctly displayed', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      const context = Context.Player;
      checkContainPlatformText(context);
      checkContainUrlText(context, item.id);
    });

    it('Library link is correctly displayed', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      const context = Context.Library;
      checkContainPlatformText(context);
      checkContainUrlText(context, item.id);
    });

    it('Share Item with QR Code', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      cy.get(`#${SHARE_ITEM_QR_BTN_ID}`).click();
      cy.get(`#${SHARE_ITEM_QR_DIALOG_ID}`).should('exist');
    });
  });

  describe('With short links', () => {
    const item = PublishedItemFactory(PackedFolderItemFactory());

    const shortLinks: ShortLink[] = [
      {
        alias: 'test-1',
        platform: Context.Builder,
        itemId: item.id,
      },
      {
        alias: 'test-2',
        platform: Context.Player,
        itemId: item.id,
      },
      {
        alias: 'test-3',
        platform: Context.Library,
        itemId: item.id,
      },
    ];

    beforeEach(() => {
      cy.setUpApi({
        items: [item, PublishedItemFactory(PackedFolderItemFactory())],
        shortLinks,
      });
    });

    it('Builder link is correctly displayed', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      expectNumberOfShortLinks(3);
      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      const context = Context.Builder;
      checkContainPlatformText(context);
      checkContainShortLinkText(context, shortLinks[0].alias);
    });

    it('Player link is correctly displayed', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      expectNumberOfShortLinks(3);
      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      const context = Context.Player;
      checkContainPlatformText(context);
      checkContainShortLinkText(context, shortLinks[1].alias);
    });

    it('Library link is correctly displayed', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      expectNumberOfShortLinks(3);
      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      const context = Context.Library;
      checkContainPlatformText(context);
      checkContainShortLinkText(context, shortLinks[2].alias);
    });

    it('Share Item with QR Code', () => {
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      expectNumberOfShortLinks(3);
      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      cy.get(`#${SHARE_ITEM_QR_BTN_ID}`).click();
      cy.get(`#${SHARE_ITEM_QR_DIALOG_ID}`).should('exist');
    });
  });

  describe('Without short links', () => {
    const item = PublishedItemFactory(PackedFolderItemFactory());

    beforeEach(() => {
      cy.setUpApi({ items: [item] });
    });

    it('Builder link is correctly displayed', () => {
      cy.visit(buildItemSharePath(item.id));

      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      const context = Context.Builder;
      checkContainPlatformText(context);
      checkContainUrlText(context, item.id);
    });
  });
});
