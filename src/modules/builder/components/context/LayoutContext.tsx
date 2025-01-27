import { type JSX, createContext, useContext, useMemo } from 'react';

import { useSearch } from '@tanstack/react-router';

import { ItemLayoutMode, ItemLayoutModeType } from '~builder/enums';

interface LayoutContextInterface {
  mode: ItemLayoutModeType;
}

export const LayoutContext = createContext<LayoutContextInterface>({
  mode: ItemLayoutMode.List,
});

export const LayoutContextProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { mode } = useSearch({ from: '/builder' });

  const value: LayoutContextInterface = useMemo(
    () => ({
      mode,
    }),
    [mode],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayoutContext = (): LayoutContextInterface =>
  useContext<LayoutContextInterface>(LayoutContext);
