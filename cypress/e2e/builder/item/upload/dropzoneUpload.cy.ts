import { PackedFolderItemFactory } from '@graasp/sdk';

import { DROPZONE_SELECTOR } from '../../../../../src/config/selectors';
import { SAMPLE_PUBLIC_ITEMS } from '../../fixtures/items';
import { HOME_PATH, buildItemPath } from '../../utils';

describe('Dropzone Helper Visibility', () => {
  describe('Home screen', () => {
    beforeEach(() => {
      cy.setUpApi();
    });

    it('should display the dropzone on the home screen when no items', () => {
      cy.visit(HOME_PATH);
      cy.get(DROPZONE_SELECTOR).should('be.visible');
    });
  });

  describe('Empty folder', () => {
    it('should show dropzone helper when no items (logged in)', () => {
      const ITEMS = [PackedFolderItemFactory()];
      cy.setUpApi({ items: ITEMS });
      cy.visit(buildItemPath(ITEMS[0].id));
      cy.get(DROPZONE_SELECTOR).should('be.visible');
    });

    it('should hide dropzone helper when no items (logged out)', () => {
      cy.setUpApi({ ...SAMPLE_PUBLIC_ITEMS, currentMember: null });
      cy.visit(buildItemPath(SAMPLE_PUBLIC_ITEMS.items[2].id));
      cy.get(DROPZONE_SELECTOR).should('not.exist');
    });
  });
});
