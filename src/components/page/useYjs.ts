/**
 * source: lexical
 */
import { useCallback, useEffect, useState } from 'react';

import { Provider } from '@lexical/yjs';
import { WebsocketProvider } from 'y-websocket';
import { Doc } from 'yjs';

import { WS_HOST } from '@/config/env';

export const useYjs = () => {
  const [yjsProvider, setYjsProvider] = useState<null | Provider>(null);
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<
    { name: string; color: string }[]
  >([]);

  const handleAwarenessUpdate = useCallback(() => {
    const awareness = yjsProvider!.awareness!;
    setActiveUsers(
      Array.from(awareness.getStates().entries()).map(
        ([userId, { color, name }]) => ({
          color,
          name,
          userId,
        }),
      ),
    );
  }, [yjsProvider]);

  useEffect(() => {
    if (yjsProvider == null) {
      return;
    }

    yjsProvider.awareness.on('update', handleAwarenessUpdate);

    return () => yjsProvider.awareness.off('update', handleAwarenessUpdate);
  }, [yjsProvider, handleAwarenessUpdate]);

  const providerFactory = useCallback(
    (id: string, yjsDocMap: Map<string, Doc>) => {
      const provider = createWebsocketProvider(
        id,
        yjsDocMap,
      ) as unknown as Provider;
      provider.on('status', (event) => {
        setConnected(
          // Websocket provider
          event.status === 'connected' ||
            // WebRTC provider has different approact to status reporting
            ('connected' in event && event.connected === true),
        );
      });

      // This is a hack to get reference to provider with standard CollaborationPlugin.
      // To be fixed in future versions of Lexical.
      setTimeout(() => setYjsProvider(provider), 0);

      return provider;
    },
    [],
  );

  return { providerFactory, activeUsers, connected };
};

export function createWebsocketProvider(
  id: string,
  yjsDocMap: Map<string, Doc>,
) {
  const doc = getDocFromMap(id, yjsDocMap);

  return new WebsocketProvider(WS_HOST, `items/pages/${id}/ws`, doc, {
    // connect manually using wsProvider.connect()
    connect: false,
  });
}

function getDocFromMap(id: string, yjsDocMap: Map<string, Doc>): Doc {
  let doc = yjsDocMap.get(id);
  if (doc === undefined) {
    doc = new Doc();
    yjsDocMap.set(id, doc);
  } else {
    doc.load();
  }

  return doc;
}
