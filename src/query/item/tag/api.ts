import { DiscriminatedItem, Tag } from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import {
  buildAddTagRoute,
  buildGetTagsByItemRoute,
  buildRemoveTagRoute,
} from './routes.js';

export const getTagsByItem = async (args: {
  itemId: DiscriminatedItem['id'];
}) => {
  return axios
    .get<Tag[]>(`${API_HOST}/${buildGetTagsByItemRoute(args)}`)
    .then(({ data }) => data);
};

export const addTag = async (args: {
  itemId: DiscriminatedItem['id'];
  tag: Pick<Tag, 'category' | 'name'>;
}) => {
  return axios
    .post<void>(`${API_HOST}/${buildAddTagRoute(args)}`, args.tag)
    .then(({ data }) => data);
};

export const removeTag = async (args: {
  itemId: DiscriminatedItem['id'];
  tagId: Tag['id'];
}) => {
  return axios
    .delete<void>(`${API_HOST}/${buildRemoveTagRoute(args)}`)
    .then(({ data }) => data);
};
