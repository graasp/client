import React, { useState } from 'react';

import { Button, Stack, Typography } from '@mui/material';

import { DEFAULT_LANG, langs } from '@graasp/translations';

import { useAccountTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import {
  MEMBER_PROFILE_ANALYTICS_SWITCH_ID,
  MEMBER_PROFILE_EDIT_PREFERENCES_BUTTON_ID,
  MEMBER_PROFILE_EMAIL_FREQUENCY_ID,
  MEMBER_PROFILE_LANGUAGE_SWITCH_ID,
} from '@/config/selectors';

import RoundedStack from '../common/RoundedStack';
import EditMemberPreferences from './EditMemberPreferences';
import MemberProfileItem from './MemberProfileItem';

const MemberPreferences = (): JSX.Element => {
  const { data: member } = hooks.useCurrentMember();
  const languageCode = (member?.extra?.lang ??
    DEFAULT_LANG) as keyof typeof langs;
  const languageName = langs[languageCode];

  const { t } = useAccountTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
  };
  return (
    <RoundedStack>
      {isEditing ? (
        <EditMemberPreferences onClose={handleClose} />
      ) : (
        <>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5">
              {t('PROFILE_PREFERENCES_TITLE')}
            </Typography>
            <Button
              variant="contained"
              onClick={handleEditClick}
              id={MEMBER_PROFILE_EDIT_PREFERENCES_BUTTON_ID}
              size="small"
            >
              {t('EDIT_BUTTON_LABEL')}
            </Button>
          </Stack>
          <MemberProfileItem
            title={t('PROFILE_LANGUAGE_TITLE')}
            content={languageName}
            contentId={MEMBER_PROFILE_LANGUAGE_SWITCH_ID}
          />

          <MemberProfileItem
            title={t('PROFILE_EMAIL_FREQUENCY_TITLE')}
            content={
              member?.extra?.emailFreq === 'always'
                ? t('ALWAYS_RECEIVE_EMAILS')
                : t('DISABLE_EMAILS')
            }
            contentId={MEMBER_PROFILE_EMAIL_FREQUENCY_ID}
          />

          <MemberProfileItem
            title={t('PROFILE_SAVE_ACTIONS_TITLE')}
            content={
              member?.enableSaveActions === true
                ? t('PROFILE_SAVE_ACTIONS_VALUE_TRUE')
                : t('PROFILE_SAVE_ACTIONS_VALUE_FALSE')
            }
            contentId={MEMBER_PROFILE_ANALYTICS_SWITCH_ID}
          />
        </>
      )}
    </RoundedStack>
  );
};

export default MemberPreferences;