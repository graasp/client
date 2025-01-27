import { ChangeEvent, type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';

import { ExportActionsFormatting } from '@graasp/sdk';

import { getRouteApi } from '@tanstack/react-router';
import { Braces, Grid3X3 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';

import {
  EXPORT_ACTIONS_BUTTON_ID,
  buildSelectExportFormatID,
} from '~analytics/config/selectors';

const SelectFormatRadio = ({
  icon,
  title,
  description,
}: {
  icon: JSX.Element;
  title: ExportActionsFormatting;
  description: string;
}) => (
  <FormControlLabel
    control={<Radio value={title} />}
    id={buildSelectExportFormatID(title)}
    label={
      <>
        <Box display="flex" alignItems="center" gap={0.5}>
          {icon}
          {title}
        </Box>
        <Typography variant="caption">{description}</Typography>
      </>
    }
  />
);

const itemApi = getRouteApi('/analytics/items/$itemId/export');

export function ExportData(): JSX.Element {
  const { t } = useTranslation(NS.Analytics);
  const [format, setFormat] = useState(ExportActionsFormatting.CSV);

  const [isFormatExported, setIsFormatExported] = useState({
    [ExportActionsFormatting.CSV]: false,
    [ExportActionsFormatting.JSON]: false,
  });

  const { mutate: exportActions } = mutations.useExportActions();

  const { itemId } = itemApi.useParams();
  const onClick = () => {
    if (itemId) {
      exportActions({ itemId, format });
      setIsFormatExported({ ...isFormatExported, [format]: true });
    }
  };

  const formats = [
    {
      format: ExportActionsFormatting.CSV,
      label: t('CSV_DESCRIPTION'),
      icon: <Grid3X3 size={16} />,
    },
    {
      format: ExportActionsFormatting.JSON,
      label: t('JSON_DESCRIPTION'),
      icon: <Braces size={16} />,
    },
  ];

  return (
    <Stack gap={1}>
      <FormControl sx={{ display: 'block' }}>
        <Typography variant="h6">{t('SELECT_FORMAT_TITLE')}</Typography>
        <Typography variant="body1">
          {t('SELECT_FORMAT_DIALOG_DESCRIPTION')}
        </Typography>
        <RadioGroup
          name="export-format"
          value={format}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormat(
              (event.target as HTMLInputElement)
                .value as ExportActionsFormatting,
            );
          }}
        >
          {formats.map((ele) => (
            <SelectFormatRadio
              key={ele.format}
              icon={ele.icon}
              title={ele.format}
              description={ele.label}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Button
        onClick={onClick}
        variant="contained"
        disabled={isFormatExported[format]}
        id={EXPORT_ACTIONS_BUTTON_ID}
      >
        {isFormatExported[format]
          ? t('EXPORTING_DONE', { format: format.toUpperCase() })
          : t('START_EXPORTING', { format: format.toUpperCase() })}
      </Button>
    </Stack>
  );
}
