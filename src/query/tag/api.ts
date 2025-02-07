import { Tag, TagCategory } from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import { buildGetTagCountsRoute } from './routes.js';

export const getTagCounts = async (args: {
  search?: string;
  category?: TagCategory;
}) => {
  return axios
    .get<
      {
        id: Tag['id'];
        name: Tag['name'];
        category: Tag['category'];
        count: number;
      }[]
    >(`${API_HOST}/${buildGetTagCountsRoute(args)}`)
    .then(({ data }) => data);
};
