import { useTranslation } from 'react-i18next';

import {
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { ArrowRightIcon } from 'lucide-react';

import { NS } from '@/config/constants';
import LibraryIcon from '@/ui/icons/LibraryIcon';
import { AccentColors } from '@/ui/theme';

function LibraryCard() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation(NS.Home, { keyPrefix: 'LIBRARY.CARD' });

  return (
    <Stack alignItems="center" mb={2}>
      <Stack
        borderRadius={5}
        gap={3}
        p={isXs ? 2 : 3}
        direction="row"
        sx={{
          background: `linear-gradient(${AccentColors.library}ef, ${AccentColors.library}cc), 50% 50% url(/library/books.jpeg)`,
        }}
      >
        <Stack gap={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h3" color="white">
              {t('TITLE')}
            </Typography>
            <LibraryIcon primaryColor="white" />
          </Stack>
          <Typography color="white">{t('SUBTITLE')}</Typography>
          <Button
            sx={{ background: 'white', color: AccentColors.library }}
            variant="contained"
            endIcon={<ArrowRightIcon size={20} />}
          >
            {t('BUTTON_TEXT')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default LibraryCard;
