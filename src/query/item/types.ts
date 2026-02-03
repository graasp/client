import { Member } from '@graasp/sdk';

import type { PermissionLevel } from '@/openapi/client';
import { ItemType } from '@/openapi/client';

export type ItemSearchParams = {
  creatorId?: Member['id'];
  ordering?: 'desc' | 'asc';
  sortBy?:
    | 'item.name'
    | 'item.type'
    | 'item.creator.name'
    | 'item.created_at'
    | 'item.updated_at';
  permissions?: PermissionLevel[];
  types?: ItemType[];
  keywords?: string;
};

export type ItemChildrenParams = {
  ordered?: boolean;
  types?: ItemType[];
  keywords?: string;
};
