import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { Stack, Typography } from '@mui/material';

import { AccountType } from '@graasp/sdk';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';

import { useAuth } from '@/AuthContext';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { NS } from '@/config/constants';
import { GRAASP_LIBRARY_HOST } from '@/config/env';
import { LANDING_PAGE_PATH } from '@/config/paths';
import { updateCurrentAccountMutation } from '@/openapi/client/@tanstack/react-query.gen';
import { memberKeys } from '@/query/keys';
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
  const { t: translateMessage } = useTranslation(NS.Messages);
  const { isAuthenticated, user } = useAuth();
  const { isMobile } = useMobileView();
  const { fill: primary } = useButtonColor('primary');

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    ...updateCurrentAccountMutation(),
    onError: (error: Error) => {
      console.error(error);
      toast.error(translateMessage('EDIT_MEMBER_ERROR'));
    },
    // Always refetch after error or success:
    onSettled: async () => {
      // invalidate all queries
      await queryClient.invalidateQueries({
        queryKey: memberKeys.current().content,
      });
    },
  });
  const { isEnabled: isPreviewEnabled } = usePreviewMode();
  const onChangeLang: OnChangeLangProp = (lang: string) => {
    // only "full users" can change their language
    if (isAuthenticated && user.type === AccountType.Individual) {
      mutate({ body: { extra: { lang } } });
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
