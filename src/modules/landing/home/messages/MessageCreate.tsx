import { useTranslation } from 'react-i18next';

import { Grid, Stack, Typography } from '@mui/material';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { NS } from '@/config/constants';

import { Message } from '../Message';
import { UserCapsuleExample } from '../UserCapsuleExample';
import { getCapsulesByLang } from '../constants';

function MessageCreate() {
  const { t, i18n } = useTranslation(NS.Landing);

  return (
    <Stack gap={6}>
      <Message
        title={t('HOME.MESSAGES.CREATE.TITLE')}
        image="/illustration/landing-message-create.svg"
      >
        <Typography>{t('HOME.MESSAGES.CREATE.DESCRIPTION_1')}</Typography>
        <Typography>{t('HOME.MESSAGES.CREATE.DESCRIPTION_2')}</Typography>
        <ButtonLink
          to="/features"
          sx={{
            // make button take only needed space
            width: 'fit-content',
          }}
          color="secondary"
          variant="contained"
        >
          {t('HOME.MESSAGES.CREATE.BUTTON_TEXT')}
        </ButtonLink>
      </Message>
      <Stack gap={3}>
        <Typography color="primary" variant="h5">
          {t('HOME.MESSAGES.CREATE.CONTENT_TITLE')}
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
