import { Trans, useTranslation } from 'react-i18next';

import {
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { NS } from '@/config/constants';
import { GRAASP_LIBRARY_HOST } from '@/config/env';

import { Message } from '../Message';
import { UserCapsuleExample } from '../UserCapsuleExample';
import { getCapsulesByLang } from '../constants';
import { strongTag } from '../constants';

function MessageLibrary() {
  const { t, i18n } = useTranslation(NS.Landing, {
    keyPrefix: 'HOME.MESSAGES.LIBRARY',
  });

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Stack gap={6}>
      <Message
        title={t('TITLE')}
        image="/illustration/landing-message-library.svg"
      >
        <Typography>
          <Trans
            t={t}
            i18nKey={'DESCRIPTION'}
            components={{
              b: strongTag,
            }}
          />
        </Typography>
        <Stack direction="row" gap={2}>
          <ButtonLink
            to={GRAASP_LIBRARY_HOST}
            sx={{
              // make button take only needed space
              width: 'fit-content',
            }}
            color="primary"
            variant="contained"
            dataUmamiEvent="messages-library-button"
          >
            {t('LIBRARY_BUTTON_TEXT')}
          </ButtonLink>
          {isSmUp && (
            <ButtonLink
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              to={`${GRAASP_LIBRARY_HOST}/oer`}
              sx={{
                // make button take only needed space
                width: 'fit-content',
              }}
              color="secondary"
              variant="contained"
              dataUmamiEvent="messages-library-oer-button"
            >
              {t('OER_BUTTON_TEXT')}
            </ButtonLink>
          )}
        </Stack>
      </Message>
      <Stack gap={3}>
        <Typography color="primary" variant="h5">
          {t('DISCOVER_TITLE')}
        </Typography>
        <Grid container spacing={2} direction="row">
          {getCapsulesByLang(i18n.language).map(({ title, imageSrc, url }) => {
            return (
              <Grid size={{ xs: 4, sm: 4, md: 2 }}>
                <UserCapsuleExample
                  title={title}
                  imageSrc={imageSrc}
                  url={url}
                />
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </Stack>
  );
}

export default MessageLibrary;
