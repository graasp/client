import { MouseEvent } from 'react';

import { styled } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { Tag } from '../../types';

const StyledTagGroup = styled(ToggleButtonGroup)(() => ({
  display: 'flex',
  flexWrap: 'wrap',
}));
const StyledTagButton = styled(ToggleButton)(() => ({
  padding: '5px 5px',
  margin: '2px 5px',
  fontSize: '10px',
}));

type Props = {
  items: Tag[];
  value: string[];
  setValue: (ele: string[]) => void;
};

type Item = {
  name: string;
};
const ToggleButtonsMultiple = ({
  items,
  value,
  setValue,
}: Props): JSX.Element => {
  const handleSelect = (_event: MouseEvent<HTMLElement>, ele: string[]) => {
    setValue(ele);
  };

  return (
    <StyledTagGroup
      value={value}
      onChange={handleSelect}
      aria-label="text formatting"
      size="small"
    >
      {items.map((item: Item) => (
        <StyledTagButton
          key={item.name}
          value={item.name}
          aria-label={item.name}
        >
          {item.name}
        </StyledTagButton>
      ))}
    </StyledTagGroup>
  );
};

export default ToggleButtonsMultiple;
