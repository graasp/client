import {
  ItemLoginSchema,
  ItemLoginSchemaFactory,
  ItemLoginSchemaStatus,
  ItemLoginSchemaType,
} from '@graasp/sdk';

import type { PackedItem } from '@/openapi/client';

export const addItemLoginSchema = (
  item: PackedItem,
  itemLoginSchemaType: ItemLoginSchemaType,
  status = ItemLoginSchemaStatus.Active,
): PackedItem & { itemLoginSchema: ItemLoginSchema } => ({
  ...item,
  itemLoginSchema: ItemLoginSchemaFactory({
    item: item as unknown as ItemLoginSchema['item'],
    type: itemLoginSchemaType,
    status,
  }),
});
