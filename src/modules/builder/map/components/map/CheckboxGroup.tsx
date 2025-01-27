import { ChangeEvent, type JSX } from 'react';

import { Checkbox, FormControlLabel, FormGroup, styled } from '@mui/material';

interface Props {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  list: any[];
}

const StyledFormControlLabel = styled(FormControlLabel)`
  .MuiFormControlLabel-label {
    font-size: 12px;
  }
  .MuiCheckbox-root {
    padding: 4px;
  }
`;

const CheckboxGroup = ({ list, handleChange }: Props): JSX.Element => (
  <FormGroup>
    {list.map((ele: { label: any }) => (
      <StyledFormControlLabel
        key={ele.label}
        control={<Checkbox checked onChange={handleChange} size="small" />}
        label={ele.label}
        name={ele.label}
      />
    ))}
  </FormGroup>
);

export default CheckboxGroup;
