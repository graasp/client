import { type JSX, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';

import { Box } from '@mui/material';

import {
  UUID,
  getIframeResizeHeightCookie,
  setIframeResizeHeightCookie,
} from '@graasp/sdk';

import { IFRAME_MIN_HEIGHT } from '../constants.js';
import ResizingIcon from '../icons/ResizingIcon.js';

export type WithResizingProps = {
  height: string | number;
  component: JSX.Element;
  memberId?: UUID;
  itemId: UUID;
};

const resizeHandleStyles = {
  resizeHandleComponent: {
    height: '24px',
    bottom: '-32px',
    width: '23px',
    marginRight: 'auto',
    marginLeft: 'auto',
    left: '0',
    right: '0',
  },
};

const withResizing =
  <P extends object>({
    height,
    component,
    memberId,
    itemId,
  }: WithResizingProps): ((props: P) => JSX.Element) =>
  () => {
    const [variableHeight, setVariableHeight] = useState<number | string>(
      getIframeResizeHeightCookie({ memberId, itemId }) ?? height,
    );

    useEffect(() => {
      setIframeResizeHeightCookie({ memberId, itemId }, variableHeight);
    }, [variableHeight]);

    return (
      <Box
        width="100%"
        sx={{
          paddingBottom: '35px',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        <Rnd
          style={{ position: 'relative' }}
          disableDragging
          enableResizing={{ bottom: true }}
          default={{
            width: '100%',
            height: variableHeight,
            x: 0,
            y: 0,
          }}
          minHeight={IFRAME_MIN_HEIGHT}
          resizeHandleComponent={{ bottom: <ResizingIcon /> }}
          resizeHandleStyles={{
            bottom: resizeHandleStyles.resizeHandleComponent,
          }}
          onResizeStop={(_e, _direction, ref) => {
            setVariableHeight(ref.style.height);
          }}
        >
          {component}
        </Rnd>
      </Box>
    );
  };

export default withResizing;
