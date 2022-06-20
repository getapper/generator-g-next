import React, { memo, MutableRefObject, Ref } from "react";
import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormHelperText,
  SxProps,
  Theme,
} from "@mui/material";
import { useFormCheckbox } from "./index.hooks";
import { Control, Controller, RefCallBack } from "react-hook-form";

type FormCheckboxProps = {
  name: string;
  control?: any;
  label: string;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
  value?: boolean;
  onChange?: (newValue: boolean) => void;
} & CheckboxProps;

export const FormCheckbox = memo(
  ({
    control,
    name,
    label,
    error,
    helperText,
    sx,
    value,
    onChange,
    ...props
  }: FormCheckboxProps) => {
    const {} = useFormCheckbox();

    const renderCheckbox = (
      onChange: (newValue: boolean) => void,
      value: boolean,
      name: string,
      onBlur = null,
      refCb: RefCallBack = null,
    ) => {
      return (
        <FormControl error={error} component="fieldset" sx={sx}>
          <FormControlLabel
            control={
              <Checkbox
                {...props}
                name={name}
                checked={value}
                onChange={
                  onChange ? (ev) => onChange(ev.target.checked) : undefined
                }
                inputRef={(e) => {
                  if (refCb) {
                    refCb(e);
                  }
                }}
                onBlur={onBlur}
              />
            }
            label={label}
            sx={sx}
          />
          {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      );
    };

    if (!!control) {
      return (
        <Controller
          control={control}
          name={name}
          defaultValue={false}
          render={({ field: { onChange, onBlur, value, name, ref } }) => {
            return renderCheckbox(onChange, value, name, onBlur, ref);
          }}
        />
      );
    } else {
      return renderCheckbox(onChange, value, name);
    }
  },
);
