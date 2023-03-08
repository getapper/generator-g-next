import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { itTranslations } from "@/translations/it/common";
import { enTranslations } from "@/translations/en/common";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  fallbackNS: "common",
  defaultNS: "common",
  ns: "common",

  nsSeparator: false,
  keySeparator: false, // we do not use keys in form messages.welcome

  interpolation: {
    escapeValue: false, // react already safes from xss
  },

  resources: {
    en: {
      common: enTranslations, // 'common' is our custom namespace
    },
    it: {
      common: itTranslations,
    },
  },
});

export { i18n };
