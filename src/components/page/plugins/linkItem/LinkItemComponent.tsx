import { JSX, ReactNode, useEffect, useRef, useState } from 'react';

import { Alert, Box, Link as MUILink } from '@mui/material';

import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import { type ElementFormatType, type NodeKey } from 'lexical';

import LinkCard from '@/ui/Card/LinkCard';
import { LinkIframe } from '@/ui/items/LinkItem';

import useModalStatus from '~builder/components/hooks/useModalStatus';

import { Layout } from './LinkItemNode';
import LinkItemMenu from './menu/LinkItemMenu';

type LinkItemComponentProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  loadingComponent?: JSX.Element | string;
  nodeKey: NodeKey;
  onError?: (error: string) => void;
  onLoad?: () => void;
  url: string;
  layout: Layout;
}>;

function isURLExternal(url: string): boolean {
  try {
    return new URL(url).origin !== window.location.origin;
  } catch {
    return false;
  }
}

const useClickOutside = ({ onClick, isOpen, enabled }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    console.log(enabled);
    if (enabled) {
      const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          onClick();
        }
      };
      document
        .getElementsByClassName('editor')[0]
        .addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [enabled, isOpen, onClick]);

  return modalRef;
};

export function LinkItemComponent({
  className,
  format,
  nodeKey,
  // onError,
  // onLoad,
  canEdit = true,
  url,
  layout,
  html,
  icons,
  id,
  name,
  itemId,
  thumbnail,
  memberId,
  description,
  loadingMessage = 'Link is Loading...',
  height: defaultHeight = 400,
  errorMessage = 'The link is malformed.',
  isResizable = false,
  onClick,
  onLayoutChange,
  onUrlChange,
}: LinkItemComponentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [height] = useState<string | number>(defaultHeight);
  // const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { isOpen, closeModal, openModal } = useModalStatus();
  const ref = useClickOutside({
    onClick: closeModal,
    isOpen,
    enabled: canEdit,
  });

  const showIframe = layout === 'iframe';
  const showButton = layout === 'button';

  useEffect(
    () => {
      if (!isLoading) {
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setIsLoading(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url],
  );

  const getComponent = (): JSX.Element => {
    if (!url) {
      return <Alert severity="error">{errorMessage}</Alert>;
    }

    const isExternal = isURLExternal(url);
    const linkCard = (
      <LinkCard
        id={id}
        thumbnail={thumbnail ?? icons?.[0]}
        title={name}
        url={url}
        description={description ?? ''}
        onClick={onClick}
        isExternal={isExternal}
      />
    );

    if (showIframe) {
      // for rich media we use the provided html
      // this is highly unsafe, and could allow XSS vulnerability if the backend does not protect this property
      if (html) {
        return (
          <Box
            // this is allows for the box to not really exist and instead display the children box
            // we can not get rid of this div as we need a way to attach the onClick handler for registering actions
            display="contents"
            id={id}
            onClick={onClick}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }

      return (
        <>
          <LinkIframe
            id={id}
            url={url}
            isResizable={isResizable}
            height={height}
            title={name}
            isLoading={isLoading}
            onDoneLoading={() => setIsLoading(false)}
            itemId={itemId}
            memberId={memberId}
            loadingMessage={loadingMessage}
          />
          {showButton && linkCard}
        </>
      );
    }

    if (showButton) {
      return linkCard;
    }

    return (
      <MUILink href={url} onClick={onClick}>
        {url}
      </MUILink>
    );
  };

  let menu: ReactNode = undefined;
  if (canEdit) {
    menu = (
      <LinkItemMenu
        url={url}
        ref={ref}
        onUrlChange={onUrlChange}
        setIsFocused={setIsFocused}
        close={closeModal}
        layout={layout}
        onLayoutChange={onLayoutChange}
      />
    );
  }
  return (
    <Box
      className="link-wrapper"
      onMouseLeave={() => {
        if (!isFocused) {
          closeModal();
        }
      }}
      onMouseEnter={() => {
        openModal();
      }}
    >
      {isOpen && menu}
      <BlockWithAlignableContents
        className={className}
        format={format}
        nodeKey={nodeKey}
      >
        {getComponent()}
      </BlockWithAlignableContents>
    </Box>
  );
}
