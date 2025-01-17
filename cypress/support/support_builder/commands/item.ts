import {
  HOME_MODAL_ITEM_ID,
  ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS,
  MY_GRAASP_ITEM_PATH,
  SHARE_BUTTON_SELECTOR,
  SHARE_ITEM_EMAIL_INPUT_ID,
  SHARE_ITEM_SHARE_BUTTON_ID,
  TREE_MODAL_CONFIRM_BUTTON_ID,
  buildDataCyWrapper,
  buildItemRowArrowId,
  buildNavigationModalItemId,
  buildPermissionOptionId,
  buildTreeItemId,
} from '../../../../src/config/selectors';
import { getParentsIdsFromPath } from '../../../../src/modules/builder/utils/item';

Cypress.Commands.add(
  'fillShareForm',
  ({ email, permission, submit = true, selector = '' }) => {
    cy.get(buildDataCyWrapper(SHARE_BUTTON_SELECTOR)).click();

    // select permission
    cy.get(`${selector} .${ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS}`).click();
    cy.get(`#${buildPermissionOptionId(permission)}`).click();

    // input mail
    cy.get(`#${SHARE_ITEM_EMAIL_INPUT_ID}`).type(email);

    if (submit) {
      cy.get(`#${SHARE_ITEM_SHARE_BUTTON_ID}`).click();
    }
  },
);

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
