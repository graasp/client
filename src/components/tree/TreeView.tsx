import { type JSX, useState } from 'react';

import { Collapse, List, ListItemButton, Typography } from '@mui/material';

import { getIdsFromPath } from '@graasp/sdk';

import { ErrorBoundary } from '@sentry/react';

import { buildTreeItemClass } from '@/config/selectors';
import type { Item, ItemType } from '@/openapi/client';

import { ExpandButton } from './ExpandButton';
import { TreeErrorBoundary } from './TreeErrorBoundary';
import { PartialItemWithChildren, buildItemsTree } from './utils';

export const GRAASP_MENU_ITEMS = ['folder' as const, 'shortcut' as const];

function ListItem({
  expandedIds,
  selectedIds,
  item,
  // bug: to allow animation of collapse, the sidebar should avoid to re-render the whole tree on navigation
  toggleExpand,
  level = 0,
  onClick,
}: Readonly<{
  expandedIds: string[];
  selectedIds: string[];
  item: PartialItemWithChildren;
  toggleExpand: (id: string) => void;
  level?: number;
  onClick?: (id: string) => void;
}>): JSX.Element {
  const isExpanded = expandedIds.includes(item.id);
  const isSelected = selectedIds.includes(item.id);

  return (
    <>
      <ListItemButton
        className={buildTreeItemClass(item.id)}
        selected={isSelected}
        sx={{
          ml: 3 * level,
          gap: 1,
          py: 0,
          fontWeight: isSelected || level === 0 ? 'bold' : 'normal',
        }}
        onClick={() => {
          onClick?.(item.id);
          if (!isExpanded) {
            toggleExpand(item.id);
          }
        }}
      >
        {Boolean(item.children?.length) && (
          <ExpandButton
            element={item}
            level={level}
            isExpanded={isExpanded}
            toggleExpand={toggleExpand}
          />
        )}
        {item.name}
      </ListItemButton>
      <Collapse in={isExpanded} timeout="auto">
        <List component="div" disablePadding>
          {item.children?.map((child) => (
            <ListItem
              key={child.id}
              toggleExpand={toggleExpand}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              item={child}
              level={level + 1}
              onClick={onClick}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}

type TreeViewProps = {
  id: string;
  header?: string;
  rootItems: (Item & { children?: Item[] })[];
  items?: (Item & { children?: Item[] })[];
  onTreeItemSelect?: (value: string) => void;
  itemId: string;
  /**
   * Item whose type is not in the list is filtered out. If the array is empty, no item is filtered.
   */
  allowedTypes?: ItemType[];
};

export function TreeView({
  id,
  header,
  items,
  rootItems,
  onTreeItemSelect,
  allowedTypes = [],
  itemId,
}: Readonly<TreeViewProps>): JSX.Element {
  const itemsToShow = items?.filter((item) =>
    allowedTypes.length ? allowedTypes.includes(item.type) : true,
  );
  const [expandedIds, setExpandedIds] = useState<string[]>(() => {
    const focusedItem = itemsToShow?.find((i) => i.id === itemId);
    const defaultExpandedIds = rootItems[0]?.id ? [rootItems[0].id] : [];
    return focusedItem ? getIdsFromPath(focusedItem.path) : defaultExpandedIds;
  });

  const itemTree = buildItemsTree(itemsToShow ?? [], rootItems);
  const tree = Object.values(itemTree);

  const toggleExpand = (targetId: string) => {
    setExpandedIds((prev) =>
      prev.includes(targetId)
        ? prev.filter((expandedId) => expandedId !== targetId)
        : [...prev, targetId],
    );
  };

  return (
    <ErrorBoundary fallback={<TreeErrorBoundary />}>
      {header && (
        <Typography sx={{ ml: 2, fontWeight: 'bold' }} variant="body1">
          {header}
        </Typography>
      )}
      <List id={id} dense component="nav">
        <ListItem
          item={tree[0]}
          selectedIds={itemId ? [itemId] : []}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
          onClick={onTreeItemSelect}
        />
      </List>
    </ErrorBoundary>
  );
}
