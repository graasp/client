import { useTranslation } from 'react-i18next';

import { Box, FormLabel, Typography } from '@mui/material';

import TextEditor from '@graasp/ui/text-editor';

import { NS } from '@/config/constants';

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
  const { t: translateBuilder } = useTranslation(NS.Builder);

  return (
    <Box>
      <FormLabel>
        <Typography variant="caption">
          {translateBuilder('DESCRIPTION_LABEL')}
        </Typography>
      </FormLabel>
      <TextEditor
        id={id}
        value={value}
        onChange={onChange}
        showActions={false}
      />
    </Box>
  );
}
