import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { CircleUser } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { ENROLL_BUTTON_SELECTOR } from '@/config/selectors';

export const EnrollContent = ({ itemId }: { itemId: string }): JSX.Element => {
  const { t: translatePlayer } = useTranslation(NS.Player);

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
      <Typography variant="h3">{translatePlayer('ENROLL_TITLE')}</Typography>
      <Typography variant="subtitle2">
        {translatePlayer('ENROLL_DESCRIPTION')}
      </Typography>
      <Button
        data-cy={ENROLL_BUTTON_SELECTOR}
        onClick={() => {
          enroll({ itemId });
        }}
      >
        {translatePlayer('ENROLL_BUTTON')}
      </Button>
    </Stack>
  );
};
