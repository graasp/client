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
import GraaspMainMenu from '@/ui/MainMenu/MainMenu';

import { TUTORIALS_LINK } from '../../constants';
import { BUILDER } from '../../langs';

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

export function MainMenu(): JSX.Element | null {
  const { t } = useTranslation(NS.Builder, { keyPrefix: 'MENU' });
  const { data: member } = hooks.useCurrentMember();

  if (!member || !member.id) {
    return null;
  }

  return (
    <GraaspMainMenu fullHeight>
      <Stack direction="column" height="100%" justifyContent="space-between">
        <Box>
          <MainMenuItem
            dataUmamiEvent="sidebar-home"
            to="/builder"
            icon={<HomeIcon />}
            text={t('MY_ITEMS')}
          />
          {member.type === AccountType.Individual ? (
            <>
              <MainMenuItem
                dataUmamiEvent="sidebar-bookmarks"
                to="/builder/bookmarks"
                text={t('BOOKMARKED_ITEMS')}
                icon={<BookmarkIcon />}
              />
              <MainMenuItem
                dataUmamiEvent="sidebar-published"
                to="/builder/published"
                text={t('PUBLISHED_ITEMS')}
                icon={<LibraryBigIcon />}
              />
              <MainMenuItem
                dataUmamiEvent="sidebar-trash"
                to="/builder/recycled"
                text={t('RECYCLED_ITEMS')}
                icon={<TrashIcon />}
              />
            </>
          ) : null}
        </Box>
        <Box>
          <ResourceLinks />
        </Box>
      </Stack>
    </GraaspMainMenu>
  );
}
