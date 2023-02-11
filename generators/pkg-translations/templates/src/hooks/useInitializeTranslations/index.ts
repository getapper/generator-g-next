import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { enTranslations } from "../../translations/en/common";
import { itTranslations } from "../../translations/it/common";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

export const useInitializeTranslations = () => {
  const isInitialized = useRef(false);
  const { locale } = useRouter();

  if (!isInitialized.current) {
    isInitialized.current = true;
    i18n.use(initReactI18next).init({
      lng: locale,
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
  }

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return null;
};
