import {
  GuestFactory,
  ItemLoginSchemaFactory,
  PackedFolderItemFactory,
  PackedRecycledItemDataFactory,
} from '@graasp/sdk';

import i18n from '../../../../../.storybook/i18nTestInstance';
import {
  PREVENT_GUEST_MESSAGE_ID,
  RECYCLED_ITEMS_ERROR_ALERT_ID,
  RECYCLED_ITEMS_ROOT_CONTAINER,
  buildItemCard,
} from '../../../../../src/config/selectors';
import { BUILDER } from '../../../../../src/modules/builder/langs';
import { CURRENT_USER } from '../../fixtures/members';
import { RECYCLE_BIN_PATH } from '../../utils';

const recycledItemData = [
  PackedRecycledItemDataFactory(),
  PackedRecycledItemDataFactory(),
  PackedRecycledItemDataFactory(),
];

describe('View trash', () => {
  it('Show message for guest', () => {
    const item = PackedFolderItemFactory();
    const guest = GuestFactory({
      itemLoginSchema: ItemLoginSchemaFactory({ item }),
    });
    cy.setUpApi({ items: [item], currentMember: guest });
    cy.visit(RECYCLE_BIN_PATH);
    cy.get(`#${PREVENT_GUEST_MESSAGE_ID}`).should('be.visible');
  });

  describe('Member has no recycled items', () => {
    it('Show empty table', () => {
      cy.setUpApi({
        items: recycledItemData.map(({ item }) => item),
      });
      cy.visit(RECYCLE_BIN_PATH);
      i18n.changeLanguage(CURRENT_USER.extra.lang as string);
      const text = i18n.t(BUILDER.TRASH_NO_ITEM, { ns: 'builder' });
      cy.get(`#${RECYCLED_ITEMS_ROOT_CONTAINER}`).should('contain', text);
    });
  });

  describe('Member has recycled items', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: recycledItemData.map(({ item }) => item),
        recycledItemData,
      });
      i18n.changeLanguage(CURRENT_USER.extra.lang as string);
      cy.visit(RECYCLE_BIN_PATH);
    });

    it('check recycled item layout', () => {
      for (const { item } of recycledItemData) {
        cy.get(`#${buildItemCard(item.id)}`).should('be.visible');
      }
    });
  });

  describe('Error Handling', () => {
    it('check recycled item layout with server error', () => {
      cy.setUpApi({
        items: recycledItemData.map(({ item }) => item),
        recycledItemData,
        getRecycledItemsError: true,
      });
      cy.visit(RECYCLE_BIN_PATH);

      cy.get(`#${RECYCLED_ITEMS_ERROR_ALERT_ID}`).should('exist');
    });
  });
});
