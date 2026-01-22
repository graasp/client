import { type JSX, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { Skeleton, Stack } from '@mui/material';

import { useSuspenseQuery } from '@tanstack/react-query';

import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { DEFAULT_LANG, NS } from '@/config/constants';
import { SETTINGS_PAGE_CONTAINER_ID } from '@/config/selectors';
import { MemberCard } from '@/modules/home/MemberCard';
import { getCurrentSettingsOptions } from '@/openapi/client/@tanstack/react-query.gen';

import { DeleteMemberSection } from '~account/settings/DeleteMemberSection';
import { ExportMemberData } from '~account/settings/ExportMemberData';
import { Password } from '~account/settings/password/Password';
import { Preferences } from '~account/settings/preferences/Preferences';
import { PersonalInformation } from '~account/settings/profile/PersonalInformation';
import { PublicProfile } from '~account/settings/publicProfile/PublicProfile';

export function SettingsPage(): JSX.Element {
  return (
    <Suspense fallback={<SettingsLoader />}>
      <Settings />
    </Suspense>
  );
}

function Settings(): JSX.Element {
  const { t } = useTranslation(NS.Account);
  const { data: memberSettings } = useSuspenseQuery(
    getCurrentSettingsOptions(),
  );

  const {
    lang,
    enableSaveActions,
    notificationFrequency,
    marketingEmailsSubscribedAt,
  } = memberSettings;

  return (
    <ScreenLayout
      id={SETTINGS_PAGE_CONTAINER_ID}
      title={t('MAIN_MENU.SETTINGS')}
    >
      <MemberCard />
      <PersonalInformation />
      <Password />
      <PublicProfile />
      <Preferences
        lang={lang ?? DEFAULT_LANG}
        enableSaveActions={enableSaveActions}
        notificationFrequency={notificationFrequency}
        marketingEmailsSubscribedAt={marketingEmailsSubscribedAt}
      />
      <ExportMemberData />
      <DeleteMemberSection />
    </ScreenLayout>
  );
}

function SettingsLoader() {
  return (
    <Stack gap={3}>
      <Skeleton width="100%" height={50} sx={{ transform: 'unset' }}></Skeleton>
      <Skeleton height={120} sx={{ transform: 'unset' }}></Skeleton>
      <Skeleton height={200} sx={{ transform: 'unset' }}></Skeleton>
      <Skeleton height={200} sx={{ transform: 'unset' }}></Skeleton>
    </Stack>
  );
}
