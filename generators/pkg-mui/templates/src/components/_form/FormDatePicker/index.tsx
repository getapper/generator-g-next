import {
  DatePicker,
  DatePickerProps,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
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
  fullWidth?: boolean;
} & Omit<DatePickerProps<Moment>, keyof OmittedProps>;

export const FormDatePicker = memo(
  ({ name, label, fullWidth = false, ...others }: FormDatePickerProps) => {
    const { fieldValue, setValue, error } = useFormDatePicker(name);

    return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          {...others}
          label={label}
          value={fieldValue}
          onChange={setValue}
          slotProps={{
            textField: {
              error: !!error,
              helperText: error,
              fullWidth,
            },
          }}
        />
      </LocalizationProvider>
    );
  },
);
FormDatePicker.displayName = "FormDatePicker";
