import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';

import LinkUrlField from '~builder/components/item/form/link/LinkUrlField';

interface LinkItemMenuUrlProps {
  url: string;
  onUrlChange: (url: string) => void;
}

type Inputs = {
  url: string;
};

export function useLinkItemMenuUrl({ url, onUrlChange }: LinkItemMenuUrlProps) {
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
  };

  return {
    button: (
      <Button
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        URL
      </Button>
    ),
    modal: (
      <Dialog onClose={handleClose} open={open}>
        <FormProvider {...methods}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <LinkUrlField />
            </DialogContent>
            <DialogActions>
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
            </DialogActions>
          </Box>
        </FormProvider>
      </Dialog>
    ),
  };
}
