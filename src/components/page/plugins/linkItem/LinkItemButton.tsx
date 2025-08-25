import { FormProvider, useForm } from 'react-hook-form';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import useModalStatus from '~builder/components/hooks/useModalStatus';
import LinkUrlField from '~builder/components/item/form/link/LinkUrlField';

import { INSERT_LINK_ITEM_COMMAND } from './LinkItemPlugin';

type Inputs = {
  url: string;
};

export function LinkItemButton() {
  const [editor] = useLexicalComposerContext();
  const { isOpen, closeModal, openModal } = useModalStatus();

  const methods = useForm<Inputs>({});
  const {
    handleSubmit,
    formState: { isValid, isSubmitted },
  } = methods;

  const onSubmit = (data: Inputs) => {
    editor.dispatchCommand(INSERT_LINK_ITEM_COMMAND, {
      url: data.url,
    });

    closeModal();
  };

  return (
    <>
      <Button size="small" variant="outlined" onClick={openModal}>
        Insert a link
      </Button>
      <Dialog onClose={closeModal} open={isOpen}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <FormProvider {...methods}>
            <DialogTitle>Insert a link</DialogTitle>
            <DialogContent>
              <LinkUrlField />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeModal}>Cancel</Button>
              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitted && !isValid}
              >
                Insert
              </Button>
            </DialogActions>
          </FormProvider>
        </Box>
      </Dialog>
    </>
  );
}
