import { useRef, useState } from 'react';

import { LinkNode } from '@lexical/link';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ParagraphNode, TextNode } from 'lexical';

import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import './styles.css';
import { theme } from './theme';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

export function Editor({ initialEditorState = null }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const [yjsProvider, setYjsProvider] = useState<null | Provider>(null);
  // const [connected, setConnected] = useState(false);
  // const [activeUsers, setActiveUsers] = useState<any[]>([]);
  // const [userProfile, setUserProfile] = useState({
  //   name: 'name',
  //   color: 'red',
  // });

  // const [editorState, setEditorState] = useState();
  // const hasLinkAttributes = true;
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  // const handleAwarenessUpdate = useCallback(() => {
  //   const awareness = yjsProvider!.awareness!;
  //   setActiveUsers(
  //     Array.from(awareness.getStates().entries()).map(
  //       ([userId, { color, name }]) => ({
  //         color,
  //         name,
  //         userId,
  //       }),
  //     ),
  //   );
  // }, [yjsProvider]);
  // const handleConnectionToggle = () => {
  //   if (yjsProvider == null) {
  //     return;
  //   }
  //   if (connected) {
  //     yjsProvider.disconnect();
  //   } else {
  //     yjsProvider.connect();
  //   }
  // };

  // useEffect(() => {
  //   if (yjsProvider == null) {
  //     return;
  //   }

  //   yjsProvider.awareness.on('update', handleAwarenessUpdate);

  //   return () => yjsProvider.awareness.off('update', handleAwarenessUpdate);
  // }, [yjsProvider, handleAwarenessUpdate]);

  // const providerFactory = useCallback(
  //   (id: string, yjsDocMap: Map<string, Doc>) => {
  //     const provider = createWebsocketProvider(id, yjsDocMap);
  //     provider.on('status', (event) => {
  //       setConnected(
  //         // Websocket provider
  //         event.status === 'connected' ||
  //           // WebRTC provider has different approact to status reporting
  //           ('connected' in event && event.connected === true),
  //       );
  //     });

  //     // This is a hack to get reference to provider with standard CollaborationPlugin.
  //     // To be fixed in future versions of Lexical.
  //     setTimeout(() => setYjsProvider(provider), 0);

  //     return provider;
  //   },
  //   [],
  // );

  const initialConfig: InitialConfigType = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes: [ParagraphNode, TextNode, LinkNode],
    editorState: initialEditorState,
  };

  // const onChange = async (editorState) => {
  //   // Call toJSON on the EditorState object, which produces a serialization safe string
  //   const editorStateJSON = editorState.toJSON();
  //   // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
  //   setEditorState(JSON.stringify(editorStateJSON));

  //   console.log(editorStateJSON);
  // };

  return (
    <div ref={containerRef}>
      <LexicalComposer initialConfig={initialConfig}>
        <div style={{ width: '100%', height: '100vh', background: 'white' }}>
          <ToolbarPlugin />
          <div className="editor-inner">
            {/* With CollaborationPlugin - we MUST NOT use @lexical/react/LexicalHistoryPlugin */}
            {/* <CollaborationPlugin
            id="lexical/react-rich-collab-test"
            providerFactory={providerFactory}
            // Unless you have a way to avoid race condition between 2+ users trying to do bootstrap simultaneously
            // you should never try to bootstrap on client. It's better to perform bootstrap within Yjs server.
            shouldBootstrap={false}
            username={userProfile.name}
            cursorColor={userProfile.color}
            cursorsContainerRef={containerRef}
          /> */}
            <RichTextPlugin
              contentEditable={
                // necessary for dnd, or at least for allowing updates
                <div className="editor-scroller">
                  <div className="editor" ref={onRef}>
                    <ContentEditable
                      // className="editor-input"
                      // necessary for dnd, for shifting text and show drag icon correctly
                      className={'content-editable-root'}
                      aria-placeholder={'Enter some text...'}
                      placeholder={
                        <div className="editor-placeholder">
                          Enter some text...
                        </div>
                      }
                    />
                  </div>
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <AutoFocusPlugin />
            {floatingAnchorElem && (
              <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
            )}
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}
