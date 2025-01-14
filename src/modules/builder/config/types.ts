import { DiscriminatedItem } from '@graasp/sdk';

export enum InternalItemType {
  ZIP = 'zip',
}

export type NewItemTabType = DiscriminatedItem['type'] | InternalItemType.ZIP;
