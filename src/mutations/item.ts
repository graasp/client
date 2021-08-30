import { List, Record, Map } from 'immutable';
import { QueryClient } from 'react-query';
import * as Api from '../api';
import {
  copyItemRoutine,
  copyItemsRoutine,
  createItemRoutine,
  deleteItemsRoutine,
  deleteItemRoutine,
  editItemRoutine,
  moveItemRoutine,
  moveItemsRoutine,
  shareItemRoutine,
  uploadFileRoutine,
  putItemLoginRoutine,
  postItemLoginRoutine,
} from '../routines';
import {
  buildItemChildrenKey,
  buildItemKey,
  getKeyForParentId,
  MUTATION_KEYS,
  buildItemLoginKey,
  OWN_ITEMS_KEY,
} from '../config/keys';
import { buildPath, getDirectParentId } from '../utils/item';
import type { Item, QueryClientConfig, UUID } from '../types';

const {
  POST_ITEM,
  DELETE_ITEM,
  EDIT_ITEM,
  FILE_UPLOAD,
  SHARE_ITEM,
  MOVE_ITEM,
  MOVE_ITEMS,
  COPY_ITEM,
  COPY_ITEMS,
  DELETE_ITEMS,
  POST_ITEM_LOGIN,
  PUT_ITEM_LOGIN,
} = MUTATION_KEYS;

interface Value {
  value: any;
}

interface IdAndValue extends Value {
  id: UUID;
}

interface PathAndValue extends Value {
  childPath: string;
}

type IdOrPathWithValue = IdAndValue | PathAndValue;

export default (queryClient: QueryClient, queryConfig: QueryClientConfig) => {
  const { notifier } = queryConfig;

  // Utils functions to mutate react query data
  const mutateItem = async ({ id, value }: { id: UUID; value: any }) => {
    const itemKey = buildItemKey(id);

    await queryClient.cancelQueries(itemKey);

    // Snapshot the previous value
    const prevValue = queryClient.getQueryData(itemKey);

    queryClient.setQueryData(itemKey, value);

    // Return a context object with the snapshotted value
    return prevValue;
  };

  const mutateParentChildren = async (args: IdOrPathWithValue) => {
    const { value } = args;
    const parentId =
      (args as IdAndValue).id ||
      getDirectParentId((args as PathAndValue).childPath);

    // get parent key
    const childrenKey = !parentId
      ? OWN_ITEMS_KEY
      : buildItemChildrenKey(parentId);

    // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries(childrenKey);

    // Snapshot the previous value
    const prevParent = queryClient.getQueryData(childrenKey);

    // Optimistically update
    queryClient.setQueryData(childrenKey, value);

    // Return a context object with the snapshotted value
    return prevParent;
  };

  queryClient.setMutationDefaults(POST_ITEM, {
    mutationFn: async (item) => ({
      parentId: item.parentId,
      item: await Api.postItem(item, queryConfig),
    }),
    // we cannot optimistically add an item because we need its id
    onSuccess: () => {
      notifier?.({ type: createItemRoutine.SUCCESS });
    },
    onError: (error) => {
      notifier?.({ type: createItemRoutine.FAILURE, payload: { error } });
    },
    onSettled: (newItem) => {
      const key = getKeyForParentId(newItem?.parentId);
      queryClient.invalidateQueries(key);
    },
  });

  queryClient.setMutationDefaults(EDIT_ITEM, {
    mutationFn: (item) => Api.editItem(item.id, item, queryConfig),
    // newItem contains only changed values
    onMutate: async (newItem: Partial<Item>) => {
      const trimmed = Map({
        ...newItem,
        name: newItem.name?.trim(),
      });

      const itemKey = buildItemKey(newItem.id);

      // invalidate key
      await queryClient.cancelQueries(itemKey);

      // build full item with new values
      const prevItem = queryClient.getQueryData(itemKey) as Record<Item>;
      const newFullItem = prevItem ? prevItem.merge(trimmed) : prevItem;
      queryClient.setQueryData(itemKey, newFullItem);

      const previousItems = {
        ...(Boolean(prevItem) && {
          parent: await mutateParentChildren({
            childPath: prevItem.get('path'),
            value: (old: List<Item>) => {
              if (!old || old.isEmpty()) {
                return old;
              }
              const idx = old.findIndex(({ id }) => id === newItem.id);
              // todo: remove toJS when moving to List<Map<Item>>
              return old.set(idx, newFullItem.toJS() as Item);
            },
          }),
          item: prevItem,
        }),
      };

      return previousItems;
    },
    onSuccess: () => {
      notifier?.({ type: editItemRoutine.SUCCESS });
    },
    onError: (error, newItem, context) => {
      const { item: prevItem } = context;
      const parentKey = getKeyForParentId(
        getDirectParentId(prevItem.get('path')),
      );
      queryClient.setQueryData(parentKey, context.parent);
      const itemKey = buildItemKey(newItem.id);
      queryClient.setQueryData(itemKey, context.item);
      notifier?.({ type: editItemRoutine.FAILURE, payload: { error } });
    },
    onSettled: (_newItem, _error, { id }, context) => {
      const { item: prevItem } = context;
      if (prevItem) {
        const parentKey = getKeyForParentId(
          getDirectParentId(prevItem.get('path')),
        );
        queryClient.invalidateQueries(parentKey);
      }

      const itemKey = buildItemKey(id);
      queryClient.invalidateQueries(itemKey);
    },
  });

  queryClient.setMutationDefaults(DELETE_ITEM, {
    mutationFn: ([itemId]) =>
      Api.deleteItem(itemId, queryConfig).then(() => itemId),

    onMutate: async ([itemId]) => {
      const itemKey = buildItemKey(itemId);
      const itemData = queryClient.getQueryData(itemKey) as Record<Item>;
      const parentKey = getKeyForParentId(
        getDirectParentId(itemData.get('path')),
      );
      const parentData = queryClient.getQueryData(parentKey);
      const previousItems = {
        ...(Boolean(itemData) && {
          parent: parentData,
          item: await mutateItem({ id: itemId, value: null }),
        }),
      };
      return previousItems;
    },
    onSuccess: () => {
      notifier?.({ type: deleteItemRoutine.SUCCESS });
    },
    onError: (error, itemId, context) => {
      const itemData = context.item;

      if (itemData) {
        const itemKey = buildItemKey(itemId);
        queryClient.setQueryData(itemKey, context.item);
        const parentKey = getKeyForParentId(
          getDirectParentId(itemData.get('path')),
        );
        queryClient.setQueryData(parentKey, context.parent);
      }
      notifier?.({ type: deleteItemRoutine.FAILURE, payload: { error } });
    },
    onSettled: (itemId, _error, _variables, context) => {
      const itemData = context.item;

      if (itemData) {
        const itemKey = buildItemKey(itemId);
        queryClient.invalidateQueries(itemKey);

        const parentKey = getKeyForParentId(
          getDirectParentId(itemData.get('path')),
        );
        queryClient.invalidateQueries(parentKey);
      }
    },
  });

  queryClient.setMutationDefaults(DELETE_ITEMS, {
    mutationFn: (itemIds) =>
      Api.deleteItems(itemIds, queryConfig).then(() => itemIds),

    onMutate: async (itemIds: UUID[]) => {
      // get path from first item
      const itemKey = buildItemKey(itemIds[0]);
      const item = queryClient.getQueryData(itemKey) as Record<Item>;
      const itemPath = item?.get('path');

      const previousItems = {
        ...(Boolean(itemPath) && {
          parent: await mutateParentChildren({
            childPath: itemPath,
            value: (old: List<Item>) =>
              old.filter(({ id }) => !itemIds.includes(id)),
          }),
        }),
      };

      itemIds.forEach(async (id) => {
        previousItems[id] = await mutateItem({ id, value: null });
      });

      return previousItems;
    },
    onSuccess: () => {
      notifier?.({ type: deleteItemRoutine.SUCCESS });
    },
    onError: (error, itemIds: UUID[], context) => {
      const itemPath = context[itemIds[0]]?.get('path');

      if (itemPath) {
        const parentKey = getKeyForParentId(getDirectParentId(itemPath));
        queryClient.setQueryData(parentKey, context.parent);
      }

      itemIds.forEach((id) => {
        const itemKey = buildItemKey(id);
        queryClient.setQueryData(itemKey, context[id]);
      });

      notifier?.({ type: deleteItemsRoutine.FAILURE, payload: { error } });
    },
    onSettled: (itemIds: UUID[], _error, _variables, context) => {
      const itemPath = context[itemIds[0]]?.get('path');

      itemIds.forEach((id) => {
        const itemKey = buildItemKey(id);
        queryClient.invalidateQueries(itemKey);
      });

      if (itemPath) {
        const parentKey = getKeyForParentId(getDirectParentId(itemPath));
        queryClient.invalidateQueries(parentKey);
      }
    },
  });

  queryClient.setMutationDefaults(COPY_ITEM, {
    mutationFn: (payload) =>
      Api.copyItem(payload, queryConfig).then((newItem) => ({
        to: payload.to,
        ...newItem,
      })),
    // cannot mutate because it needs the id
    onSuccess: () => {
      notifier?.({ type: copyItemRoutine.SUCCESS });
    },
    onError: (error) => {
      notifier?.({ type: copyItemRoutine.FAILURE, payload: { error } });
    },
    onSettled: (_newItem, _err, payload) => {
      const parentKey = getKeyForParentId(payload.to);
      queryClient.invalidateQueries(parentKey);
    },
  });

  queryClient.setMutationDefaults(COPY_ITEMS, {
    mutationFn: (payload) =>
      Api.copyItems(payload, queryConfig).then((newItems) => ({
        to: payload.to,
        ...newItems,
      })),
    // cannot mutate because it needs the id
    onSuccess: () => {
      notifier?.({ type: copyItemsRoutine.SUCCESS });
    },
    onError: (error) => {
      notifier?.({ type: copyItemsRoutine.FAILURE, payload: { error } });
    },
    onSettled: (_newItems, _err, payload) => {
      const parentKey = getKeyForParentId(payload.to);
      queryClient.invalidateQueries(parentKey);
    },
  });

  queryClient.setMutationDefaults(MOVE_ITEM, {
    mutationFn: (payload) =>
      Api.moveItem(payload, queryConfig).then(() => payload),
    onMutate: async ({ id: itemId, to }) => {
      const itemKey = buildItemKey(itemId);
      const itemData = queryClient.getQueryData(itemKey) as Record<Item>;
      const previousItems = {
        ...(Boolean(itemData) && {
          // add item in target item
          targetParent: await mutateParentChildren({
            id: to,
            value: (old: List<Item>) => old?.push(itemData.toJS() as Item),
          }),

          // remove item in original item
          originalParent: await mutateParentChildren({
            childPath: itemData.get('path'),
            value: (old: List<Item>) => old?.filter(({ id }) => id !== itemId),
          }),

          // update item's path
          item: await mutateItem({
            id: itemId,
            value: (item: Record<Item>) =>
              item.set(
                'path',
                buildPath({
                  prefix:
                    queryClient
                      .getQueryData<Record<Item>>(buildItemKey(to))
                      ?.get('path') ?? '',
                  ids: [itemId],
                }),
              ),
          }),
        }),
      };
      return previousItems;
    },
    onSuccess: () => {
      notifier?.({ type: moveItemRoutine.SUCCESS });
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (error, { id, to }, context) => {
      const itemKey = buildItemKey(id);
      queryClient.setQueryData(itemKey, context.item);

      const parentKey = getKeyForParentId(to);
      queryClient.setQueryData(parentKey, context.targetParent);

      const itemData = context.item;
      if (itemData) {
        const parentKey = getKeyForParentId(
          getDirectParentId(itemData.get('path')),
        );
        queryClient.setQueryData(parentKey, context.originalParent);
      }
      notifier?.({ type: moveItemRoutine.FAILURE, payload: { error } });
    },
    // Always refetch after error or success:
    onSettled: (_newItem, _err, { id, to }, context) => {
      // Invalidate new parent
      const newParentKey = getKeyForParentId(to);
      queryClient.invalidateQueries(newParentKey);

      // Invalidate old parent
      const oldParentKey = getKeyForParentId(context.originalParent.id);
      queryClient.invalidateQueries(oldParentKey);

      // Invalidate moved item
      const itemKey = buildItemKey(id);
      queryClient.invalidateQueries(itemKey);
    },
  });

  queryClient.setMutationDefaults(MOVE_ITEMS, {
    mutationFn: (payload) =>
      Api.moveItems(payload, queryConfig).then(() => payload),
    onMutate: async ({ id: itemIds, to }) => {
      const itemsData = itemIds.map((id: UUID) => {
        const itemKey = buildItemKey(id);
        const itemData = queryClient.getQueryData(itemKey) as Record<Item>;
        return itemData.toJS();
      });

      const path = itemsData[0].path;

      const previousItems = {
        ...(Boolean(itemsData) && {
          // add item in target item
          targetParent: await mutateParentChildren({
            id: to,
            value: (old: List<Item>) => old?.concat(itemsData),
          }),

          // remove item in original item
          originalParent: await mutateParentChildren({
            childPath: path,
            value: (old: List<Item>) =>
              old?.filter(({ id }) => !itemIds.includes(id)),
          }),
        }),
      };
      // update item's path
      itemIds.forEach(async (id: any) => {
        previousItems[id] = await mutateItem({
          id: id,
          value: (item: Record<Item>) =>
            item.set(
              'path',
              buildPath({
                prefix:
                  queryClient
                    .getQueryData<Record<Item>>(buildItemKey(to))
                    ?.get('path') ?? '',
                ids: [id],
              }),
            ),
        });
      });
      return previousItems;
    },
    onSuccess: () => {
      notifier?.({ type: moveItemsRoutine.SUCCESS });
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (error, { id: itemIds, to }, context) => {
      const parentKey = getKeyForParentId(to);
      queryClient.setQueryData(parentKey, context.targetParent);
      itemIds.forEach((id: UUID) => {
        const itemKey = buildItemKey(id);
        queryClient.setQueryData(itemKey, context[id]);

        const itemData = context[id];
        if (itemData) {
          const parentKey = getKeyForParentId(
            getDirectParentId(itemData.get('path')),
          );
          queryClient.setQueryData(parentKey, context.originalParent);
        }
      });
      notifier?.({ type: moveItemsRoutine.FAILURE, payload: { error } });
    },
    // Always refetch after error or success:
    onSettled: (_newItem, _err, { id: itemIds, to }, context) => {
      // Invalidate new parent
      const newParentKey = getKeyForParentId(to);
      queryClient.invalidateQueries(newParentKey);

      // Invalidate old parent
      const oldParentKey = getKeyForParentId(context.originalParent.id);
      queryClient.invalidateQueries(oldParentKey);

      itemIds.forEach((id: UUID) => {
        // Invalidate moved item
        const itemKey = buildItemKey(id);
        queryClient.invalidateQueries(itemKey);
      });
    },
  });

  queryClient.setMutationDefaults(SHARE_ITEM, {
    mutationFn: (payload) =>
      Api.shareItemWith(payload, queryConfig).then(() => payload),
    onSuccess: () => {
      notifier?.({ type: shareItemRoutine.SUCCESS });
    },
    onError: (error) => {
      notifier?.({ type: shareItemRoutine.FAILURE, payload: { error } });
    },
    onSettled: ({ id }) => {
      const itemKey = buildItemKey(id);
      queryClient.invalidateQueries(itemKey);

      // invalidate children since membership will also change for them
      queryClient.invalidateQueries(buildItemChildrenKey(id));
    },
  });

  // this mutation is used for its callback
  queryClient.setMutationDefaults(FILE_UPLOAD, {
    mutationFn: ({ id, error }) => Promise.resolve({ id, error }),
    onSuccess: ({ error }) => {
      if (!error) {
        notifier?.({ type: uploadFileRoutine.SUCCESS });
      } else {
        notifier?.({ type: uploadFileRoutine.FAILURE, payload: { error } });
      }
    },
    onSettled: ({ id }) => {
      const parentKey = getKeyForParentId(id);
      queryClient.invalidateQueries(parentKey);
    },
  });

  queryClient.setMutationDefaults(POST_ITEM_LOGIN, {
    mutationFn: (payload) => Api.postItemLoginSignIn(payload, queryConfig),
    onError: (error) => {
      notifier?.({ type: postItemLoginRoutine.FAILURE, payload: { error } });
    },
    onSettled: () => {
      queryClient.resetQueries();
    },
  });

  queryClient.setMutationDefaults(PUT_ITEM_LOGIN, {
    mutationFn: (payload) =>
      Api.putItemLoginSchema(payload, queryConfig).then(() => payload),
    onSuccess: () => {
      notifier?.({ type: putItemLoginRoutine.SUCCESS });
    },
    onError: (error) => {
      notifier?.({ type: putItemLoginRoutine.FAILURE, payload: { error } });
    },
    onSettled: ({ itemId }) => {
      queryClient.invalidateQueries(buildItemLoginKey(itemId));
    },
  });
};
