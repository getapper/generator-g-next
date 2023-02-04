import { useFormContext } from "react-hook-form";
import useFormField from "@/hooks/useFormField";
import React, { useCallback } from "react";

export const useFormRadioGroup = (name: string) => {
  const { value, setValue, error } = useFormField<string>({ name });

  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setValue(ev.target.value);
    },
    [setValue],
  );

  return {
    value,
    handleChange,
    error,
  };
};
