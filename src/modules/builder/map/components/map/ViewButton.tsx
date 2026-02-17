import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Tooltip } from '@mui/material';

import { NS } from '@/config/constants';
import type { GenericItem } from '@/openapi/client';

import { useQueryClientContext } from '../context/QueryClientContext';

type Props = {
  itemId: GenericItem['id'];
};

const ViewButton = ({ itemId }: Props): JSX.Element => {
  const { viewItem } = useQueryClientContext();
  const { t } = useTranslation(NS.Map);

  return (
    <Tooltip title={t('VIEW_ITEM_PLAYER_TOOLTIP')}>
      <IconButton
        onClick={() => {
          viewItem(itemId);
        }}
      >
        <VisibilityIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ViewButton;
