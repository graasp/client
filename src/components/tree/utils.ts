import { getMimetype, getParentFromPath } from '@graasp/sdk';

import type { ItemType, PackedItem } from '@/openapi/client';

type ItemIdToDirectChildren = {
  [nodeId: string]: PackedItem[];
};

/**
 * build parent -> children map
 * items without parent are not in the map
 */
const createMapTree = (data: PackedItem[]): ItemIdToDirectChildren =>
  data.reduce<ItemIdToDirectChildren>((treeMap, elem) => {
    const parentId = getParentFromPath(elem.path);
    if (parentId) {
      treeMap[parentId] = (treeMap[parentId] ?? []).concat([elem]);
    }
    return treeMap;
  }, {});

// we can't pass all the item as metadata because nested objects are currently not supported by the library.
// we expose the mimetype on the first level of metadata so it can be accessed and the icons of the files can be rendered
export type ItemMetaData = {
  type: ItemType;
  mimetype?: string;
};

export type PartialItemWithChildren = {
  id: string;
  name: string;
  metadata: ItemMetaData;
} & {
  children?: PartialItemWithChildren[];
};

type TreeNode = {
  [nodeId: string]: PartialItemWithChildren;
};

// handle item children tree
export const buildItemsTree = (data: PackedItem[], rootItems: PackedItem[]) => {
  const tree: TreeNode = {};
  if (data.length === 1) {
    // this for non children one item as tree map build based on children to parent relation
    tree[data[0].id] = {
      id: data[0].id,
      name: data[0].name,
      metadata: {
        type: data[0].type,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mimetype: getMimetype(data[0].extra as any),
      },
      children: [],
    };
  }
  const mapTree = createMapTree(data);

  const buildTree = (node: PackedItem) => {
    if (node.type === 'folder' && mapTree[node.id]) {
      const children = mapTree[node.id] ?? [];

      const entry: PartialItemWithChildren = {
        id: node.id,
        name: node.name,
        metadata: { type: node.type },
        children: children.map((child) => buildTree(child)),
      };
      return entry;
    }
    // root items are not in the map
    return {
      id: node.id,
      name: node.name,
      metadata: {
        type: node.type,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mimetype: getMimetype(node.extra as any),
      },
    };
  };

  rootItems.forEach((ele) => {
    tree[ele.id] = buildTree(ele);
  });

  return tree;
};
