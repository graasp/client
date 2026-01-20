import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BorderedSection } from '@/components/layout/BorderedSection';
import { Button } from '@/components/ui/Button';
import { DEFAULT_LANG, NS } from '@/config/constants';
import { LANGS } from '@/config/langs';
import {
  PREFERENCES_ANALYTICS_SWITCH_ID,
  PREFERENCES_EDIT_BUTTON_ID,
  PREFERENCES_EMAIL_FREQUENCY_ID,
  PREFERENCES_LANGUAGE_DISPLAY_ID,
  PREFERENCES_MARKETING_SUBSCRIPTION_DISPLAY_ID,
} from '@/config/selectors';
import type { CurrentSettings, NotificationFrequency } from '@/openapi/client';

import { SettingItem } from '~account/settings/SettingItem';

import { EditPreferences } from './EditPreferences';

export const Preferences = ({
  lang,
  enableSaveActions,
  marketingEmailsSubscribedAt,
  notificationFrequency,
}: {
  lang: string;
  enableSaveActions: boolean;
  marketingEmailsSubscribedAt: CurrentSettings['marketingEmailsSubscribedAt'];
  notificationFrequency: NotificationFrequency;
}): JSX.Element | null => {
  const { t } = useTranslation(NS.Account);

  const [isEditing, setIsEditing] = useState(false);

  const languageCode = (lang ?? DEFAULT_LANG) as keyof typeof LANGS;
  const languageName = LANGS[languageCode];

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <EditPreferences
        lang={lang}
        enableSaveActions={enableSaveActions}
        marketingEmailsSubscribedAt={marketingEmailsSubscribedAt}
        notificationFrequency={notificationFrequency}
        onClose={handleClose}
      />
    );
  }
  return (
    <BorderedSection
      title={t('PROFILE_PREFERENCES_TITLE')}
      topAction={
        <Button
          key="edit"
          variant="contained"
          onClick={handleEditClick}
          id={PREFERENCES_EDIT_BUTTON_ID}
          size="small"
        >
          {t('EDIT_BUTTON_LABEL')}
        </Button>
      }
    >
      <SettingItem
        title={t('PROFILE_LANGUAGE_TITLE')}
        content={languageName}
        contentId={PREFERENCES_LANGUAGE_DISPLAY_ID}
      />
      <SettingItem
        title={t('PROFILE_SAVE_ACTIONS_TITLE')}
        content={
          enableSaveActions
            ? t('PROFILE_SAVE_ACTIONS_ENABLED')
            : t('PROFILE_SAVE_ACTIONS_DISABLED')
        }
        contentId={PREFERENCES_ANALYTICS_SWITCH_ID}
      />
      <SettingItem
        title={t('PROFILE_EMAIL_FREQUENCY_TITLE')}
        content={
          notificationFrequency === 'always'
            ? t('ALWAYS_RECEIVE_EMAILS')
            : t('DISABLE_EMAILS')
        }
        contentId={PREFERENCES_EMAIL_FREQUENCY_ID}
      />
      <SettingItem
        title={t('PROFILE_ENABLE_EMAIL_SUBSCRIPTION.TITLE')}
        content={
          marketingEmailsSubscribedAt
            ? t('PROFILE_ENABLE_EMAIL_SUBSCRIPTION.ENABLED')
            : t('PROFILE_ENABLE_EMAIL_SUBSCRIPTION.DISABLED')
        }
        contentId={PREFERENCES_MARKETING_SUBSCRIPTION_DISPLAY_ID}
      />
    </BorderedSection>
  );
};
