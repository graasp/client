import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack } from '@mui/material';

import { ArrowRightIcon } from 'lucide-react';

import { useAuth } from '@/AuthContext';
import { ButtonLink } from '@/components/ui/ButtonLink';
import LanguageSwitch from '@/components/ui/LanguageSwitch';
import { NS } from '@/config/constants';
import { OnChangeLangProp } from '@/types';

type RightHeaderProps = {
  onChangeLang: OnChangeLangProp;
};

export function RightHeader({
  onChangeLang,
}: Readonly<RightHeaderProps>): JSX.Element {
  const { isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation(NS.Common);
  const { t: translateLanding } = useTranslation(NS.Landing);

  if (isAuthenticated) {
    return (
      <Stack gap={2} direction="row" alignItems="center">
        <ButtonLink
          variant="contained"
          to="/account"
          endIcon={<ArrowRightIcon />}
        >
          {translateLanding('NAV.GO_TO_GRAASP')}
        </ButtonLink>
        <LanguageSwitch lang={i18n.language} onChange={onChangeLang} />
      </Stack>
    );
  }

  return (
    <Stack gap={2} direction="row" id="leftTitleWrapper" alignItems="center">
      <ButtonLink to="/auth/login">{t('LOG_IN.BUTTON_TEXT')}</ButtonLink>
      <ButtonLink to="/auth/register">{t('REGISTER.BUTTON_TEXT')}</ButtonLink>
      <LanguageSwitch lang={i18n.language} onChange={onChangeLang} />
    </Stack>
  );
}
