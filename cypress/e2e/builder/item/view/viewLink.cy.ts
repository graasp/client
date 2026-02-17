import { PackedLinkItemFactory } from '@graasp/sdk';

import type { PackedItem } from '@/openapi/client';

import { CURRENT_MEMBER } from '../../../../fixtures/members';
import { expectLinkViewScreenLayout } from '../../../../support/viewUtils';
import {
  GRAASP_LINK_ITEM,
  GRAASP_LINK_ITEM_IFRAME_ONLY,
  YOUTUBE_LINK_ITEM,
} from '../../fixtures/links';
import { buildItemMembership } from '../../fixtures/memberships';
import { HOME_PATH, buildItemPath } from '../../utils';

const linkItem = PackedLinkItemFactory(GRAASP_LINK_ITEM) as PackedItem;
const linkItemIframeOnly = PackedLinkItemFactory(
  GRAASP_LINK_ITEM_IFRAME_ONLY,
) as PackedItem;
const linkItemYoutube = PackedLinkItemFactory(YOUTUBE_LINK_ITEM) as PackedItem;

const items = [
  {
    ...linkItem,
    memberships: [
      buildItemMembership({
        item: linkItem,
        account: CURRENT_MEMBER,
      }),
    ],
  },
  {
    ...linkItemIframeOnly,
    memberships: [
      buildItemMembership({
        item: linkItemIframeOnly,
        account: CURRENT_MEMBER,
      }),
    ],
  },
  {
    ...linkItemYoutube,
    memberships: [
      buildItemMembership({
        item: linkItemYoutube,
        account: CURRENT_MEMBER,
      }),
    ],
  },
];

describe('Links', () => {
  beforeEach(() => {
    cy.setUpApi({
      items,
    });
  });

  it('view some link', () => {
    const { id, extra } = GRAASP_LINK_ITEM;
    cy.visit(buildItemPath(id));

    // should get current item
    cy.wait('@getItem');

    expectLinkViewScreenLayout({ item: GRAASP_LINK_ITEM });

    // check home page display link thumbnail
    cy.visit(HOME_PATH);
    cy.get(`[src="${extra.embeddedLink.thumbnails?.[0]}"]`);
  });

  it('view some link with iframe', () => {
    const { id, extra } = GRAASP_LINK_ITEM_IFRAME_ONLY;
    cy.visit(buildItemPath(id));

    // should get current item
    cy.wait('@getItem');

    expectLinkViewScreenLayout({ item: GRAASP_LINK_ITEM_IFRAME_ONLY });

    // check home page display link thumbnail
    cy.visit(HOME_PATH);
    cy.get(`[src="${extra.embeddedLink.thumbnails?.[0]}"]`);
  });

  it('view youtube', () => {
    const { id, extra } = YOUTUBE_LINK_ITEM;
    cy.visit(buildItemPath(id));

    // should get current item
    cy.wait('@getItem');

    expectLinkViewScreenLayout({ item: YOUTUBE_LINK_ITEM });

    // check home page display link icon because it does not have thumbnail
    cy.visit(HOME_PATH);
    cy.get(`[src="${extra.embeddedLink.icons?.[0]}"]`);
  });
});
