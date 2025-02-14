import {
  GuestFactory,
  ItemLoginSchemaFactory,
  PackedFolderItemFactory,
  PackedItemBookmarkFactory,
} from '@graasp/sdk';

import {
  BOOKMARKED_ITEMS_ERROR_ALERT_ID,
  BOOKMARKED_ITEMS_ID,
  BOOKMARK_ICON_SELECTOR,
  CREATE_ITEM_BUTTON_ID,
  ITEM_SEARCH_INPUT_ID,
  PREVENT_GUEST_MESSAGE_ID,
  SORTING_ORDERING_SELECTOR_ASC,
  SORTING_ORDERING_SELECTOR_DESC,
  SORTING_SELECT_SELECTOR,
  UNBOOKMARK_ICON_SELECTOR,
  buildItemCard,
} from '../../../../../src/config/selectors';
import { SortingOptions } from '../../../../../src/modules/builder/components/table/types';
import { BOOKMARKED_ITEMS_PATH, HOME_PATH } from '../../utils';

const BOOKMARKED_ITEMS = [
  PackedItemBookmarkFactory(),
  PackedItemBookmarkFactory(),
];
const ITEMS = BOOKMARKED_ITEMS.map(({ item }) => item);
const NON_BOOKMARKED_ITEM = PackedFolderItemFactory();

const removefromBookmark = (itemId: string) => {
  cy.get(`#${buildItemCard(itemId)} ${UNBOOKMARK_ICON_SELECTOR}`).click();
};

const addToBookmark = (itemId: string) => {
  cy.get(`#${buildItemCard(itemId)} ${BOOKMARK_ICON_SELECTOR}`).click();
};
// COMMENT: bookmarks have been removed as a standalone feature and are now on the home page
describe.skip('Bookmarked Item', () => {
  it('Show message for guest', () => {
    const item = PackedFolderItemFactory();
    const guest = GuestFactory({
      itemLoginSchema: ItemLoginSchemaFactory({ item }),
    });
    cy.setUpApi({ items: [item], currentMember: null, currentGuest: guest });
    cy.visit(BOOKMARKED_ITEMS_PATH);
    cy.get(`#${PREVENT_GUEST_MESSAGE_ID}`).should('be.visible');
  });

  describe('Member has no bookmarked items', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: ITEMS,
      });
      cy.visit(BOOKMARKED_ITEMS_PATH);
    });

    it('Show empty table', () => {
      cy.get(`#${BOOKMARKED_ITEMS_ID}`).should('contain', 'No bookmarked item');
    });
  });

  describe('Member has bookmarked items', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [...ITEMS, NON_BOOKMARKED_ITEM],
        bookmarkedItems: BOOKMARKED_ITEMS,
      });
      cy.visit(BOOKMARKED_ITEMS_PATH);
    });

    it('Empty search', () => {
      const searchText = 'mysearch';
      cy.wait('@getBookmarkedItems');
      cy.get(`#${ITEM_SEARCH_INPUT_ID}`).should('not.be.disabled');
      cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(searchText, { delay: 100 });

      cy.get(`#${BOOKMARKED_ITEMS_ID}`).should(
        'contain',
        `No bookmarked item for ${searchText}`,
      );
    });

    it("New button doesn't exist", () => {
      cy.get(`#${CREATE_ITEM_BUTTON_ID}`).should('not.exist');
    });

    it('Check bookmarked items view', () => {
      for (const { item } of BOOKMARKED_ITEMS) {
        cy.get(`#${buildItemCard(item.id)}`).should('be.visible');
      }
    });

    it('Add item to bookmarks', () => {
      cy.visit(HOME_PATH);

      const item = NON_BOOKMARKED_ITEM;

      addToBookmark(item.id);

      cy.wait('@bookmarkItem').then(({ request }) => {
        expect(request.url).to.contain(item.id);
      });
    });

    it('remove item from bookmarks', () => {
      const itemId = ITEMS[1].id;

      removefromBookmark(itemId);

      cy.wait('@unbookmarkItem').then(({ request }) => {
        expect(request.url).to.contain(itemId);
      });
    });

    it('Sorting & Ordering', () => {
      cy.get(`${SORTING_SELECT_SELECTOR} input`).should(
        'have.value',
        SortingOptions.ItemUpdatedAt,
      );
      cy.get(SORTING_ORDERING_SELECTOR_DESC).should('be.visible');

      cy.get(SORTING_SELECT_SELECTOR).click();
      cy.get('li[data-value="item.name"]').click();

      // check items are ordered by name
      cy.get(`#${BOOKMARKED_ITEMS_ID} h5`).then(($e) => {
        BOOKMARKED_ITEMS.sort((a, b) => (a.item.name < b.item.name ? 1 : -1));
        for (let idx = 0; idx < BOOKMARKED_ITEMS.length; idx += 1) {
          expect($e[idx].innerText).to.eq(BOOKMARKED_ITEMS[idx].item.name);
        }
      });

      // change ordering
      cy.get(SORTING_ORDERING_SELECTOR_DESC).click();
      cy.get(SORTING_ORDERING_SELECTOR_ASC).should('be.visible');
      cy.get(`#${BOOKMARKED_ITEMS_ID} h5`).then(($e) => {
        BOOKMARKED_ITEMS.reverse();
        for (let idx = 0; idx < BOOKMARKED_ITEMS.length; idx += 1) {
          expect($e[idx].innerText).to.eq(BOOKMARKED_ITEMS[idx].item.name);
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('check bookmarked items view with server error', () => {
      cy.setUpApi({
        items: ITEMS,
        getFavoriteError: true,
      });
      cy.visit(BOOKMARKED_ITEMS_PATH);

      cy.get(`#${BOOKMARKED_ITEMS_ERROR_ALERT_ID}`).should('exist');
    });
  });
});
