import type { JSX } from 'react';

import { Typography } from '@mui/material';

import { DocumentItemType, getDocumentExtra } from '@graasp/sdk';

import TextDisplay from '@/ui/TextDisplay/TextDisplay.js';
import { withFlavor } from '@/ui/TextDisplay/withFlavor.js';

import withCollapse from '../Collapse/withCollapse.js';

export type DocumentItemProps = {
  id?: string;
  emptyMessage?: string;
  showEmpty?: boolean;
  /**
   * Show the item name as the Alert title
   */
  showTitle?: boolean;
  onCollapse?: (c: boolean) => void;
} & (
  | { showCollapse: true; item: DocumentItemType }
  | { showCollapse?: false; item: Pick<DocumentItemType, 'extra' | 'name'> }
);

const DocumentItem = ({
  id,
  item,
  emptyMessage = 'This document is empty…',
  showEmpty,
  showCollapse,
  showTitle,
  onCollapse,
}: DocumentItemProps): JSX.Element => {
  let component: JSX.Element;
  const extra = getDocumentExtra(item.extra);

  if (!extra?.content && showEmpty) {
    component = (
      <Typography
        variant="body2"
        sx={{ fontStyle: 'italic', color: 'lightgrey' }}
      >
        {emptyMessage}
      </Typography>
    );
  } else {
    component = withFlavor({
      content: <TextDisplay id={id} content={extra?.content} />,
      flavor: extra?.flavor,
      title: showTitle ? item?.name : undefined,
    });
  }

  if (showCollapse) {
    component = withCollapse({ item, onCollapse })(component);
  }

  return component;
};

export default DocumentItem;
