import { type JSX, type ReactNode, createContext, useContext } from 'react';

import { Account, ChatMessageWithCreator } from '@graasp/sdk';

import { hooks } from '@/config/queryClient';

export type MessagesContextType = {
  messages?: ChatMessageWithCreator[];
  itemId: string;
  members: Account[];
};

export const MessagesContext = createContext<MessagesContextType>({
  itemId: '',
  members: [],
});

type Props = {
  messages?: ChatMessageWithCreator[];
  itemId: string;
  children: ReactNode;
};

export const MessagesContextProvider = ({
  children,
  messages,
  itemId,
}: Props): JSX.Element => {
  const { data: itemPermissions } = hooks.useItemMemberships(itemId);
  const members = itemPermissions?.map(({ account }) => account);

  const value = {
    messages,
    members: members ?? [],
    itemId,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessagesContext = (): MessagesContextType =>
  useContext<MessagesContextType>(MessagesContext);
