import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Tooltip } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import { useMapTranslation } from '../../config/i18n';
import { useQueryClientContext } from '../context/QueryClientContext';

type Props = {
  item: DiscriminatedItem;
};

const ViewButton = ({ item }: Props): JSX.Element => {
  const { viewItem } = useQueryClientContext();
  const { t } = useMapTranslation();

  return (
    <Tooltip title={t('VIEW_ITEM_PLAYER_TOOLTIP')}>
      <IconButton
        onClick={() => {
          viewItem(item);
        }}
      >
        <VisibilityIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ViewButton;
