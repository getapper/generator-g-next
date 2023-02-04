import React, { useCallback, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { JsUtility } from "@/models/common/JsUtility";

type useFormFieldProps = {
  name: string;
};

const useFormField = <T,>({ name }: useFormFieldProps) => {
  const {
    control,
    formState: { errors, isSubmitted },
    setValue: _setValue,
    trigger,
  } = useFormContext();

  const value: T = useWatch({
    control,
    name,
  });

  const setValue = useCallback(
    (newValue: T) => {
      _setValue(name, newValue);
      if (isSubmitted) {
        trigger(name);
      }
    },
    [name, _setValue, isSubmitted, trigger],
  );

  const error: string | null = useMemo(
    () => JsUtility.accessObjectByDotSeparatedKeys(errors, name)?.message,
    [JsUtility.accessObjectByDotSeparatedKeys(errors, name), errors, name],
  );

  return {
    value,
    setValue,
    error,
  };
};

export default useFormField;
