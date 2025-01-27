import { type JSX, type ReactNode, createContext, useContext } from 'react';

import { Account, ChatMessage } from '@graasp/sdk';

export type MessagesContextType = {
  messages?: ChatMessage[];
  chatId: string;
  members?: Account[];
};

export const MessagesContext = createContext<MessagesContextType>({
  chatId: '',
  members: [],
});

type Props = {
  messages?: ChatMessage[];
  chatId: string;
  members?: Account[];
  children: ReactNode;
};

export const MessagesContextProvider = ({
  children,
  messages,
  chatId,
  members = [],
}: Props): JSX.Element => {
  const value = {
    messages,
    chatId,
    members,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessagesContext = (): MessagesContextType =>
  useContext<MessagesContextType>(MessagesContext);
