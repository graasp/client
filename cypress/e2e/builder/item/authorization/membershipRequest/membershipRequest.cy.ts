import { MembershipRequestStatus, PackedFolderItemFactory } from '@graasp/sdk';

import { v4 } from 'uuid';

import {
  ITEM_LOGIN_SCREEN_FORBIDDEN_ID,
  MEMBERSHIP_REQUEST_PENDING_SCREEN_SELECTOR,
  REQUEST_MEMBERSHIP_BUTTON_ID,
  buildDataCyWrapper,
} from '../../../../../../src/config/selectors';
import { CURRENT_MEMBER } from '../../../../../fixtures/members';
import { buildItemPath } from '../../../utils';

it('Request membership when signed in', () => {
  const item = PackedFolderItemFactory({}, { permission: null });
  cy.setUpApi({
    items: [item],
  });

  cy.visit(buildItemPath(item.id));

  // click on request button
  cy.get(`#${REQUEST_MEMBERSHIP_BUTTON_ID}`).click();

  // check endpoint
  cy.wait('@requestMembership').then(({ request }) => {
    expect(request.url).to.contain(item.id);
  });

  // button is disabled
  cy.get(`#${REQUEST_MEMBERSHIP_BUTTON_ID}`).should('be.disabled');
});
it('Cannot request membership if item is hidden', () => {
  cy.setUpApi({
    items: [],
  });

  cy.visit(buildItemPath(v4()));

  cy.get(`#${ITEM_LOGIN_SCREEN_FORBIDDEN_ID}`).should('be.visible');
});

it('Membership request is already sent', () => {
  const item = PackedFolderItemFactory({}, { permission: null });
  cy.setUpApi({
    items: [item],
    membershipRequests: [
      {
        item,
        member: CURRENT_MEMBER,
        status: MembershipRequestStatus.Pending,
        createdAt: '2024-06-12T00:45:00Z',
      },
    ],
  });

  cy.visit(buildItemPath(item.id));

  // request pending screen
  cy.get(buildDataCyWrapper(MEMBERSHIP_REQUEST_PENDING_SCREEN_SELECTOR)).should(
    'be.visible',
  );
});
