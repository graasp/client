const TreePreventSelection = {
  NONE: 'none',
  SELF_AND_CHILDREN: 'selfAndChildren',
} as const;

const ButtonVariants = {
  IconButton: 'icon',
  Button: 'button',
} as const;

const ItemLayoutMode = {
  List: 'list',
  Grid: 'grid',
  Map: 'map',
} as const;

const Ordering = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const DEFAULT_ITEM_LAYOUT_MODE = ItemLayoutMode.List;

export { Ordering, TreePreventSelection, ButtonVariants, ItemLayoutMode };
