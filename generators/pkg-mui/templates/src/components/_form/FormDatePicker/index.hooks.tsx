import useFormField from "@/hooks/useFormField";
import moment, { Moment } from "moment";
import { useMemo } from "react";

export const useFormDatePicker = (name: string) => {
  const { value, setValue, error } = useFormField<Moment>({ name });

  const fieldValue = useMemo(
    () => (moment(value).isValid() ? moment(value) : null),
    [value],
  );

  return {
    fieldValue,
    setValue,
    error,
  };
};
