import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import { buildGetEmbeddedLinkMetadata } from '../routes.js';
import { EmbeddedLinkMetadata } from '../types.js';

export const getEmbeddedLinkMetadata = (
  link: string,
): Promise<EmbeddedLinkMetadata> =>
  axios
    .get<EmbeddedLinkMetadata>(
      `${API_HOST}/${buildGetEmbeddedLinkMetadata(link)}`,
    )
    .then(({ data }) => data);
