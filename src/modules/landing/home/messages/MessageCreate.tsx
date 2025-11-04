import { useTranslation } from 'react-i18next';

import { Grid, Stack, Typography } from '@mui/material';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { Image } from '@/components/ui/StyledImages';
import { NS } from '@/config/constants';

import { UserCapsuleExample } from '../UserCapsuleExample';
import { UserStory } from '../UserStory';
import { getCapsulesByLang } from '../constants';

function MessageCreate() {
  const { t, i18n } = useTranslation(NS.Landing);

  return (
    <Stack gap={6}>
      <UserStory
        title={t('HOME.USER_STORY.TEACHER.TITLE')}
        image={<Image src="/illustration/landing-message-share.svg" />}
      >
        <Typography>
          With Graasp, you can easily bring your teaching materials online,
          turning images, PDFs, and traditional resources into interactive
          digital lessons in minutes.
        </Typography>
        <Typography>
          And what makes Graasp truly powerful is its ability to help you design
          engaging learning activities by integrating videos and interactive
          apps. You can create lessons that captivate students, ignite
          curiosity, and encourage active participation.
        </Typography>
        <ButtonLink
          to="/features"
          sx={{
            // make button take only needed space
            width: 'fit-content',
          }}
          color="secondary"
          variant="contained"
        >
          Learn More
        </ButtonLink>
      </UserStory>
      <Stack gap={3}>
        <Typography color="primary" variant="h5">
          {t('Compose your learning material with interactive content')}
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
