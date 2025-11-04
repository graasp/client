import { useTranslation } from 'react-i18next';

import { Grid, Stack, Typography } from '@mui/material';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { Image } from '@/components/ui/StyledImages';
import { NS } from '@/config/constants';
import { GRAASP_LIBRARY_HOST } from '@/config/env';

import { UserCapsuleExample } from '../UserCapsuleExample';
import { UserStory } from '../UserStory';
import { getCapsulesByLang } from '../constants';

function MessageLibrary() {
  const { t, i18n } = useTranslation(NS.Landing);

  return (
    <Stack gap={6}>
      <UserStory
        title={t(
          'Benefit and contribute to an Open Educational Resources (OER) Library',
        )}
        image={<Image src="/illustration/teacher-red.webp" />}
      >
        <Typography>
          Collaboration is at the heart of Graasp Library, where educators and
          professionals come together to share, co-create, and learn. By sharing
          Open Educational Resources (OER), educators have access and contribute
          to a growing library of collective knowledge.
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
          >
            Go to Graasp Library
          </ButtonLink>
          <ButtonLink
            to={`${GRAASP_LIBRARY_HOST}/oer`}
            sx={{
              // make button take only needed space
              width: 'fit-content',
            }}
            color="secondary"
            variant="contained"
          >
            What are OERs?
          </ButtonLink>
        </Stack>
      </UserStory>
      <Stack gap={3}>
        <Typography color="primary" variant="h5">
          {t('HOME.USER_STORY.DISCOVER.TITLE')}
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
