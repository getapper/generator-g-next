import React, { memo } from "react";
import {
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  SxProps,
  Theme,
} from "@mui/material";
import { useFormRadioGroup } from "components/_form/FormRadioGroup/index.hooks";
import { Control, Controller, RefCallBack } from "react-hook-form";

type FormRadioGroupProps = {
  name: string;
  control?: any;
  label: string;
  error?: boolean;
  helperText?: string;
  options: {
    label: string;
    value: string;
  }[];
  sx?: SxProps<Theme>;
  value?: string;
  onChange?: (newValue: string) => void;
} & CheckboxProps;

export const FormRadioGroup = memo(
  ({
    control,
    name,
    label,
    options,
    error,
    helperText,
    sx,
    value,
    onChange,
    ...props
  }: FormRadioGroupProps) => {
    const {} = useFormRadioGroup();

    const renderRadioGroup = (
      onChange: (newValue: string) => void,
      value: string,
      name: string,
      onBlur = null,
      ref: RefCallBack = null,
    ) => {
      return (
        <FormControl error={error} variant="standard" sx={sx}>
          <FormLabel id={`${name}-controlled-radio-buttons-gruop`}>
            {label}
          </FormLabel>
          <RadioGroup
            aria-labelledby={`${name}-controlled-radio-buttons-gruop`}
            name={name}
            value={value}
            onChange={onChange ? (ev) => onChange(ev.target.value) : undefined}
            onBlur={onBlur}
          >
            {options.map(({ label, value }) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio {...props} />}
                inputRef={(e) => {
                  if (ref) {
                    ref(e);
                  }
                }}
                label={label}
              />
            ))}
          </RadioGroup>
          {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      );
    };

    if (!!control) {
      return (
        <Controller
          control={control}
          name={name}
          defaultValue={""}
          render={({ field: { onChange, onBlur, value, name, ref } }) => {
            return renderRadioGroup(onChange, value, name, onBlur, ref);
          }}
        />
      );
    } else {
      return renderRadioGroup(onChange, value, name);
    }
  },
);
