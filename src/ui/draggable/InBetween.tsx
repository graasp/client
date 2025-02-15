// we could replace dnd with this https://docs.dndkit.com
import { type JSX, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

import { Box } from '@mui/material';

import type { DraggableAndDroppableProps, DroppedFile } from './types.js';

export type InBetweenProps<T> = {
  previousRow?: T;
  enableMoveInBetween: boolean;
  onDrop: (draggedRow: T | DroppedFile, previous?: T) => void;
  renderComponent: (
    el: T | DroppedFile,
    args: DraggableAndDroppableProps,
  ) => JSX.Element;
  allowFiles?: boolean;
};

const InBetween = <T extends object>({
  previousRow,
  onDrop,
  enableMoveInBetween,
  renderComponent,
  allowFiles = true,
}: InBetweenProps<T>): JSX.Element => {
  const dropRef = useRef<HTMLDivElement>(null);
  const accept = ['row'];
  if (allowFiles) {
    accept.push(NativeTypes.FILE);
  }
  const [{ isOver, data }, drop] = useDrop(
    () => ({
      accept,
      drop: (draggedRow: T | DroppedFile) => {
        return onDrop(draggedRow, previousRow);
      },
      canDrop: () => enableMoveInBetween,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
        data: monitor.getItem(),
      }),
    }),
    [onDrop],
  );
  // this is a patch for making the drop connector work with react19
  // ref: https://arc.net/l/quote/qeobtkbh
  // https://github.com/react-dnd/react-dnd/issues/3655
  drop(dropRef);

  const spacing = 12;

  return (
    <Box ref={dropRef}>
      {(!isOver || !enableMoveInBetween) && (
        <Box style={{ padding: 0, height: spacing, width: '100%' }} />
      )}
      {isOver && enableMoveInBetween && (
        <Box
          sx={{
            opacity: 0.5,
            paddingTop: spacing / 8,
            paddingBottom: spacing / 8,
          }}
        >
          {renderComponent(data, {
            isOver: false,
            isDragging: false,
            isMovable: false,
          })}
        </Box>
      )}
    </Box>
  );
};

export default InBetween;
