import { ItemLoginSchemaType, ItemType } from '@graasp/sdk';

export const APP_NAME = 'Graasp';

/**
 * Max length to display for an item name
 */
export const ITEM_NAME_MAX_LENGTH = 20;

export const SETTINGS = {
  ITEM_LOGIN: {
    name: 'item-login',
    SIGN_IN_MODE: {
      PSEUDONYM: 'pseudonym',
      MEMBER_ID: 'memberId',
      USERNAME_AND_PASSWORD: 'username+password',
    },
  },
  ITEM_PUBLIC: {
    name: 'public-item',
  },
  ITEM_HIDDEN: {
    name: 'hidden',
  },
  // this tag doesn't exist but is used if none of the visiblity tag is set
  ITEM_PRIVATE: {
    name: 'private-item',
  },
};

export const SETTINGS_ITEM_LOGIN_DEFAULT = ItemLoginSchemaType.Username;
export const SETTINGS_ITEM_LOGIN_SIGN_IN_MODE_DEFAULT =
  SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.PSEUDONYM;

export const ITEM_TYPES_WITH_CAPTIONS: string[] = [
  ItemType.FOLDER,
  ItemType.S3_FILE,
  ItemType.LOCAL_FILE,
  ItemType.APP,
  ItemType.LINK,
  ItemType.DOCUMENT,
];

export const SHORT_LINK_COLOR = 'black';
export const SHORT_LINK_CONTAINER_BORDER_WIDTH = 1;
export const SHORT_LINK_CONTAINER_BORDER_STYLE = 'dotted';

export const THUMBNAIL_SETTING_MAX_WIDTH = 76;
export const THUMBNAIL_SETTING_MAX_HEIGHT = 76;

export const H5P_FILE_DOT_EXTENSION = '.h5p';

export const CC_LICENSE_ADAPTION_OPTIONS = {
  ALLOW: 'allow',
  ALIKE: 'alike',
  NONE: '',
};

export const CC_LICENSE_ABOUT_URL =
  'https://creativecommons.org/about/cclicenses/';

export const ADMIN_CONTACT = 'admin@graasp.org';

export const MEMBERSHIP_TABLE_HEIGHT = 400;
export const MEMBERSHIP_TABLE_ROW_HEIGHT = 75;

export const DISPLAY_CO_EDITORS_OPTIONS = {
  YES: {
    value: true,
    label: 'Yes',
  },
  NO: {
    value: false,
    label: 'No',
  },
};

export const ITEM_HEADER_ICON_HEIGHT = 24;
export const AVATAR_ICON_HEIGHT = 30;
export const DEFAULT_LINK_SHOW_IFRAME = false;
export const DEFAULT_LINK_SHOW_BUTTON = true;

// TODO: refer from specific endpoint /tutorials?
export const TUTORIALS_LINK =
  'https://player.graasp.org/9d80d81f-ec9d-4bfb-836a-1c6b125aef2f';
export const TAGS_DOCUMENTATION =
  'https://graasp.github.io/docs/user/library/tags/';

// todo: to remove once we dynamically compute how many items we display
export const ITEM_PAGE_SIZE = 12;
export const WARNING_COLOR = '#FFCC02';
export const DIALOG_CONTENT_WIDTH = { xs: '300px', sm: '500px' };
