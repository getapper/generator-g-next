import {
  DatePicker,
  DatePickerProps,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TextField } from "@mui/material";
import React, { memo } from "react";
import { useFormDatePicker } from "./index.hooks";
import { Moment } from "moment";

interface OmittedProps {
  renderInput: any;
  onChange: any;
  value: any;
}

type FormDatePickerProps = {
  name: string;
  label?: string;
} & Omit<DatePickerProps<Moment, Moment>, keyof OmittedProps>;

export const FormDatePicker = memo(({ name, label }: FormDatePickerProps) => {
  const { value, setValue, error } = useFormDatePicker(name);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={label}
        value={value}
        onChange={setValue}
        renderInput={(params) => (
          <TextField {...params} error={!!error} helperText={error} />
        )}
      />
    </LocalizationProvider>
  );
});
FormDatePicker.displayName = "FormDatePicker";
