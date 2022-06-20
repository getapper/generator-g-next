import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { TextField, SxProps, Theme } from "@mui/material";
import React, { memo } from "react";
import { useFormDateTimePicker } from "components/_form/FormDateTimePicker/index.hooks";
import { Moment } from "moment";
import { Control, Controller } from "react-hook-form";

type FormDateTimePickerProps = {
  name: string;
  control?: any;
  label: string;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
  value?: Moment;
  onChange?: (newValue: Moment) => void;
};

export const FormDateTimePicker = memo(
  ({
    control,
    name,
    label,
    error,
    helperText,
    sx,
    value,
    onChange,
  }: FormDateTimePickerProps) => {
    const {} = useFormDateTimePicker();

    const renderDateTimePicker = (onChange, value, name, onBlur = null) => {
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
                error={error}
                helperText={helperText}
              />
            )}
          />
        </LocalizationProvider>
      );
    };

    if (!!control) {
      return (
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value, name, ref } }) => {
            return renderDateTimePicker(onChange, value, name, onBlur);
          }}
        />
      );
    } else {
      return renderDateTimePicker(onChange, value, name);
    }
  },
);
