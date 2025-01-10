import type { Meta, StoryObj } from '@storybook/react';

import { Navigator } from './Navigator';

const meta = {
  component: Navigator,
} satisfies Meta<typeof Navigator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {},
} satisfies Story;

// export const HomeRoot = {
//   args: {},

//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);

//     // 2 x Home
//     expect(canvas.getAllByTestId(dataTestId)).toHaveLength(2);
//   },
// } satisfies Story;

// export const FolderWithParents = {
//   args: {
//     buildToItemPath,
//     useChildren,
//     item: folder,

//     renderRoot: () => {
//       return (
//         <>
//           <HomeMenu selected={menu[0]} elements={menu} />
//           <ItemMenu
//             itemId={item.id}
//             useChildren={() => {
//               return {
//                 data: [buildItem('Home item 1'), buildItem('Home item 2')],
//               } as UseChildrenHookType;
//             }}
//             buildToItemPath={buildToItemPath}
//           />
//         </>
//       );
//     },
//     parents,
//   },

//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);

//     // current item
//     expect(canvas.getByText(folder.name)).toBeInTheDocument();

//     // check parents
//     for (const p of parents) {
//       const b = canvas.getByText(p!.name);
//       expect(b).toBeInTheDocument();
//     }

//     // 4 = 2 parents + 2 x Home + current item is a folder
//     expect(canvas.getAllByTestId(dataTestId)).toHaveLength(5);
//   },
// } satisfies Story;

// export const FileWithParents = {
//   args: {
//     buildToItemPath,
//     useChildren,
//     item,

//     renderRoot: () => {
//       return (
//         <>
//           <HomeMenu selected={menu[0]} elements={menu} />
//           <ItemMenu
//             itemId={item.id}
//             useChildren={() => {
//               return {
//                 data: [buildItem('Home item 1'), buildItem('Home item 2')],
//               } as UseChildrenHookType;
//             }}
//             buildToItemPath={buildToItemPath}
//           />
//         </>
//       );
//     },
//     parents,
//   },

//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);

//     // current item
//     expect(canvas.getByText(item.name)).toBeInTheDocument();

//     // check parents
//     for (const p of parents) {
//       const b = canvas.getByText(p!.name);
//       expect(b).toBeInTheDocument();
//     }

//     // 4 = 2 parents + 2 x Home
//     expect(canvas.getAllByTestId(dataTestId)).toHaveLength(4);
//   },
// } satisfies Story;

// const extraItems = [
//   {
//     name: 'Settings',
//     path: '/settings',
//     icon: <CogIcon />,
//     menuItems: [
//       { name: 'Information', path: '/info' },
//       { name: 'Settings', path: '/settings' },
//       { name: 'Publish', path: '/publish' },
//     ],
//   },
// ];

// export const FolderWithParentsWithExtraItems = {
//   args: {
//     buildToItemPath,
//     useChildren,
//     item: folder,
//     maxItems: 10,
//     renderRoot: () => {
//       return (
//         <>
//           <HomeMenu selected={menu[0]} elements={menu} />
//           <ItemMenu
//             itemId={item.id}
//             useChildren={() => {
//               return {
//                 data: [buildItem('Home item 1'), buildItem('Home item 2')],
//               } as UseChildrenHookType;
//             }}
//             buildToItemPath={buildToItemPath}
//           />
//         </>
//       );
//     },
//     parents,
//     extraItems,
//   },

//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);

//     // current item
//     expect(canvas.getByText(folder.name)).toBeInTheDocument();

//     // check parents
//     for (const p of parents) {
//       const b = canvas.getByText(p!.name);
//       expect(b).toBeInTheDocument();
//     }

//     // 4 = 2 parents + 2 x Home + current item is a folder + 1 extra item
//     expect(canvas.getAllByTestId(dataTestId)).toHaveLength(6);
//   },
// } satisfies Story;
