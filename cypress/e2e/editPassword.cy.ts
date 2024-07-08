import { StatusCodes } from 'http-status-codes';

import { PROFILE_PATH } from '@/config/paths';
import {
  CONFIRM_PASSWORD_ID,
  NEW_PASSWORD_ID,
  PASSWORD_EDIT_BUTTON_ID,
  PASSWORD_SAVE_BUTTON_ID,
} from '@/config/selectors';

import { BOB } from '../fixtures/members';

describe('Password Settings', () => {
  beforeEach(() => {
    cy.setUpApi({
      currentMember: BOB,
    });
    cy.visit(PROFILE_PATH);
    cy.get(`#${PASSWORD_EDIT_BUTTON_ID}`).click();
    cy.wait('@getCurrentMember');
  });

  it('button should be disabled when password is not strong', () => {
    const weakPassword = 'weakPassword';

    cy.get(`#${NEW_PASSWORD_ID}`).type(weakPassword);
    cy.get(`#${CONFIRM_PASSWORD_ID}`).type(weakPassword);

    cy.get(`#${PASSWORD_SAVE_BUTTON_ID}`).should('be.disabled');
  });
  it('button should be disabled when password is empty', () => {
    const weakPassword = 'weakPassword';

    cy.get(`#${NEW_PASSWORD_ID}`).type(weakPassword);
    cy.get(`#${NEW_PASSWORD_ID}`).clear();

    cy.get(`#${CONFIRM_PASSWORD_ID}`).type(weakPassword);
    cy.get(`#${CONFIRM_PASSWORD_ID}`).clear();

    cy.get(`#${PASSWORD_SAVE_BUTTON_ID}`).should('be.disabled');
  });

  it('should update password successfully when password is strong', () => {
    const strongPassword = 'StrongPassword123';

    cy.get(`#${NEW_PASSWORD_ID}`).type(strongPassword);
    cy.get(`#${CONFIRM_PASSWORD_ID}`).type(strongPassword);
    cy.get(`#${PASSWORD_SAVE_BUTTON_ID}`).click();

    cy.wait('@updatePassword')
      .its('response.statusCode')
      .should('eq', StatusCodes.OK);
  });
});