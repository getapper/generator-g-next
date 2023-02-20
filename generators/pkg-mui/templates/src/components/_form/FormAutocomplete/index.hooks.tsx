import useFormField from "@/hooks/useFormField";
import React, { useCallback, useMemo } from "react";

export const useFormAutocomplete = <T extends { id: string }>(
  name: string,
  options: T[],
) => {
  const {
    value: _value,
    setValue,
    error,
  } = useFormField<string>({
    name,
  });

  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>, newValue: T) => {
      setValue(newValue?.id ?? "");
    },
    [setValue],
  );

  const value = useMemo(
    () => options?.find((o) => o.id === _value),
    [_value, options],
  );

  return {
    value,
    handleChange,
    error,
  };
};
