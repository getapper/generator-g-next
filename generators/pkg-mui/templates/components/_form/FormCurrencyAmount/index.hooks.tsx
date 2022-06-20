import { useEffect, useMemo, useRef } from "react";
import { Currency, CurrencyCodes } from "models";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import * as yup from "yup";
import AutoNumeric from "autonumeric";
import { useFormContext } from "react-hook-form";

export const useFormCurrencyAmount = ({
  currencyName,
}: {
  currencyName: string;
}) => {
  const currencyOptions = useMemo(
    () =>
      Object.values(CurrencyCodes).map((currencyCode) => ({
        label: Currency.getSymbolByCurrencyCode(currencyCode),
        value: currencyCode,
      })),
    [],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const autonumericRef = useRef<AutoNumeric>(null);
  const { watch } = useFormContext();

  const numberOfDecimals = useMemo(
    () => Currency.getDecimalsByCurrencyCode(watch(currencyName)),
    [watch(currencyName)],
  );

  useEffect(() => {
    if (autonumericRef.current) {
      autonumericRef.current.detach();
      autonumericRef.current.remove();
    }
    autonumericRef.current = new AutoNumeric(inputRef.current, "", {
      decimalCharacter: ",",
      digitGroupSeparator: ".",
      decimalPlaces: Currency.getDecimalsByCurrencyCode(watch(currencyName)),
    });
  }, [watch(currencyName)]);

  return { currencyOptions, inputRef, watch, autonumericRef, numberOfDecimals };
};
