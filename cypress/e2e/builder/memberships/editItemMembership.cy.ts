import {
  ItemMembership,
  PackedFolderItemFactory,
  PermissionLevel,
  PermissionLevelOptions,
} from '@graasp/sdk';

import {
  ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS,
  buildItemMembershipRowEditButtonId,
  buildPermissionOptionId,
  buildShareButtonId,
} from '../../../../src/config/selectors';
import { CURRENT_MEMBER } from '../../../fixtures/members';
import { MEMBERS } from '../../../fixtures/members';
import { ItemForTest } from '../../../support/types';
import { ITEMS_WITH_MEMBERSHIPS } from '../fixtures/memberships';
import { buildItemPath, buildItemSharePath } from '../utils';

const openPermissionSelect = ({
  id,
  permission,
}: {
  id: ItemMembership['id'];
  permission: PermissionLevelOptions;
}) => {
  cy.get(`#${buildItemMembershipRowEditButtonId(id)}`).click();
  const select = cy.get(`.${ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS}`);
  select.click();
  select.get(`#${buildPermissionOptionId(permission)}`).click();
};

const editItemMembership = ({
  itemId,
  id,
  permission,
}: {
  id: string;
  itemId: string;
  permission: PermissionLevelOptions;
}) => {
  cy.get(`#${buildShareButtonId(itemId)}`).click();
  openPermissionSelect({ id, permission });
  cy.get('button[type="submit"]').click();
};

describe('Edit Membership', () => {
  it('edit item membership', () => {
    cy.setUpApi(ITEMS_WITH_MEMBERSHIPS);

    // go to children item
    const { id, memberships } = ITEMS_WITH_MEMBERSHIPS.items[0];
    cy.visit(buildItemPath(id));

    // update membership
    const permission = PermissionLevel.Read;
    const { id: mId } = memberships[1];
    editItemMembership({ itemId: id, id: mId, permission });

    cy.wait('@editItemMembership').then(({ request: { url, body } }) => {
      expect(url).to.contain(mId);
      expect(body?.permission).to.equal(permission);
    });
  });

  it('edit children membership should create a new membership', () => {
    cy.setUpApi({ ...ITEMS_WITH_MEMBERSHIPS });

    // go to children item
    const { id, memberships } = ITEMS_WITH_MEMBERSHIPS.items[1];
    cy.visit(buildItemPath(id));

    // update membership
    const permission = PermissionLevel.Admin;
    const { id: mId } = memberships[1];
    editItemMembership({ itemId: id, id: mId, permission });

    cy.wait('@postItemMembership').then(({ request: { url, body } }) => {
      expect(url).to.contain(id);
      expect(body?.permission).to.equal(permission);
    });
  });

  it('cannot downgrade child membership', () => {
    const item: ItemForTest = PackedFolderItemFactory();
    const child: ItemForTest = PackedFolderItemFactory();
    const memberships = [
      {
        id: 'membership-0',
        permission: PermissionLevel.Admin,
        account: CURRENT_MEMBER,
        item: child,
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },
      {
        id: 'membership-1',
        permission: PermissionLevel.Write,
        account: MEMBERS.BOB,
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
        item,
      },
    ];
    const items = [
      {
        ...child,
        memberships,
      },
    ];
    cy.setUpApi({ items });

    // go to children item
    cy.visit(buildItemSharePath(child.id));

    const m = memberships[1];
    openPermissionSelect(m);

    // should not show read
    cy.get(`#${buildPermissionOptionId(PermissionLevel.Read)}`).should(
      'not.exist',
    );
  });
});
