import { useFormContext } from "react-hook-form";
import useFormField from "@/hooks/useFormField";
import React, { useCallback } from "react";

export const useFormCheckbox = (name: string) => {
  const { value, setValue, error } = useFormField<boolean>({ name });

  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setValue(ev.target.checked);
    },
    [setValue],
  );

  return {
    value,
    handleChange,
    error,
  };
};
