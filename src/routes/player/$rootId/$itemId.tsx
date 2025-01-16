import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography, useTheme } from '@mui/material';

import { Context } from '@graasp/sdk';

import { Outlet, createFileRoute } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

import { CustomLink } from '@/components/ui/CustomLink';
import { UserSwitchWrapper } from '@/components/ui/UserSwitchWrapper';
import { NS } from '@/config/constants';
import { GRAASP_BUILDER_HOST, GRAASP_LIBRARY_HOST } from '@/config/env';
import { hooks } from '@/config/queryClient';
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
    to="/account"
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
  const { data: item } = hooks.useItem();

  const platformProps = {
    [Platform.Builder]: {
      href: `${GRAASP_BUILDER_HOST}/items/${itemId}`,
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
      open={Boolean(rootId)}
      context={Context.Player}
      drawerContent={<ItemNavigation />}
      drawerOpenAriaLabel={t('DRAWER_ARIAL_LABEL')}
      LinkComponent={LinkComponent}
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
      headerRightContent={<UserSwitchWrapper />}
    >
      <Outlet />
    </Main>
  );
}
