import { StatusCodes } from 'http-status-codes';

import { LOG_IN_PAGE_PATH } from '../../../src/config/paths';
import {
  EMAIL_SIGN_IN_FIELD_ID,
  ERROR_DISPLAY_ID,
  PASSWORD_SIGN_IN_BUTTON_ID,
  PASSWORD_SIGN_IN_FIELD_ID,
} from '../../../src/config/selectors';
import { API_ROUTES } from '../../../src/query-client';
import { AUTH_MEMBERS } from '../../fixtures/members';
import { fillPasswordSignInLayout } from './util';

describe('Email and Password Validation', () => {
  it('Sign In With Password', () => {
    const redirectionLink = 'http://localhost:3005/mylink';
    cy.intercept(
      {
        pathname: API_ROUTES.SIGN_IN_WITH_PASSWORD_ROUTE,
      },
      ({ reply }) => {
        reply({ statusCode: 303, body: { resource: redirectionLink } });
      },
    ).as('signInWithPassword');
    cy.intercept(
      {
        url: redirectionLink,
      },
      ({ reply }) => {
        reply({
          headers: { 'content-type': 'text/html' },
          statusCode: StatusCodes.OK,
          body: '<h1>Mock Auth Page</h1>',
        });
      },
    ).as('redirectionPage');

    const { INVALID_EMAIL: WRONG_EMAIL, GRAASP } = AUTH_MEMBERS;
    cy.visit(LOG_IN_PAGE_PATH);
    // Signing in with wrong email
    cy.signInPasswordAndCheck(WRONG_EMAIL);

    // Signing in with a valid email and password
    cy.signInPasswordAndCheck(GRAASP);
    cy.wait('@signInWithPassword');
    cy.url().should('contain', redirectionLink);
  });

  it('Sign In With Wrong Password', () => {
    cy.intercept(
      {
        pathname: API_ROUTES.SIGN_IN_WITH_PASSWORD_ROUTE,
      },
      (req) => {
        req.reply({
          statusCode: StatusCodes.UNAUTHORIZED,
          body: { message: 'Unauthorized member' },
        });
      },
    ).as('signInWithPassword');

    cy.visit(LOG_IN_PAGE_PATH);

    // Signing in with a valid email but wrong password
    fillPasswordSignInLayout(AUTH_MEMBERS.WRONG_PASSWORD);
    cy.get(`#${PASSWORD_SIGN_IN_BUTTON_ID}`).click();
    cy.get(`#${EMAIL_SIGN_IN_FIELD_ID}-helper-text`).should('not.exist');
    cy.get(`#${PASSWORD_SIGN_IN_FIELD_ID}-helper-text`).should('not.exist');
    cy.get(`#${ERROR_DISPLAY_ID}`).should('be.visible');
  });

  it('Check errors if  shows success message if no redirect', () => {
    cy.intercept(
      {
        pathname: API_ROUTES.SIGN_IN_WITH_PASSWORD_ROUTE,
      },
      (req) => {
        req.reply({ statusCode: 303 });
      },
    ).as('signInWithPassword');

    cy.visit(LOG_IN_PAGE_PATH);
    cy.signInPasswordAndCheck(AUTH_MEMBERS.INVALID_EMAIL);

    // Signing in with a valid email but empty password
    cy.signInPasswordAndCheck(AUTH_MEMBERS.INVALID_PASSWORD);
  });
});
