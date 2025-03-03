import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, FormLabel, Typography } from '@mui/material';

import { NS } from '@/config/constants';
import TextEditor from '@/ui/TextEditor/TextEditor';

export type DescriptionFormProps = {
  id?: string;
  value?: string;
  onChange: (v: string) => void;
};

export function DescriptionForm({
  id,
  value = '',
  onChange,
}: Readonly<DescriptionFormProps>): JSX.Element {
  const { t: translateBuilder } = useTranslation(NS.Builder, {
    keyPrefix: 'DESCRIPTION',
  });

  return (
    <Box>
      <FormLabel>
        <Typography variant="caption">{translateBuilder('LABEL')}</Typography>
      </FormLabel>
      <TextEditor
        id={id}
        value={value}
        onChange={onChange}
        placeholderText={translateBuilder('PLACEHOLDER')}
      />
    </Box>
  );
}
