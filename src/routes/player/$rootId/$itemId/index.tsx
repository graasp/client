import type { JSX } from 'react';

import { AccountType } from '@graasp/sdk';

import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

import { axios, hooks, mutations } from '@/config/queryClient';
import {
  ITEM_LOGIN_PASSWORD_INPUT_ID,
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_USERNAME_INPUT_ID,
} from '@/config/selectors';
import ItemLoginWrapper from '@/ui/itemLogin/ItemLoginWrapper';

import { EnrollContent } from '~player/access/EnrollContent';
import { RequestAccessContent } from '~player/access/RequestAccessContent';
import ItemForbiddenScreen from '~player/item/ItemForbiddenScreen';
import MainScreen from '~player/item/MainScreen';

const schema = z.object({
  from: z.string().optional(),
  fromName: z.string().optional(),
});

export const Route = createFileRoute('/player/$rootId/$itemId/')({
  validateSearch: zodValidator(schema),
  component: ItemPage,
});

function ItemPage(): JSX.Element | null {
  const { itemId } = Route.useParams();
  const { data: member } = hooks.useCurrentMember();
  const {
    data: item,
    isFetching: isItemLoading,
    error: itemError,
  } = hooks.useItem(itemId);
  const {
    data: itemLoginSchemaType,
    isFetching: isLoadingItemLoginSchemaType,
  } = hooks.useItemLoginSchemaType({ itemId });

  const { mutate: itemLoginSignIn } = mutations.usePostItemLogin();

  const errorStatusCode =
    (axios.isAxiosError(itemError) && itemError.status) || null;

  return (
    <ItemLoginWrapper
      itemId={itemId}
      item={item}
      currentAccount={member}
      signIn={itemLoginSignIn}
      itemErrorStatusCode={errorStatusCode}
      itemLoginSchemaType={itemLoginSchemaType}
      usernameInputId={ITEM_LOGIN_USERNAME_INPUT_ID}
      signInButtonId={ITEM_LOGIN_SIGN_IN_BUTTON_ID}
      passwordInputId={ITEM_LOGIN_PASSWORD_INPUT_ID}
      enrollContent={<EnrollContent itemId={itemId} />}
      forbiddenContent={<ItemForbiddenScreen />}
      requestAccessContent={
        member?.type === AccountType.Individual ? (
          <RequestAccessContent itemId={itemId} member={member} />
        ) : undefined
      }
      isLoading={isItemLoading || isLoadingItemLoginSchemaType}
    >
      <MainScreen />
    </ItemLoginWrapper>
  );
}
