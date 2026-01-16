import { useCallback, useEffect, useMemo, useRef } from "react";
import AutoNumeric from "autonumeric";
import useFormField from "@/hooks/useFormField";

export const useFormCurrencyAmount = ({
  amountName,
  index,
  decimals = 2,
}: {
  amountName: string;
  index?: number;
  decimals?: number;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autonumericRef = useRef<AutoNumeric | null>(null);

  const {
    value: amountValue,
    setValue: setAmountValue,
    error: amountError,
  } = useFormField<number[] | number>({ name: amountName });

  const numberOfDecimals = useMemo(
    () => Math.max(0, Math.min(6, Math.floor(decimals))),
    [decimals],
  );

  const onAmountChange = useCallback(
    () => {
      const numericString = autonumericRef.current?.getNumericString?.() ?? "0";
      const newValue = Math.round(
        Number(numericString) * Math.pow(10, numberOfDecimals),
      );

      setAmountValue(
        index !== undefined
          ? [
              ...(amountValue as number[]).slice(0, index),
              newValue,
              ...(amountValue as number[]).slice(index + 1),
            ]
          : newValue,
      );
    },
    [amountValue, index, numberOfDecimals, setAmountValue],
  );

  useEffect(() => {
    if (autonumericRef.current) {
      autonumericRef.current.detach();
      autonumericRef.current.remove();
      autonumericRef.current = null;
    }

    const autonumericOptions = {
      watchExternalChanges: true,
      decimalCharacter: ",",
      digitGroupSeparator: ".",
      decimalPlaces: numberOfDecimals,
    };

    autonumericRef.current = new AutoNumeric(
      inputRef.current,
      "0",
      autonumericOptions,
    );
  }, [numberOfDecimals]);

  useEffect(() => {
    if (inputRef.current) {
      const current = Math.round(
        parseFloat(inputRef.current.value.replace(",", ".")) *
          Math.pow(10, numberOfDecimals),
      );

      const raw =
        index !== undefined
          ? (amountValue as number[] | undefined)?.[index]
          : (amountValue as number | undefined);
      const newValue = raw ?? 0;

      if (current !== newValue) {
        inputRef.current.value = (
          newValue / Math.pow(10, numberOfDecimals)
        ).toFixed(numberOfDecimals);
      }
    }
  }, [amountValue, index, numberOfDecimals]);

  return {
    inputRef,
    onAmountChange,
    autonumericRef,
    numberOfDecimals,
    amountError,
  };
};
