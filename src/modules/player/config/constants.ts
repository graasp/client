import { Context } from '@graasp/sdk';

import { GRAASP_BUILDER_HOST, GRAASP_LIBRARY_HOST } from '@/config/env';

export const APP_NAME = 'Graasp';

export const buildGraaspPlayerItemRoute = (id: string): string =>
  `${window.location.origin}/${id}`;

export const ITEM_CARD_MAX_LENGTH = 18;
export const HEADER_HEIGHT = 64;
export const DRAWER_WIDTH = 400;
export const DESCRIPTION_MAX_LENGTH = 130;

export const HOST_MAP = {
  [Context.Builder]: GRAASP_BUILDER_HOST,
  [Context.Library]: GRAASP_LIBRARY_HOST,
  [Context.Analytics]: '/analytics',
  [Context.Player]: '/',
};

export const FLOATING_BUTTON_Z_INDEX = 10;

export const buildBuilderTabName = (id: string): string => `builder-tab-${id}`;

export const AVATAR_ICON_HEIGHT = 30;
