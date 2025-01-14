enum TreePreventSelection {
  NONE = 'none',
  SELF_AND_CHILDREN = 'selfAndChildren',
}

enum ButtonVariants {
  IconButton = 'icon',
  Button = 'button',
}

enum ItemLayoutMode {
  List = 'list',
  Grid = 'grid',
  Map = 'map',
}

enum Ordering {
  ASC = 'asc',
  DESC = 'desc',
}

export const DEFAULT_ITEM_LAYOUT_MODE = ItemLayoutMode.List;

export { Ordering, TreePreventSelection, ButtonVariants, ItemLayoutMode };
