import { ACCOUNT_HOME_PATH, LOG_IN_PAGE_PATH } from '../../../src/config/paths';

describe('Redirections', () => {
  it('redirects to the login page when not logged in', () => {
    cy.setUpApi({ currentMember: null });
    cy.visit(ACCOUNT_HOME_PATH);
    cy.wait('@getCurrentMember');
    cy.url().should('contain', `/auth/login?url=`);
  });

  it('redirects to builder when already logged in', () => {
    // COMMENT: This has been changed from "/account" to "/builder" to not change too much for users.
    // in the future we will redirect to a personalized home page for the user
    cy.setUpApi({});
    cy.visit(LOG_IN_PAGE_PATH);
    cy.wait('@getCurrentMember');
    cy.url().should('contain', '/builder');
  });
});
