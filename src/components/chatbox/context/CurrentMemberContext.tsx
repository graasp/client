import { type JSX, type ReactNode, createContext, useContext } from 'react';

import { CurrentAccount } from '@graasp/sdk';

export type CurrentMemberContextType = CurrentAccount | null | undefined;

const CurrentMemberContext = createContext<CurrentMemberContextType>(null);

type Props = {
  children: ReactNode;
  currentMember?: CurrentAccount | null;
};

export const CurrentMemberContextProvider = ({
  children,
  currentMember,
}: Props): JSX.Element => {
  return (
    <CurrentMemberContext.Provider value={currentMember}>
      {children}
    </CurrentMemberContext.Provider>
  );
};

export const useCurrentMemberContext = (): CurrentMemberContextType =>
  useContext<CurrentMemberContextType>(CurrentMemberContext);
