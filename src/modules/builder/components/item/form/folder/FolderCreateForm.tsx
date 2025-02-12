import { type JSX, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';

import { DiscriminatedItem, ItemGeolocation, ItemType } from '@graasp/sdk';

import { useParams } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import {
  FOLDER_FORM_DESCRIPTION_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
} from '@/config/selectors';
import Button from '@/ui/buttons/Button/Button';

import CancelButton from '~builder/components/common/CancelButton';

import ThumbnailCrop from '../../../thumbnails/ThumbnailCrop';
import { ItemNameField } from '../ItemNameField';
import { DescriptionForm } from '../description/DescriptionForm';

type Inputs = {
  name: string;
  description: string;
};

type FolderCreateFormProps = {
  onClose: () => void;
  parentId?: DiscriminatedItem['id'];
  geolocation?: Pick<ItemGeolocation, 'lat' | 'lng'>;
  previousItemId?: DiscriminatedItem['id'];
};

export function FolderCreateForm({
  onClose,
  geolocation,
  previousItemId,
}: Readonly<FolderCreateFormProps>): JSX.Element {
  const { itemId: parentId } = useParams({ strict: false });
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { t: translateCommon } = useTranslation(NS.Common);
  const methods = useForm<Inputs>();
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { isValid, isSubmitted },
  } = methods;

  const description = watch('description');
  const [thumbnail, setThumbnail] = useState<Blob>();

  const { mutateAsync: createItem } = mutations.usePostItem();

  async function onSubmit(data: Inputs) {
    try {
      await createItem({
        name: data.name,
        type: ItemType.FOLDER,
        description: data.description,
        thumbnail,
        parentId,
        geolocation,
        previousItemId,
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <FormProvider {...methods}>
      <Stack
        component="form"
        direction="column"
        onSubmit={handleSubmit(onSubmit)}
        flex={1}
      >
        <DialogTitle>
          {translateBuilder('CREATE_ITEM_NEW_FOLDER_TITLE')}
        </DialogTitle>
        <DialogContent>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            gap={2}
          >
            <ThumbnailCrop
              setChanges={({ thumbnail: image }) => {
                setThumbnail(image);
              }}
            />
            <ItemNameField required />
          </Stack>
          <DescriptionForm
            id={FOLDER_FORM_DESCRIPTION_ID}
            value={description}
            onChange={(newValue) => {
              setValue('description', newValue);
            }}
          />
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
      </Stack>
    </FormProvider>
  );
}
