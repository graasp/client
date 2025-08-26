import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Button } from '@mui/material';

import { PageItemType } from '@graasp/sdk';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ParagraphNode, TextNode } from 'lexical';

import { AuthenticatedMember } from '@/AuthContext';
import { NS } from '@/config/constants';
import { stringToColor } from '@/ui/Avatar/stringToColor';

import { StatusToolbar } from './StatusToolbar';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import { DEFAULT_FONT_SIZE } from './plugins/FontSize';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { LinkItemNode } from './plugins/linkItem/LinkItemNode';
import { LinkItemPlugin } from './plugins/linkItem/LinkItemPlugin';
import './styles.css';
import { theme } from './theme';
import { useYjs } from './useYjs';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

type Props = {
  item: PageItemType;
  currentAccount: AuthenticatedMember;
};

export function Editor({ item, currentAccount }: Readonly<Props>) {
  const { t } = useTranslation(NS.PageEditor);
  const { providerFactory, activeUsers, connected, hasTimedOut } = useYjs({
    edit: true,
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const initialConfig: InitialConfigType = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes: [ParagraphNode, TextNode, LinkItemNode],
    editable: true,
  };

  return (
    <div ref={containerRef}>
      <StatusToolbar users={activeUsers} isConnected={connected} />
      {hasTimedOut && (
        <Alert
          severity="error"
          action={
            <Button
              size="small"
              onClick={() => {
                window.location.reload();
              }}
            >
              {t('RELOAD_BUTTON')}
            </Button>
          }
        >
          {t('DISCONNECTED_TEXT')}
        </Alert>
      )}
      {/* unmount component on timeout to prevent further connection attempts */}
      {!hasTimedOut && (
        <>
          <LexicalComposer initialConfig={initialConfig}>
            <div
              style={{ width: '100%', height: '100vh', background: 'white' }}
            >
              <ToolbarPlugin />
              <div className="editor-inner">
                {/* With CollaborationPlugin - we MUST NOT use @lexical/react/LexicalHistoryPlugin */}

                <CollaborationPlugin
                  id={item.id}
                  providerFactory={providerFactory}
                  // Unless you have a way to avoid race condition between 2+ users trying to do bootstrap simultaneously
                  // you should never try to bootstrap on client. It's better to perform bootstrap within Yjs server.
                  shouldBootstrap={false}
                  username={currentAccount.name}
                  cursorColor={stringToColor(currentAccount.id)}
                  cursorsContainerRef={containerRef}
                />
                <RichTextPlugin
                  contentEditable={
                    // necessary for dnd, or at least for allowing updates
                    <div className="editor-scroller">
                      <div className="editor" ref={onRef}>
                        <ContentEditable
                          // className="editor-input"
                          // necessary for dnd, for shifting text and show drag icon correctly
                          className={'content-editable-root'}
                          style={{ fontSize: DEFAULT_FONT_SIZE }}
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
                <LinkItemPlugin />
                {floatingAnchorElem && (
                  <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                )}
              </div>
            </div>
          </LexicalComposer>
        </>
      )}
    </div>
  );
}
