import * as graaspSdk from '@graasp/sdk';
import { Channel } from '@graasp/sdk';

import { vi } from 'vitest';

import { MockWebSocket } from '@/query/ws/mock-ws-client';

export type Handler = { channel: Channel; handler: (event: unknown) => void };

const MockedWebsocket = (handlers: Handler[]) => ({
  subscribe: vi.fn((channel, handler) => {
    handlers.push({ channel, handler });
  }),
  unsubscribe: vi.fn(),
});

export function setUpWs() {
  vi.stubGlobal('WebSocket', MockWebSocket);
  const handlers: Handler[] = [];
  vi.mock('@graasp/sdk', { spy: true });
  vi.mocked(graaspSdk.configureWebsocketClient).mockImplementation(() => {
    return MockedWebsocket(handlers);
  });
  return { handlers };
}

export const getHandlerByChannel = (
  thisHandlers: Handler[],
  thisChannel: Channel,
): Handler | undefined =>
  thisHandlers.find(
    ({ channel: c }) =>
      thisChannel.name === c.name && thisChannel.topic === c.topic,
  );
