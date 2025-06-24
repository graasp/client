import { WebsocketClient } from '@graasp/sdk';

import configureItemHooks from '../item/hooks.js';
import configureMemberHooks from '../member/hooks.js';
import configureTagHooks from '../tag/hooks.js';
import { QueryClientConfig } from '../types.js';
import configureChatHooks from './chat.js';
import configureEmbeddedLinkHooks from './embeddedLink.js';
import configureEtherpadHooks from './etherpad.js';
import configureItemLikeHooks from './itemLike.js';
import configureItemLoginHooks from './itemLogin.js';
import configureItemPublishedHooks from './itemPublish.js';
import configureItemValidationHooks from './itemValidation.js';
import configureMembershipHooks from './membership.js';
import configureMentionsHooks from './mention.js';
import configureKeywordSearchHooks from './search.js';
import useDebounce from './useDebounce.js';

export const configureHooks = (
  queryConfig: QueryClientConfig,
  websocketClient?: WebsocketClient,
) => {
  const memberHooks = configureMemberHooks(queryConfig);

  return {
    ...configureChatHooks(queryConfig, websocketClient),
    ...configureMentionsHooks(
      queryConfig,
      memberHooks.useCurrentMember,
      websocketClient,
    ),
    ...configureMembershipHooks(queryConfig, websocketClient),
    ...configureItemHooks(queryConfig, websocketClient),
    ...configureEtherpadHooks(queryConfig),
    ...configureKeywordSearchHooks(queryConfig),
    ...configureItemLikeHooks(queryConfig),
    ...configureItemLoginHooks(queryConfig),
    ...configureItemPublishedHooks(queryConfig),
    ...configureItemValidationHooks(queryConfig),
    ...memberHooks,
    ...configureEmbeddedLinkHooks(queryConfig),
    ...configureTagHooks(queryConfig),
    useDebounce,
  };
};
