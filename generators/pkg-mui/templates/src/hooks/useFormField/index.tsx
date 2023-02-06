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

  const errorObj = JsUtility.accessObjectByDotSeparatedKeys(errors, name);

  const error: string | null = useMemo(() => errorObj?.message, [errorObj]);

  return {
    value,
    setValue,
    error,
  };
};

export default useFormField;
