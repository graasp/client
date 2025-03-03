import { SignJWT } from 'jose/jwt/sign';

import {
  EMAIL_SIGN_IN_FIELD_ID,
  EMAIL_SIGN_UP_FIELD_ID,
  MAGIC_LINK_EMAIL_FIELD_ID,
  NAME_SIGN_UP_FIELD_ID,
  PASSWORD_SIGN_IN_BUTTON_ID,
  PASSWORD_SIGN_IN_FIELD_ID,
  REGISTER_BUTTON_ID,
  SIGN_IN_BUTTON_ID,
} from '../../../src/config/selectors';

export const fillSignUpLayout = ({
  name,
  email,
}: {
  name: string;
  email?: string;
}) => {
  cy.get(`#${NAME_SIGN_UP_FIELD_ID}`).clear().type(name);
  if (email) {
    cy.get(`#${EMAIL_SIGN_UP_FIELD_ID}`).clear().type(email);
  }
};

export const checkInvitationFields = ({
  name,
  email,
}: {
  name?: string;
  email: string;
}): void => {
  if (name) {
    cy.get(`#${NAME_SIGN_UP_FIELD_ID}`).should('have.value', name);
  }
  cy.get(`#${EMAIL_SIGN_UP_FIELD_ID}`)
    .should('have.value', email)
    .should('be.disabled');
};

export const fillSignInByMailLayout = ({ email }: { email?: string }): void => {
  if (email) {
    cy.get(`#${MAGIC_LINK_EMAIL_FIELD_ID}`).clear().type(email);
  }
};

export const submitSignIn = (): void => {
  cy.get(`#${SIGN_IN_BUTTON_ID}`).click();
};

export const submitRegister = (): void => {
  cy.get(`#${REGISTER_BUTTON_ID}`).click();
};

export const fillPasswordSignInLayout = ({
  email,
  password,
}: {
  email: string;
  password?: string;
}): void => {
  cy.get(`#${EMAIL_SIGN_IN_FIELD_ID}`).clear().type(email);
  if (password) {
    cy.get(`#${PASSWORD_SIGN_IN_FIELD_ID}`).clear().type(password);
  }
};

export const submitPasswordSignIn = (): void => {
  cy.get(`#${PASSWORD_SIGN_IN_BUTTON_ID}`).click();
};

export const generateJWT = async (
  payload: string,
  expiresAt: string = '24h',
): Promise<string> => {
  const jwt = await new SignJWT({ payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(
      new TextEncoder().encode(
        // random key. You could put whatever you want here.
        'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
      ),
    );
  return jwt;
};
