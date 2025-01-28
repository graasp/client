import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from '@mui/material';

import { DescriptionPlacementType, DiscriminatedItem } from '@graasp/sdk';

import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import {
  EDIT_ITEM_MODAL_CANCEL_BUTTON_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
} from '@/config/selectors';

import CancelButton from '~builder/components/common/CancelButton';

import { ItemNameField } from '../ItemNameField';
import DescriptionPlacementForm from '../description/DescriptionPlacementForm';

type Inputs = {
  name: string;
  description: string;
  descriptionPlacement: DescriptionPlacementType;
};

export function LinkEditForm({
  item,
  onClose,
}: Readonly<{
  item: DiscriminatedItem;
  onClose: () => void;
}>) {
  const { t: translateCommon } = useTranslation(NS.Common);
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const methods = useForm<Inputs>({
    defaultValues: {
      name: item.name,
      description: item.description ?? '',
    },
  });
  const {
    handleSubmit,
    register,
    formState: { isValid, dirtyFields },
  } = methods;

  // TODO: use special endpoint for link
  const { mutateAsync: editItem } = mutations.useEditItem();
  async function onSubmit(data: Inputs) {
    try {
      await editItem({
        id: item.id,
        name: data.name,
        description: data.description,
        settings: { descriptionPlacement: data.descriptionPlacement },
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <ItemNameField required />
          <Stack spacing={2}>
            <TextField
              label={translateBuilder('DESCRIPTION.LABEL')}
              placeholder={translateBuilder('DESCRIPTION.PLACEHOLDER')}
              variant="filled"
              multiline
              minRows={3}
              maxRows={15}
              {...register('description')}
            />
            <DescriptionPlacementForm />
          </Stack>
        </DialogContent>
        <DialogActions>
          <CancelButton
            id={EDIT_ITEM_MODAL_CANCEL_BUTTON_ID}
            onClick={onClose}
          />
          <Button
            id={ITEM_FORM_CONFIRM_BUTTON_ID}
            variant="contained"
            type="submit"
            disabled={!isValid || !Object.keys(dirtyFields).length}
          >
            {translateCommon('SAVE.BUTTON_TEXT')}
          </Button>
        </DialogActions>
      </Box>
    </FormProvider>
  );
}
