import { UUID } from '@graasp/sdk';

import { useQuery } from '@tanstack/react-query';

import { UndefinedArgument } from '../../config/errors.js';
import { memberKeys } from '../../keys.js';
import * as Api from './api.js';

export const useOwnProfile = () =>
  useQuery({
    queryKey: memberKeys.current().profile,
    queryFn: () => Api.getOwnProfile(),
  });

export const usePublicProfile = (memberId?: UUID) =>
  useQuery({
    queryKey: memberKeys.single(memberId).profile,
    queryFn: () => {
      if (!memberId) {
        throw new UndefinedArgument();
      }
      return Api.getPublicProfile(memberId);
    },
    enabled: Boolean(memberId),
  });
