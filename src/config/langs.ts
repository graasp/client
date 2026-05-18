import type { Locale } from 'date-fns';
import { ar } from 'date-fns/locale/ar';
import { de } from 'date-fns/locale/de';
import { el } from 'date-fns/locale/el';
import { enUS } from 'date-fns/locale/en-US';
import { es } from 'date-fns/locale/es';
import { fr } from 'date-fns/locale/fr';
import { it } from 'date-fns/locale/it';
import { ja } from 'date-fns/locale/ja';
import { uk } from 'date-fns/locale/uk';

import { DEFAULT_LANG } from './constants';

const dateFnsLocales = {
  en: enUS,
  fr: fr,
  de: de,
  it: it,
  es: es,
  ar: ar,
  ja: ja,
  uk: uk,
  el: el,
} as const;

export function getLocalForDateFns(i18nLocale: string): Locale {
  if (Object.keys(dateFnsLocales).includes(i18nLocale)) {
    const locale = i18nLocale as keyof typeof dateFnsLocales;
    return dateFnsLocales[locale];
  } else {
    return dateFnsLocales[DEFAULT_LANG];
  }
}

export const LANGS = {
  // bg: "български",
  // ca: "Català",
  // cs: "čeština",
  de: 'Deutsch',
  el: 'Ελληνικά',
  en: 'English',
  es: 'Español',
  // et: "Eesti",
  // fi: "Suomi",
  fr: 'Français',
  // hu: "Magyar",
  it: 'Italiano',
  uk: 'Українська',
  ja: '日本語',
  // ka: "ქართული",
  // lt: "lietuvių kalba",
  // lv: "Latviešu",
  // nl: "Nederlands",
  // pt: "Português",
  // ro: "Română",
  // ru: "Русский",
  // sk: "Slovenský",
  // sl: "Slovenščina",
  // sr: "српски језик",
  // sw: 'Kiswahili',
  // tr: "Türkçe",
  // uk: "Українська",
  // vi: "Tiếng Việt",
  // zh: "简体中文",
  // zh_tw: "繁體中文",
  ar: 'العربية',
} as const;
