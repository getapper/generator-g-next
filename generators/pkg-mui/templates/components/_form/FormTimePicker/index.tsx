import { TimePicker, LocalizationProvider } from "@mui/lab";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { TextField } from "@mui/material";
import React, { memo } from "react";
import { useFormTimePicker } from "./index.hooks";
import { Controller } from "react-hook-form";
import { JsUtility } from "models/common";

type FormTimePickerProps = {
  name: string;
  label: string;
};

export const FormTimePicker = memo(({ name, label }: FormTimePickerProps) => {
  const { control, errors } = useFormTimePicker();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, name, ref } }) => {
        return (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <TimePicker
              label={label}
              value={value}
              onChange={onChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onBlur={onBlur}
                  error={
                    !!JsUtility.accessObjectByDotSeparatedKeys(errors, name)
                  }
                  helperText={
                    JsUtility.accessObjectByDotSeparatedKeys(errors, name)
                      ?.message
                  }
                />
              )}
            />
          </LocalizationProvider>
        );
      }}
    />
  );
});
FormTimePicker.displayName = "FormTimePicker";
