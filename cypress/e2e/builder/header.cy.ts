import {
  APP_NAVIGATION_PLATFORM_SWITCH_ID,
  HEADER_MEMBER_MENU_BUTTON_ID,
} from '../../../src/config/selectors';

describe('Header', () => {
  it('App Navigation', () => {
    cy.setUpApi();
    cy.visit('/builder');
    cy.get('[data-testid="builder"]').click();
    cy.get(`#${APP_NAVIGATION_PLATFORM_SWITCH_ID}`).should('exist');
  });

  describe('User Menu', () => {
    it('Sign out', () => {
      cy.setUpApi();
      cy.visit('/builder');
      // sign out
      cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();
      cy.get('li').contains('Sign Out').click();
      cy.url().should('include', '/auth/login');
    });
  });
});
