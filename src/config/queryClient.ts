import { configureQueryClient } from '@/query';

import { API_HOST, SHOW_NOTIFICATIONS } from './env';
import notifier from './notifier';

const {
  queryClient,
  QueryClientProvider,
  hooks,
  mutations,
  useMutation,
  useQueryClient,
  ReactQueryDevtools,
  axios,
  useQuery,
} = configureQueryClient({
  API_HOST,
  notifier,
  defaultQueryOptions: {
    keepPreviousData: true,
  },
  SHOW_NOTIFICATIONS,
});
export {
  useQueryClient,
  mutations,
  queryClient,
  QueryClientProvider,
  hooks,
  useMutation,
  ReactQueryDevtools,
  axios,
  useQuery,
};
