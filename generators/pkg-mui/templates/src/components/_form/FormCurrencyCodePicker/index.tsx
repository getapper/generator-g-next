import React, { memo } from "react";
import { useFormCurrencyCodePicker } from "./index.hooks";
import { FormSelect } from "@/components/_form/FormSelect";
import { SxProps, Theme } from "@mui/material";

type FormCurrencyCodePickerProps = {
  name?: string;
  value?: string;
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  currencyCodes?: string[];
  selectProps?: any;
  sx?: SxProps<Theme>;
};

export const FormCurrencyCodePicker = memo(
  ({
    name,
    value,
    label,
    disabled,
    fullWidth,
    currencyCodes,
    selectProps,
    sx,
  }: FormCurrencyCodePickerProps) => {
    const { currencyOptions } = useFormCurrencyCodePicker(currencyCodes);

    return (
      <FormSelect
        name={name}
        value={value}
        label={label}
        options={currencyOptions}
        disabled={disabled}
        fullWidth={fullWidth}
        selectProps={selectProps}
        sx={sx}
      />
    );
  },
);
FormCurrencyCodePicker.displayName = "FormCurrencyCodePicker";
