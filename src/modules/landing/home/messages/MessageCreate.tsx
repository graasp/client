import { Trans, useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { NS } from '@/config/constants';

import { Message } from '../Message';
import { strongTag } from '../constants';

function MessageCreate() {
  const { t } = useTranslation(NS.Landing, {
    keyPrefix: 'HOME.MESSAGES.CREATE',
  });

  return (
    <Stack gap={6}>
      <Message
        title={t('TITLE')}
        image="/illustration/landing-message-create.svg"
      >
        <Typography>
          <Trans
            t={t}
            i18nKey={'DESCRIPTION_1'}
            components={{
              b: strongTag,
            }}
          />
        </Typography>
        <Typography>
          <Trans
            t={t}
            i18nKey={'DESCRIPTION_2'}
            components={{
              b: strongTag,
            }}
          />
        </Typography>
        <ButtonLink
          to="/features"
          sx={{
            // make button take only needed space
            width: 'fit-content',
          }}
          color="secondary"
          variant="contained"
          dataUmamiEvent="messages-create-button"
        >
          {t('BUTTON_TEXT')}
        </ButtonLink>
      </Message>
      <Stack gap={3}>
        <Typography color="primary" variant="h5">
          {t('CONTENT_TITLE')}
        </Typography>
        <Stack
          gap={{ xs: 1, sm: 2 }}
          direction="row"
          width="100%"
          position="relative"
        >
          <Stack>
            <img alt="img icon" width={'100%'} src="/landing/img.svg" />
          </Stack>
          <Stack>
            <img alt="audio icon" width={'100%'} src="/landing/audio.svg" />
          </Stack>
          <Stack>
            <img alt="video icon" width={'100%'} src="/landing/video.svg" />
          </Stack>
          <Stack>
            <img alt="h5p icon" width={'100%'} src="/landing/h5p.svg" />
          </Stack>
          <Stack>
            <img alt="pdf icon" width={'100%'} src="/landing/pdf.svg" />
          </Stack>
          <Stack>
            <img alt="quiz icon" width={'100%'} src="/landing/quiz.svg" />
          </Stack>
          <Stack>
            <img alt="sim icon" width={'100%'} src="/landing/sim.svg" />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default MessageCreate;
