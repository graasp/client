import type { JSX } from 'react';

import { Dialog } from '@mui/material';

import type { GenericItem } from '@/openapi/client';

import ImportUsersDialogContent, {
  DIALOG_ID_LABEL,
} from './ImportUsersDialogContent';

type ImportUsersWithCSVDialogProps = {
  item: GenericItem;
  handleCloseModal: () => void;
  open: boolean;
};

const ImportUsersWithCSVDialog = ({
  item,
  handleCloseModal,
  open,
}: ImportUsersWithCSVDialogProps): JSX.Element => (
  <Dialog
    scroll="paper"
    onClose={handleCloseModal}
    aria-labelledby={DIALOG_ID_LABEL}
    open={open}
  >
    <ImportUsersDialogContent
      item={item}
      isFolder={item.type === 'folder'}
      handleClose={handleCloseModal}
    />
  </Dialog>
);
export default ImportUsersWithCSVDialog;
