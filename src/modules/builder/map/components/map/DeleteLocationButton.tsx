import { useState } from 'react';

import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import {
  DialogActions,
  DialogContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import { DiscriminatedItem } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useCommonTranslation, useMapTranslation } from '../../config/i18n';
import { MAP } from '../../langs/constants';
import { useQueryClientContext } from '../context/QueryClientContext';

export interface Props {
  item: DiscriminatedItem;
}

const DeleteLocationButton = ({ item }: Props): JSX.Element => {
  const { t } = useMapTranslation();
  const { t: translateCommon } = useCommonTranslation();
  const { useDeleteItemGeolocation } = useQueryClientContext();
  const { mutate: deleteLocation } = useDeleteItemGeolocation();
  const [open, setOpen] = useState(false);

  const onClick = () => {
    setOpen(true);
  };

  const onDelete = () => {
    deleteLocation({ itemId: item.id });
    setOpen(false);
  };

  const handleClose = () => {
    // onClose(selectedValue);
    setOpen(false);
    // setSelectedValue(selectedValue);
  };

  return (
    <>
      <Tooltip title="Delete Item Location">
        <IconButton onClick={onClick}>
          <WrongLocationIcon />
        </IconButton>
      </Tooltip>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>{t(MAP.DELETE_ITEM_LOCATION_TITLE)}</DialogTitle>
        <DialogContent>
          {t(MAP.DELETE_ITEM_LOCATION_EXPLANATION, { name: item.name })}
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setOpen(false)}>
            {translateCommon(COMMON.CANCEL_BUTTON)}
          </Button>
          <Button color="error" onClick={onDelete}>
            {t(MAP.DELETE_ITEM_LOCATION_BUTTON)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default DeleteLocationButton;
