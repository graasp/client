import { AccountType, type DiscriminatedItem } from '@graasp/sdk';

import { useQuery } from '@tanstack/react-query';

import { ItemMembership } from '@/openapi/client';
import { getItemMembershipsForItemOptions } from '@/openapi/client/@tanstack/react-query.gen';

export function useGuestMemberships(itemId: DiscriminatedItem['id']): {
  isLoading: boolean;
  data?: ItemMembership[];
} {
  const { data: memberships, isLoading } = useQuery(
    getItemMembershipsForItemOptions({ query: { itemId } }),
  );

  const guestMemberships = memberships?.filter(
    ({ account: { type } }) => type === AccountType.Guest,
  );

  return { isLoading, data: guestMemberships };
}
