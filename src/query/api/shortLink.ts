import {
  ShortLink,
  ShortLinkAvailable,
  ShortLinksOfItem,
  UpdateShortLink,
} from '@graasp/sdk';

import axios from 'axios';

import { API_HOST } from '@/config/env.js';

import {
  buildDeleteShortLinkRoute,
  buildGetShortLinkAvailableRoute,
  buildGetShortLinksItemRoute,
  buildPatchShortLinkRoute,
  buildPostShortLinkRoute,
} from '../routes.js';
import { verifyAuthentication } from './axios.js';

export const getShortLinkAvailable = (alias: string) =>
  verifyAuthentication(() =>
    axios
      .get<ShortLinkAvailable>(
        `${API_HOST}/${buildGetShortLinkAvailableRoute(alias)}`,
      )
      .then(({ data }) => data),
  );

export const getShortLinksItem = (itemId: string) =>
  verifyAuthentication(() =>
    axios
      .get<ShortLinksOfItem>(
        `${API_HOST}/${buildGetShortLinksItemRoute(itemId)}`,
      )
      .then(({ data }) => data),
  );

export const deleteShortLink = (alias: string) =>
  verifyAuthentication(() =>
    axios
      .delete<ShortLink>(`${API_HOST}/${buildDeleteShortLinkRoute(alias)}`)
      .then(({ data }) => data),
  );

export const postShortLink = async (shortLink: ShortLink) =>
  verifyAuthentication(() =>
    axios
      .post<ShortLink>(`${API_HOST}/${buildPostShortLinkRoute()}`, shortLink)
      .then(({ data }) => data),
  );

export const patchShortLink = (
  alias: string,
  updatedPayload: UpdateShortLink,
) =>
  verifyAuthentication(() =>
    axios
      .patch<ShortLink>(
        `${API_HOST}/${buildPatchShortLinkRoute(alias)}`,
        updatedPayload,
      )
      .then(({ data }) => data),
  );
