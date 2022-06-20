import { TimePicker, LocalizationProvider } from "@mui/lab";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { TextField, SxProps, Theme } from "@mui/material";
import React, { memo } from "react";
import { useFormTimePicker } from "./index.hooks";
import { Moment } from "moment";
import { Control, Controller } from "react-hook-form";

type FormTimePickerProps = {
  name: string;
  control?: Control;
  label: string;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
  value?: Moment;
  onChange?: (newValue: Moment) => void;
};

export const FormTimePicker = memo(
  ({
    control,
    name,
    label,
    error,
    helperText,
    sx,
    value,
    onChange,
  }: FormTimePickerProps) => {
    const {} = useFormTimePicker();

    const renderTimePicker = (onChange, value, name, onBlur = null) => {
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
            return renderTimePicker(onChange, value, name, onBlur);
          }}
        />
      );
    } else {
      return renderTimePicker(onChange, value, name);
    }
  },
);
