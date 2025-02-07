import { type JSX, createContext, useContext, useMemo } from 'react';

import {
  CurrentAccount,
  DiscriminatedItem,
  ItemGeolocation,
  PackedItem,
} from '@graasp/sdk';

import type { configureQueryClient } from '@/query';

type QueryClientMutations = ReturnType<
  typeof configureQueryClient
>['mutations'];

export interface QueryClientContextInterface {
  item?: PackedItem;
  currentMember?: CurrentAccount | null;
  currentPosition?: { lat: number; lng: number };
  useRecycleItems: QueryClientMutations['useRecycleItems'];
  usePostItem: QueryClientMutations['usePostItem'];
  useDeleteItemGeolocation: QueryClientMutations['useDeleteItemGeolocation'];
  viewItem: (item: DiscriminatedItem) => void;
  viewItemInBuilder: (item: DiscriminatedItem) => void;
  handleAddOnClick?: ({
    location,
  }: {
    location: Pick<ItemGeolocation, 'lat' | 'lng'> &
      Partial<Pick<ItemGeolocation, 'country' | 'addressLabel'>>;
  }) => void;
}

export const QueryClientContext = createContext<QueryClientContextInterface>({
  currentMember: undefined,
  useRecycleItems: () => ({}) as any,
  usePostItem: () => ({}) as any,
  useDeleteItemGeolocation: () => ({}) as any,
  viewItem: () => ({}) as any,
  viewItemInBuilder: () => ({}) as any,
});

export const QueryClientContextProvider = ({
  currentMember,
  children,
  useRecycleItems,
  usePostItem,
  useDeleteItemGeolocation,
  viewItem,
  item,
  currentPosition,
  handleAddOnClick,
  viewItemInBuilder,
}: QueryClientContextInterface & { children: JSX.Element }): JSX.Element => {
  const value = useMemo(
    () => ({
      currentMember,
      useRecycleItems,
      usePostItem,
      useDeleteItemGeolocation,
      viewItem,
      item,
      currentPosition,
      handleAddOnClick,
      viewItemInBuilder,
    }),
    [
      currentMember,
      useRecycleItems,
      usePostItem,
      useDeleteItemGeolocation,
      viewItem,
      item,
      currentPosition,
      handleAddOnClick,
      viewItemInBuilder,
    ],
  );

  return (
    <QueryClientContext.Provider value={value}>
      {children}
    </QueryClientContext.Provider>
  );
};

export const useQueryClientContext = (): QueryClientContextInterface =>
  useContext<QueryClientContextInterface>(QueryClientContext);
