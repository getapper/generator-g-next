import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { TextField } from "@mui/material";
import React, { memo } from "react";
import { useFormDateTimePicker } from "components/_form/FormDateTimePicker/index.hooks";
import { Controller } from "react-hook-form";
import { JsUtility } from "models/common";

type FormDateTimePickerProps = {
  name: string;
  label: string;
};

export const FormDateTimePicker = memo(
  ({ name, label }: FormDateTimePickerProps) => {
    const { control, errors } = useFormDateTimePicker();

    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, name } }) => {
          return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
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
  }
);
