import { useTranslation } from 'react-i18next';

import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';

import { AccountType } from '@graasp/sdk';
import { MainMenu as GraaspMainMenu } from '@graasp/ui';

import {
  BookOpenTextIcon,
  BookmarkIcon,
  HomeIcon,
  LibraryBigIcon,
  TrashIcon,
} from 'lucide-react';

import { MainMenuItem } from '@/components/ui/MainMenuItem';
import { NS } from '@/config/constants';
import { hooks } from '@/config/queryClient';

import { TUTORIALS_LINK } from '../../config/constants';
import { BUILDER } from '../../langs/constants';

const ResourceLinks = () => {
  const { t } = useTranslation(NS.Builder);
  return (
    <ListItem disablePadding>
      <ListItemButton
        href={TUTORIALS_LINK}
        target="_blank"
        data-umami-event="sidebar-tutorials"
      >
        <ListItemIcon>
          <BookOpenTextIcon />
        </ListItemIcon>
        <ListItemText>{t(BUILDER.TUTORIALS)}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

const MainMenu = (): JSX.Element | null => {
  const { t } = useTranslation(NS.Builder);
  const { data: member } = hooks.useCurrentMember();

  if (!member || !member.id) {
    return null;
  }

  const individualMenuItems =
    member.type === AccountType.Individual ? (
      <>
        <MainMenuItem
          dataUmamiEvent="sidebar-bookmarks"
          to="/builder/bookmarks"
          text={t(BUILDER.BOOKMARKED_ITEMS_TITLE)}
          icon={<BookmarkIcon />}
        />
        <MainMenuItem
          dataUmamiEvent="sidebar-published"
          to="/builder/published"
          text={t(BUILDER.NAVIGATION_PUBLISHED_ITEMS_TITLE)}
          icon={<LibraryBigIcon />}
        />
        <MainMenuItem
          dataUmamiEvent="sidebar-trash"
          to="/builder/recycled"
          text={t(BUILDER.RECYCLE_BIN_TITLE)}
          icon={<TrashIcon />}
        />
      </>
    ) : null;

  return (
    <GraaspMainMenu fullHeight>
      <Stack direction="column" height="100%" justifyContent="space-between">
        <Box>
          <MainMenuItem
            dataUmamiEvent="sidebar-home"
            to="/builder"
            icon={<HomeIcon />}
            text={t(BUILDER.MY_ITEMS_TITLE)}
          />
          {individualMenuItems}
        </Box>
        <Box>
          <ResourceLinks />
        </Box>
      </Stack>
    </GraaspMainMenu>
  );
};

export default MainMenu;
