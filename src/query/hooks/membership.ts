import { UUID, WebsocketClient } from '@graasp/sdk';

import { useQuery } from '@tanstack/react-query';

import { getItemMembershipsForItemOptions } from '@/openapi/client/@tanstack/react-query.gen.js';

import { QueryClientConfig } from '../types.js';
import { configureWsMembershipHooks } from '../ws/index.js';

export default (
  queryConfig: QueryClientConfig,
  websocketClient?: WebsocketClient,
) => {
  const { enableWebsocket } = queryConfig;

  const membershipWsHooks =
    enableWebsocket && websocketClient // required to type-check non-null
      ? configureWsMembershipHooks(websocketClient)
      : undefined;

  return {
    // custom defined hook to handle websocket as well
    useItemMemberships: (itemId: UUID, options?: { getUpdates?: boolean }) => {
      const getUpdates = options?.getUpdates ?? enableWebsocket;

      membershipWsHooks?.useItemsMembershipsUpdates(
        getUpdates ? [itemId] : null,
      );

      return useQuery(getItemMembershipsForItemOptions({ query: { itemId } }));
    },
  };
};
