import { useFormContext } from "react-hook-form";
import useFormField from "@/hooks/useFormField";

export const useFormDateTimePicker = (name: string) => {
  const { value, setValue, error } = useFormField<Date>({ name });

  return {
    value,
    setValue,
    error,
  };
};
