import { type ReactNode } from 'react';

import {
  AccountType,
  CurrentAccount,
  DiscriminatedItem,
  ItemLoginSchemaType,
  UUID,
} from '@graasp/sdk';

import { StatusCodes } from 'http-status-codes';

import CustomInitialLoader from '../CustomInitialLoader/CustomInitialLoader.js';
import ForbiddenText from './ForbiddenText.js';
import ItemLoginScreen, { SignInPropertiesType } from './ItemLoginScreen.js';

export type ItemLoginAuthorizationProps = {
  signIn: (args: { itemId: string } & SignInPropertiesType) => void;
  itemId: UUID;
  itemErrorStatusCode: number | null;
  currentAccount?: CurrentAccount | null;
  item?: DiscriminatedItem;
  itemLoginSchemaType?: ItemLoginSchemaType;
  usernameInputId?: string;
  signInButtonId?: string;
  passwordInputId?: string;
  children?: ReactNode;
  forbiddenContent?: ReactNode;
  isLoading?: boolean;
  enrollContent?: ReactNode;
  requestAccessContent?: ReactNode;
};

const ItemLoginAuthorization = ({
  currentAccount,
  item,
  itemErrorStatusCode,
  itemLoginSchemaType,
  itemId,
  signIn,
  isLoading,
  usernameInputId,
  signInButtonId,
  passwordInputId,
  forbiddenContent = <ForbiddenText />,
  enrollContent,
  requestAccessContent,
  children,
}: ItemLoginAuthorizationProps): ReactNode => {
  if (isLoading) {
    return <CustomInitialLoader />;
  }

  // the item could be fetched without errors
  // because the user is signed in and has access
  // or because the item is public
  if (item && item.id) {
    return children;
  }

  if (currentAccount) {
    if (currentAccount.type === AccountType.Individual) {
      // user is logged in and item login enabled - request automatic membership
      if (itemLoginSchemaType) {
        return enrollContent ?? forbiddenContent;
      }

      // user is logged in and item login disabled
      // cannot access to item - request access
      if (itemErrorStatusCode === StatusCodes.FORBIDDEN) {
        return requestAccessContent ?? forbiddenContent;
      }
      // any other error return forbidden message
      return forbiddenContent;
    } else {
      return forbiddenContent;
    }
  }

  // signed out but can sign in with item login
  if (itemLoginSchemaType) {
    return (
      <ItemLoginScreen
        itemId={itemId}
        signIn={signIn}
        itemLoginSchemaType={itemLoginSchemaType}
        usernameInputId={usernameInputId}
        signInButtonId={signInButtonId}
        passwordInputId={passwordInputId}
      />
    );
  }

  // either the item does not allow item login
  // or the user is already signed in as normal user and hasn't the access to this item
  return forbiddenContent;
};

export default ItemLoginAuthorization;
