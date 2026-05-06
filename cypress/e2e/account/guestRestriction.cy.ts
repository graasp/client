import {
  GuestFactory,
  ItemLoginSchemaFactory,
  ItemLoginSchemaType,
  PackedFolderItemFactory,
} from '@graasp/sdk';

import {
  PREVENT_GUEST_LOGOUT_BUTTON_ID,
  PREVENT_GUEST_MESSAGE_ID,
} from '../../../src/config/selectors';

const folder = PackedFolderItemFactory();
const itemLoginSchema = ItemLoginSchemaFactory({
  type: ItemLoginSchemaType.Username,
  item: folder,
});
const guest = GuestFactory({ itemLoginSchema });

describe('Guest on member-only page', () => {
  beforeEach(() => {
    cy.setUpApi({
      items: [folder],
      currentMember: null,
      currentGuest: guest,
    });
    cy.visit('/account/settings');
  });

  it('shows the guest restriction screen', () => {
    cy.get(`#${PREVENT_GUEST_MESSAGE_ID}`).should('be.visible');
  });

  it('shows a logout button', () => {
    cy.get(`#${PREVENT_GUEST_LOGOUT_BUTTON_ID}`).should('be.visible');
  });

  it('redirects to the item player page when the logout button is clicked', () => {
    cy.get(`#${PREVENT_GUEST_LOGOUT_BUTTON_ID}`).click();
    cy.wait('@signOut');
    cy.url().should('include', `/player/${folder.id}/${folder.id}`);
  });
});
