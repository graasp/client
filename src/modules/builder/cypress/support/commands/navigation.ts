import {
  NAVIGATION_HOME_LINK_ID,
  buildItemCard,
} from '../../../config/selectors';
import { buildItemPath } from '../../../paths';

Cypress.Commands.add('goToItemInCard', (id) => {
  // card component might have many click zone
  cy.get(`#${buildItemCard(id)} a[href="${buildItemPath(id)}"]`)
    .first()
    .click();
});

Cypress.Commands.add('goToHome', () => {
  cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();
});

Cypress.Commands.add('goToItemWithNavigation', (id) => {
  cy.get(`[href^="${buildItemPath(id)}"]`).click();
});
