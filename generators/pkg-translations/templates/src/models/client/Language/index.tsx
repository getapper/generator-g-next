import itFlag from "assets/images/flags/it.svg";
import enFlag from "assets/images/flags/gb.svg";
import { Locales } from "models/common/Translation";

export interface ILanguage {
  value: Locales;
  label: string;
  icon: string;
}

export class Language implements ILanguage {
  value: Locales;
  label: string;
  icon: string;

  constructor(obj: ILanguage) {
    Object.assign(this, obj);
  }

  static getFlagIconByLanguageValue(languageValue: Locales): string {
    switch (languageValue) {
      case Locales.en:
        return enFlag.src;
      case Locales.it:
        return itFlag.src;
    }
  }

  static getLanguageNameByLanguageValue(languageValue: Locales): string {
    switch (languageValue) {
      case Locales.en:
        return "English";
      case Locales.it:
        return "Italian";
    }
  }
}
