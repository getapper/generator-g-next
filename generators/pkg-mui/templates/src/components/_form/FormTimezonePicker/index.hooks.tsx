import { useMemo } from "react";
import useFormField from "@/hooks/useFormField";
import { getTimezoneOptionsByOffset } from "@/lib/timezones";

export const useFormTimezonePicker = (name: string) => {
  const timezoneOptions = useMemo(() => getTimezoneOptionsByOffset(), []);

  return {
    timezoneOptions,
  };
};
