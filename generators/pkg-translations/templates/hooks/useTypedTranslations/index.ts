import { StringMap } from "i18next";
import { useTranslation as _useTranslation } from "react-i18next";
import { Translations } from "translations/translations.type";

export type TranslationFnc = (
  key: keyof Translations,
  defaultValue?: string,
  options?: StringMap,
) => string;

type CustomUseTranslation = () => [TranslationFnc, any, boolean];

export const useTypedTranslations: CustomUseTranslation = _useTranslation;
