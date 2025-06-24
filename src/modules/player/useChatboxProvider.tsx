import { useMutation, useQuery } from '@tanstack/react-query';

import { hooks } from '@/config/queryClient';
import {
  createChatMessageMutation,
  deleteChatMessageMutation,
  getChatOptions,
  patchChatMessageMutation,
} from '@/openapi/client/@tanstack/react-query.gen';

export function useChatboxProvider({ itemId }: { itemId: string }) {
  // setup websocket, no need for further invalidations
  hooks.useItemChatUpdates(itemId);

  const messagesQueryResult = useQuery(getChatOptions({ path: { itemId } }));

  const { mutate: sendMessage } = useMutation(createChatMessageMutation());

  const { mutate: editMessage } = useMutation(patchChatMessageMutation());

  const { mutate: deleteMessage } = useMutation(deleteChatMessageMutation());

  return { ...messagesQueryResult, sendMessage, editMessage, deleteMessage };
}
