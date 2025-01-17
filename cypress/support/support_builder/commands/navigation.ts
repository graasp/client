import { buildItemCard } from '../../../../src/config/selectors';
import { buildItemPath } from '../../../e2e/builder/utils';

Cypress.Commands.add('goToItemInCard', (id) => {
  // card component might have many click zone
  cy.get(`#${buildItemCard(id)} a[href="${buildItemPath(id)}"]`)
    .first()
    .click();
});
