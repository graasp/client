import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';
import LangDetector from 'i18next-browser-languagedetector';
import Fetch from 'i18next-fetch-backend';

i18n
  .use(Fetch)
  .use(LangDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    ns: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // specify which languages are supported
    supportedLngs: ['en', 'fr', 'de', 'it', 'es', 'ar'],
    // options for the language detector
    detection: {
      order: ['localStorage', 'navigator', 'querystring'],
      caches: ['localStorage'],
    },
    debug: true,
  });
