import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import {
  CROP_MODAL_CONFIRM_BUTTON_ID,
  IMAGE_PLACEHOLDER_FOLDER,
  IMAGE_THUMBNAIL_FOLDER,
  IMAGE_THUMBNAIL_UPLOADER,
  REMOVE_THUMBNAIL_BUTTON,
} from '@/config/selectors';

import ThumbnailCrop from './ThumbnailCrop';

const THUMBNAIL_MEDIUM_PATH = 'cypress/fixtures/thumbnails/medium.jpeg';
const THUMBNAIL_SMALL_PATH = 'cypress/fixtures/thumbnails/small.jpeg';

const meta: Meta<typeof ThumbnailCrop> = {
  title: 'Builder/ThumbnailCrop',
  component: ThumbnailCrop,
  args: {
    thumbnailSize: 120,
  },
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

const confirmCrop = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  const button = canvas.getByRole('button', {
    name: "Change the item's thumbnail",
  });

  await userEvent.click(button);
};

const uploadFile = async (input: HTMLInputElement, filePath: string) => {
  // Storybook test runner has `userEvent.upload`, but you can also
  // construct a File if your component doesn’t rely on path.
  const file = new File(['dummy'], filePath, { type: 'image/png' });
  await userEvent.upload(input, file);
};

export const NoImageSet_ImagePlaceholderVisible: Story = {
  name: 'No image – placeholder visible',
  args: {
    setChanges: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const onUpload = args.setChanges;

    // Placeholder should be visible
    expect(canvas.getByTestId(IMAGE_PLACEHOLDER_FOLDER)).toBeVisible();

    // Upload a new thumbnail
    await uploadFile(
      canvas.getByTestId(IMAGE_THUMBNAIL_UPLOADER),
      THUMBNAIL_MEDIUM_PATH,
    );
    await confirmCrop(canvasElement);

    await waitFor(() => {
      // expect(onUpload).toHaveBeenCalledTimes(1);

      // // Placeholder disappears
      // expect(
      //   canvas.getByTestId(IMAGE_PLACEHOLDER_FOLDER),
      // ).not.toBeInTheDocument();

      // Thumbnail becomes visible
      expect(canvas.getByTestId(IMAGE_THUMBNAIL_FOLDER)).toBeVisible();
    });
  },
};

export const ImageSet_ThumbnailVisible: Story = {
  name: 'Image set – thumbnail visible',
  args: {
    currentThumbnail: THUMBNAIL_MEDIUM_PATH,
    setChanges: fn(),
    onDelete: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Image element should be visible
    expect(canvas.getByTestId(IMAGE_THUMBNAIL_FOLDER)).toBeVisible();

    // Placeholder should not exist
    expect(
      canvas.getByTestId(IMAGE_PLACEHOLDER_FOLDER),
    ).not.toBeInTheDocument();
  },
};

export const ImageSet_UploadNewThumbnail: Story = {
  name: 'Image set – upload new thumbnail',
  args: {
    currentThumbnail: THUMBNAIL_MEDIUM_PATH,
    setChanges: fn(),
    onDelete: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const onUpload = args.setChanges as ReturnType<typeof fn>;

    await uploadFile(
      canvas.getByTestId(IMAGE_THUMBNAIL_UPLOADER),
      THUMBNAIL_SMALL_PATH,
    );
    await confirmCrop(canvasElement);

    await waitFor(() => {
      expect(onUpload).toHaveBeenCalledTimes(1);

      // Placeholder should not exist
      expect(
        canvas.getByTestId(IMAGE_PLACEHOLDER_FOLDER),
      ).not.toBeInTheDocument();

      // Thumbnail should be visible
      expect(canvas.getByTestId(IMAGE_THUMBNAIL_FOLDER)).toBeVisible();
    });
  },
};

export const ImageSet_RemoveThumbnail: Story = {
  name: 'Image set – remove thumbnail',
  args: {
    currentThumbnail: THUMBNAIL_MEDIUM_PATH,
    setChanges: fn(),
    onDelete: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const onDelete = args.onDelete;

    await userEvent.click(canvas.getByTestId(REMOVE_THUMBNAIL_BUTTON));

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledTimes(1);

      // Placeholder visible again
      expect(canvas.getByTestId(IMAGE_PLACEHOLDER_FOLDER)).toBeVisible();

      // Thumbnail removed
      expect(
        canvas.getByTestId(IMAGE_THUMBNAIL_FOLDER),
      ).not.toBeInTheDocument();
    });
  },
};
