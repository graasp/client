import { MenuItem, Select, type SelectProps } from '@mui/material';

import { type Layout } from '../LinkItemNode';

type Props = {
  layout: string;
  onLayoutChange: (layout: Layout) => void;
};

export function LinkItemType({ layout, onLayoutChange }: Readonly<Props>) {
  const onChange: SelectProps['onChange'] = (event) => {
    onLayoutChange(event.target.value as Layout);
  };

  return (
    <>
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
        <MenuItem value="button">Button</MenuItem>
        <MenuItem value="embed">Embed</MenuItem>
        <MenuItem value="text">Link</MenuItem>
      </Select>
    </>
  );
}
