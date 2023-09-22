import useFormField from "@/hooks/useFormField";
import { useMemo } from "react";
import moment, { Moment } from "moment";

export const useFormTimePicker = (name: string) => {
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
