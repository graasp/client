import { configureWebsocketClient } from '@graasp/sdk';

import { configureQueryClient } from '@/query';

import { API_HOST, SHOW_NOTIFICATIONS, WS_HOST } from './env';
import notifier from './notifier';

export const WS_CLIENT = configureWebsocketClient(WS_HOST);

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
  wsClient: WS_CLIENT,
});
export {
  axios,
  hooks,
  mutations,
  queryClient,
  QueryClientProvider,
  ReactQueryDevtools,
  useMutation,
  useQuery,
  useQueryClient,
};
