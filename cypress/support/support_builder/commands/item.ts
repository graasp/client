import {
  HOME_MODAL_ITEM_ID,
  MY_GRAASP_ITEM_PATH,
  TREE_MODAL_CONFIRM_BUTTON_ID,
  buildItemRowArrowId,
  buildNavigationModalItemId,
  buildTreeItemId,
} from '../../../../src/config/selectors';
import { getParentsIdsFromPath } from '../../../../src/modules/builder/utils/item';

Cypress.Commands.add('clickTreeMenuItem', (value: string) => {
  // cy.wrap(tree)
  cy.get(`#${buildNavigationModalItemId(value)}`)
    .get(`#${buildItemRowArrowId(value)}`)
    .first()
    // hack to show button - cannot trigger with cypress
    .invoke('attr', 'style', 'visibility: visible')
    .click();
});

Cypress.Commands.add(
  'handleTreeMenu',
  (toItemPath, treeRootId = HOME_MODAL_ITEM_ID) => {
    const ids =
      toItemPath === MY_GRAASP_ITEM_PATH
        ? []
        : getParentsIdsFromPath(toItemPath);

    [MY_GRAASP_ITEM_PATH, ...ids].forEach((value, idx, array) => {
      cy.get(`#${treeRootId}`).then(($tree) => {
        // click on the element
        if (idx === array.length - 1) {
          cy.wrap($tree)
            .get(`#${buildNavigationModalItemId(value)}`)
            .first()
            .click();
        }
        // if can't find children click on parent (current value)
        if (
          idx !== array.length - 1 &&
          !$tree.find(`#${buildTreeItemId(array[idx + 1], treeRootId)}`).length
        ) {
          cy.clickTreeMenuItem(value);
        }
      });
    });

    cy.get(`#${TREE_MODAL_CONFIRM_BUTTON_ID}`).click();
  },
);
