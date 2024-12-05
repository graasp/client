import { Trans, useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { Image } from '@/components/ui/StyledImages';
import { NS } from '@/config/constants';

import { UserStory } from './UserStory';

export function UserStorySection(): JSX.Element {
  const { t } = useTranslation(NS.Landing);
  return (
    <Stack component="section" gap={20} maxWidth="lg">
      <UserStory
        href="/auth/register"
        caption={t('HOME.USER_STORY.TEACHER.LEADING_SENTENCE')}
        buttonText={t('HOME.USER_STORY.TEACHER.BUTTON_TEXT')}
        title={t('HOME.USER_STORY.TEACHER.TITLE')}
        image={<Image src="/illustration/teacher.webp" />}
        imageAttribution={
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ '& a': { color: 'inherit' } }}
          >
            <Trans
              t={t}
              i18nKey="HOME.USER_STORY.TEACHER.IMAGE_ATTRIBUTION"
              components={{
                author: <a href="https://unsplash.com/@thutra0803">_</a>,
                image: (
                  <a href="https://unsplash.com/photos/womens-blue-dress-shirt-TVSRWmnW8Us">
                    _
                  </a>
                ),
              }}
            />
          </Typography>
        }
      >
        <Typography>
          <span>{t('HOME.USER_STORY.TEACHER.USE_CASE_1')}</span>
          <br />
          <span>{t('HOME.USER_STORY.TEACHER.USE_CASE_2')}</span>
          <br />
          <span>{t('HOME.USER_STORY.TEACHER.USE_CASE_3')}</span>
        </Typography>
      </UserStory>
      <UserStory
        href="/auth/register"
        caption={t('HOME.USER_STORY.RESEARCHER.LEADING_SENTENCE')}
        buttonText={t('HOME.USER_STORY.RESEARCHER.BUTTON_TEXT')}
        title={t('HOME.USER_STORY.RESEARCHER.TITLE')}
        image={
          <Image
            src="/illustration/research.webp"
            alt="students experimenting in a lab session"
          />
        }
      >
        <Typography>
          <span>{t('HOME.USER_STORY.RESEARCHER.USE_CASE_1')}</span>
          <br />
          <span>{t('HOME.USER_STORY.RESEARCHER.USE_CASE_2')}</span>
          <br />
          <span>{t('HOME.USER_STORY.RESEARCHER.USE_CASE_3')}</span>
        </Typography>
      </UserStory>
    </Stack>
  );
}
