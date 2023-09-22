import {
  DateTimePicker,
  DateTimePickerProps,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { memo } from "react";
import { useFormDateTimePicker } from "./index.hooks";
import { Moment } from "moment/moment";

interface OmittedProps {
  renderInput: any;
  onChange: any;
  value: any;
}

type FormDateTimePickerProps = {
  name: string;
  label?: string;
} & Omit<DateTimePickerProps<Moment>, keyof OmittedProps>;

export const FormDateTimePicker = memo(
  ({ name, label, ...others }: FormDateTimePickerProps) => {
    const { fieldValue, setValue, error } = useFormDateTimePicker(name);

    return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateTimePicker
          {...others}
          label={label}
          value={fieldValue}
          onChange={setValue}
          slotProps={{
            textField: {
              error: !!error,
              helperText: error,
            },
          }}
        />
      </LocalizationProvider>
    );
  },
);
FormDateTimePicker.displayName = "FormDateTimePicker";
