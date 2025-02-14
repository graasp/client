import { HEADER_MEMBER_MENU_BUTTON_ID } from '../../../src/config/selectors';

describe('Header', () => {
  describe('User Menu', () => {
    it('Sign out', () => {
      cy.setUpApi();
      cy.visit('/home');
      // sign out
      cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();
      cy.get('li').contains('Log out').click();
      cy.url().should('include', '/auth/login');
    });
  });
});
