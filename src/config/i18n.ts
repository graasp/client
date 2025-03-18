import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';
import LangDetector from 'i18next-browser-languagedetector';
import Fetch from 'i18next-fetch-backend';

i18n
  .createInstance()
  .use(Fetch)
  .use(LangDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    // namespaces that will be loaded by default
    ns: ['common'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // specify which languages are supported
    // 1. prefers exact match across all supported langs
    // 2. prefers lang without locale
    // 3. uses fallback
    supportedLngs: ['fr', 'de', 'it', 'es', 'ar', 'en'],
    // options for the language detector
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      // the name of the query parameter to look for the language
      lookupQuerystring: 'lang',
    },
    react: {
      // prevent the translations from using the react suspense and thus making the interface flicker
      useSuspense: false,
    },
  });
