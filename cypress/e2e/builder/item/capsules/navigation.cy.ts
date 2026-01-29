import { CapsuleItemFactory, PackedFolderItemFactory } from '@graasp/sdk';

import { buildItemCard } from '../../../../../src/config/selectors';
import { HOME_PATH, buildItemPath } from '../../utils';

it('capsule navigates to player from home', () => {
  const capsule = CapsuleItemFactory();

  cy.setUpApi({ items: [capsule] });
  cy.visit(HOME_PATH);

  cy.wait('@getAccessibleItems');

  // visit capsule should go to player
  const url = `/player/${capsule.id}/${capsule.id}`;
  cy.get(`#${buildItemCard(capsule.id)} a[href^="${url}"]`)
    .first()
    .click();

  cy.url().should('include', url);
});

it('capsule navigates to player from parent folder', () => {
  const parentItem = PackedFolderItemFactory();
  const capsule = CapsuleItemFactory({ parentItem });

  cy.setUpApi({ items: [parentItem, capsule] });
  cy.visit(buildItemPath(parentItem.id));

  // visit capsule should go to player
  const url = `/player/${capsule.id}/${capsule.id}`;
  cy.get(`#${buildItemCard(capsule.id)} a[href^="${url}"]`)
    .first()
    .click();

  cy.url().should('include', url);
});
