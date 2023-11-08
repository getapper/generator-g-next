import {
  TimePicker,
  TimePickerProps,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { memo } from "react";
import { useFormTimePicker } from "./index.hooks";
import { Moment } from "moment";

interface OmittedProps {
  renderInput: any;
  onChange: any;
  value: any;
}

type FormTimePickerProps = {
  name: string;
  label?: string;
} & Omit<TimePickerProps<Moment>, keyof OmittedProps>;

export const FormTimePicker = memo(({ name, label }: FormTimePickerProps) => {
  const { fieldValue, setValue, error, ...others } = useFormTimePicker(name);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <TimePicker
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
});
FormTimePicker.displayName = "FormTimePicker";
