import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { Image } from '@/components/ui/StyledImages';
import { NS } from '@/config/constants';

import { UserStory } from './UserStory';
import { UserStoryButton } from './UserStoryButton';
import { RESEARCHER_USER_STORY, TEACHER_USER_STORY } from './constants';

export function UserStorySection(): JSX.Element {
  const { t } = useTranslation(NS.Landing);
  return (
    <Stack component="section" gap={20} maxWidth="md">
      <Stack direction="row" gap={{ xs: 2, md: 4 }} justifyContent="center">
        <UserStoryButton id={TEACHER_USER_STORY} text="Are you a teacher?" />
        <UserStoryButton
          id={RESEARCHER_USER_STORY}
          text="Are you a researcher?"
        />
      </Stack>
      <UserStory
        id={TEACHER_USER_STORY}
        href="/auth/register"
        caption={t('HOME.USER_STORY.TEACHER.LEADING_SENTENCE')}
        buttonText={t('HOME.USER_STORY.TEACHER.BUTTON_TEXT')}
        title={t('HOME.USER_STORY.TEACHER.TITLE')}
        image={<Image src="/illustration/teacher-red.webp" />}
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
        id={RESEARCHER_USER_STORY}
        href="/auth/register"
        caption={t('HOME.USER_STORY.RESEARCHER.LEADING_SENTENCE')}
        buttonText={t('HOME.USER_STORY.RESEARCHER.BUTTON_TEXT')}
        title={t('HOME.USER_STORY.RESEARCHER.TITLE')}
        image={
          <Image
            src="/illustration/group-work.webp"
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
