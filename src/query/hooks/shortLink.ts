import { useQuery } from '@tanstack/react-query';

import * as Api from '../api/shortLink.js';
import { UndefinedArgument } from '../config/errors.js';
import { buildShortLinkKey, itemKeys } from '../keys.js';

export const useShortLinkAvailable = (alias: string | undefined) =>
  useQuery({
    queryKey: buildShortLinkKey(alias),
    queryFn: () => {
      if (!alias) {
        throw new UndefinedArgument();
      }
      return Api.getShortLinkAvailable(alias);
    },
    enabled: Boolean(alias),
  });

export const useShortLinksItem = (itemId: string) =>
  useQuery({
    queryKey: itemKeys.single(itemId).shortLinks,
    queryFn: () => Api.getShortLinksItem(itemId),
    enabled: Boolean(itemId),
  });
