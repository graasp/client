import { type JSX, type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography, useTheme } from '@mui/material';

import { Context } from '@graasp/sdk';

import { Outlet, createFileRoute } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

import { CustomLink } from '@/components/ui/CustomLink';
import { HeaderRightContent } from '@/components/ui/HeaderRightContent';
import { NS } from '@/config/constants';
import { GRAASP_LIBRARY_HOST } from '@/config/env';
import { hooks } from '@/config/queryClient';
import { MAIN_WITH_DRAWER_ID } from '@/config/selectors';
import Main from '@/ui/Main/Main';
import PlatformSwitch from '@/ui/PlatformSwitch/PlatformSwitch';
import { Platform } from '@/ui/PlatformSwitch/hooks';
import { useMobileView } from '@/ui/hooks/useMobileView';

import ItemNavigation from '~player/ItemNavigation';

const playerSchema = z.object({
  shuffle: z.boolean().optional(),
  fullscreen: fallback(z.boolean(), false).default(false),
});

export const Route = createFileRoute('/player/$rootId/$itemId')({
  validateSearch: zodValidator(playerSchema),
  component: PlayerWrapper,
});

const LinkComponent = ({ children }: { children: ReactNode }): JSX.Element => (
  <CustomLink
    to="/home"
    sx={{
      textDecoration: 'none',
      color: 'inherit',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    {children}
  </CustomLink>
);

function PlayerWrapper(): JSX.Element {
  const { fullscreen } = Route.useSearch();
  const { t } = useTranslation(NS.Player);
  const theme = useTheme();
  const { isMobile } = useMobileView();
  const { rootId, itemId } = Route.useParams();
  const { data: item } = hooks.useItem(itemId);

  const platformProps = {
    [Platform.Builder]: {
      href: `/builder/items/${itemId}`,
    },
    [Platform.Player]: {
      href: '/player',
    },
    [Platform.Library]: {
      href: GRAASP_LIBRARY_HOST,
    },
    [Platform.Analytics]: {
      href: `/analytics/items/${itemId}`,
    },
  };

  // reset scroll on navigation
  useEffect(() => {
    const mainComponent = document.getElementById(MAIN_WITH_DRAWER_ID);
    mainComponent?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [itemId]);

  if (fullscreen) {
    return (
      /* necessary for item login screen to be centered */
      <Box height="100vh" overflow="auto" display="flex" flexDirection="column">
        <Outlet />
      </Box>
    );
  }

  return (
    <Main
      open={
        /**
         * override the open prop to close the menu when there is no rootId or we could not fetch the item (logged out and not public)
         * we want to keep the default behavior when the user is logged in
         */
        Boolean(rootId)
      }
      context={Context.Player}
      drawerContent={<ItemNavigation />}
      drawerOpenAriaLabel={t('DRAWER_ARIAL_LABEL')}
      LinkComponent={LinkComponent}
      id={MAIN_WITH_DRAWER_ID}
      PlatformComponent={
        <PlatformSwitch
          selected={Platform.Player}
          platformsProps={platformProps}
          disabledColor="#999"
          color={isMobile ? theme.palette.primary.main : 'white'}
          accentColor={isMobile ? 'white' : theme.palette.primary.main}
        />
      }
      headerLeftContent={<Typography noWrap>{item?.name}</Typography>}
      headerRightContent={<HeaderRightContent />}
    >
      <Outlet />
    </Main>
  );
}
