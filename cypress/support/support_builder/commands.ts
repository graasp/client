import 'cypress-localstorage-commands';

import { LAYOUT_MODE_BUTTON_ID } from '../../../src/config/selectors';
import { ItemLayoutMode } from '../../../src/modules/builder/enums';
import './commands/item';
import './commands/navigation';

Cypress.Commands.add('switchMode', (mode) => {
  cy.get(`#${LAYOUT_MODE_BUTTON_ID}`).click({ force: true });
  switch (mode) {
    case ItemLayoutMode.Grid:
      cy.get(`li[value="${ItemLayoutMode.Grid}"]`).click({ force: true });
      break;
    case ItemLayoutMode.List:
      cy.get(`li[value="${ItemLayoutMode.List}"]`).click({ force: true });
      break;
    case ItemLayoutMode.Map:
      cy.get(`li[value="${ItemLayoutMode.Map}"]`).click({ force: true });
      break;
    default:
      throw new Error(`invalid mode ${mode} provided`);
  }
});

Cypress.Commands.add(
  'clickElementInIframe',
  (iframeSelector, elementSelector) =>
    cy
      .get(iframeSelector)
      .then(($iframe) =>
        cy.wrap($iframe.contents().find(elementSelector)).click(),
      ),
);

Cypress.Commands.add(
  'checkContentInElementInIframe',
  (iframeSelector, elementSelector, text) =>
    cy
      .get(iframeSelector)
      .then(($iframe) =>
        cy
          .wrap($iframe.contents().find(elementSelector))
          .should('contain', text),
      ),
);

Cypress.Commands.add('attachFile', (selector, file, options = {}) => {
  selector.selectFile(`cypress/fixtures/${file}`, options);
});

Cypress.Commands.add('attachFiles', (selector, filenames, options = {}) => {
  const correctFilenames = filenames.map(
    (filename) => `cypress/fixtures/${filename}`,
  );
  selector.selectFile(correctFilenames, options);
});
