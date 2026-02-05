import { AccountType } from '@graasp/sdk';

import { hooks } from '@/config/queryClient';
import { Item, ItemMembership } from '@/openapi/client';

export function useGuestMemberships(itemId: Item['id']): {
  isLoading: boolean;
  data?: ItemMembership[];
} {
  const { data: memberships, isLoading } = hooks.useItemMemberships(itemId);

  const guestMemberships = memberships?.filter(
    ({ account: { type } }) => type === AccountType.Guest,
  );

  return { isLoading, data: guestMemberships };
}
