import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Box, Button, Popover, Stack } from '@mui/material';

import LinkUrlField from '~builder/components/item/form/link/LinkUrlField';

interface LinkItemMenuUrlProps {
  url: string;
  setIsFocused: (focused: boolean) => void;
  onUrlChange: (url: string) => void;
}

type Inputs = {
  url: string;
};

function LinkItemMenuUrl({
  url,
  setIsFocused,
  onUrlChange,
}: LinkItemMenuUrlProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const methods = useForm<Inputs>({
    defaultValues: { url },
  });
  const {
    handleSubmit,
    formState: { isValid, isSubmitted },
  } = methods;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onSubmit = (event: Inputs) => {
    onUrlChange(event.url);

    handleClose();
    // hack to manually close modal if mouse happen to be outside of element because of dropdown
    // close();
  };

  return (
    <>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        URL
      </Button>
      <Popover onClose={handleClose} open={open} anchorEl={anchorEl}>
        <Box p={2} component="form" onSubmit={handleSubmit(onSubmit)}>
          <FormProvider {...methods}>
            <LinkUrlField
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
            />
            <Stack direction="row" justifyContent="flex-end">
              <Button size="small" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                type="submit"
                disabled={isSubmitted && !isValid}
              >
                Update
              </Button>
            </Stack>
          </FormProvider>
        </Box>
      </Popover>
    </>
  );
}

export default LinkItemMenuUrl;
