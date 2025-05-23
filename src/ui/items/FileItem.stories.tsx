import {
  DescriptionPlacement,
  FileItemFactory,
  ItemType,
  MaxWidth,
  MemberFactory,
  MimeTypes,
  UnionOfConst,
} from '@graasp/sdk';

import type { Meta, StoryObj } from '@storybook/react';

import FileItem from './FileItem.js';

const meta = {
  title: 'Items/FileItem',
  component: FileItem,

  render: (args, { loaded: { content } }) => {
    return <FileItem {...args} content={content} />;
  },
} satisfies Meta<typeof FileItem>;

export default meta;

type Story = StoryObj<typeof meta>;

const buildImageStory = (
  descriptionPlacement?: UnionOfConst<typeof DescriptionPlacement>,
): Story =>
  ({
    loaders: [
      async () => ({
        content: await fetch('/test-assets/small_photo.jpg').then((r) =>
          r.blob(),
        ),
      }),
    ],
    args: {
      item: FileItemFactory({
        id: 'my-id',
        name: 'my item name',
        extra: {
          [ItemType.FILE]: {
            path: '/test-assets/small_photo.jpg',
            mimetype: MimeTypes.Image.PNG,
            name: 'original file name',
            size: 2600,
            altText: 'my image alt text',
            content: '',
          },
        },
        type: ItemType.FILE,
        description: 'my image description',
        path: 'item-path',
        settings: descriptionPlacement ? { descriptionPlacement } : {},
        creator: MemberFactory(),
      }),
    },
  }) satisfies Story;

export const Image = buildImageStory();

export const ImageDescriptionAbove = buildImageStory(
  DescriptionPlacement.ABOVE,
);

export const BigContainedImage = {
  loaders: [
    async () => ({
      content: await fetch('/test-assets/big_photo.jpg').then((r) => r.blob()),
    }),
  ],
  args: {
    item: FileItemFactory({
      id: 'my-id',
      name: 'my item name',
      extra: {
        [ItemType.FILE]: {
          path: '/test-assets/big_photo.jpg',
          mimetype: MimeTypes.Image.PNG,
          name: 'original file name',
          size: 2600,
          altText: 'my image alt text',
          content: '',
        },
      },
      type: ItemType.FILE,
      description:
        'This image is really big but is constrained to its container',
      path: 'item-path',
      settings: {
        maxWidth: MaxWidth.Small,
      },
      creator: MemberFactory(),
    }),
  },
} satisfies Story;

export const SmallContainedImage = {
  loaders: [
    async () => ({
      content: await fetch('/test-assets/small_photo.jpg').then((r) =>
        r.blob(),
      ),
    }),
  ],
  args: {
    item: FileItemFactory({
      id: 'my-id',
      name: 'my item name',
      extra: {
        [ItemType.FILE]: {
          path: '/test-assets/small_photo.jpg',
          mimetype: MimeTypes.Image.PNG,
          name: 'original file name',
          size: 2600,
          altText: 'my image alt text',
          content: '',
        },
      },
      type: ItemType.FILE,
      description:
        'This image is small but is constrained to its big container',
      path: 'item-path',
      settings: {
        maxWidth: MaxWidth.Large,
      },
      creator: MemberFactory(),
    }),
  },
} satisfies Story;

export const ImageSVG = {
  loaders: [
    async () => ({
      content: await fetch('/test-assets/test.svg').then((r) => r.blob()),
    }),
  ],
  args: {
    item: FileItemFactory({
      id: 'my-id',
      name: 'my item name',
      extra: {
        [ItemType.FILE]: {
          path: '/test-assets/test.svg',
          mimetype: MimeTypes.Image.SVG, // Should be image/svg+xml
          name: 'original file name',
          size: 2600,
          altText: 'my svg alt text',
          content: '',
        },
      },
      type: ItemType.FILE,
      description: 'my svg description',
      path: 'item-path',
      settings: {},
      creator: MemberFactory(),
    }),
  },
} satisfies Story;

export const ImageWebP = {
  loaders: [
    async () => ({
      content: await fetch('/test-assets/test.webp').then((r) => r.blob()),
    }),
  ],
  args: {
    item: FileItemFactory({
      id: 'my-id',
      name: 'my item name',
      extra: {
        [ItemType.FILE]: {
          path: '/test-assets/test.webp',
          mimetype: MimeTypes.Image.WEBP, // Should be image/svg+xml
          name: 'original file name',
          size: 2600,
          altText: 'my webp alt text',
          content: '',
        },
      },
      type: ItemType.FILE,
      description: 'my webp description',
      path: 'item-path',
      settings: {},
      creator: MemberFactory(),
    }),
  },
} satisfies Story;

export const WAVAudio = {
  loaders: [
    async () => ({
      content: await fetch('/test-assets/sample.wav').then((r) => r.blob()),
    }),
  ],
  args: {
    item: FileItemFactory({
      id: 'my-id',
      name: 'my item name',
      extra: {
        [ItemType.FILE]: {
          path: '/test-assets/sample.wav',
          mimetype: MimeTypes.Audio.WAV, // Should be audio/wav
          name: 'original file name',
          size: 10000000,
          content: '',
        },
      },
      type: ItemType.FILE,
      description: 'my audio description',
      path: 'item-path',
      settings: {},
      creator: MemberFactory(),
    }),
  },
} satisfies Story;
