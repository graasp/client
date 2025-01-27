import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import { CircleUser } from 'lucide-react';

import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { ENROLL_BUTTON_SELECTOR } from '@/config/selectors';
import Button from '@/ui/buttons/Button/Button';

import { BUILDER } from '~builder/langs';

type Props = { itemId: DiscriminatedItem['id'] };

const EnrollContent = ({ itemId }: Props): JSX.Element => {
  const { t: translateBuilder } = useTranslation(NS.Builder);

  const { mutate: enroll } = mutations.useEnroll();

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      gap={2}
    >
      <CircleUser size={40} />
      <Typography variant="h3">
        {translateBuilder(BUILDER.ENROLL_TITLE)}
      </Typography>
      <Typography variant="subtitle2">
        {translateBuilder(BUILDER.ENROLL_DESCRIPTION)}
      </Typography>
      <Button
        dataCy={ENROLL_BUTTON_SELECTOR}
        onClick={() => {
          enroll({ itemId });
        }}
      >
        {translateBuilder(BUILDER.ENROLL_BUTTON)}
      </Button>
    </Stack>
  );
};

export default EnrollContent;
