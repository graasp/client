import { useQuery } from '@tanstack/react-query';

import * as Api from '../api/apps.js';
import { CONSTANT_KEY_STALE_TIME_MILLISECONDS } from '../config/constants.js';
import { APPS_KEY, memberKeys } from '../keys.js';

export const useApps = () =>
  useQuery({
    queryKey: APPS_KEY,
    queryFn: () => Api.getApps(),
    staleTime: CONSTANT_KEY_STALE_TIME_MILLISECONDS,
  });
export const useMostUsedApps = () =>
  useQuery({
    queryKey: memberKeys.current().mostUsedApps,
    queryFn: () => Api.getMostUsedApps(),
  });
