import { renderHook } from '@testing-library/react';
import { v4 } from 'uuid';
import { beforeEach, describe, expect, it } from 'vitest';

import { WS_CLIENT } from '@/config/queryClient';
import { getChatQueryKey } from '@/openapi/client/@tanstack/react-query.gen';
import { CHAT_MESSAGES } from '@/query/test/constants';
import { KINDS, OPS, TOPICS } from '@/query/ws/constants';
import { getHandlerByChannel, setUpWs } from '@/test/wsUtils';

import { useItemChatUpdates } from './chatbox.hook';
import { setUpTest } from './utils';

const { queryClient, wrapper } = setUpTest();
const { handlers } = setUpWs();

const chatId = v4();
const chatKey = getChatQueryKey({ path: { itemId: chatId } });

const channel = {
  name: chatId,
  topic: TOPICS.CHAT_ITEM,
};

describe('useItemChatUpdates', () => {
  beforeEach(() => {
    queryClient.clear();
    queryClient.setQueryData(chatKey, CHAT_MESSAGES);
  });
  it('Does nothing for undefined chatId', async () => {
    renderHook(() => useItemChatUpdates(WS_CLIENT, ''), {
      wrapper,
    });

    const chatEvent = {
      kind: KINDS.ITEM,
      op: OPS.PUBLISH,
      message: 'new Message',
    };

    getHandlerByChannel(handlers, channel)?.handler(chatEvent);

    // expect no change
    expect(queryClient.getQueryData(chatKey)).toEqual(CHAT_MESSAGES);
  });

  it(`Receive chat messages update`, async () => {
    renderHook(() => useItemChatUpdates(WS_CLIENT, chatId), {
      wrapper,
    });

    const newMessage = { body: 'new content message' };

    queryClient.setQueryData(chatKey, CHAT_MESSAGES);

    const chatEvent = {
      kind: KINDS.ITEM,
      op: OPS.PUBLISH,
      message: newMessage,
    };

    getHandlerByChannel(handlers, channel)?.handler(chatEvent);

    expect(queryClient.getQueryData(chatKey)).toContainEqual(newMessage);
  });
});
