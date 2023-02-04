import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TextField } from "@mui/material";
import React, { memo } from "react";
import { useFormDateTimePicker } from "./index.hooks";

type FormDateTimePickerProps = {
  name: string;
  label?: string;
};

export const FormDateTimePicker = memo(
  ({ name, label }: FormDateTimePickerProps) => {
    const { value, setValue, error } = useFormDateTimePicker(name);

    return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateTimePicker
          label={label}
          value={value}
          onChange={setValue}
          renderInput={(params) => (
            <TextField {...params} error={!!error} helperText={error} />
          )}
        />
      </LocalizationProvider>
    );
  },
);
FormDateTimePicker.displayName = "FormDateTimePicker";
