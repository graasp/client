import { MeiliSearchResults, Tag, TagCategory } from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import {
  SEARCH_PUBLISHED_ITEMS_ROUTE,
  buildGetSearchFacets,
} from '../routes.js';

export type MeiliSearchProps = {
  limit?: number;
  offset?: number;
  sort?: string[];
  attributesToCrop?: string[];
  cropLength?: number;
  highlightPreTag?: string;
  highlightPostTag?: string;
  page?: number;
  elementsPerPage?: number;
  query?: string;
  tags?: Record<TagCategory, Tag['name'][]>;
  isPublishedRoot?: boolean;
  langs?: string[];
};

export const searchPublishedItems = async (query: MeiliSearchProps) => {
  return axios
    .post<
      MeiliSearchResults['results'][0]
    >(`${API_HOST}/${SEARCH_PUBLISHED_ITEMS_ROUTE}`, query)
    .then(({ data }) => data);
};

export const getSearchFacets = async (
  query: MeiliSearchProps & { facetName: string },
) => {
  return axios
    .post<
      Record<string, number>
    >(`${API_HOST}/${buildGetSearchFacets(query.facetName)}`, query)
    .then(({ data }) => data);
};
