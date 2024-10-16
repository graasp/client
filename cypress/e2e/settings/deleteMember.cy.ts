import { SETTINGS_PATH } from '../../../src/config/paths';
import {
  DELETE_MEMBER_BUTTON_ID,
  DELETE_MEMBER_DIALOG_CONFIRMATION_BUTTON_ID,
  DELETE_MEMBER_DIALOG_CONFIRMATION_FIELD_ID,
  DELETE_MEMBER_DIALOG_TITLE_ID,
  DELETE_MEMBER_SECTION_ID,
  LOGIN_REQUIRED_TEXT_ID,
} from '../../../src/config/selectors';
import { CURRENT_MEMBER } from '../../fixtures/members';

describe('Current Member', () => {
  it('Delete account', () => {
    cy.setUpApi({
      currentMember: CURRENT_MEMBER,
    });
    cy.visit(SETTINGS_PATH);
    cy.wait('@getCurrentMember');

    cy.get(`#${DELETE_MEMBER_SECTION_ID}`).should('be.visible');
    cy.get(`#${DELETE_MEMBER_BUTTON_ID}`).click();
    cy.get(`#${DELETE_MEMBER_DIALOG_TITLE_ID}`).should('be.visible');
    cy.get(`#${DELETE_MEMBER_DIALOG_CONFIRMATION_FIELD_ID}`).type('delete');
    cy.get(`#${DELETE_MEMBER_DIALOG_CONFIRMATION_BUTTON_ID}`).click();
    cy.wait('@deleteCurrentMember');
  });
});

describe('Unauthenticated member', () => {
  it('Delete account', () => {
    cy.setUpApi({
      currentMember: null,
    });
    cy.visit(SETTINGS_PATH);

    // there is no authenticated user, we expect the login text to be displayed
    cy.get(`#${LOGIN_REQUIRED_TEXT_ID}`).should('be.visible');
  });
});
