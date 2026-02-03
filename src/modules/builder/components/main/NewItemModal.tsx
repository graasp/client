import { type JSX, ReactNode, useState } from 'react';

import { Dialog, Stack } from '@mui/material';

import { DiscriminatedItem, ItemGeolocation } from '@graasp/sdk';

import { useParams } from '@tanstack/react-router';

import { InternalItemType, NewItemTabType } from '../../types';
import AppForm from '../item/form/app/AppForm';
import { DocumentCreateForm } from '../item/form/document/DocumentCreateForm';
import { EtherpadForm } from '../item/form/etherpad/EtherpadForm';
import { UploadFileModalContent } from '../item/form/file/UploadFileModalContent';
import { FolderCreateForm } from '../item/form/folder/FolderCreateForm';
import { LinkForm } from '../item/form/link/LinkForm';
import ImportH5P from './ImportH5P';
import { ImportZipForm } from './ImportZipForm';
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
  const { itemId: parentId } = useParams({ strict: false });
  let content: ReactNode = null;

  switch (selectedItemType) {
    case 'folder': {
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
    case 'embeddedLink': {
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
    case 'app': {
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
    case 'document': {
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
    case 'etherpad': {
      content = <EtherpadForm onClose={handleClose} parentId={parentId} />;
      break;
    }
    case 'h5p': {
      content = (
        <ImportH5P onClose={handleClose} previousItemId={previousItemId} />
      );
      break;
    }
    case 'file': {
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
      content = <ImportZipForm onClose={handleClose} />;
    }
  }

  return (
    <Stack direction="column" width="100%" overflow="hidden">
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
  const [selectedItemType, setSelectedItemType] =
    useState<NewItemTabType>('file');

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
