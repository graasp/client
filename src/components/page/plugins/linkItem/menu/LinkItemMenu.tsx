import { Ref } from 'react';

import { Box, MenuItem, Select } from '@mui/material';

import { type Layout } from '../LinkItemNode';
import LinkItemMenuUrl from './LinkItemMenuUrl';

type Props = {
  ref: Ref<HTMLDivElement>;
  layout: string;
  url: string;
  onLayoutChange: (layout: Layout) => void;
  close: () => void;
  setIsFocused: (isFocused: boolean) => void;
  onUrlChange: (url: string) => void;
};

function LinkItemMenu({
  ref,
  layout,
  url,
  onLayoutChange,
  close,
  setIsFocused,
  onUrlChange,
}: Readonly<Props>) {
  const onChange = (event) => {
    onLayoutChange(event.target.value as Layout);

    // hack to manually close modal if mouse happen to be outside of element because of dropdown
    close();
  };

  return (
    <>
      <Box
        ref={ref}
        sx={{
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            zIndex: 9999,
            top: -35,
            boxShadow: '0 4px 10px lightgrey',
            background: 'white',
            mb: 1,
          }}
          borderRadius={2}
          width="fit-content"
          py={1}
          px={2}
        >
          <Select
            disableUnderline
            variant="standard"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={layout}
            label="Age"
            onChange={onChange}
            size="small"
          >
            <MenuItem value={'button'}>Button</MenuItem>
            <MenuItem value={'iframe'}>Iframe</MenuItem>
            <MenuItem value={'text'}>Link</MenuItem>
          </Select>
          <LinkItemMenuUrl
            url={url}
            setIsFocused={setIsFocused}
            onUrlChange={onUrlChange}
          />
        </Box>
      </Box>
    </>
  );
}

export default LinkItemMenu;
