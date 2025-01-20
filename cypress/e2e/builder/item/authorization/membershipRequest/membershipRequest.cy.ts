import { FolderItemFactory, MembershipRequestStatus } from '@graasp/sdk';

import {
  MEMBERSHIP_REQUEST_PENDING_SCREEN_SELECTOR,
  REQUEST_MEMBERSHIP_BUTTON_ID,
  buildDataCyWrapper,
} from '../../../../../../src/config/selectors';
import { CURRENT_MEMBER } from '../../../../../fixtures/members';
import { buildItemPath } from '../../../utils';

it('Request membership when signed in', () => {
  const item = FolderItemFactory();
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

it('Membership request is already sent', () => {
  const item = FolderItemFactory();
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
