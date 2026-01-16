import React, { memo } from "react";
import { useFormTimezonePicker } from "./index.hooks";
import { FormSelect } from "@/components/_form/FormSelect";
import { SxProps, Theme } from "@mui/material";

type FormTimezonePickerProps = {
  name: string;
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  selectProps?: any;
  sx?: SxProps<Theme>;
};

export const FormTimezonePicker = memo(
  ({
    name,
    label,
    disabled,
    fullWidth,
    selectProps,
    sx,
  }: FormTimezonePickerProps) => {
    const { timezoneOptions } = useFormTimezonePicker(name);

    return (
      <FormSelect
        name={name}
        label={label}
        options={timezoneOptions}
        disabled={disabled}
        fullWidth={fullWidth}
        selectProps={selectProps}
        sx={sx}
      />
    );
  },
);
FormTimezonePicker.displayName = "FormTimezonePicker";
