import {
  DatePicker,
  DatePickerProps,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { TextField } from "@mui/material";
import React, { memo } from "react";
import { useFormDatePicker } from "components/_form/FormDatePicker/index.hooks";
import { Controller } from "react-hook-form";
import { JsUtility } from "models/common";

interface OmittedProps {
  renderInput: any;
  onChange: any;
  value: any;
}

type FormDatePickerProps = {
  name: string;
  label: string;
} & Omit<DatePickerProps, keyof OmittedProps>;

export const FormDatePicker = memo(({ name, label }: FormDatePickerProps) => {
  const { control, errors } = useFormDatePicker();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, name } }) => {
        return (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
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
