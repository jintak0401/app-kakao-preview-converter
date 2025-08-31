/* eslint-disable no-restricted-imports */
import enTranslations from './en.json'
import jaTranslations from './ja.json'
import koTranslations from './ko.json'
/* eslint-enable no-restricted-imports */

export interface I18nText {
  en: string
  ja: string
  ko: string
}

export const translations = {
  ko: {
    translation: koTranslations,
  },
  en: {
    translation: enTranslations,
  },
  ja: {
    translation: jaTranslations,
  },
}
