import { TagCategoryType } from '@graasp/sdk';

export const buildGetTagCountsRoute = ({
  search,
  category,
}: {
  search?: string;
  category?: TagCategoryType;
}) => {
  const searchParams = new URLSearchParams();

  // searchParams
  if (search) {
    searchParams.set('search', search);
  }
  if (category) {
    searchParams.set('category', category);
  }
  return `tags?${searchParams}`;
};
