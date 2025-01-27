import { type JSX, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
} from '@mui/material';

import { Context } from '@graasp/sdk';

import { Info } from 'lucide-react';

import { NS } from '@/config/constants';
import { useButtonColor } from '@/ui/buttons/hooks';

import {
  SELECT_VIEW_ID,
  SELECT_VIEW_RENDERED_TEXT_ID,
  buildSelectViewId,
} from '~analytics/config/selectors';
import {
  ActionViewContext,
  ActionViewContextUnion,
} from '~analytics/constants';
import { ViewDataContext } from '~analytics/context/ViewDataProvider';

const ViewSelect = (): JSX.Element => {
  const { t } = useTranslation(NS.Analytics);
  const { t: enumT } = useTranslation(NS.Enums);
  const { color } = useButtonColor('primary');

  const { view, setView } = useContext(ViewDataContext);

  const handleChange = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    setView(value);
  };

  let viewMessage = '';
  switch (view) {
    case Context.Builder:
      viewMessage = t('VIEW_BUILDER_TOOLTIP');
      break;
    case Context.Player:
      viewMessage = t('VIEW_PLAYER_TOOLTIP');
      break;
    case Context.Library:
      viewMessage = t('VIEW_LIBRARY_TOOLTIP');
      break;
    default:
      break;
  }
  return (
    <Stack
      direction="row"
      alignItems="center"
      width="100%"
      spacing={1}
      maxWidth={{ xs: '100%', sm: '300px' }}
    >
      <FormControl fullWidth>
        <InputLabel id="viewLabel">{t('VIEWS_SELECT')}</InputLabel>
        <Select
          id={SELECT_VIEW_ID}
          label={t('VIEWS_SELECT')}
          labelId="viewLabel"
          value={view}
          onChange={handleChange}
          renderValue={(selected: ActionViewContextUnion) => (
            <span
              id={SELECT_VIEW_RENDERED_TEXT_ID}
              style={{ textTransform: 'capitalize' }}
            >
              {enumT(selected)}
            </span>
          )}
        >
          {Object.values(ActionViewContext).map((c) => (
            <MenuItem
              key={c}
              sx={{ textTransform: 'capitalize' }}
              value={c}
              id={buildSelectViewId(c)}
            >
              {enumT(c)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Tooltip title={viewMessage}>
        <Info color={color} />
      </Tooltip>
    </Stack>
  );
};

export default ViewSelect;
