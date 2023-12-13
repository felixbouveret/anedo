import { createI18n } from 'vue-i18n';

import fr from './locales/fr.json';

type MessageSchema = typeof fr;

export default createI18n<[MessageSchema], 'fr'>({
  locale: 'fr',
  fallbackLocale: 'fr',
  legacy: false,
  messages: {
    fr: fr
  }
});
