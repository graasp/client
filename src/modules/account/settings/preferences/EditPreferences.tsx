import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Switch, Tooltip } from '@mui/material';

import { CompleteMember } from '@graasp/sdk';

import { BorderedSection } from '@/components/layout/BorderedSection';
import FormProperty from '@/components/layout/FormProperty';
import { Button } from '@/components/ui/Button';
import LanguageSwitch from '@/components/ui/LanguageSwitch';
import { DEFAULT_EMAIL_FREQUENCY, DEFAULT_LANG, NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import {
  PREFERENCES_ANALYTICS_SWITCH_ID,
  PREFERENCES_CANCEL_BUTTON_ID,
  PREFERENCES_EDIT_CONTAINER_ID,
  PREFERENCES_EMAIL_FREQUENCY_ID,
  PREFERENCES_LANGUAGE_SWITCH_ID,
  PREFERENCES_SAVE_BUTTON_ID,
} from '@/config/selectors';

import { EmailPreferenceSwitch } from '../EmailPreferenceSwitch';

type EditPreferencesProp = {
  readonly member: CompleteMember;
  readonly onClose: () => void;
};
export function EditPreferences({
  member,
  onClose,
}: EditPreferencesProp): JSX.Element {
  const { t } = useTranslation(NS.Account);
  const { t: translateCommon } = useTranslation(NS.Common);
  const { mutate: editMember } = mutations.useEditCurrentMember();

  const memberLang = member?.extra?.lang ?? DEFAULT_LANG;
  const memberEmailFreq = member?.extra?.emailFreq ?? DEFAULT_EMAIL_FREQUENCY;
  const memberSaveActions = member?.enableSaveActions ?? true;

  const [selectedLang, setSelectedLang] = useState<string>(memberLang);
  const [selectedEmailFreq, setSelectedEmailFreq] = useState(memberEmailFreq);
  const [switchedSaveActions, setSwitchedSaveActions] =
    useState(memberSaveActions);

  const handleOnToggle = (event: { target: { checked: boolean } }): void => {
    const { checked } = event.target;
    setSwitchedSaveActions(checked);
  };
  const saveSettings = () => {
    editMember({
      extra: {
        lang: selectedLang,
        emailFreq: selectedEmailFreq,
      },
      enableSaveActions: switchedSaveActions,
    });
    onClose();
  };

  const hasChanges =
    selectedLang !== memberLang ||
    selectedEmailFreq !== memberEmailFreq ||
    switchedSaveActions !== memberSaveActions;

  return (
    <BorderedSection
      id={PREFERENCES_EDIT_CONTAINER_ID}
      title={t('PROFILE_PREFERENCES_TITLE')}
    >
      <FormProperty title={t('PROFILE_LANGUAGE_TITLE')}>
        <LanguageSwitch
          lang={selectedLang}
          id={PREFERENCES_LANGUAGE_SWITCH_ID}
          onChange={setSelectedLang}
        />
      </FormProperty>
      <FormProperty title={t('PROFILE_EMAIL_FREQUENCY_TITLE')}>
        <EmailPreferenceSwitch
          emailFreq={member.extra?.emailFreq ?? DEFAULT_EMAIL_FREQUENCY}
          onChange={setSelectedEmailFreq}
          id={PREFERENCES_EMAIL_FREQUENCY_ID}
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
          onClick={saveSettings}
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
