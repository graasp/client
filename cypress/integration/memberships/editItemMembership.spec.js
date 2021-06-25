import { PERMISSION_LEVELS } from '../../../src/enums';
import { buildItemPath } from '../../../src/config/paths';
import {
  buildItemMembershipRowId,
  buildPermissionOptionId,
  ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS,
  ITEM_SETTINGS_BUTTON_CLASS,
} from '../../../src/config/selectors';
import { ITEMS_WITH_MEMBERSHIPS } from '../../fixtures/memberships';

const editItemMembership = ({ id, permission }) => {
  cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();
  const select = cy.get(
    `#${buildItemMembershipRowId(
      id,
    )} .${ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS}`,
  );
  select.click();
  select.get(`#${buildPermissionOptionId(permission)}`).click();
};

describe('Edit Membership', () => {
  it('edit item membership', () => {
    cy.setUpApi({ ...ITEMS_WITH_MEMBERSHIPS });

    // go to children item
    const { id, memberships } = ITEMS_WITH_MEMBERSHIPS.items[0];
    cy.visit(buildItemPath(id));

    // update membership
    const permission = PERMISSION_LEVELS.READ;
    const { id: mId } = memberships[1];
    editItemMembership({ id: mId, permission });

    cy.wait('@editItemMembership').then(({ request: { url, body } }) => {
      expect(url).to.contain(mId);
      expect(body?.permission).to.equal(permission);
    });
  });
});
