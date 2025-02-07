import { PublicationStatus, UUID } from '@graasp/sdk';

import axios from 'axios';

import { API_HOST } from '@/config/env.js';

import { buildGetPublicationStatusRoute } from '../../routes.js';

export const getItemPublicationStatus = async (itemId: UUID) =>
  axios
    .get<PublicationStatus>(
      `${API_HOST}/${buildGetPublicationStatusRoute(itemId)}`,
    )
    .then(({ data }) => data);
