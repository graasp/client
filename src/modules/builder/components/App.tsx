import { Trans } from 'react-i18next';

import { buildSignInPath, saveUrlForRedirection } from '@graasp/sdk';
import {
  CustomInitialLoader,
  PreventGuestWrapper,
  SignedInWrapper,
} from '@graasp/ui';

import { DOMAIN, GRAASP_AUTH_HOST } from '@/config/env';
import { useBuilderTranslation } from '@/config/i18n';
import { PREVENT_GUEST_MESSAGE_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import {
  BOOKMARKED_ITEMS_PATH,
  HOME_PATH,
  ITEM_PUBLISH_PATH,
  ITEM_SETTINGS_PATH,
  ITEM_SHARE_PATH,
  PUBLISHED_ITEMS_PATH,
  buildItemPath,
} from '../config/paths';
import { hooks, mutations } from '../config/queryClient';
import BookmarkedItemsScreen from './pages/BookmarkedItemsScreen';
import PublishedItemsScreen from './pages/PublishedItemsScreen';
import HomeScreen from './pages/home/HomeScreenContent';
import ItemPageLayout from './pages/item/ItemPageLayout';
import ItemScreen from './pages/item/ItemScreen';
import ItemSettingsPage from './pages/item/ItemSettingsPage';
import ItemSharingPage from './pages/item/ItemSharingPage';
import LibrarySettingsPage from './pages/item/LibrarySettingsPage';
import ItemAccessWrapper from './pages/item/accessWrapper/ItemAccessWrapper';

const { useItemFeedbackUpdates, useCurrentMember } = hooks;

const App = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: signOut } = mutations.useSignOut();
  const { pathname } = useLocation();
  const { data: currentAccount, isLoading } = useCurrentMember();

  // registers the item updates through websockets
  useItemFeedbackUpdates?.(currentAccount?.id);

  if (isLoading) {
    return <CustomInitialLoader />;
  }

  return (
    <Routes>
      {/* pages with personal info */}
      <Route
        element={
          // redirect to sign in if not signed in
          <SignedInWrapper
            currentAccount={currentAccount}
            redirectionLink={buildSignInPath({
              host: GRAASP_AUTH_HOST,
              redirectionUrl: window.location.toString(),
            })}
            onRedirect={() => {
              // save current url for later redirection after sign in
              saveUrlForRedirection(pathname, DOMAIN);
            }}
          >
            <PreventGuestWrapper
              id={PREVENT_GUEST_MESSAGE_ID}
              currentAccount={currentAccount}
              buttonText={translateBuilder(BUILDER.GUEST_SIGN_OUT_BUTTON)}
              onButtonClick={() => signOut()}
              errorText={translateBuilder(BUILDER.ERROR_MESSAGE)}
              text={
                <Trans
                  t={translateBuilder}
                  i18nKey={BUILDER.GUEST_LIMITATION_TEXT}
                  values={{
                    name: currentAccount?.name,
                  }}
                  components={{ 1: <strong /> }}
                />
              }
            >
              <Outlet />
            </PreventGuestWrapper>
          </SignedInWrapper>
        }
      >
        <Route path={HOME_PATH} element={<HomeScreen />} />
        <Route
          path={BOOKMARKED_ITEMS_PATH}
          element={<BookmarkedItemsScreen />}
        />
        <Route path={PUBLISHED_ITEMS_PATH} element={<PublishedItemsScreen />} />
      </Route>

      {/* item pages - can be public */}
      <Route path={buildItemPath()} element={<ItemAccessWrapper />}>
        <Route index element={<ItemScreen />} />
        <Route element={<ItemPageLayout />}>
          <Route path={ITEM_SHARE_PATH} element={<ItemSharingPage />} />
          <Route path={ITEM_PUBLISH_PATH} element={<LibrarySettingsPage />} />
          <Route path={ITEM_SETTINGS_PATH} element={<ItemSettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
