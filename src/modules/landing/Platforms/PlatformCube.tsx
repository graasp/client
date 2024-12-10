import { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Stack } from '@mui/material';

import {
  AnalyticsIcon,
  BuildIcon,
  LibraryIcon,
  Platform,
  PlayIcon,
} from '@graasp/ui';

import { NS } from '@/config/constants';
import {
  GRAASP_ANALYTICS_HOST,
  GRAASP_BUILDER_HOST,
  GRAASP_LIBRARY_HOST,
  GRAASP_PLAYER_HOST,
} from '@/config/env';

import { PlatformColorSurface } from './PlatformColorSurface';

function Row({ children }: { children: ReactNode }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} gap="2px">
      {children}
    </Stack>
  );
}

export function PlatformCube() {
  const { t } = useTranslation(NS.Landing, { keyPrefix: 'HOME.PUZZLE' });
  const PlatformProps = {
    [Platform.Builder]: {
      Icon: BuildIcon,
      color: Platform.Builder,
      text: <Trans t={t} i18nKey="BUILDER.DESCRIPTION" />,
      button: {
        text: t('BUILDER.BUTTON_TEXT'),
        href: GRAASP_BUILDER_HOST,
      },
    },
    [Platform.Player]: {
      Icon: PlayIcon,
      color: Platform.Player,
      text: <Trans t={t} i18nKey="PLAYER.DESCRIPTION" />,
      button: {
        text: t('PLAYER.BUTTON_TEXT'),
        href: GRAASP_PLAYER_HOST,
      },
    },
    [Platform.Library]: {
      Icon: LibraryIcon,
      color: Platform.Library,
      text: <Trans t={t} i18nKey="LIBRARY.DESCRIPTION" />,
      button: {
        text: t('LIBRARY.BUTTON_TEXT'),
        href: GRAASP_LIBRARY_HOST,
      },
    },
    [Platform.Analytics]: {
      Icon: AnalyticsIcon,
      color: Platform.Analytics,
      text: <Trans t={t} i18nKey="ANALYTICS.DESCRIPTION" />,
      button: {
        text: t('ANALYTICS.BUTTON_TEXT'),
        href: GRAASP_ANALYTICS_HOST,
      },
    },
  } as const;
  return (
    <Stack
      maxWidth="md"
      overflow="hidden"
      borderRadius={8}
      direction="column"
      gap="2px"
    >
      <Row>
        <PlatformColorSurface {...PlatformProps.builder} />
        <PlatformColorSurface {...PlatformProps.analytics} />
      </Row>
      <Row>
        <PlatformColorSurface {...PlatformProps.player} />
        <PlatformColorSurface {...PlatformProps.library} />
      </Row>
    </Stack>
  );
}
