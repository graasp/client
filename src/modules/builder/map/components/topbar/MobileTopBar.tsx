import React from 'react';
import { useMap } from 'react-leaflet';

import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';

import { COMMON } from '@graasp/translations';

import { useCommonTranslation, useMapTranslation } from '../../config/i18n';
import GeolocationPicker, {
  GeolocationPickerProps,
} from '../GeolocationPicker/GeolocationPicker';
import { useQueryClientContext } from '../context/QueryClientContext';
import Search from './Search';

type Props = { onChange: () => void; tags: string[] };

const MobileTopBar = ({ onChange, tags }: Props): JSX.Element => {
  const map = useMap();
  const { useSuggestionsForAddress, currentMember } = useQueryClientContext();
  const { t } = useMapTranslation();
  const { t: commonT } = useCommonTranslation();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChangeOption: GeolocationPickerProps['onChangeOption'] = ({
    lat,
    lng,
  }) => {
    map.flyTo({ lat, lng }, 10);
    setOpen(false);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label={t('filters')}
        onClick={handleClickOpen}
        role="search"
        sx={{ position: 'absolute', bottom: 20, right: 20 }}
      >
        <SearchIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('Filters')}</DialogTitle>
        <DialogContent>
          {currentMember && (
            <>
              <br />
              <GeolocationPicker
                useSuggestionsForAddress={useSuggestionsForAddress}
                onChangeOption={onChangeOption}
              />
              <br />
            </>
          )}
          <Search tags={tags} onChange={onChange} />
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{commonT(COMMON.CLOSE_BUTTON)}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default MobileTopBar;
