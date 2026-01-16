import { useMemo } from "react";

const FALLBACK_CURRENCY_CODES: string[] = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
  "CHF",
];

function getDefaultCurrencyCodes(): string[] {
  // Prefer a dynamic list when supported, fallback to a small curated list.
  try {
    const supportedValuesOf = (Intl as any)?.supportedValuesOf as
      | ((key: string) => string[])
      | undefined;
    const currencies = supportedValuesOf?.("currency");
    if (Array.isArray(currencies) && currencies.length > 0) {
      return currencies;
    }
  } catch {
    // ignore
  }
  return FALLBACK_CURRENCY_CODES;
}

export const useFormCurrencyCodePicker = (currencyCodes?: string[]) => {
  const currencyOptions = useMemo(
    () =>
      (currencyCodes?.length ? currencyCodes : getDefaultCurrencyCodes()).map(
        (currencyCode) => ({
        label: currencyCode,
        value: currencyCode,
      })),
    [currencyCodes],
  );

  return {
    currencyOptions,
  };
};
