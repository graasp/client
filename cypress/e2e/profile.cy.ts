import { HttpMethod, formatDate } from '@graasp/sdk';

import { PROFILE_PATH } from 'config/paths';

import i18n from '@/config/i18n';
import {
  CARD_TIP_ID,
  CROP_MODAL_CONFIRM_BUTTON_ID,
  IMAGE_AVATAR_UPLOADER,
  MEMBER_AVATR_ID,
  MEMBER_CREATEDAT_ID,
  MEMBER_PROFILE_ANALYTICS_SWITCH_ID,
  MEMBER_PROFILE_LANGUAGE_SWITCH_ID,
  USERNAME_CANCEL_BUTTON_ID,
  USERNAME_DISPLAY_ID,
  USERNAME_EDIT_BUTTON_ID,
  USERNAME_SAVE_BUTTON_ID,
  buildDataCyWrapper,
} from '@/config/selectors';

import { THUMBNAIL_MEDIUM_PATH } from '../fixtures/Thumbnails/links';
import {
  BOB,
  CURRENT_MEMBER,
  MEMBERS,
  MEMBERS_HAS_AVATAR,
} from '../fixtures/members';
import { AVATAR_LINK, mockGetCurrentMember } from '../support/server';
import { ID_FORMAT, buildDataCySelector } from '../support/utils';

const API_HOST = Cypress.env('VITE_GRAASP_API_HOST');

const currentMember = CURRENT_MEMBER;

const expectEnableSaveActionsInRequestToBe = (enableSaveActions: boolean) =>
  cy
    .wait('@editMember')
    .its('request.body.enableSaveActions')
    .should('eq', enableSaveActions);

const expectEnableSaveActionsInResponseToBe = (enableSaveActions: boolean) =>
  cy
    .wait('@getCurrentMember')
    .its('response.body.enableSaveActions')
    .should('eq', enableSaveActions);

const expectAnalyticsSwitchToBe = (enabled: boolean) =>
  cy
    .get(buildDataCySelector(MEMBER_PROFILE_ANALYTICS_SWITCH_ID, 'input'))
    .should(`${enabled ? '' : 'not.'}be.checked`);

const clickOnAnalyticsSwitch = () =>
  cy
    .get(buildDataCySelector(MEMBER_PROFILE_ANALYTICS_SWITCH_ID, 'input'))
    .click();

const checkAnalyticsAfterUpdate = (shouldSaveActionsBeEnabled: boolean) => {
  const enableSaveActions = shouldSaveActionsBeEnabled;
  mockGetCurrentMember({ ...currentMember, enableSaveActions });
  clickOnAnalyticsSwitch();
  expectEnableSaveActionsInRequestToBe(enableSaveActions);
  expectAnalyticsSwitchToBe(enableSaveActions);
  expectEnableSaveActionsInResponseToBe(enableSaveActions);
  expectAnalyticsSwitchToBe(enableSaveActions);
};

const changeUsername = (newUserName: string) => {
  cy.get(`#${USERNAME_EDIT_BUTTON_ID}`).click();
  cy.get('input[name=username]').clear();
  // Find the input field and type the new username
  cy.get('input[name=username]').type(newUserName);
};

describe('Change username', () => {
  beforeEach(() => {
    cy.setUpApi({ currentMember: BOB });
    cy.visit(PROFILE_PATH);
  });

  it('Username field connot be empty', () => {
    changeUsername('validUsername');
    cy.get('input[name=username]').clear();
    cy.get(`#${USERNAME_SAVE_BUTTON_ID}`).should('be.disabled');
  });

  it('Username too long', () => {
    const longUsername = MEMBERS.WRONG_NAME_TOO_LONG.name;
    changeUsername(longUsername);

    cy.get(`#${USERNAME_SAVE_BUTTON_ID}`).should('be.disabled');
  });

  it('Username too short', () => {
    const shortUsername = MEMBERS.WRONG_NAME_TOO_SHORT.name;
    changeUsername(shortUsername);
    cy.get(`#${USERNAME_SAVE_BUTTON_ID}`).should('be.disabled');
  });

  it('Valid username can be saved', () => {
    const validUsername = 'validUsername';
    changeUsername(validUsername);
    cy.get(`#${USERNAME_SAVE_BUTTON_ID}`).should('not.be.disabled');

    cy.get(`#${USERNAME_SAVE_BUTTON_ID}`).click();

    cy.wait('@editMember').then(({ request: { body } }) => {
      expect(body.name).to.equal(validUsername);
    });
  });

  it('Should not update the user name if canceling edit', () => {
    changeUsername('validUsername');
    cy.get(`#${USERNAME_CANCEL_BUTTON_ID}`).click();
    cy.get(`#${USERNAME_DISPLAY_ID}`).contains(BOB.name);
  });

  it('Saves username after trimming trailing space', () => {
    const usernameWithTrailingSpace = 'test  '; // Nom d'utilisateur avec espace à la fin
    changeUsername(usernameWithTrailingSpace);
    cy.get(`#${USERNAME_SAVE_BUTTON_ID}`).click();
    cy.wait('@editMember').then(({ request }) => {
      expect(request.body.name).to.equal(usernameWithTrailingSpace.trim());
    });
  });
});

describe('Checks the analytics switch', () => {
  describe('enableSaveActions is enabled', () => {
    beforeEach(() => {
      cy.setUpApi({
        currentMember: {
          ...currentMember,
          enableSaveActions: true,
        },
      });
      cy.visit(`${PROFILE_PATH}`);
      // wait on current member request to update then the mock response for current member
      cy.wait('@getCurrentMember');
    });

    it('Analytics switch should be enabled', () => {
      expectAnalyticsSwitchToBe(true);
    });

    it('Disable analytics switch', () => {
      checkAnalyticsAfterUpdate(false);
    });
  });

  describe('enableSaveActions is disabled', () => {
    beforeEach(() => {
      cy.setUpApi({
        currentMember: {
          ...currentMember,
          enableSaveActions: false,
        },
      });
      cy.visit(`${PROFILE_PATH}`);
      // wait on current member request to update then the mock response for current member
      cy.wait('@getCurrentMember');
    });

    it('Analytics switch should be enabled', () => {
      expectAnalyticsSwitchToBe(false);
    });

    it('Disable analytics switch', () => {
      checkAnalyticsAfterUpdate(true);
    });
  });
});

describe('Checks the language switch', () => {
  beforeEach(() => {
    cy.setUpApi({
      currentMember,
    });
    cy.visit(PROFILE_PATH);
    cy.wait('@getCurrentMember');
  });
  it('should select an option from the select component', () => {
    cy.get(`#${MEMBER_PROFILE_LANGUAGE_SWITCH_ID}`).should('be.visible'); // Ensure the element is visible
    cy.get(`#${MEMBER_PROFILE_LANGUAGE_SWITCH_ID}`).click();

    cy.get(`[role="option"][data-value="de"]`).click();
    cy.wait('@editMember').then(({ request }) => {
      expect(request.body.extra.lang).to.equal('de');
    });
  });
});

describe('Checks the current member language', () => {
  beforeEach(() => {
    cy.setUpApi({
      currentMember: { ...currentMember, extra: { lang: 'es' } },
    });
    cy.visit(PROFILE_PATH);
    cy.wait('@getCurrentMember');
  });

  it('should display the member language', () => {
    cy.get(`#${MEMBER_PROFILE_LANGUAGE_SWITCH_ID}`).should(
      'contain',
      'Español',
    );
  });
});

describe('Upload Avatar', () => {
  beforeEach(() => {
    cy.setUpApi({ currentMember: BOB });
    cy.visit('/');
  });

  it('Upload a new thumbnail', () => {
    // at first card element should exist
    cy.get(buildDataCyWrapper(CARD_TIP_ID)).should('exist');
    // select the avatar image
    cy.get(buildDataCyWrapper(IMAGE_AVATAR_UPLOADER)).selectFile(
      THUMBNAIL_MEDIUM_PATH,
      // use force because the input is visually hidden
      { force: true },
    );
    cy.get(`#${CROP_MODAL_CONFIRM_BUTTON_ID}`)
      .click()
      .then(() => {
        cy.get(buildDataCyWrapper(MEMBER_AVATR_ID)).should('be.visible');
      });
    cy.intercept(
      {
        method: HttpMethod.Get,
        // TODO: include all sizes
        url: new RegExp(
          `${API_HOST}/members/${ID_FORMAT}/avatar/(medium|small)\\?replyUrl\\=true`,
        ),
      },
      ({ reply }) =>
        // TODO: REPLY URL
        reply(AVATAR_LINK),
    );

    cy.wait('@uploadAvatar');
    // card element should not exist
    cy.get(buildDataCyWrapper(CARD_TIP_ID)).should('not.exist');
  });
});

describe('Image is  not set', () => {
  beforeEach(() => {
    cy.setUpApi({ currentMember: BOB });
    cy.visit('/');
  });
  it('Image is not set', () => {
    cy.get(buildDataCyWrapper(CARD_TIP_ID)).should('exist');
    // Image element should not exist
    cy.get(buildDataCyWrapper(IMAGE_AVATAR_UPLOADER)).should('not.exist');
  });
});

describe('Check  member info', () => {
  const formattedDate = formatDate(MEMBERS_HAS_AVATAR.BOB.createdAt, {
    locale: i18n.language,
  });
  beforeEach(() => {
    cy.setUpApi({
      currentMember: MEMBERS_HAS_AVATAR.BOB,
      members: Object.values(MEMBERS_HAS_AVATAR),
    });
    cy.visit('/');
    cy.wait('@getCurrentMember');
  });
  it('displays the correct member info', () => {
    // displays the correct member avatar
    cy.get(buildDataCyWrapper(MEMBER_AVATR_ID)).should(
      'have.attr',
      'src',
      MEMBERS_HAS_AVATAR.BOB.thumbnails,
    );
    // displays the correct member name
    cy.get(buildDataCyWrapper(USERNAME_DISPLAY_ID)).should(
      'contain',
      MEMBERS_HAS_AVATAR.BOB.name,
    );
    // displays the correct creation date

    cy.get(buildDataCyWrapper(MEMBER_CREATEDAT_ID)).should(
      'contain',
      formattedDate,
    );
  });
});

describe('Redirect when not logged in', () => {
  beforeEach(() => {
    cy.setUpApi({ currentMember: null });
  });

  it('redirects to the login page when not logged in', () => {
    cy.visit('/');
    cy.url().should('include', `?url=`);
  });
});
