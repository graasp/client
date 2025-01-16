import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { ITEM_FORM_CONFIRM_BUTTON_ID } from '@/config/selectors';
import Button from '@/ui/buttons/Button/Button';

import { CancelButton } from '~builder/components/common/CancelButton';

import { BUILDER } from '../../../langs';
import { ItemNameField } from './ItemNameField';

type Inputs = { name: string };

export function EtherpadForm({
  parentId,
  onClose,
}: Readonly<{
  parentId?: DiscriminatedItem['id'];
  onClose: () => void;
}>): JSX.Element {
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { mutateAsync: postEtherpad } = mutations.usePostEtherpad();
  const { t: translateCommon } = useTranslation(NS.Common);

  const methods = useForm<Inputs>();
  const {
    handleSubmit,
    formState: { isSubmitted, isValid },
  } = methods;
  const onSubmit = async (data: Inputs) => {
    await postEtherpad({ parentId, name: data.name });

    onClose();
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {translateBuilder(BUILDER.CREATE_NEW_ITEM_ETHERPAD_TITLE)}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {translateBuilder(BUILDER.CREATE_NEW_ITEM_ETHERPAD_INFORMATIONS)}
          </Typography>
          <ItemNameField required />
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={onClose} />
          <Button
            id={ITEM_FORM_CONFIRM_BUTTON_ID}
            type="submit"
            disabled={isSubmitted && !isValid}
          >
            {translateCommon('SAVE.BUTTON_TEXT')}
          </Button>
        </DialogActions>
      </Box>
    </FormProvider>
  );
}
