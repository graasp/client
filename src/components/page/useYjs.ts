/**
 * source: lexical
 */
import { useCallback, useEffect, useState } from 'react';

import { Provider } from '@lexical/yjs';
import { WebsocketProvider } from 'y-websocket';
import { Doc } from 'yjs';

import { WS_HOST } from '@/config/env';

export const useYjs = ({ edit }: { edit: boolean }) => {
  const [yjsProvider, setYjsProvider] = useState<null | Provider>(null);
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<
    { name: string; color: string }[]
  >([]);

  const handleAwarenessUpdate = useCallback(() => {
    if (edit) {
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
    }
  }, [edit, yjsProvider]);

  useEffect(() => {
    if (yjsProvider == null) {
      return;
    }

    if (edit) {
      yjsProvider.awareness.on('update', handleAwarenessUpdate);

      return () => yjsProvider.awareness.off('update', handleAwarenessUpdate);
    }
  }, [yjsProvider, handleAwarenessUpdate, edit]);

  const providerFactory = useCallback(
    (id: string, yjsDocMap: Map<string, Doc>) => {
      const provider = createWebsocketProvider(
        id,
        yjsDocMap,
        edit,
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
    [edit],
  );

  return { providerFactory, activeUsers, connected };
};

export function createWebsocketProvider(
  id: string,
  yjsDocMap: Map<string, Doc>,
  edit: boolean,
) {
  const doc = getDocFromMap(id, yjsDocMap);

  return new WebsocketProvider(
    WS_HOST,
    edit ? `items/pages/${id}/ws` : `items/pages/${id}/ws/read`,
    doc,
    {
      // connect manually using wsProvider.connect()
      connect: false,
    },
  );
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
