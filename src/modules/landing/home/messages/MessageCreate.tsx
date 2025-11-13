import { Trans, useTranslation } from 'react-i18next';

import { Grid, Stack, Typography } from '@mui/material';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { NS } from '@/config/constants';

import { Message } from '../Message';
import { UserCapsuleExample } from '../UserCapsuleExample';
import { getCapsulesByLang } from '../constants';
import { strongTag } from '../constants';

function MessageCreate() {
  const { t, i18n } = useTranslation(NS.Landing, {
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

export default MessageCreate;
