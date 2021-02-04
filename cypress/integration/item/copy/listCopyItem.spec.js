import { MODES, ROOT_ID } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  buildItemMenu,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { SIMPLE_ITEMS } from '../../../fixtures/items';

const copyItem = (id, toItemId) => {
  const menuSelector = `#${buildItemsTableRowId(
    id,
  )} .${ITEM_MENU_BUTTON_CLASS}`;
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_COPY_BUTTON_CLASS}`).click();
  cy.fillTreeModal(toItemId);
};

describe('Copy Item in List', () => {
  it('copy item on Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit(HOME_PATH);
    cy.switchMode(MODES.LIST);

    // copy
    const { id: copyItemId } = SIMPLE_ITEMS[0];
    const { id: toItem } = SIMPLE_ITEMS[1];
    copyItem(copyItemId, toItem);

    cy.wait('@copyItem').then(({ response: { body } }) => {
      cy.get(`#${buildItemsTableRowId(copyItemId)}`).should('exist');

      // check in new parent
      cy.goToItemInList(toItem);
      cy.get(`#${buildItemsTableRowId(body.id)}`).should('exist');
    });
  });

  it('copy item in item', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(MODES.LIST);

    // copy
    const { id: copyItemId } = SIMPLE_ITEMS[2];
    const { id: toItem } = SIMPLE_ITEMS[3];
    copyItem(copyItemId, toItem);

    cy.wait('@copyItem').then(({ response: { body } }) => {
      cy.get(`#${buildItemsTableRowId(copyItemId)}`).should('exist');

      // check in new parent
      cy.goToItemInList(toItem);
      cy.get(`#${buildItemsTableRowId(body.id)}`).should('exist');
    });
  });

  it('copy item to Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(MODES.LIST);

    // copy
    const { id: copyItemId } = SIMPLE_ITEMS[2];
    const toItem = ROOT_ID;
    copyItem(copyItemId, toItem);

    cy.wait('@copyItem').then(({ response: { body } }) => {
      cy.get(`#${buildItemsTableRowId(copyItemId)}`).should('exist');

      // check in new parent
      cy.goToHome();
      cy.get(`#${buildItemsTableRowId(body.id)}`).should('exist');
    });
  });

  describe('Errors handling', () => {
    it('error while moving item does not create in interface', () => {
      cy.setUpApi({ items: SIMPLE_ITEMS, copyItemError: true });
      const { id } = SIMPLE_ITEMS[0];

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(MODES.LIST);

      // copy
      const { id: copyItemId } = SIMPLE_ITEMS[2];
      const { id: toItem } = SIMPLE_ITEMS[0];
      copyItem(copyItemId, toItem);

      cy.wait('@copyItem').then(({ response: { body } }) => {
        // check item is still existing in parent
        cy.get(`#${buildItemsTableRowId(copyItemId)}`).should('exist');
        cy.get(`#${buildItemsTableRowId(body.id)}`).should('not.exist');
      });
    });
  });
});
