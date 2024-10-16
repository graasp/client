import { PROFILE_PATH } from '../../../src/config/paths';
import {
  PUBLIC_PROFILE_BIO_ID,
  PUBLIC_PROFILE_EDIT_BUTTON_ID,
  PUBLIC_PROFILE_FACEBOOK_HREF_ID,
  PUBLIC_PROFILE_FACEBOOK_ID,
  PUBLIC_PROFILE_LINKEDIN_HREF_ID,
  PUBLIC_PROFILE_LINKEDIN_ID,
  PUBLIC_PROFILE_SAVE_BUTTON_ID,
  PUBLIC_PROFILE_TWITTER_HREF_ID,
  PUBLIC_PROFILE_TWITTER_ID,
} from '../../../src/config/selectors';
import {
  BOB,
  MEMBER_EMPTY_PUBLIC_PROFILE,
  MEMBER_PUBLIC_PROFILE,
} from '../../fixtures/members';

const SocialProfile = {
  Linkedin: 'linkedinID',
  Twitter: 'twitterID',
  Facebook: 'facebookID',
} as const;

describe('Display public profile', () => {
  describe('Completed public profile', () => {
    beforeEach(() => {
      cy.setUpApi({
        currentMember: BOB,
        currentProfile: MEMBER_PUBLIC_PROFILE,
      });
      cy.visit(PROFILE_PATH);
      cy.wait('@getOwnProfile');
    });

    it('displays public profile info', () => {
      // displays the correct bio
      cy.get(`#${PUBLIC_PROFILE_BIO_ID}`).should(
        'contain',
        MEMBER_PUBLIC_PROFILE.bio,
      );

      // displays the correct member linkedIn
      cy.get(`#${PUBLIC_PROFILE_LINKEDIN_ID}`).should(
        'contain',
        MEMBER_PUBLIC_PROFILE.linkedinID,
      );
      // displays the correct member linkedIn link
      cy.get(`#${PUBLIC_PROFILE_LINKEDIN_HREF_ID}`).should(
        'have.attr',
        'href',
        `https://linkedin.com/in/${MEMBER_PUBLIC_PROFILE.linkedinID}`,
      );

      // displays the correct member twitter
      cy.get(`#${PUBLIC_PROFILE_TWITTER_ID}`).should(
        'contain',
        MEMBER_PUBLIC_PROFILE.twitterID,
      );
      // displays the correct member twitter link
      cy.get(`#${PUBLIC_PROFILE_TWITTER_HREF_ID}`).should(
        'have.attr',
        'href',
        `https://twitter.com/${MEMBER_PUBLIC_PROFILE.twitterID}`,
      );

      // displays the correct member facebook
      cy.get(`#${PUBLIC_PROFILE_FACEBOOK_ID}`).should(
        'contain',
        MEMBER_PUBLIC_PROFILE.facebookID,
      );
      // displays the correct member facebook link
      cy.get(`#${PUBLIC_PROFILE_FACEBOOK_HREF_ID}`).should(
        'have.attr',
        'href',
        `https://facebook.com/${MEMBER_PUBLIC_PROFILE.facebookID}`,
      );
    });
  });

  describe('Empty public profile', () => {
    beforeEach(() => {
      cy.setUpApi({
        currentMember: BOB,
        currentProfile: MEMBER_EMPTY_PUBLIC_PROFILE,
      });
      cy.visit(PROFILE_PATH);
      cy.wait('@getOwnProfile');
    });

    it('display public profile when empty', () => {
      // displays a message indicating no bio is available
      cy.get(`#${PUBLIC_PROFILE_BIO_ID}`).should(
        'contain',
        'No biography has been specified',
      );

      // displays a message indicating no LinkedIn ID is available
      cy.get(`#${PUBLIC_PROFILE_LINKEDIN_ID}`).should(
        'contain',
        'No LinkedIn username has been specified',
      );

      // displays a message indicating no Twitter ID is available
      cy.get(`#${PUBLIC_PROFILE_TWITTER_ID}`).should(
        'contain',
        'No Twitter username has been specified',
      );

      // displays a message indicating no Facebook ID is available
      cy.get(`#${PUBLIC_PROFILE_FACEBOOK_ID}`).should(
        'contain',
        'No Facebook username has been specified',
      );
    });
  });
});

describe('Edit public profile', () => {
  beforeEach(() => {
    cy.setUpApi({
      currentMember: BOB,
      currentProfile: MEMBER_PUBLIC_PROFILE,
    });
    cy.visit(PROFILE_PATH);
    cy.wait('@getCurrentMember');
    cy.wait('@getOwnProfile');
    cy.get(`#${PUBLIC_PROFILE_EDIT_BUTTON_ID}`).click();
  });

  it('With initial values', () => {
    // displays the correct member bio value
    cy.get(`#${PUBLIC_PROFILE_BIO_ID}`).should(
      'have.value',
      MEMBER_PUBLIC_PROFILE.bio,
    );
    // displays the correct member linkedin value
    cy.get(`#${PUBLIC_PROFILE_LINKEDIN_ID}`).should(
      'have.value',
      `https://linkedin.com/in/${MEMBER_PUBLIC_PROFILE.linkedinID}`,
    );
    // displays the correct member twitter value
    cy.get(`#${PUBLIC_PROFILE_TWITTER_ID}`).should(
      'have.value',
      `https://twitter.com/${MEMBER_PUBLIC_PROFILE.twitterID}`,
    );
    // displays the correct member facebook value
    cy.get(`#${PUBLIC_PROFILE_FACEBOOK_ID}`).should(
      'have.value',
      `https://facebook.com/${MEMBER_PUBLIC_PROFILE.facebookID}`,
    );
  });

  it('bio field cannot be empty ', () => {
    cy.get(`#${PUBLIC_PROFILE_BIO_ID}`).clear();
    cy.get(`#${PUBLIC_PROFILE_SAVE_BUTTON_ID}`).should('be.disabled');
  });

  [
    {
      platform: SocialProfile.Linkedin,
      urls: [
        'https://www.linke@din.com/in/sample',
        'https://www.linkedin.com/in/sam*ple',
        'https://www.linkedin.com/in/',
      ],
    },
    {
      platform: SocialProfile.Twitter,
      urls: [
        'https://www.twitte@r.com/sample',
        'https://www.twitter.com/sam*ple',
        'https://twitter.com/',
      ],
    },
    {
      platform: SocialProfile.Facebook,
      urls: [
        'https://www.faceb@ook.com/sample',
        'https://www.facebook.com/sam*ple',
        'https://www.facebook.com/',
      ],
    },
  ].forEach(({ platform, urls }) => {
    describe(platform, () => {
      urls.forEach((url) =>
        it(url, () => {
          cy.get(`input[name=${platform}]`).clear();
          cy.get(`input[name=${platform}]`).type(url);
          cy.get(`#${PUBLIC_PROFILE_SAVE_BUTTON_ID}`).should('be.disabled');
        }),
      );
    });
  });

  Object.values(SocialProfile).forEach((platform) => {
    it(`Can clear ${platform}`, () => {
      // clear
      cy.get(`input[name=${platform}]`).clear();
      cy.get(`#${PUBLIC_PROFILE_SAVE_BUTTON_ID}`).should('not.be.disabled');
      cy.get(`#${PUBLIC_PROFILE_SAVE_BUTTON_ID}`).click();
      cy.wait('@editPublicProfile').then(({ request: { body } }) => {
        expect(body[platform]).to.equal('');
      });
    });

    it(`Enter valid ${platform}`, () => {
      // set new social profile
      const validProfile = 'simple';
      cy.get(`input[name=${platform}]`).clear();
      cy.get(`input[name=${platform}]`).type(validProfile);
      cy.get(`#${PUBLIC_PROFILE_SAVE_BUTTON_ID}`).should('not.be.disabled');
      cy.get(`#${PUBLIC_PROFILE_SAVE_BUTTON_ID}`).click();
      cy.wait('@editPublicProfile').then(({ request: { body } }) => {
        expect(body[platform]).to.equal(validProfile);
      });
    });
  });
});
