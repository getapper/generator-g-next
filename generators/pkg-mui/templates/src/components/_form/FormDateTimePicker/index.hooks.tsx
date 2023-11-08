import useFormField from "@/hooks/useFormField";
import { Moment } from "moment";
import { useMemo } from "react";
import moment from "moment/moment";

export const useFormDateTimePicker = (name: string) => {
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
