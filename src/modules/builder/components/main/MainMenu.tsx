import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  List,
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

import { useAuth } from '@/AuthContext';
import { MainMenuItem } from '@/components/ui/MainMenuItem';
import { NS } from '@/config/constants';
import { DRAWER_WIDTH } from '@/ui/constants';

import { TUTORIALS_LINK } from '../../constants';
import { BUILDER } from '../../langs';

const ResourceLinks = () => {
  const { t } = useTranslation(NS.Builder);
  return (
    <ListItem disablePadding>
      <ListItemButton
        href={TUTORIALS_LINK}
        target="_blank"
        // data-umami-event="sidebar-tutorials"
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
  const { user } = useAuth();

  if (user) {
    return (
      <Stack
        direction="column"
        justifyContent="space-between"
        flex={1}
        height="100%"
      >
        <List sx={{ width: DRAWER_WIDTH }}>
          <MainMenuItem
            to="/builder"
            icon={<HomeIcon />}
            text={t('MY_ITEMS')}
          />
          {user.type === AccountType.Individual ? (
            <>
              <MainMenuItem
                to="/builder/bookmarks"
                text={t('BOOKMARKED_ITEMS')}
                icon={<BookmarkIcon />}
              />
              <MainMenuItem
                to="/builder/published"
                text={t('PUBLISHED_ITEMS')}
                icon={<LibraryBigIcon />}
              />
              <MainMenuItem
                to="/builder/recycled"
                text={t('RECYCLED_ITEMS')}
                icon={<TrashIcon />}
              />
            </>
          ) : null}
        </List>
        <Box>
          <ResourceLinks />
        </Box>
      </Stack>
    );
  }
  return null;
}
