import { MimeTypes } from '@graasp/sdk';

import type { Meta, StoryObj } from '@storybook/react';

import { TABLE_CATEGORIES } from '../utils/storybook.js';
import ItemIcon from './ItemIcon.js';

const meta: Meta<typeof ItemIcon> = {
  title: 'Icons/ItemIcon',
  component: ItemIcon,

  argTypes: {
    color: {
      table: {
        category: TABLE_CATEGORIES.MUI,
      },
    },
    type: {
      control: 'radio',
      options: [
        'app',
        'page',
        'file',
        'document',
        'folder',
        'h5p',
        'embeddedLink',
        'shortcut',
        'etherpad',
        'upload',
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ItemIcon>;

export const Folder: Story = {
  args: {
    type: 'folder',
  },
};

export const Default: Story = {
  args: {
    type: 'folder',
    iconSrc: 'https://picsum.photos/100',
  },
};

export const ImageWithStyle: Story = {
  args: {
    type: 'folder',
    iconSrc: 'https://picsum.photos/200/100',
    size: '100px',
  },
};

export const Image: Story = {
  args: {
    type: 'file',
    mimetype: MimeTypes.Image.JPEG,
  },
};

export const Video: Story = {
  args: {
    type: 'file',
    mimetype: MimeTypes.Video.MP4,
  },
};

export const Audio: Story = {
  args: {
    type: 'file',
    mimetype: MimeTypes.Audio.MP3,
  },
};

export const PDF: Story = {
  args: {
    type: 'file',
    mimetype: MimeTypes.PDF,
  },
};

export const ZIP: Story = {
  args: {
    type: 'file',
    mimetype: MimeTypes.ZIP,
  },
};

export const App: Story = {
  args: {
    type: 'app',
  },
};

export const H5P: Story = {
  name: 'H5P',
  args: {
    type: 'h5p',
  },
};

export const Link: Story = {
  args: {
    type: 'embeddedLink',
  },
};

export const Shortcut: Story = {
  args: {
    type: 'shortcut',
  },
};

export const EtherPad: Story = {
  args: {
    type: 'etherpad',
  },
};

export const FancyImage: Story = {
  args: {
    type: 'file',
    color: 'red',
    size: '3rem',
    mimetype: MimeTypes.Image.JPEG,
  },
};
