import {
  ACCESSIBLE_ITEMS_ONLY_ME_ID,
  CREATE_ITEM_BUTTON_ID,
  HOME_LOAD_MORE_BUTTON_SELECTOR,
  ITEM_SEARCH_INPUT_ID,
  SORTING_ORDERING_SELECTOR_ASC,
  SORTING_ORDERING_SELECTOR_DESC,
  SORTING_SELECT_SELECTOR,
  buildItemCard,
} from '../../../src/config/selectors';
import { SortingOptions } from '../../../src/modules/builder/components/table/types';
import { ITEM_PAGE_SIZE } from '../../../src/modules/builder/constants';
import { CURRENT_MEMBER } from '../../fixtures/members';
import { ItemForTest } from '../../support/types';
import { generateOwnItems } from '../builder/fixtures/items';

const HOME_PATH = '/home';

const ownItems = generateOwnItems(30);

describe('Empty Home', () => {
  it('visit empty Home', () => {
    cy.setUpApi({
      items: [],
    });

    cy.visit(HOME_PATH);
    cy.get(`[role="dropzone"]`).should('be.visible');
    cy.get(`#${CREATE_ITEM_BUTTON_ID}`).should('be.visible');
  });
});

describe('Home page features', () => {
  beforeEach(() => {
    cy.setUpApi({
      items: ownItems,
    });
    cy.visit(HOME_PATH);
  });

  it('Enabling show only created by me should trigger refetch', () => {
    // a first call is done by the "recent items" components
    cy.wait('@getAccessibleItems');

    // remaining calls are done by the accessible table
    cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
      expect(url).not.to.contain(CURRENT_MEMBER.id);
    });

    cy.get(`#${ACCESSIBLE_ITEMS_ONLY_ME_ID}`).click();

    cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
      expect(url).to.contain(CURRENT_MEMBER.id);
    });
  });

  it('Sorting & ordering', () => {
    // a first call is done by the "recent items" components
    cy.wait('@getAccessibleItems');

    // remaining calls are done by the accessible table
    cy.wait('@getAccessibleItems');

    cy.get(`${SORTING_SELECT_SELECTOR} input`).should(
      'have.value',
      SortingOptions.ItemUpdatedAt,
    );
    cy.get(SORTING_ORDERING_SELECTOR_DESC).should('be.visible');

    // change sorting
    cy.get(SORTING_SELECT_SELECTOR).click();
    cy.get('li[data-value="item.name"]').click();
    cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
      expect(url).to.contain('item.name');
      expect(url).to.contain('desc');
    });

    // change ordering
    cy.get(SORTING_ORDERING_SELECTOR_DESC).click();
    cy.get(SORTING_ORDERING_SELECTOR_ASC).should('be.visible');
    cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
      expect(url).to.contain('asc');
    });
  });

  describe('Search', () => {
    it('Search should trigger refetch', () => {
      // a first call is done by the "recent items" components
      cy.wait('@getAccessibleItems');

      // remaining calls are done by the accessible table
      cy.wait('@getAccessibleItems');

      const searchText = 'mysearch';
      cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(searchText);

      cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
        expect(url).to.contain(searchText);
      });
    });

    it('Search on second page should reset page number', () => {
      const searchText = 'mysearch';

      // a first call is done by the "recent items" components
      cy.wait('@getAccessibleItems');

      // remaining calls are done by the accessible table
      cy.wait('@getAccessibleItems');
      // navigate to second page
      cy.get(HOME_LOAD_MORE_BUTTON_SELECTOR).click();

      cy.wait('@getAccessibleItems').then(({ request: { url } }) => {
        expect(url).to.contain('page=2');
      });
      cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(searchText);

      // using our custom interceptor with the search parameter we can distinguish the complete
      // search request from possibly other incomplete search requests
      cy.wait('@getAccessibleItems').then(({ request: { query } }) => {
        expect(query.keywords).to.eq(searchText);
        expect(query.page).to.eq('1');
      });
      cy.get(`#${buildItemCard(ownItems[0].id)}`).should('be.visible');
    });
  });

  describe('Pagination', () => {
    it('shows only items of each page', () => {
      // using default items per page count
      checkGridPagination(ownItems);
    });
  });
});

const checkGridPagination = (
  items: ItemForTest[],
  itemsPerPage: number = ITEM_PAGE_SIZE,
) => {
  const numberPages = Math.ceil(items.length / itemsPerPage);
  // for each page
  for (let i = 0; i < numberPages; i += 1) {
    // compute items that should be on this page
    const shouldDisplay = items.slice(0, (i + 1) * itemsPerPage);

    shouldDisplay.forEach((item) => {
      cy.get(`#${buildItemCard(item.id)}`).should('exist');
    });

    // navigate to page
    // button does not exist for last "page"
    if (i !== numberPages - 1) {
      cy.get(HOME_LOAD_MORE_BUTTON_SELECTOR).click();
    }
  }
};
