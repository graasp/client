import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Stack, Switch, Tooltip } from '@mui/material';

import { BorderedSection } from '@/components/layout/BorderedSection';
import FormProperty from '@/components/layout/FormProperty';
import { Button } from '@/components/ui/Button';
import LanguageSwitch from '@/components/ui/LanguageSwitch';
import { NS } from '@/config/constants';
import {
  PREFERENCES_ANALYTICS_SWITCH_ID,
  PREFERENCES_CANCEL_BUTTON_ID,
  PREFERENCES_EDIT_CONTAINER_ID,
  PREFERENCES_LANGUAGE_SWITCH_ID,
  PREFERENCES_SAVE_BUTTON_ID,
} from '@/config/selectors';
import type { CurrentSettings, NotificationFrequency } from '@/openapi/client';

import { EmailPreferenceSwitch } from './EmailPreferenceSwitch';
import { MarketingEmailsSubscribeSwitch } from './MarketingEmailsSubscribeSwitch';
import { useUpdatePreferences } from './useUpdatePreferences';

type EditPreferencesProp = Readonly<{
  lang: string;
  enableSaveActions: boolean;
  notificationFrequency: NotificationFrequency;
  marketingEmailsSubscribedAt: CurrentSettings['marketingEmailsSubscribedAt'];
  onClose: () => void;
}>;
export function EditPreferences({
  lang,
  enableSaveActions,
  marketingEmailsSubscribedAt,
  notificationFrequency,
  onClose,
}: EditPreferencesProp): JSX.Element {
  const { i18n, t } = useTranslation(NS.Account);
  const { t: translateCommon } = useTranslation(NS.Common);
  const { t: translateMessage } = useTranslation(NS.Messages);
  const { saveSettings, error } = useUpdatePreferences({
    marketingEmailsSubscribedAt,
  });

  const [selectedLang, setSelectedLang] = useState<string>(lang);
  const [
    selectedIsSubscribedToMarketingEmails,
    setSelectedIsSubscribedToMarketingEmails,
  ] = useState(Boolean(marketingEmailsSubscribedAt));
  const [selectedNotificationFrequency, setSelectedNotificationFrequency] =
    useState(notificationFrequency);
  const [switchedSaveActions, setSwitchedSaveActions] =
    useState(enableSaveActions);

  const handleOnToggle = (event: { target: { checked: boolean } }): void => {
    const { checked } = event.target;
    setSwitchedSaveActions(checked);
  };

  const onSubmit = () => {
    saveSettings({
      lang: selectedLang,
      enableSaveActions: switchedSaveActions,
      notificationFrequency: selectedNotificationFrequency,
      isSubscribedToMarketingEmails: selectedIsSubscribedToMarketingEmails,
    });

    if (selectedLang !== lang) {
      i18n.changeLanguage(selectedLang);
    }
    onClose();
  };

  const hasChanges =
    selectedLang !== lang ||
    selectedIsSubscribedToMarketingEmails !==
      Boolean(marketingEmailsSubscribedAt) ||
    selectedNotificationFrequency !== notificationFrequency ||
    switchedSaveActions !== enableSaveActions;

  return (
    <BorderedSection
      id={PREFERENCES_EDIT_CONTAINER_ID}
      title={t('PROFILE_PREFERENCES_TITLE')}
    >
      <FormProperty title={t('PROFILE_LANGUAGE_TITLE')}>
        <LanguageSwitch
          lang={selectedLang}
          dense={false}
          id={PREFERENCES_LANGUAGE_SWITCH_ID}
          onChange={setSelectedLang}
        />
      </FormProperty>

      <FormProperty title={t('PROFILE_SAVE_ACTIONS_TITLE')}>
        <Tooltip title={t('SAVE_ACTIONS_TOGGLE_TOOLTIP')}>
          <Switch
            id={PREFERENCES_ANALYTICS_SWITCH_ID}
            onChange={handleOnToggle}
            checked={switchedSaveActions}
            color="primary"
          />
        </Tooltip>
      </FormProperty>
      <FormProperty title={t('PROFILE_EMAIL_FREQUENCY_TITLE')}>
        <EmailPreferenceSwitch
          value={selectedNotificationFrequency}
          onChange={setSelectedNotificationFrequency}
        />
      </FormProperty>
      <FormProperty title={t('PROFILE_ENABLE_EMAIL_SUBSCRIPTION.TITLE')}>
        <MarketingEmailsSubscribeSwitch
          value={selectedIsSubscribedToMarketingEmails}
          onChange={setSelectedIsSubscribedToMarketingEmails}
        />
      </FormProperty>

      {error && (
        <Alert severity="error">{translateMessage('EDIT_MEMBER_ERROR')}</Alert>
      )}
      <Stack direction="row" gap={2} justifyContent="flex-end">
        <Button
          onClick={onClose}
          variant="outlined"
          id={PREFERENCES_CANCEL_BUTTON_ID}
          size="small"
        >
          {translateCommon('CANCEL.BUTTON_TEXT')}
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          id={PREFERENCES_SAVE_BUTTON_ID}
          disabled={!hasChanges}
          size="small"
        >
          {translateCommon('SAVE.BUTTON_TEXT')}
        </Button>
      </Stack>
    </BorderedSection>
  );
}
