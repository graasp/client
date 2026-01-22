import {
  Account,
  DiscriminatedItem,
  ItemMembership,
  Member,
  MemberFactory,
  PackedFolderItemFactory,
} from '@graasp/sdk';

import { v4 } from 'uuid';

import type { PermissionLevel } from '@/openapi/client/types.gen';

import { MEMBERS } from '../../../fixtures/members';
import { ApiConfig } from '../../../support/types';

export const buildItemMembership = (args: {
  permission?: PermissionLevel;
  item: DiscriminatedItem;
  account: Partial<Account>;
  creator?: Member;
}): ItemMembership => ({
  permission: args.permission ?? 'admin',
  account: MemberFactory(args.account),
  item: args.item,
  creator: MemberFactory(args.creator ?? args.account),
  createdAt: '2021-08-11T12:56:36.834Z',
  updatedAt: '2021-08-11T12:56:36.834Z',
  id: v4(),
});

const sampleItems: DiscriminatedItem[] = [
  PackedFolderItemFactory({
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'own_item_name1',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
  }),
  PackedFolderItemFactory({
    id: 'fcafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'own_item_name1',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fcafbd2a_5688_11eb_ae93_0242ac130002',
  }),
  PackedFolderItemFactory({
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
    name: 'own_item_name2',
    path: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
  }),
];

// warning: actor has admin permission
export const ITEMS_WITH_MEMBERSHIPS: ApiConfig = {
  items: [
    {
      ...sampleItems[0],
      memberships: [
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130002',
          item: sampleItems[0],
          permission: 'admin',
          account: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
        },
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130002',
          item: sampleItems[0],
          permission: 'write',
          account: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
        },
        {
          id: 'ecafbd1a-5688-11eb-be93-0242ac130002',
          item: sampleItems[0],
          permission: 'write',
          account: MEMBERS.CEDRIC,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
          creator: MEMBERS.ANNA,
        },
        {
          id: 'ecbfbd2a-5688-11eb-be93-0242ac130002',
          item: sampleItems[0],
          permission: 'read',
          account: MEMBERS.DAVID,
          creator: MEMBERS.ANNA,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...sampleItems[1],
      memberships: [
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130002',
          item: sampleItems[1],
          permission: 'admin',
          account: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
        },
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130002',
          item: sampleItems[0],
          permission: 'write',
          account: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    sampleItems[2],
  ],
};
