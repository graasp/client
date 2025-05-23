import { PackedFolderItemFactory, PermissionLevel } from '@graasp/sdk';

import {
  buildDownloadButtonId,
  buildItemsGridMoreButtonSelector,
} from '../../../../../src/config/selectors';
import { SAMPLE_PUBLIC_ITEMS } from '../../fixtures/items';
import { HOME_PATH, buildItemPath } from '../../utils';

const SHARED_ITEM = PackedFolderItemFactory(
  {},
  { permission: PermissionLevel.Read },
);

describe('Download Item', () => {
  it('Download action exists in item menu', () => {
    cy.setUpApi({ items: [SHARED_ITEM] });
    cy.visit(HOME_PATH);
    const item = SHARED_ITEM;
    cy.get(buildItemsGridMoreButtonSelector(item.id)).click();
    cy.get(`[role="menu"] #${buildDownloadButtonId(item.id)}`).should(
      'be.visible',
    );
  });
  it('Table View', () => {
    cy.setUpApi({ items: [SHARED_ITEM] });
    cy.visit(HOME_PATH);
    cy.wait('@getAccessibleItems').then(
      ({
        response: {
          body: { data },
        },
      }) => {
        for (const item of data) {
          cy.get(`#${buildDownloadButtonId(item.id)}`).should('exist');
        }
      },
    );
  });
  it('Grid view', () => {
    cy.setUpApi({ items: [SHARED_ITEM] });
    cy.visit(HOME_PATH);
    cy.wait('@getAccessibleItems').then(
      ({
        response: {
          body: { data },
        },
      }) => {
        for (const item of data) {
          cy.get(`#${buildDownloadButtonId(item.id)}`).should('exist');
        }
      },
    );
  });
  it('download button for public item should be exist', () => {
    cy.setUpApi({
      ...SAMPLE_PUBLIC_ITEMS,
      currentMember: null,
    });
    const item = SAMPLE_PUBLIC_ITEMS.items[4];
    cy.visit(buildItemPath(item.id));
    cy.wait('@getItem').then(({ response: { body } }) => {
      expect(body.id).to.equal(item.id);
      cy.get(`#${buildDownloadButtonId(item.id)}`).should('exist');
    });
  });
});
