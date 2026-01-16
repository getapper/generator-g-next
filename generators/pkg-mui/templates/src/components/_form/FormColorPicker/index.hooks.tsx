import { useFormContext } from "react-hook-form";
import useFormField from "@/hooks/useFormField";

export const useFormColorPicker = (name: string) => {
  const { value, setValue, error } = useFormField<string>({
    name,
  });

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return {
    value,
    handleChange,
    error,
  };
};
