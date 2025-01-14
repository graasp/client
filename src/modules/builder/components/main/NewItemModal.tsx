import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import { DiscriminatedItem, ItemGeolocation, ItemType } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { getRouteApi } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { CREATE_ITEM_CLOSE_BUTTON_ID } from '@/config/selectors';

import { InternalItemType, NewItemTabType } from '../../config/types';
import { BUILDER } from '../../langs/constants';
import { EtherpadForm } from '../item/form/EtherpadForm';
import AppForm from '../item/form/app/AppForm';
import { DocumentCreateForm } from '../item/form/document/DocumentCreateForm';
import { UploadFileModalContent } from '../item/form/file/UploadFileModalContent';
import { FolderCreateForm } from '../item/form/folder/FolderCreateForm';
import { LinkForm } from '../item/form/link/LinkForm';
import ImportH5P from './ImportH5P';
import ImportZip from './ImportZip';
import ItemTypeTabs from './ItemTypeTabs';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  paddingLeft: 0,
  paddingRight: 0,
}));

const itemRoute = getRouteApi('/builder/_layout/items/$itemId');

type Props = {
  open: boolean;
  handleClose: () => void;
  geolocation?: Pick<ItemGeolocation, 'lat' | 'lng'>;
  previousItemId?: DiscriminatedItem['id'];
};

const NewItemModal = ({
  open,
  handleClose,
  geolocation,
  previousItemId,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useTranslation(NS.Builder);

  const [selectedItemType, setSelectedItemType] = useState<NewItemTabType>(
    ItemType.LOCAL_FILE,
  );

  const { itemId: parentId } = itemRoute.useParams();

  // folders, apps, files, documents, etherpad and links are handled beforehand
  const renderContent = () => {
    if (selectedItemType === InternalItemType.ZIP) {
      return (
        <>
          <Typography variant="h6" color="primary">
            {translateBuilder(BUILDER.IMPORT_ZIP_TITLE)}
          </Typography>
          <ImportZip />
        </>
      );
    }
    return null;
  };

  // folders, etherpad and links, documents are handled before
  const renderActions = () => {
    if (selectedItemType === InternalItemType.ZIP) {
      return (
        <Button id={CREATE_ITEM_CLOSE_BUTTON_ID} onClick={handleClose}>
          {translateBuilder('CLOSE_BUTTON')}
        </Button>
      );
    }
    return null;
  };

  // temporary solution to wrap content and actions
  const renderContentWithWrapper = () => {
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
      default: {
        content = renderContent();
      }
    }

    return (
      <>
        <StyledDialogContent>
          <Stack direction="column" px={2} width="100%" overflow="hidden">
            {content}
          </Stack>
        </StyledDialogContent>
        <DialogActions>{renderActions()}</DialogActions>
      </>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Stack direction="row">
        <Stack>
          <ItemTypeTabs
            onTypeChange={setSelectedItemType}
            initialValue={selectedItemType}
          />
        </Stack>
        <Stack width="100%">{renderContentWithWrapper()}</Stack>
      </Stack>
    </Dialog>
  );
};

export default NewItemModal;
