import { DatePicker, DatePickerProps, LocalizationProvider } from "@mui/lab";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { TextField, SxProps, Theme } from "@mui/material";
import React, { memo } from "react";
import { useFormDatePicker } from "components/_form/FormDatePicker/index.hooks";
import { Moment } from "moment";
import { Control, Controller } from "react-hook-form";

interface OmittedProps {
  renderInput: any;
  onChange: any;
  value: any;
}

type FormDatePickerProps = {
  name: string;
  control?: any;
  label: string;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
  value?: Moment;
  onChange?: (newValue: Moment) => void;
} & Omit<DatePickerProps, keyof OmittedProps>;

export const FormDatePicker = memo(
  ({
    control,
    name,
    label,
    error,
    helperText,
    sx,
    value,
    onChange,
  }: FormDatePickerProps) => {
    const {} = useFormDatePicker();

    const renderDatePicker = (onChange, value, name, onBlur = null) => {
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
          render={({ field: { onChange, onBlur, value, name } }) => {
            return renderDatePicker(onChange, value, name, onBlur);
          }}
        />
      );
    } else {
      return renderDatePicker(onChange, value, name);
    }
  },
);
