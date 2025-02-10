import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, styled, useTheme } from '@mui/material';

import {
  AccountType,
  Context,
  PermissionLevel,
  PermissionLevelCompare,
} from '@graasp/sdk';

import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import axios from 'axios';
import { z } from 'zod';

import { useAuth } from '@/AuthContext';
import { MentionButton } from '@/components/chatbox/Mentions/MentionButton';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { UserButtonMenu } from '@/components/ui/UserButtonMenu';
import { NS } from '@/config/constants';
import { GRAASP_LIBRARY_HOST } from '@/config/env';
import { hooks, mutations } from '@/config/queryClient';
import {
  APP_NAVIGATION_PLATFORM_SWITCH_ID,
  HEADER_APP_BAR_ID,
  ITEM_LOGIN_SCREEN_FORBIDDEN_ID,
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
  ITEM_LOGIN_SIGN_IN_USERNAME_ID,
} from '@/config/selectors';
import Main from '@/ui/Main/Main';
import PlatformSwitch from '@/ui/PlatformSwitch/PlatformSwitch';
import { Platform } from '@/ui/PlatformSwitch/hooks';
import { useMobileView } from '@/ui/hooks/useMobileView';
import ForbiddenContent from '@/ui/itemLogin/ForbiddenContent';
import ItemLoginWrapper from '@/ui/itemLogin/ItemLoginWrapper';

import { MemberValidationBanner } from '~builder/components/alerts/MemberValidationBanner';
import { FilterItemsContextProvider } from '~builder/components/context/FilterItemsContext';
import { MainMenu } from '~builder/components/main/MainMenu';
import { OutletContext } from '~builder/contexts/OutletContext';
import { EnrollContent } from '~player/access/EnrollContent';
import { RequestAccessContent } from '~player/access/RequestAccessContent';

const schema = z.object({
  chatOpen: z.boolean().optional(),
});

export const Route = createFileRoute('/builder/items/$itemId')({
  validateSearch: zodValidator(schema),
  component: RouteComponent,
});

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
}));
const LinkComponent = ({ children }: { children: ReactNode }) => (
  <StyledLink
    // data-umami-event="header-home-link"
    // data-umami-event-context={Context.Builder}
    to="/account"
  >
    {children}
  </StyledLink>
);

function RouteComponent() {
  const { user } = useAuth();
  const { t } = useTranslation(NS.Builder);
  const { t: translateCommon } = useTranslation(NS.Common);
  const theme = useTheme();
  const { isMobile } = useMobileView();
  const { itemId } = Route.useParams();
  const {
    data: item,
    isLoading: itemIsLoading,
    error: itemError,
  } = hooks.useItem(itemId);
  const { data: currentMember, isLoading: currentMemberIsLoading } =
    hooks.useCurrentMember();
  const {
    data: itemLoginSchemaType,
    isLoading: itemLoginSchemaTypeIsLoading,
    isError: isItemLoginSchemaTypeError,
  } = hooks.useItemLoginSchemaType({ itemId });

  const { mutate: itemLoginSignIn } = mutations.usePostItemLogin();
  const canWrite = item?.permission
    ? PermissionLevelCompare.gte(item.permission, PermissionLevel.Write)
    : false;

  const canAdmin = item?.permission
    ? PermissionLevelCompare.gte(item.permission, PermissionLevel.Admin)
    : false;

  const errorStatusCode =
    (axios.isAxiosError(itemError) && itemError.status) || null;

  const platformProps = {
    [Platform.Builder]: {
      href: '/builder',
    },
    [Platform.Player]: {
      href: `/player/${itemId}/${itemId}`,
    },
    [Platform.Library]: {
      href: GRAASP_LIBRARY_HOST,
    },
    [Platform.Analytics]: {
      href: `/analytics/items/${itemId}`,
    },
  };

  return (
    <Main
      open={
        /**
         * only override the open prop when user is not logged in
         * we want to keep the default behavior when the user is logged in
         * we close the drawer if the user is a guest
         */
        user?.type === AccountType.Individual ? undefined : false
      }
      context={Context.Builder}
      headerId={HEADER_APP_BAR_ID}
      drawerOpenAriaLabel={t('ARIA_OPEN_DRAWER')}
      headerRightContent={
        <Stack direction="row" alignItems="center">
          <MentionButton color="white" badgeColor="primary" />
          <UserButtonMenu />
        </Stack>
      }
      drawerContent={<MainMenu />}
      LinkComponent={LinkComponent}
      PlatformComponent={
        <PlatformSwitch
          id={APP_NAVIGATION_PLATFORM_SWITCH_ID}
          selected={Platform.Builder}
          platformsProps={platformProps}
          color={isMobile ? theme.palette.primary.main : 'white'}
          accentColor={isMobile ? 'white' : theme.palette.primary.main}
        />
      }
    >
      <MemberValidationBanner />
      <FilterItemsContextProvider>
        <Stack maxWidth="xl" mx="auto" width="100%" height="100%">
          <ItemLoginWrapper
            item={item}
            itemErrorStatusCode={errorStatusCode}
            currentAccount={currentMember}
            enrollContent={<EnrollContent itemId={itemId} />}
            signInButtonId={ITEM_LOGIN_SIGN_IN_BUTTON_ID}
            usernameInputId={ITEM_LOGIN_SIGN_IN_USERNAME_ID}
            passwordInputId={ITEM_LOGIN_SIGN_IN_PASSWORD_ID}
            signIn={itemLoginSignIn}
            itemLoginSchemaType={itemLoginSchemaType}
            itemId={itemId}
            isLoading={
              currentMemberIsLoading ||
              itemLoginSchemaTypeIsLoading ||
              itemIsLoading
            }
            requestAccessContent={
              currentMember?.type === AccountType.Individual &&
              // member can request a membership if the item login type is null and not an error
              // item login schema type can error if the item is hidden
              !isItemLoginSchemaTypeError ? (
                <RequestAccessContent itemId={itemId} member={currentMember} />
              ) : undefined
            }
            forbiddenContent={
              <Stack
                id={ITEM_LOGIN_SCREEN_FORBIDDEN_ID}
                direction="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
                flex={1}
                gap={2}
              >
                <ForbiddenContent id={ITEM_LOGIN_SCREEN_FORBIDDEN_ID} />
                <ButtonLink to="/auth/login">
                  {translateCommon('LOG_IN.BUTTON_TEXT')}
                </ButtonLink>
              </Stack>
            }
          >
            <OutletContext.Provider
              value={{
                item: item!,
                permission: item?.permission,
                canWrite,
                canAdmin,
              }}
            >
              <Outlet />
            </OutletContext.Provider>
          </ItemLoginWrapper>
        </Stack>
      </FilterItemsContextProvider>
    </Main>
  );
}
