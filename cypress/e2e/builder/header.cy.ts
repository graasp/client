import {
  APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS,
  APP_NAVIGATION_PLATFORM_SWITCH_ID,
  HEADER_MEMBER_MENU_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID,
} from '../../../src/config/selectors';

describe('Header', () => {
  it('App Navigation', () => {
    cy.setUpApi();
    cy.visit('/builder');
    // check navigation and display and interface doesn't crash
    // todo: this is less robust than using the Platform contant from ui, but it was making cypress compile ui which is unnecessary.
    cy.get(`#${APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS.builder}`).click();
    cy.get(`#${APP_NAVIGATION_PLATFORM_SWITCH_ID}`).should('exist');
  });

  describe('User Menu', () => {
    it('Sign out', () => {
      cy.setUpApi();
      cy.visit('/builder');
      // sign out
      cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();
      cy.get(`#${HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID}`).click();
      cy.url().should('include', '/auth/login');
    });
  });
});
