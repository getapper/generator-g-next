import {
  TimePicker,
  TimePickerProps,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TextField } from "@mui/material";
import React, { memo } from "react";
import { useFormTimePicker } from "./index.hooks";
import { Moment } from "moment";

type FormTimePickerProps = {
  name: string;
  label?: string;
} & Omit<TimePickerProps<Moment, Moment>, "renderInput" | "onChange" | "value">;

export const FormTimePicker = memo(({ name, label }: FormTimePickerProps) => {
  const { value, setValue, error } = useFormTimePicker(name);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <TimePicker
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
FormTimePicker.displayName = "FormTimePicker";
