import { useCallback } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import useFormField from "@/hooks/useFormField";

export const useFormSelectBoolean = (name: string) => {
  const { value, setValue, error } = useFormField<boolean>({ name });

  const handleChange = useCallback(
    (event: SelectChangeEvent<boolean>) => {
      const newValue = event.target.value === "true";
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
