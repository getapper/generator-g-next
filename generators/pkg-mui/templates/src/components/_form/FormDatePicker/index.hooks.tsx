import useFormField from "@/hooks/useFormField";

export const useFormDatePicker = (name: string) => {
  const { value, setValue, error } = useFormField<Date>({ name });

  return {
    value,
    setValue,
    error,
  };
};
