import { useQuery } from '@tanstack/react-query';

import * as Api from '../api/itemBookmark.js';
import { memberKeys } from '../keys.js';

export const useBookmarkedItems = () =>
  useQuery({
    queryKey: memberKeys.current().bookmarkedItems,
    queryFn: () => Api.getBookmarkedItems(),
  });
