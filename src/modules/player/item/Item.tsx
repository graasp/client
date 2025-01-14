import { Fragment, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

import {
  Alert,
  AlertTitle,
  Box,
  Container,
  Divider,
  Stack,
} from '@mui/material';

import { Api } from '@graasp/query-client';
import {
  ActionTriggers,
  AppItemType,
  Context,
  DocumentItemType,
  EtherpadItemType,
  H5PItemType,
  ItemType,
  LinkItemType,
  LocalFileItemType,
  PackedItem,
  PermissionLevel,
  S3FileItemType,
  ShortcutItemType,
  buildPdfViewerURL,
} from '@graasp/sdk';
import {
  AppItem,
  EtherpadItem,
  FileItem,
  H5PItem,
  ItemSkeleton,
  LinkItem,
  TextDisplay,
  withCollapse,
} from '@graasp/ui';
import { DocumentItem } from '@graasp/ui/text-editor';

import { getRouteApi } from '@tanstack/react-router';

import { useAuth } from '@/AuthContext';
import { Button } from '@/components/ui/Button';
import { NS } from '@/config/constants';
import { API_HOST, GRAASP_ASSETS_URL, H5P_INTEGRATION_URL } from '@/config/env';
import { axios, hooks } from '@/config/queryClient';
import {
  buildAppId,
  buildCollapsibleId,
  buildDocumentId,
  buildFileId,
  buildFolderButtonId,
  buildLinkItemId,
} from '@/config/selectors';

import NavigationIsland from '~player/navigationIsland/NavigationIsland';
import { FolderCard } from '~player/ui/FolderCard';

import { FromShortcutButton } from './FromShortcutButton';
import { SectionHeader } from './SectionHeader';
import { useCollapseAction } from './useCollapseAction';
import usePageTitle from './usePageTitle';

const paginationContentFilter = (items: PackedItem[]): PackedItem[] =>
  items
    .filter((i) => i.type !== ItemType.FOLDER)
    .filter((i) => !i.settings?.isPinned);

const itemRoute = getRouteApi('/player/$rootId/$itemId');
const DEFAULT_RESIZABLE_SETTING = false;
const PDF_VIEWER_LINK = buildPdfViewerURL(GRAASP_ASSETS_URL);
// define a max height depending on the screen height
// use a bit less of the height because of the header and some margin
const SCREEN_MAX_HEIGHT = window.innerHeight * 0.8;

const {
  useEtherpad,
  useItem,
  useChildren,
  useFileContentUrl,
  useChildrenPaginated,
} = hooks;

type EtherpadContentProps = {
  item: EtherpadItemType;
};
const EtherpadContent = ({ item }: EtherpadContentProps) => {
  const { t } = useTranslation(NS.Common);
  // get etherpad url if type is etherpad
  const etherpadQuery = useEtherpad(item, 'read');

  if (etherpadQuery?.isLoading) {
    return (
      <ItemSkeleton
        itemType={item.type}
        isChildren={false}
        screenMaxHeight={SCREEN_MAX_HEIGHT}
      />
    );
  }

  if (etherpadQuery?.isError) {
    return <Alert severity="error">{t('ERRORS.UNEXPECTED')}</Alert>;
  }
  if (!etherpadQuery?.data?.padUrl) {
    return <Alert severity="error">{t('ERRORS.UNEXPECTED')}</Alert>;
  }
  return (
    <EtherpadItem
      itemId={item.id}
      padUrl={etherpadQuery.data.padUrl}
      options={{
        showLineNumbers: false,
        showControls: false,
        showChat: false,
        noColors: true,
      }}
      style={{ height: '80vh' }}
    />
  );
};

type FileContentProps = {
  item: S3FileItemType | LocalFileItemType;
};
const FileContent = ({ item }: FileContentProps) => {
  const { t } = useTranslation(NS.Common);
  // fetch file content if type is file
  const {
    data: fileUrl,
    isLoading: isFileContentLoading,
    isError: isFileError,
  } = useFileContentUrl(item.id);
  const { triggerAction, onCollapse } = useCollapseAction(item.id);

  const onDownloadClick = useCallback(() => {
    triggerAction({
      itemId: item.id,
      payload: { type: ActionTriggers.ItemDownload },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  if (isFileContentLoading) {
    return (
      <ItemSkeleton
        itemType={item.type}
        isChildren={false}
        screenMaxHeight={SCREEN_MAX_HEIGHT}
      />
    );
  }

  if (isFileError) {
    return <Alert severity="error">{t('ERRORS.UNEXPECTED')}</Alert>;
  }

  return (
    <FileItem
      id={buildFileId(item.id)}
      item={item}
      fileUrl={fileUrl}
      maxHeight={SCREEN_MAX_HEIGHT}
      showCollapse={item.settings?.isCollapsible}
      pdfViewerLink={PDF_VIEWER_LINK?.toString()}
      onClick={onDownloadClick}
      onCollapse={onCollapse}
    />
  );
};

const LinkContent = ({ item }: { item: LinkItemType }): JSX.Element => {
  const { user } = useAuth();
  const { triggerAction, onCollapse } = useCollapseAction(item.id);

  const handleLinkClick = () => {
    // trigger player Action for link click
    triggerAction({
      itemId: item.id,
      payload: { type: ActionTriggers.LinkOpen },
    });
  };

  return (
    <Box id={buildLinkItemId(item.id)}>
      <LinkItem
        id={item.id}
        item={item}
        height={SCREEN_MAX_HEIGHT}
        memberId={user?.id}
        isResizable
        showButton={item.settings?.showLinkButton}
        showIframe={item.settings?.showLinkIframe}
        showCollapse={item.settings?.isCollapsible}
        onClick={handleLinkClick}
        onCollapse={onCollapse}
      />
    </Box>
  );
};

const DocumentContent = ({ item }: { item: DocumentItemType }): JSX.Element => {
  const { onCollapse } = useCollapseAction(item.id);

  return (
    <DocumentItem
      id={buildDocumentId(item.id)}
      item={item}
      showCollapse={item.settings?.isCollapsible}
      onCollapse={onCollapse}
    />
  );
};

const AppContent = ({ item }: { item: AppItemType }): JSX.Element => {
  const { user } = useAuth();
  const { onCollapse } = useCollapseAction(item.id);

  return (
    <>
      {!user && (
        <Alert severity="warning">
          <AlertTitle>Viewing app as an anonymous user</AlertTitle>
          When viewing applications as an anonymous user, you might not be able
          to properly interact with them. Data will not be saved. Log in to save
          your progress.
        </Alert>
      )}
      <AppItem
        frameId={buildAppId(item.id)}
        item={item}
        memberId={user?.id}
        requestApiAccessToken={(payload) =>
          Api.requestApiAccessToken(payload, { API_HOST, axios })
        }
        isResizable={item.settings?.isResizable || DEFAULT_RESIZABLE_SETTING}
        contextPayload={{
          apiHost: API_HOST,
          settings: item.settings,
          lang: item.lang ?? user?.lang,
          permission: PermissionLevel.Read,
          context: Context.Player,
          accountId: user?.id,
          itemId: item.id,
        }}
        showCollapse={item.settings?.isCollapsible}
        onCollapse={onCollapse}
      />
    </>
  );
};

const H5PContent = ({ item }: { item: H5PItemType }): JSX.Element => {
  const { t } = useTranslation(NS.Common);
  const { onCollapse } = useCollapseAction(item.id);

  const contentId = item?.extra?.h5p?.contentId;
  if (!contentId) {
    return <Alert severity="error">{t('ERRORS.UNEXPECTED')}</Alert>;
  }

  return (
    <H5PItem
      itemId={item.id}
      itemName={item.name}
      contentId={contentId}
      integrationUrl={H5P_INTEGRATION_URL}
      showCollapse={item.settings?.isCollapsible}
      onCollapse={onCollapse}
    />
  );
};

const ShortcutContent = ({ item }: { item: ShortcutItemType }): JSX.Element => {
  if (item.settings.isCollapsible) {
    return (
      <span id={buildCollapsibleId(item.id)}>
        {withCollapse({ item })(
          <Item isChildren id={item.extra?.shortcut?.target} />,
        )}
      </span>
    );
  }
  return <Item isChildren id={item.extra?.shortcut?.target} />;
};

const FolderButtonContent = ({ item }: { item: PackedItem }) => {
  const search = itemRoute.useSearch();
  const { itemId } = itemRoute.useParams();
  const { data: currentDisplayedItem } = useItem(itemId);
  const thumbnail = item.thumbnails?.medium;

  const newSearchParams = new URLSearchParams(search.toString());
  newSearchParams.set('from', window.location.pathname);
  if (currentDisplayedItem) {
    newSearchParams.set('fromName', currentDisplayedItem.name);
  }
  return (
    <FolderCard
      id={buildFolderButtonId(item.id)}
      name={item.name}
      thumbnail={thumbnail}
      description={
        // to not display the default empty description we check it here
        item.description && item.description !== '<p><br></p>' ? (
          <TextDisplay content={item.description ?? ''} />
        ) : undefined
      }
      to="/player/$rootId/$itemId"
      params={{ rootId: item.id, itemId: item.id }}
      search={{
        ...search,
        from: window.location.pathname,
        ...(currentDisplayedItem
          ? { fromName: currentDisplayedItem.name }
          : {}),
      }}
    />
  );
};

type ItemContentProps = {
  item: PackedItem;
};

const ItemContent = ({ item }: ItemContentProps) => {
  switch (item.type) {
    case ItemType.FOLDER: {
      return <FolderButtonContent item={item} />;
    }
    case ItemType.LINK: {
      return <LinkContent item={item} />;
    }
    case ItemType.LOCAL_FILE:
    case ItemType.S3_FILE: {
      return <FileContent item={item} />;
    }
    case ItemType.DOCUMENT: {
      return <DocumentContent item={item} />;
    }
    case ItemType.APP: {
      return <AppContent item={item} />;
    }

    case ItemType.H5P: {
      return <H5PContent item={item} />;
    }

    case ItemType.ETHERPAD: {
      return <EtherpadContent item={item} />;
    }

    case ItemType.SHORTCUT: {
      return <ShortcutContent item={item} />;
    }

    default:
      console.error(`The type of item is not defined`, item);
      return null;
  }
};

export const ItemContentWrapper = ({
  item,
}: {
  item: PackedItem;
}): JSX.Element | null => {
  // An item the user has access to can be hidden (write, admin) so we hide it in player
  if (item.hidden) {
    return null;
  }
  return <ItemContent item={item} />;
};

type FolderContentProps = {
  item: PackedItem;
  showPinnedOnly?: boolean;
};
const FolderContent = ({
  item,
  showPinnedOnly = false,
}: FolderContentProps) => {
  const { ref, inView } = useInView();
  const { t } = useTranslation(NS.Player);

  // this should be fetched only when the item is a folder
  const { data: children = [], isLoading: isChildrenLoading } = useChildren(
    item.id,
    undefined,
    {
      getUpdates: true,
    },
  );

  const {
    data: childrenPaginated,
    refetch: refetchChildrenPaginated,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useChildrenPaginated(item.id, children, {
    enabled: Boolean(!showPinnedOnly && children && !isChildrenLoading),
    filterFunction: paginationContentFilter,
  });

  useEffect(() => {
    if (children) {
      refetchChildrenPaginated();
    }

    if (inView) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, children]);

  const showLoadMoreButton =
    !hasNextPage || isFetchingNextPage ? null : (
      <Container ref={ref}>
        <Button
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
          fullWidth
        >
          {t('LOAD_MORE')}
        </Button>
      </Container>
    );

  if (showPinnedOnly) {
    return children
      ?.filter((i) => showPinnedOnly === (i.settings?.isPinned || false))
      ?.map((thisItem) => (
        <ItemContentWrapper key={thisItem.id} item={thisItem} />
      ));
  }
  // render each children recursively
  return (
    <>
      <Container maxWidth="lg">
        <Stack direction="column" pb={7} spacing={2} margin="auto">
          <SectionHeader item={item} />
          <Divider flexItem />

          <Stack direction="column" gap={4}>
            {childrenPaginated?.pages?.map((page) => (
              <Fragment key={page.pageNumber}>
                {page.data.map((thisItem) => (
                  <ItemContentWrapper key={thisItem.id} item={thisItem} />
                ))}
              </Fragment>
            ))}
          </Stack>
          {showLoadMoreButton}
        </Stack>
      </Container>
      <FromShortcutButton />
      <NavigationIsland />
    </>
  );
};

type Props = {
  /**
   * Id of the parent item for which the page is displayed
   */
  id?: string;

  isChildren?: boolean;
  showPinnedOnly?: boolean;
};

const Item = ({
  id,
  isChildren = false,
  showPinnedOnly = false,
}: Props): JSX.Element | null => {
  const { t } = useTranslation(NS.Common);
  const { data: item, isLoading: isLoadingItem, isError } = useItem(id);
  const title = usePageTitle();
  if (item && item.type === ItemType.FOLDER) {
    if (isChildren) {
      return <ItemContentWrapper item={item} />;
    }

    return (
      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <FolderContent item={item} showPinnedOnly={showPinnedOnly} />
      </>
    );
  }

  if (isLoadingItem) {
    return (
      <ItemSkeleton
        itemType={ItemType.FOLDER}
        isChildren={isChildren}
        screenMaxHeight={SCREEN_MAX_HEIGHT}
      />
    );
  }

  if (item) {
    // executed when item is a single child that is not a folder
    return (
      <>
        <ItemContentWrapper item={item} />
        {
          // only render the island when the item is not a children
          isChildren ? false : <NavigationIsland />
        }
      </>
    );
  }

  if (isError || !item) {
    return <Alert severity="error">{t('ERRORS.UNEXPECTED')}</Alert>;
  }
  return null;
};

export default Item;
