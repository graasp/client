import { UUID } from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import { buildExportItemRoute } from '../routes.js';

export const exportItem = async (id: UUID) =>
  axios
    .get<Blob>(`${API_HOST}/${buildExportItemRoute(id)}`, {
      method: 'GET',
      responseType: 'blob',
    })
    .then(({ data, headers }) => {
      const [_, encodedFileName] =
        // content is usually: filename="name.png"
        headers['content-disposition'].split('"');
      const name = decodeURI(encodedFileName);
      return { name, data };
    });
