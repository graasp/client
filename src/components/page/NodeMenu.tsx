import { JSX, ReactNode } from 'react';

import { Box } from '@mui/material';

import { ElementFormatType } from 'lexical';

export function NodeMenu({
  format,
  isSelected,
  children,
}: {
  children: ReactNode;
  isSelected: boolean;
  format?: ElementFormatType;
}): JSX.Element {
  return (
    <Box>
      {isSelected && (
        <Box
          className="menu-wrapper"
          sx={{
            justifyItems: format ? format : undefined,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              zIndex: 9999,
              top: -70,
              boxShadow: '0 4px 10px lightgrey',
              background: 'white',
              mb: 1,
            }}
            borderRadius={2}
            width="fit-content"
            py={1}
            px={2}
          >
            {children}
          </Box>
        </Box>
      )}
    </Box>
  );
}
