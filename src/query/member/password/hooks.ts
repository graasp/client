import { useQuery } from '@tanstack/react-query';

import { memberKeys } from '../../keys.js';
import { getPasswordStatus } from './api.js';

export const usePasswordStatus = () =>
  useQuery({
    queryKey: memberKeys.current().passwordStatus,
    queryFn: () => getPasswordStatus(),
  });
