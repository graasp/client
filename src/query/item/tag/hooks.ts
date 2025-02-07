import { DiscriminatedItem } from '@graasp/sdk';

import { useQuery } from '@tanstack/react-query';

import { UndefinedArgument } from '../../config/errors.js';
import { itemKeys } from '../../keys.js';
import { getTagsByItem } from './api.js';

export const useTagsByItem = ({
  itemId,
}: {
  itemId?: DiscriminatedItem['id'];
}) => {
  return useQuery({
    queryKey: itemKeys.single(itemId).tags,
    queryFn: () => {
      if (!itemId) {
        throw new UndefinedArgument({ itemId });
      }
      return getTagsByItem({ itemId });
    },
    enabled: Boolean(itemId),
  });
};
