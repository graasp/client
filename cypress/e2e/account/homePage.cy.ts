import { API_ROUTES } from '@graasp/query-client';
import {
  HttpMethod,
  PackedFolderItemFactory,
  PackedShortcutItemFactory,
} from '@graasp/sdk';

import { formatDistanceToNow } from 'date-fns';
import { StatusCodes } from 'http-status-codes';

import { getLocalForDateFns } from '../../../src/config/langs';
import { ACCOUNT_HOME_PATH } from '../../../src/config/paths';
import {
  AVATAR_UPLOAD_ICON_ID,
  AVATAR_UPLOAD_INPUT_ID,
  CROP_MODAL_CONFIRM_BUTTON_ID,
  MEMBER_AVATAR_IMAGE_ID,
  MEMBER_CREATED_AT_ID,
  MEMBER_USERNAME_DISPLAY_ID,
} from '../../../src/config/selectors';
import { MEMBERS, MEMBER_WITH_AVATAR } from '../../fixtures/members';
import {
  AVATAR_LINK,
  THUMBNAIL_MEDIUM_PATH,
} from '../../fixtures/thumbnails/links';
import { API_HOST } from '../../support/env';
import { MemberForTest } from '../../support/types';
import { ID_FORMAT } from '../../support/utils';

const { buildGetCurrentMemberRoute, buildUploadAvatarRoute } = API_ROUTES;

const targetItem = PackedFolderItemFactory({ name: 'Target' });
const shortcutItem = PackedShortcutItemFactory({
  name: 'Shortcut',
  extra: { shortcut: { target: targetItem.id } },
});

type TestHelperInput = { currentMember: MemberForTest };
class TestHelper {
  private readonly currentMember: MemberForTest;

  constructor(args: TestHelperInput) {
    this.currentMember = JSON.parse(JSON.stringify(args.currentMember));
  }

  setupServer() {
    cy.intercept(
      {
        method: HttpMethod.Get,
        url: `${API_HOST}/${buildGetCurrentMemberRoute()}`,
      },
      ({ reply }) =>
        reply({ statusCode: StatusCodes.OK, body: this.currentMember }),
    ).as('getCurrentMember');
    cy.intercept(
      {
        method: HttpMethod.Get,
        url: new RegExp(
          `${API_HOST}/members/${ID_FORMAT}/avatar/(original|large|medium|small)\\?replyUrl\\=true`,
        ),
      },
      ({ reply }) => {
        if (this.currentMember.extra.hasAvatar) {
          return reply({ body: this.currentMember.thumbnails });
        }
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      },
    ).as('getAvatar');
    cy.intercept(
      {
        method: HttpMethod.Post,
        url: new RegExp(`${buildUploadAvatarRoute()}`),
      },
      ({ reply }) => {
        // update avatar
        this.currentMember.extra.hasAvatar = true;
        // use default avatar link as thumbnail, we discard the uploaded thumbnail
        this.currentMember.thumbnails = AVATAR_LINK;
        return reply({ statusCode: StatusCodes.OK });
      },
    ).as('uploadAvatar');
  }
}

describe('Upload Avatar', () => {
  let helpers: TestHelper;
  beforeEach(() => {
    helpers = new TestHelper({ currentMember: MEMBERS.BOB });
    helpers.setupServer();
    cy.visit(ACCOUNT_HOME_PATH);
  });

  it('Upload a new thumbnail', () => {
    // select the avatar image
    cy.get(`#${AVATAR_UPLOAD_INPUT_ID}`).selectFile(
      THUMBNAIL_MEDIUM_PATH,
      // use force because the input is visually hidden
      { force: true },
    );
    cy.get(`#${CROP_MODAL_CONFIRM_BUTTON_ID}`)
      .click()
      .then(() => {
        cy.get(`#${MEMBER_AVATAR_IMAGE_ID}`).should('be.visible');
      });
    cy.wait('@uploadAvatar');
  });
});

describe('Image is not set', () => {
  beforeEach(() => {
    cy.setUpApi({ currentMember: MEMBERS.BOB });
    cy.visit(ACCOUNT_HOME_PATH);
  });

  it('Image is not set', () => {
    cy.wait('@getCurrentMember');
    // uploader icon should be visible
    cy.get(`#${AVATAR_UPLOAD_ICON_ID}`).should('be.visible');
    // image display element should not exist
    cy.get(`#${MEMBER_AVATAR_IMAGE_ID}`).should('not.exist');
  });
});

describe('Check member info', () => {
  beforeEach(() => {
    cy.setUpApi({
      currentMember: MEMBER_WITH_AVATAR,
    });
    cy.visit(ACCOUNT_HOME_PATH);
    cy.wait('@getCurrentMember');
  });

  it('displays the correct member info', () => {
    cy.wait('@getCurrentMemberAvatarUrl');
    // displays the correct member avatar
    cy.get(`#${MEMBER_AVATAR_IMAGE_ID}`).should(
      'have.attr',
      'src',
      MEMBER_WITH_AVATAR.thumbnails,
    );
    // displays the correct member name
    cy.get(`#${MEMBER_USERNAME_DISPLAY_ID}`).should(
      'contain',
      MEMBER_WITH_AVATAR.name,
    );
    const lang = MEMBER_WITH_AVATAR.extra.lang ?? 'en';
    // displays the correct creation date
    const formattedDate = formatDistanceToNow(MEMBER_WITH_AVATAR.createdAt, {
      locale: getLocalForDateFns(lang),
    });
    cy.get(`#${MEMBER_CREATED_AT_ID}`).should('contain', formattedDate);
  });
});

describe('Recent items', () => {
  beforeEach(() => {
    cy.setUpApi({
      currentMember: MEMBER_WITH_AVATAR,
      items: [shortcutItem, targetItem],
    });
    cy.visit(ACCOUNT_HOME_PATH);
    cy.wait('@getCurrentMember');
  });

  it('Shortcut item links to target item', () => {
    cy.get(`#recentItem-${shortcutItem.id}`).should('be.visible');
    cy.get(`#recentItem-${targetItem.id}`).should('be.visible');

    // card action on the shortcut directs to the target item
    cy.get(`a#recentItemCardAction-${shortcutItem.id}`).click();
    cy.url().should('contain', `/player/${targetItem.id}/${targetItem.id}`);

    // builder link
    cy.visit('/account');
    cy.get(`a#recentItemBuilder-${shortcutItem.id}`).click();
    cy.url().should('contain', `/builder/items/${targetItem.id}`);

    // player link
    cy.visit('/account');
    cy.get(`a#recentItemPlayer-${shortcutItem.id}`).click();
    cy.url().should('contain', `/player/${targetItem.id}/${targetItem.id}`);

    // analytics link
    cy.visit('/account');
    cy.get(`a#recentItemAnalytics-${shortcutItem.id}`).click();
    cy.url().should('contain', `/analytics/items/${targetItem.id}`);

    // the target item directs to the target item
    cy.visit('/account');
    cy.get(`a#recentItemCardAction-${targetItem.id}`).click();
    cy.url().should('contain', `/player/${targetItem.id}/${targetItem.id}`);
  });
});
