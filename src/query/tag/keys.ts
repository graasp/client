import { TagCategoryType } from '@graasp/sdk';

export const tagKeys = {
  search: (args: { search?: string; category?: TagCategoryType }) => [
    'tags',
    args,
  ],
};
