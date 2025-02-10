import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Stack, Typography } from '@mui/material';

import { DiscriminatedItem, ItemGeolocation, ItemType } from '@graasp/sdk';

import { useParams } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { CREATE_ITEM_CLOSE_BUTTON_ID } from '@/config/selectors';
import Button from '@/ui/buttons/Button/Button';

import { BUILDER } from '../../langs';
import { InternalItemType, NewItemTabType } from '../../types';
import { EtherpadForm } from '../item/form/EtherpadForm';
import AppForm from '../item/form/app/AppForm';
import { DocumentCreateForm } from '../item/form/document/DocumentCreateForm';
import { UploadFileModalContent } from '../item/form/file/UploadFileModalContent';
import { FolderCreateForm } from '../item/form/folder/FolderCreateForm';
import { LinkForm } from '../item/form/link/LinkForm';
import ImportH5P from './ImportH5P';
import ImportZip from './ImportZip';
import ItemTypeTabs from './ItemTypeTabs';

type Props = {
  open: boolean;
  handleClose: () => void;
  geolocation?: Pick<ItemGeolocation, 'lat' | 'lng'>;
  previousItemId?: DiscriminatedItem['id'];
};

function NewItemModalContent({
  selectedItemType,
  handleClose,
  geolocation,
  previousItemId,
}: Readonly<
  Omit<Props, 'open'> & {
    selectedItemType: NewItemTabType;
  }
>) {
  const { t: translateBuilder } = useTranslation(NS.Builder);

  const { itemId: parentId } = useParams({ strict: false });
  let content = null;

  switch (selectedItemType) {
    case ItemType.FOLDER: {
      content = (
        <FolderCreateForm
          onClose={handleClose}
          geolocation={geolocation}
          parentId={parentId}
          previousItemId={previousItemId}
        />
      );
      break;
    }
    case ItemType.LINK: {
      content = (
        <LinkForm
          onClose={handleClose}
          geolocation={geolocation}
          parentId={parentId}
          previousItemId={previousItemId}
        />
      );
      break;
    }
    case ItemType.APP: {
      content = (
        <AppForm
          onClose={handleClose}
          geolocation={geolocation}
          parentId={parentId}
          previousItemId={previousItemId}
        />
      );
      break;
    }
    case ItemType.DOCUMENT: {
      content = (
        <DocumentCreateForm
          onClose={handleClose}
          geolocation={geolocation}
          parentId={parentId}
          previousItemId={previousItemId}
        />
      );
      break;
    }
    case ItemType.ETHERPAD: {
      content = <EtherpadForm onClose={handleClose} parentId={parentId} />;
      break;
    }
    case ItemType.H5P: {
      content = (
        <ImportH5P onClose={handleClose} previousItemId={previousItemId} />
      );
      break;
    }
    case ItemType.S3_FILE:
    case ItemType.LOCAL_FILE: {
      content = (
        <UploadFileModalContent
          previousItemId={previousItemId}
          onClose={handleClose}
        />
      );
      break;
    }
    case InternalItemType.ZIP:
    default: {
      content = (
        <>
          <Typography variant="h6" color="primary">
            {translateBuilder(BUILDER.IMPORT_ZIP_TITLE)}
          </Typography>
          <ImportZip />
          <Button id={CREATE_ITEM_CLOSE_BUTTON_ID} onClick={handleClose}>
            {translateBuilder('CLOSE_BUTTON')}
          </Button>
        </>
      );
    }
  }

  return (
    <Stack direction="column" px={2} width="100%" overflow="hidden">
      {content}
    </Stack>
  );
}

const NewItemModal = ({
  open,
  handleClose,
  geolocation,
  previousItemId,
}: Props): JSX.Element => {
  const [selectedItemType, setSelectedItemType] = useState<NewItemTabType>(
    ItemType.LOCAL_FILE,
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Stack direction="row" width="100%">
        <ItemTypeTabs
          onTypeChange={setSelectedItemType}
          initialValue={selectedItemType}
        />
        <NewItemModalContent
          handleClose={handleClose}
          selectedItemType={selectedItemType}
          geolocation={geolocation}
          previousItemId={previousItemId}
        />
      </Stack>
    </Dialog>
  );
};

export default NewItemModal;
