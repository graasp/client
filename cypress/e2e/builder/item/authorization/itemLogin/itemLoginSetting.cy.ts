import {
  GuestFactory,
  ItemLoginSchemaStatus,
  ItemLoginSchemaType,
  PackedFolderItemFactory,
  PermissionLevel,
} from '@graasp/sdk';

import {
  DELETE_GUEST_CONFIRM_BUTTON_ID,
  REQUEST_MEMBERSHIP_BUTTON_ID,
  SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID,
  buildShareButtonId,
} from '../../../../../../src/config/selectors';
import { MEMBERS } from '../../../../../fixtures/members';
import { ITEM_LOGIN_PAUSE } from '../../../../../support/constants';
import { buildItemMembership } from '../../../fixtures/memberships';
import { buildItemPath, buildItemSharePath } from '../../../utils';
import { addItemLoginSchema } from './utils';

const ALERT_BUTTON = `[role="alert"] button`;
const DIALOG_SELECTOR = `[role="dialog"]`;

const checkItemLoginSetting = ({
  mode,
  disabled = false,
}: {
  mode: string;
  disabled?: boolean;
}) => {
  if (!disabled) {
    cy.get(`#${SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID} + input`).should(
      'have.value',
      mode,
    );
  } else {
    cy.get(`#${SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID}`).then((el) => {
      // test classnames are 'disabled'
      expect(el.parent().html()).to.contain('disabled');
    });
  }
};

const editItemLoginSetting = (mode: string) => {
  cy.get(`#${SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID}`).click();
  cy.get(`li[data-value="${mode}"]`).click();
  cy.wait('@putItemLoginSchema').then(({ request: { body } }) => {
    expect(body?.type).to.equal(mode);
  });
};

describe('Item Login', () => {
  it('Item Login not allowed', () => {
    const item = PackedFolderItemFactory({}, { permission: null });
    cy.setUpApi({
      items: [item],
      currentMember: MEMBERS.BOB,
    });
    cy.visit(buildItemPath(item.id));
    cy.wait(ITEM_LOGIN_PAUSE);
    cy.get(`#${REQUEST_MEMBERSHIP_BUTTON_ID}`).should('exist');
  });

  describe('Display Item Login Setting', () => {
    it('edit item login setting', () => {
      const item = addItemLoginSchema(
        PackedFolderItemFactory(),
        ItemLoginSchemaType.Username,
      );
      const child = {
        ...PackedFolderItemFactory({ parentItem: item }),
        // inherited schema
        itemLoginSchema: item.itemLoginSchema,
      };
      cy.setUpApi({ items: [item, child] });
      // check item with item login enabled
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      checkItemLoginSetting({
        mode: ItemLoginSchemaType.Username,
      });
      editItemLoginSetting(ItemLoginSchemaType.UsernameAndPassword);

      // disabled at child level
      cy.visit(buildItemPath(child.id));
      cy.get(`#${buildShareButtonId(child.id)}`).click();
      checkItemLoginSetting({
        mode: ItemLoginSchemaType.UsernameAndPassword,
        disabled: true,
      });
    });

    it('read permission', () => {
      const item = addItemLoginSchema(
        PackedFolderItemFactory({}, { permission: PermissionLevel.Read }),
        ItemLoginSchemaType.UsernameAndPassword,
      );
      cy.setUpApi({
        items: [item],
        currentMember: MEMBERS.BOB,
      });
      cy.visit(buildItemPath(item.id));
      cy.wait(ITEM_LOGIN_PAUSE);
    });
  });
});

describe('Item Login Delete Button', () => {
  describe('without guests', () => {
    it('Delete item login for private item ', () => {
      const item = addItemLoginSchema(
        PackedFolderItemFactory({}),
        ItemLoginSchemaType.UsernameAndPassword,
        ItemLoginSchemaStatus.Disabled,
      );
      cy.setUpApi({
        items: [item],
      });
      cy.visit(buildItemSharePath(item.id));

      // delete
      cy.get(ALERT_BUTTON).click();
      cy.wait('@deleteItemLoginSchema').then(({ request: { url } }) => {
        expect(url).to.include(item.id);
      });
    });

    it('Delete item login for public item', () => {
      const item = addItemLoginSchema(
        PackedFolderItemFactory({}, { publicVisibility: {} }),
        ItemLoginSchemaType.UsernameAndPassword,
        ItemLoginSchemaStatus.Disabled,
      );
      cy.setUpApi({
        items: [item],
      });
      cy.visit(buildItemSharePath(item.id));

      // delete
      cy.get(ALERT_BUTTON).click();
      cy.wait('@deleteItemLoginSchema').then(({ request: { url } }) => {
        expect(url).to.include(item.id);
      });
    });
  });
  describe('with guests', () => {
    it('Delete item login for private item ', () => {
      const item = addItemLoginSchema(
        PackedFolderItemFactory({}),
        ItemLoginSchemaType.UsernameAndPassword,
        ItemLoginSchemaStatus.Disabled,
      );
      const guest = GuestFactory({ itemLoginSchema: item.itemLoginSchema });
      cy.setUpApi({
        items: [
          {
            ...item,
            memberships: [
              buildItemMembership({
                item,
                account: guest,
                permission: PermissionLevel.Read,
              }),
            ],
          },
        ],
      });
      cy.visit(buildItemSharePath(item.id));

      // display delete alert
      cy.get(ALERT_BUTTON).click();
      cy.get(DIALOG_SELECTOR).should('contain', guest.name);

      // click delete
      cy.get(`${DIALOG_SELECTOR} #${DELETE_GUEST_CONFIRM_BUTTON_ID}`).click();
      cy.wait('@deleteItemLoginSchema').then(({ request: { url } }) => {
        expect(url).to.include(item.id);
      });
    });

    it('Delete item login for public item', () => {
      const item = addItemLoginSchema(
        PackedFolderItemFactory({}, { publicVisibility: {} }),
        ItemLoginSchemaType.UsernameAndPassword,
        ItemLoginSchemaStatus.Disabled,
      );
      const guest = GuestFactory({ itemLoginSchema: item.itemLoginSchema });
      cy.setUpApi({
        items: [
          {
            ...item,
            memberships: [
              buildItemMembership({
                item,
                account: guest,
                permission: PermissionLevel.Read,
              }),
            ],
          },
        ],
      });
      cy.visit(buildItemSharePath(item.id));

      // display delete alert
      cy.get(ALERT_BUTTON).click();
      cy.get(DIALOG_SELECTOR).should('contain', guest.name);

      // click delete
      cy.get(`${DIALOG_SELECTOR} #${DELETE_GUEST_CONFIRM_BUTTON_ID}`).click();
      cy.wait('@deleteItemLoginSchema').then(({ request: { url } }) => {
        expect(url).to.include(item.id);
      });
    });
  });
});
