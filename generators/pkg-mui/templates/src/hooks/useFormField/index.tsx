import React, { useCallback, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { JsUtility } from "@/models/common/JsUtility";

type useFormFieldProps = {
  name: string;
};

const useFormField = <T,>({ name }: useFormFieldProps) => {
  const {
    control,
    formState: { errors },
    setValue: _setValue,
  } = useFormContext();

  const value: T = useWatch({
    control,
    name,
  });

  const setValue = useCallback(
    (newValue: T) => _setValue(name, newValue),
    [name, _setValue],
  );

  const error: string | null = useMemo(
    () =>
      JsUtility.accessObjectByDotSeparatedKeys(errors, name)?.message ?? null,
    [errors, name],
  );

  return {
    value,
    setValue,
    error,
  };
};

export default useFormField;
