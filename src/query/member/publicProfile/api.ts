import { PublicProfile, UUID } from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import {
  buildGetOwnPublicProfileRoute,
  buildGetPublicProfileRoute,
  buildPatchPublicProfileRoute,
  buildPostPublicProfileRoute,
} from '../routes.js';

export const getOwnProfile = () =>
  axios
    .get<PublicProfile | null>(`${API_HOST}/${buildGetOwnPublicProfileRoute()}`)
    .then(({ data }) => data);

export const getPublicProfile = (memberId: UUID) =>
  axios
    .get<PublicProfile | null>(
      `${API_HOST}/${buildGetPublicProfileRoute(memberId)}`,
    )
    .then(({ data }) => data);

export type PostPublicProfilePayloadType = {
  bio: string;
  twitterID?: string;
  facebookID?: string;
  linkedinID?: string;
  visibility?: boolean;
};

export const postPublicProfile = async ({
  bio,
  twitterID,
  facebookID,
  linkedinID,
  visibility = false,
}: PostPublicProfilePayloadType) =>
  axios
    .post(`${API_HOST}/${buildPostPublicProfileRoute()}`, {
      bio,
      twitterID,
      facebookID,
      linkedinID,
      visibility,
    })
    .then(({ data }) => data);

export const patchPublicProfile = async (
  arg: Partial<PostPublicProfilePayloadType>,
) =>
  axios
    .patch(`${API_HOST}/${buildPatchPublicProfileRoute()}`, arg)
    .then(({ data }) => data);
