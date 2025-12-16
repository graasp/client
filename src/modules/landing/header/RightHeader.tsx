import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, useMediaQuery, useTheme } from '@mui/material';

import { ButtonLink } from '@/components/ui/ButtonLink';
import LanguageSwitch from '@/components/ui/LanguageSwitch';
import { NS } from '@/config/constants';
import { OnChangeLangProp } from '@/types';

import useUserMenu from './useUserMenu';

type RightHeaderProps = {
  onChangeLang: OnChangeLangProp;
};

export function RightHeader({
  onChangeLang,
}: Readonly<RightHeaderProps>): JSX.Element | null {
  const { i18n } = useTranslation(NS.Common);
  const theme = useTheme();

  const menu = useUserMenu();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return null;
  }

  return (
    <Stack gap={2} direction="row" alignItems="center">
      {menu.map((menuItem) => (
        <ButtonLink
          variant={menuItem.highlight ? 'contained' : 'text'}
          key={menuItem.event}
          to={menuItem.to}
          params={menuItem.params}
          dataUmamiEvent={`header-${menuItem.event}`}
        >
          {menuItem.label}
        </ButtonLink>
      ))}
      <LanguageSwitch
        id="languageSwitch"
        lang={i18n.language}
        onChange={onChangeLang}
      />
    </Stack>
  );
}
