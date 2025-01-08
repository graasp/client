import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, styled } from '@mui/material';

import { Context } from '@graasp/sdk';
import { Main } from '@graasp/ui';

import { Link, getRouteApi } from '@tanstack/react-router';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { UserSwitchWrapper } from '@/components/ui/UserSwitchWrapper';
import { NS } from '@/config/constants';
import { GRAASP_BUILDER_HOST } from '@/config/env';

import { AnalyticsSidebar } from './AnalyticsSidebar';

const itemRoute = getRouteApi('/analytics/items/$itemId');

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
}));

const LinkComponent = ({ children }: { children: ReactNode }): JSX.Element => (
  <StyledLink to="/account">{children}</StyledLink>
);
export function PageWrapper({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  const { t } = useTranslation(NS.Analytics);
  const { itemId } = itemRoute.useParams();

  return (
    <Main
      context={Context.Analytics}
      drawerContent={<AnalyticsSidebar itemId={itemId} />}
      drawerOpenAriaLabel={t('DRAWER_OPEN_ARIA')}
      headerRightContent={<UserSwitchWrapper />}
      PlatformComponent={
        <>
          <ButtonLink
            variant="outlined"
            color="inherit"
            to="/player/$rootId/$itemId"
            params={{ itemId, rootId: itemId }}
          >
            Player
          </ButtonLink>
          <Button
            component="a"
            variant="outlined"
            color="inherit"
            href={`${GRAASP_BUILDER_HOST}/items/${itemId}`}
          >
            Builder
          </Button>
        </>
      }
      LinkComponent={LinkComponent}
    >
      {children}
    </Main>
  );
}
