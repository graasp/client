import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { Link, Outlet, createFileRoute } from '@tanstack/react-router';

import { useAuth } from '@/AuthContext';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { NS } from '@/config/constants';
import { GRAASP_LIBRARY_HOST } from '@/config/env';
import { LANDING_PAGE_PATH } from '@/config/paths';
import { mutations } from '@/config/queryClient';
import { OnChangeLangProp } from '@/types';
import GraaspLogo from '@/ui/GraaspLogo/GraaspLogo';
import { useButtonColor } from '@/ui/buttons/hooks';
import { useMobileView } from '@/ui/hooks/useMobileView';
import { DEFAULT_BACKGROUND_COLOR } from '@/ui/theme';

import { Footer } from '~landing/footer/Footer';
import { RightHeader } from '~landing/header/RightHeader';
import { usePreviewMode } from '~landing/preview/PreviewModeContext';

export const Route = createFileRoute('/_landing')({
  component: RouteComponent,
});

function RouteComponent() {
  const { i18n, t } = useTranslation(NS.Landing, { keyPrefix: 'NAVBAR' });
  const { isAuthenticated } = useAuth();
  const { isMobile } = useMobileView();
  const { fill: primary } = useButtonColor('primary');
  const { mutate } = mutations.useEditCurrentMember();
  const { isEnabled: isPreviewEnabled } = usePreviewMode();
  const onChangeLang: OnChangeLangProp = (lang: string) => {
    if (isAuthenticated) {
      mutate({ extra: { lang } });
    }
    i18n.changeLanguage(lang);
  };

  return (
    <Stack alignItems="center" minHeight="100svh">
      <Stack
        // take maximum width
        width="100%"
        // make some room around the buttons
        p={2}
        gap={2}
        bgcolor="white"
        position="fixed"
        top="0px"
        sx={{
          boxShadow: (theme) => theme.shadows[3],
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Stack
          direction="row"
          maxWidth="lg"
          // take maximum width
          width="100%"
          m="auto"
          // separate the logo part from the buttons part
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            alignItems="center"
            id="rightTitleWrapper"
            gap={4}
          >
            <Stack
              direction="row"
              gap={1}
              alignItems="center"
              component={Link}
              to={LANDING_PAGE_PATH}
              // override link styling
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              <GraaspLogo height={44} sx={{ fill: primary! }} />
              {!isMobile && (
                <Typography fontWeight="bold" variant="h2" color="primary">
                  Graasp
                  {isPreviewEnabled ? (
                    <Typography variant="note">preview</Typography>
                  ) : (
                    ''
                  )}
                </Typography>
              )}
            </Stack>
            <Stack
              direction="row"
              display={{ xs: 'none', sm: 'unset' }}
              gap={2}
              alignItems="center"
            >
              <ButtonLink
                activeProps={() => ({ fontStyle: 'bold' })}
                to="/features"
              >
                {t('FEATURES')}
              </ButtonLink>
              <ButtonLink
                activeProps={() => ({ fontStyle: 'bold' })}
                to="/support"
              >
                {t('GETTING_STARTED')}
              </ButtonLink>
              <ButtonLink
                activeProps={() => ({ fontStyle: 'bold' })}
                to={GRAASP_LIBRARY_HOST}
              >
                {t('LIBRARY')}
              </ButtonLink>
              <ButtonLink
                activeProps={() => ({ fontStyle: 'bold' })}
                to="/about-us"
              >
                {t('ABOUT_US')}
              </ButtonLink>
            </Stack>
          </Stack>
          <RightHeader onChangeLang={onChangeLang} />
        </Stack>
      </Stack>
      <Stack
        id="bodyWrapper"
        direction="column"
        width="100%"
        alignItems="center"
        mt={
          // compensate the nav bar height
          10
        }
        p={4}
        pb={
          // give some breathing room before the footer
          15
        }
        gap={15}
        bgcolor={DEFAULT_BACKGROUND_COLOR}
        flexGrow={1}
      >
        <Outlet />
      </Stack>
      <Footer onChangeLang={onChangeLang} />
    </Stack>
  );
}
