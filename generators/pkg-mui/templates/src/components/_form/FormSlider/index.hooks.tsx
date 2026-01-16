import { useFormContext } from "react-hook-form";
import useFormField from "@/hooks/useFormField";
import React, { useCallback } from "react";

export const useFormSlider = (name: string) => {
  const { value, setValue, error } = useFormField<number | number[]>({ name });

  const handleChange = useCallback(
    (_event: Event, newValue: number | number[]) => {
      setValue(newValue);
    },
    [setValue],
  );

  return {
    value,
    handleChange,
    error,
  };
};
