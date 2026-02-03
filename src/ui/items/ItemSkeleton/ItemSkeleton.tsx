import type { JSX } from 'react';

import { Skeleton } from '@mui/material';

import { type ItemType } from '@/openapi/client';

import { SCREEN_MAX_HEIGHT } from '../../constants.js';

const SKELETON_COLLAPSE_HEIGHT = '3.5em';
const SKELETON_FOLDER_BUTTON_HEIGHT = '8.125em';

export type ItemSkeletonProps = {
  /**
   * prevent displaying skeleton if item is a folder
   */
  isChildren: boolean;
  isCollapsible?: boolean;
  itemType: ItemType;
  screenMaxHeight?: number;
};

const ItemSkeleton = ({
  isChildren,
  isCollapsible,
  itemType,
  screenMaxHeight,
}: ItemSkeletonProps): JSX.Element | null => {
  switch (true) {
    case isCollapsible: {
      return (
        <Skeleton
          variant="rectangular"
          width={'100%'}
          height={SKELETON_COLLAPSE_HEIGHT}
        />
      );
    }
    case itemType === 'folder' && isChildren: {
      return null;
    }
    case itemType === 'folder': {
      return (
        <Skeleton
          variant="rectangular"
          width={'100%'}
          height={SKELETON_FOLDER_BUTTON_HEIGHT}
        />
      );
    }
    case (['file', 'embeddedLink', 'app'] as ItemType[]).includes(itemType): {
      return (
        <Skeleton
          variant="rectangular"
          width={'100%'}
          height={screenMaxHeight || SCREEN_MAX_HEIGHT}
        />
      );
    }
    case itemType === 'document': {
      return (
        <>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </>
      );
    }
    default: {
      return <Skeleton variant="rectangular" width={'100%'} />;
    }
  }
};

export default ItemSkeleton;
