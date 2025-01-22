import {
  FolderItemFactory,
  ItemType,
  LocalFileItemFactory,
  LocalFileItemType,
  MimeTypes,
} from '@graasp/sdk';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { CogIcon } from 'lucide-react';

import { MOCK_MEMBER } from '../utils/fixtures.js';
import ExtraItemsMenu from './ExtraItemsMenu.js';
import HomeMenu from './HomeMenu.js';
import { ItemMenu, ItemMenuProps, Navigation } from './Navigation.js';

const buildItem = (name: string): LocalFileItemType =>
  LocalFileItemFactory({
    id: name,
    name,
    extra: {
      [ItemType.LOCAL_FILE]: {
        path: 'https://picsum.photos/100',
        mimetype: MimeTypes.Image.PNG,
        name: 'original file name',
        size: 2600,
        content: '',
      },
    },
  });

const meta = {
  title: 'Common/Navigation',
  component: Navigation,
  parameters: {
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
    },
  },

  render: (args) => {
    return <Navigation {...args} />;
  },
} satisfies Meta<typeof Navigation>;

export default meta;

type Story = StoryObj<typeof meta>;
type UseChildrenHookType = ReturnType<ItemMenuProps['useChildren']>;

const item = buildItem('my item');
const parents = [buildItem('parent 1'), buildItem('parent 2')];
const children = [buildItem('child 1'), buildItem('child 2')];
const useChildren: ItemMenuProps['useChildren'] = () => {
  return { data: children } as UseChildrenHookType;
};
const itemPath = '/itemPath';
const dataTestId = 'NavigateNextIcon';
const folder = FolderItemFactory({
  id: 'folder-id',
  name: 'folder',
  type: ItemType.FOLDER,
  description: 'my image description',
  path: 'item-path',
  settings: {},
  creator: MOCK_MEMBER,
});

const menu = [
  { name: 'Home', id: 'home', to: 'home' },
  { name: 'Shared Items', id: 'shared', to: 'shared' },
];

export const HomeRoot = {
  args: {
    itemPath,
    useChildren,

    renderRoot: () => {
      return (
        <>
          <HomeMenu selected={menu[0]} elements={menu} />
          <ItemMenu
            itemId={item.id}
            useChildren={() => {
              return {
                data: [buildItem('Home item 1'), buildItem('Home item 2')],
              } as UseChildrenHookType;
            }}
            itemPath="/itemPath"
          />
        </>
      );
    },
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 2 x Home
    expect(canvas.getAllByTestId(dataTestId)).toHaveLength(2);
  },
} satisfies Story;

export const FolderWithParents = {
  args: {
    itemPath,
    useChildren,
    item: folder,

    renderRoot: () => {
      return (
        <>
          <HomeMenu selected={menu[0]} elements={menu} />
          <ItemMenu
            itemId={item.id}
            useChildren={() => {
              return {
                data: [buildItem('Home item 1'), buildItem('Home item 2')],
              } as UseChildrenHookType;
            }}
            itemPath={itemPath}
          />
        </>
      );
    },
    parents,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // current item
    expect(canvas.getByText(folder.name)).toBeInTheDocument();

    // check parents
    for (const p of parents) {
      const b = canvas.getByText(p!.name);
      expect(b).toBeInTheDocument();
    }

    // 4 = 2 parents + 2 x Home + current item is a folder
    expect(canvas.getAllByTestId(dataTestId)).toHaveLength(5);
  },
} satisfies Story;

export const FileWithParents = {
  args: {
    itemPath,
    useChildren,
    item,

    renderRoot: () => {
      return (
        <>
          <HomeMenu selected={menu[0]} elements={menu} />
          <ItemMenu
            itemId={item.id}
            useChildren={() => {
              return {
                data: [buildItem('Home item 1'), buildItem('Home item 2')],
              } as UseChildrenHookType;
            }}
            itemPath={itemPath}
          />
        </>
      );
    },
    parents,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // current item
    expect(canvas.getByText(item.name)).toBeInTheDocument();

    // check parents
    for (const p of parents) {
      const b = canvas.getByText(p!.name);
      expect(b).toBeInTheDocument();
    }

    // 4 = 2 parents + 2 x Home
    expect(canvas.getAllByTestId(dataTestId)).toHaveLength(4);
  },
} satisfies Story;

const extraItems = (
  <ExtraItemsMenu
    name="Settings"
    // path="/settings"
    icon={<CogIcon />}
    menuItems={[
      { name: 'Information', path: '/info' },
      { name: 'Settings', path: '/settings' },
      { name: 'Publish', path: '/publish' },
    ]}
  />
);

export const FolderWithParentsWithExtraItems = {
  args: {
    itemPath,
    useChildren,
    item: folder,
    maxItems: 10,
    renderRoot: () => {
      return (
        <>
          <HomeMenu selected={menu[0]} elements={menu} />
          <ItemMenu
            itemId={item.id}
            useChildren={() => {
              return {
                data: [buildItem('Home item 1'), buildItem('Home item 2')],
              } as UseChildrenHookType;
            }}
            itemPath={itemPath}
          />
        </>
      );
    },
    parents,
    children: extraItems,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // current item
    expect(canvas.getByText(folder.name)).toBeInTheDocument();

    // check parents
    for (const p of parents) {
      const b = canvas.getByText(p!.name);
      expect(b).toBeInTheDocument();
    }

    // 4 = 2 parents + 2 x Home + current item is a folder + 1 extra item
    expect(canvas.getAllByTestId(dataTestId)).toHaveLength(5);
  },
} satisfies Story;
