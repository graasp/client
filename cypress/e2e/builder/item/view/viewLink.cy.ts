import { CURRENT_MEMBER } from '../../../../fixtures/members';
import { expectLinkViewScreenLayout } from '../../../../support/viewUtils';
import {
  GRAASP_LINK_ITEM,
  GRAASP_LINK_ITEM_IFRAME_ONLY,
  YOUTUBE_LINK_ITEM,
} from '../../fixtures/links';
import { buildItemMembership } from '../../fixtures/memberships';
import { HOME_PATH, buildItemPath } from '../../utils';

describe('Links', () => {
  beforeEach(() => {
    cy.setUpApi({
      items: [
        {
          ...GRAASP_LINK_ITEM,
          memberships: [
            buildItemMembership({
              item: GRAASP_LINK_ITEM,
              account: CURRENT_MEMBER,
            }),
          ],
        },
        {
          ...GRAASP_LINK_ITEM_IFRAME_ONLY,
          memberships: [
            buildItemMembership({
              item: GRAASP_LINK_ITEM_IFRAME_ONLY,
              account: CURRENT_MEMBER,
            }),
          ],
        },
        {
          ...YOUTUBE_LINK_ITEM,
          memberships: [
            buildItemMembership({
              item: YOUTUBE_LINK_ITEM,
              account: CURRENT_MEMBER,
            }),
          ],
        },
      ],
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
